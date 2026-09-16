const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse body if not automatically parsed
    let payload = req.body;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch (e) { payload = {}; }
    }
    payload = payload || {};

    const email = payload.email || 'pebbleee17@gmail.com';
    const otp = payload.otp;

    if (!otp) {
      return res.status(400).json({ error: 'Missing OTP code.' });
    }

    console.log('\n============================================================');
    console.log(' [PEBBLE VERCEL API] ADMIN PASSWORD RESET OTP DISPATCHED');
    console.log(` Target Email : ${email}`);
    console.log(` 6-Digit OTP  : ${otp}`);
    console.log(` Validity     : 10 Minutes`);
    console.log('============================================================\n');

    const gmailUser = (process.env.GMAIL_USER || '').trim();
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

    let emailSent = false;
    let infoMessage = `Verification OTP ${otp} generated for ${email}.`;

    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPass
          }
        });

        await transporter.sendMail({
          from: `"Pebble Security" <${gmailUser}>`,
          to: email,
          subject: `🔐 Pebble Admin Reset OTP: ${otp}`,
          text: `Hello,\n\nYour 6-digit security verification code to reset the Pebble Store Admin Password is:\n\n${otp}\n\nThis code expires in 10 minutes.\nIf you did not request this password reset, please secure your account immediately.\n\nWarm regards,\nPebble Security Team`,
          html: `
            <div style="font-family:'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #FAF7F2; border-radius: 14px; border: 1px solid #E8E1D5; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
              <div style="background: #121016; padding: 24px 28px; text-align: center;">
                <h1 style="margin: 0; font-family: Georgia, serif; color: #FFFFFF; font-size: 1.8rem; letter-spacing: 1px;">PEBBLE</h1>
                <p style="margin: 4px 0 0; color: #8B5CF6; font-size: 0.82rem; letter-spacing: 1.5px; text-transform: uppercase;">Admin Security Authorization</p>
              </div>
              <div style="padding: 32px 28px; background: #FFFFFF;">
                <h2 style="margin: 0 0 12px; font-size: 1.25rem; color: #14121A;">Admin Password Reset Request</h2>
                <p style="margin: 0 0 24px; color: #4A4640; font-size: 0.94rem; line-height: 1.6;">
                  We received a request to reset your master Pebble Admin password. Enter the one-time 6-digit verification code below into the security verification gate:
                </p>
                <div style="background: #F7F4FB; border: 2px dashed #8B5CF6; border-radius: 12px; padding: 18px 24px; text-align: center; margin-bottom: 24px;">
                  <span style="font-family: 'Courier New', monospace; font-size: 2.4rem; font-weight: 800; letter-spacing: 10px; color: #7C3AED; display: inline-block;">${otp}</span>
                </div>
                <div style="background: #EDE7F8; border-radius: 8px; padding: 12px 16px; font-size: 0.85rem; color: #4C1D95; line-height: 1.5; margin-bottom: 24px;">
                  ⏳ <strong>Security Window:</strong> This verification code will expire in <strong>10 minutes</strong>.
                </div>
                <p style="margin: 0; color: #7E766B; font-size: 0.82rem; line-height: 1.5;">
                  If you did not request this password change, ignore this email. Your current administrator password will remain unchanged.
                </p>
              </div>
              <div style="background: #EFEAF7; padding: 14px 28px; text-align: center; font-size: 0.76rem; color: #6E677F; border-top: 1px solid #E6DEF2;">
                Pebble Books & Papercraft • Automated Security Service
              </div>
            </div>
          `
        });
        emailSent = true;
        infoMessage = `Verification code successfully emailed to ${email}.`;
      } catch (mailErr) {
        console.error('[Pebble Vercel SMTP] Nodemailer error:', mailErr.message);
        infoMessage = `SMTP attempt failed: ${mailErr.message}. Local OTP fallback active.`;
      }
    }

    return res.status(200).json({
      success: true,
      emailSent: emailSent,
      message: infoMessage,
      debugOtp: process.env.NODE_ENV !== 'production' || !emailSent ? otp : undefined
    });
  } catch (err) {
    console.error('[Pebble Vercel API] Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
