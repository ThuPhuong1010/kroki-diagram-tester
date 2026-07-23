'use strict';
const { getCredentials, authHeader } = require('../../_confluence');

async function fetchAllPages(cfUrl, auth, spaceKey) {
  const limit = 100;
  const all = [];
  let start = 0;
  for (let page = 0; page < 100; page++) {
    const r = await fetch(
      `${cfUrl}/wiki/rest/api/content?type=page&spaceKey=${encodeURIComponent(spaceKey)}&start=${start}&limit=${limit}`,
      { headers: { Authorization: auth, Accept: 'application/json' } }
    );
    const data = await r.json();
    if (!r.ok) return { status: r.status, data };
    const results = Array.isArray(data.results) ? data.results : [];
    all.push(...results);
    if (results.length < limit || data.size < limit) break;
    start += results.length;
  }
  return { status: 200, data: { ok: true, results: all, start: 0, limit: all.length, size: all.length } };
}

module.exports = async (req, res) => {
  const spaceKey = req.query.spaceKey;
  const { cfUrl, cfEmail, cfToken } = getCredentials();
  if (!cfUrl) return res.status(500).json({ error: 'Server credentials not configured' });
  try {
    const { status, data } = await fetchAllPages(cfUrl, authHeader(cfEmail, cfToken), spaceKey);
    res.status(status).json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
};