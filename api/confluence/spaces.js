'use strict';
const { getCredentials, authHeader } = require('../_confluence');

module.exports = async (req, res) => {
  const { cfUrl, cfEmail, cfToken } = getCredentials();
  if (!cfUrl) return res.status(500).json({ error: 'Server credentials not configured' });
  try {
    const r = await fetch(`${cfUrl}/wiki/rest/api/space?limit=100&type=global`, {
      headers: { Authorization: authHeader(cfEmail, cfToken), Accept: 'application/json' }
    });
    res.status(r.status).json(await r.json());
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
};
