const http = require('http');
const fs = require('fs');
const path = require('path');

// Auto-load .env file if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const idx = trimmed.indexOf('=');
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    });
  } catch (envErr) {
    console.warn('[Pebble] Could not load .env:', envErr.message);
  }
}

const PORT = 8000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  try {
    let reqUrl = req.url.split('?')[0];

    // Handle POST /api/send-otp
    if (req.method === 'POST' && reqUrl === '/api/send-otp') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
        if (body.length > 10000) req.destroy();
      });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const email = payload.email || 'pebbleee17@gmail.com';
          const otp = payload.otp;

          if (!otp) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Missing OTP code.' }));
          }

          console.log('\n============================================================');
          console.log(' [PEBBLE SECURITY] ADMIN PASSWORD RESET OTP DISPATCHED');
          console.log(` Target Email : ${email}`);
          console.log(` 6-Digit OTP  : ${otp}`);
          console.log(` Validity     : 10 Minutes`);
          console.log(` Time         : ${new Date().toLocaleTimeString()} (${new Date().toLocaleDateString()})`);
          console.log('============================================================\n');

          let emailSent = false;
          let infoMessage = `Verification OTP ${otp} generated for ${email}.`;

          // If Gmail SMTP credentials are configured via environment variables
          const gmailUser = (process.env.GMAIL_USER || '').trim();
          const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

          if (gmailUser && gmailPass) {
            try {
              console.log(`[Pebble SMTP] Connecting to Gmail SMTP as ${gmailUser}...`);
              const nodemailer = require('nodemailer');
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: gmailUser,
                  pass: gmailPass
                }
              });

              await transporter.sendMail({
                from: `"Pebble Store Security" <${gmailUser}>`,
                to: email,
                subject: `[Pebble] Your Admin Password Reset OTP: ${otp}`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2dcd5; border-radius: 12px; background: #ffffff;">
                    <h2 style="color: #c86446; margin-top: 0; font-size: 22px;">Pebble Admin Password Reset</h2>
                    <p style="color: #444; font-size: 15px; line-height: 1.5;">You requested a one-time verification code to reset the administrator password for Pebble Bookstore.</p>
                    <div style="background: #FDF9F5; border: 1px dashed #c86446; padding: 18px; border-radius: 8px; text-align: center; margin: 24px 0;">
                      <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #c86446; font-family: monospace;">${otp}</span>
                    </div>
                    <p style="color: #666; font-size: 13px; line-height: 1.4;">This code is strictly confidential and expires in <strong>10 minutes</strong>. If you did not initiate this request, you can safely ignore this message.</p>
                  </div>
                `
              });
              emailSent = true;
              infoMessage = `Verification email delivered to ${email} inbox via Gmail SMTP.`;
              console.log(`[Pebble SMTP] ✅ Successfully delivered OTP email to ${email}!`);
            } catch (smtpErr) {
              console.error('[Pebble SMTP Dispatch Error]:', smtpErr.message);
              infoMessage = `SMTP error: ${smtpErr.message}`;
            }
          }

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({
            success: true,
            emailSent,
            email,
            message: infoMessage,
            otp: otp // Guaranteed fallback so user is never locked out
          }));
        } catch (parseErr) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON request payload.' }));
        }
      });
      return;
    }

    // Handle POST /api/upload for logos and book cover designs
    if (req.method === 'POST' && reqUrl === '/api/upload') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
        if (body.length > 25 * 1024 * 1024) req.destroy(); // 25MB safety cap
      });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const dataUri = payload.data;
          let filename = payload.filename || `upload_${Date.now()}`;
          const folder = payload.folder === 'logos' ? 'logos' : 'covers';

          if (!dataUri) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'No image data provided.' }));
          }

          // Extract base64 and mime type
          const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (!matches || matches.length !== 3) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Invalid base64 data format.' }));
          }

          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');

          let ext = '.png';
          if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
          else if (mimeType.includes('webp')) ext = '.webp';
          else if (mimeType.includes('svg')) ext = '.svg';
          else if (mimeType.includes('gif')) ext = '.gif';

          const uploadsDir = path.join(__dirname, 'uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }

          const cleanBase = path.parse(filename).name.replace(/[^a-zA-Z0-9_-]/g, '_');
          const targetFileName = `${folder}_${Date.now()}_${cleanBase}${ext}`;
          const filePath = path.join(uploadsDir, targetFileName);

          fs.writeFileSync(filePath, buffer);

          const publicUrl = `uploads/${targetFileName}`;
          console.log(`[Pebble Upload] ✅ Successfully saved ${folder} file: ${publicUrl} (${buffer.length} bytes)`);

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({
            success: true,
            url: publicUrl,
            filename: targetFileName,
            size: buffer.length
          }));
        } catch (uploadErr) {
          console.error('[Pebble Upload Error]:', uploadErr);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: uploadErr.message }));
        }
      });
      return;
    }

    let decoded = decodeURIComponent(reqUrl);
    if (decoded === '/' || decoded === '') {
      decoded = '/index.html';
    }

    // Prevent directory traversal
    const safePath = path.normalize(decoded).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, safePath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 
          'Content-Type': 'text/html; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN'
        });
        res.end(`<h2>404 Not Found</h2><p>The file <code>${escapeHtml(safePath)}</code> was not found.</p><p><a href="/index.html">Back to Storefront</a></p>`);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // Security and cache control headers
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      });

      const readStream = fs.createReadStream(filePath);
      readStream.on('error', (streamErr) => {
        console.error('Stream error:', streamErr);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
        }
        res.end('Server Error');
      });
      readStream.pipe(res);
    });
  } catch (e) {
    console.error('Request handler error:', e);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}

server.listen(PORT, () => {
  console.log(`[Pebble] Server listening at http://localhost:${PORT}/`);
  console.log(`[Pebble] Admin Panel at http://localhost:${PORT}/admin.html`);
});

server.on('error', (err) => {
  console.error('[Pebble Server Error]:', err);
});
