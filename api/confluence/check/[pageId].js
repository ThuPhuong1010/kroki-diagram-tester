'use strict';
const { getCredentials, authHeader } = require('../../_confluence');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  const pageId   = req.query.pageId;
  const filename = req.query.filename || 'diagram.png';
  const { cfUrl, cfEmail, cfToken } = getCredentials();
  if (!cfUrl) return res.status(500).json({ error: 'Server credentials not configured' });
  try {
    const r = await fetch(
      `${cfUrl}/wiki/rest/api/content/${pageId}/child/attachment?filename=${encodeURIComponent(filename)}&limit=1`,
      { headers: { Authorization: authHeader(cfEmail, cfToken), Accept: 'application/json' } }
    );
    if (!r.ok) return res.status(r.status).json({ exists: false, error: `Confluence ${r.status}` });
    const data = await r.json();
    const att  = data.results?.[0] || null;
    res.json({
      exists:       !!att,
      version:      att?.version?.number  || null,
      lastModified: att?.version?.when    || null,
      url:          att ? `${cfUrl}/wiki/download/attachments/${pageId}/${encodeURIComponent(filename)}` : null
    });
  } catch (e) {
    res.status(502).json({ exists: false, error: e.message });
  }
};
