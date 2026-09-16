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
    let payload = req.body;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch (e) { payload = {}; }
    }
    payload = payload || {};

    const dataUri = payload.data;
    if (!dataUri) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    // In Vercel serverless environment, return the canvas-optimized data URI directly
    return res.status(200).json({
      success: true,
      url: dataUri,
      filename: payload.filename || 'uploaded-image.png'
    });
  } catch (err) {
    console.error('[Pebble Vercel Upload API] Error:', err);
    return res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
};
