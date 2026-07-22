'use strict';
const { getCredentials, authHeader } = require('../../_confluence');

module.exports = async (req, res) => {
  const spaceKey = req.query.spaceKey;
  const { cfUrl, cfEmail, cfToken } = getCredentials();
  if (!cfUrl) return res.status(500).json({ error: 'Server credentials not configured' });
  try {
    const r = await fetch(
      `${cfUrl}/wiki/rest/api/content?type=page&spaceKey=${encodeURIComponent(spaceKey)}&limit=100`,
      { headers: { Authorization: authHeader(cfEmail, cfToken), Accept: 'application/json' } }
    );
    res.status(r.status).json(await r.json());
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
};
