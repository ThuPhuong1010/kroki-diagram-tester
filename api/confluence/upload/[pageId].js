'use strict';
const { getCredentials, authHeader } = require('../../_confluence');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const pageId = req.query.pageId;
  const { filename, data } = req.body || {};  // JSON body: { filename, data: base64 }

  if (!filename || !data) return res.status(400).json({ error: 'Missing filename or data' });

  const { cfUrl, cfEmail, cfToken } = getCredentials();
  if (!cfUrl) return res.status(500).json({ error: 'Server credentials not configured' });

  const auth = authHeader(cfEmail, cfToken);
  const imgBuf = Buffer.from(data, 'base64');

  try {
    // 1. Find existing attachment
    const findR = await fetch(
      `${cfUrl}/wiki/rest/api/content/${pageId}/child/attachment?filename=${encodeURIComponent(filename)}&limit=1`,
      { headers: { Authorization: auth, Accept: 'application/json' } }
    );
    if (!findR.ok) {
      const txt = await findR.text();
      return res.status(findR.status).json({ error: `Confluence ${findR.status}: ${txt.substring(0, 200)}` });
    }
    const findData = await findR.json();
    const existing = findData.results?.[0] || null;

    // 2. Upload (create or update)
    const form = new FormData();
    form.append('file', new Blob([imgBuf], { type: 'image/png' }), filename);
    form.append('comment', 'Auto-synced by Kroki Diagram Tester');
    form.append('minorEdit', 'true');

    const uploadUrl = existing
      ? `${cfUrl}/wiki/rest/api/content/${pageId}/child/attachment/${existing.id}/data`
      : `${cfUrl}/wiki/rest/api/content/${pageId}/child/attachment`;

    const uploadR = await fetch(uploadUrl, {
      method: 'POST',
      headers: { Authorization: auth, 'X-Atlassian-Token': 'no-check' },
      body: form
    });

    if (!uploadR.ok) {
      const txt = await uploadR.text();
      return res.status(uploadR.status).json({ error: `Upload ${uploadR.status}: ${txt.substring(0, 200)}` });
    }

    const stableUrl = `${cfUrl}/wiki/download/attachments/${pageId}/${filename}`;
    res.json({ ok: true, updated: !!existing, url: stableUrl });

  } catch (e) {
    res.status(502).json({ error: e.message });
  }
};
