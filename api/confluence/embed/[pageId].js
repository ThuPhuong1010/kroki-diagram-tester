'use strict';
const { getCredentials, authHeader } = require('../../_confluence');

// Add or update a <!-- kroki:filename --> block in the page body.
// If the marker already exists → replace. If not → append at end.
function embedInPage(html, filename, type, pageId, toolUrl) {
  const GEN_START = `<!-- kroki:${filename} -->`;
  const GEN_END   = '<!-- /kroki -->';
  const editHref  = `${toolUrl}?type=${type}&amp;page=${pageId}`;
  const newBlock  =
    `${GEN_START}` +
    `\n<ac:image ac:align="center"><ri:attachment ri:filename="${filename}"/></ac:image>` +
    `\n<p style="text-align:center;font-size:11px">` +
      `<a href="${editHref}" rel="nofollow">✏️ Edit in Kroki ↗</a>` +
    `</p>` +
    `\n${GEN_END}`;

  const startIdx = html.indexOf(GEN_START);
  if (startIdx !== -1) {
    const endIdx = html.indexOf(GEN_END, startIdx);
    if (endIdx !== -1) {
      return html.slice(0, startIdx) + newBlock + html.slice(endIdx + GEN_END.length);
    }
  }
  // No marker yet — append to end of body
  return html + '\n' + newBlock;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const pageId = req.query.pageId;
  const { filename, data, type = 'mermaid' } = req.body || {};

  if (!pageId)   return res.status(400).json({ error: 'Missing pageId' });
  if (!filename) return res.status(400).json({ error: 'Missing filename' });
  if (!data)     return res.status(400).json({ error: 'Missing image data' });

  const { cfUrl, cfEmail, cfToken } = getCredentials();
  if (!cfUrl) return res.status(500).json({ error: 'Server credentials not configured' });
  const auth   = authHeader(cfEmail, cfToken);
  const imgBuf = Buffer.from(data, 'base64');

  try {
    // 1. Upload PNG attachment (create or update)
    const findR = await fetch(
      `${cfUrl}/wiki/rest/api/content/${pageId}/child/attachment?filename=${encodeURIComponent(filename)}&limit=1`,
      { headers: { Authorization: auth, Accept: 'application/json' } }
    );
    if (!findR.ok) {
      const txt = await findR.text();
      return res.status(findR.status).json({ error: `Confluence ${findR.status}: ${txt.substring(0, 200)}` });
    }
    const existing = (await findR.json()).results?.[0] || null;

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

    // 2. Fetch current page body + version
    const pageR = await fetch(
      `${cfUrl}/wiki/rest/api/content/${pageId}?expand=body.storage,version,title`,
      { headers: { Authorization: auth, Accept: 'application/json' } }
    );
    if (!pageR.ok) {
      const txt = await pageR.text();
      return res.status(pageR.status).json({
        error: `Page fetch ${pageR.status}: ${txt.substring(0, 200)}`,
        uploaded: true
      });
    }
    const page    = await pageR.json();
    const version = page.version.number;
    const title   = page.title;

    // 3. Patch page body to embed image
    const toolUrl = (() => {
      if (process.env.TOOL_URL) return process.env.TOOL_URL.replace(/\/$/, '');
      // Sanitize forwarded headers to prevent injection into Confluence page body
      const proto = /^https?$/.test(req.headers['x-forwarded-proto']) ? req.headers['x-forwarded-proto'] : 'https';
      const host  = (req.headers['x-forwarded-host'] || req.headers.host || 'mvldiagram.vercel.app')
        .replace(/[^a-zA-Z0-9.:\-]/g, '');  // strip any unexpected chars
      return `${proto}://${host}`;
    })();
    const newBody = embedInPage(page.body.storage.value, filename, type, pageId, toolUrl);

    const putR = await fetch(`${cfUrl}/wiki/rest/api/content/${pageId}`, {
      method: 'PUT',
      headers: { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        version: { number: version + 1 },
        title,
        type: 'page',
        body: { storage: { value: newBody, representation: 'storage' } }
      })
    });
    if (!putR.ok) {
      const txt = await putR.text();
      return res.status(putR.status).json({
        error: `Page update ${putR.status}: ${txt.substring(0, 200)}`,
        uploaded: true
      });
    }

    const stableUrl = `${cfUrl}/wiki/download/attachments/${pageId}/${filename}`;
    res.json({ ok: true, updated: !!existing, url: stableUrl });

  } catch (e) {
    res.status(502).json({ error: e.message });
  }
};
