'use strict';
/**
 * POST /api/webhook/confluence
 *
 * Confluence webhook endpoint — auto-processes diagram code blocks
 * when a page is created or updated.
 *
 * Setup in Confluence:
 *   Admin → Webhooks → Add webhook
 *   URL: https://mvldiagram.vercel.app/api/webhook/confluence
 *   Events: page_created, page_updated
 *   (Optional) Secret: set WEBHOOK_SECRET env var to validate
 *
 * Filter: only spaces listed in WEBHOOK_SPACES env var are processed.
 *   WEBHOOK_SPACES=MV,OPS   (comma-separated space keys, empty = all spaces)
 */

const processHandler = require('../confluence/process/[pageId]');

// Simple mock of Express res to capture processHandler output
function fakeRes() {
  const r = { _status: 200, _body: null };
  r.status  = (code) => { r._status = code; return r; };
  r.json    = (data) => { r._body  = data; return r; };
  r.end     = ()     => r;
  return r;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  // Optional: validate Confluence webhook secret
  const secret = process.env.WEBHOOK_SECRET;
  if (secret) {
    const sig = req.headers['x-hub-signature'] || '';
    if (!sig.includes(secret)) {
      return res.status(401).json({ error: 'Invalid webhook secret' });
    }
  }

  const payload = req.body || {};
  const event   = payload.event   || payload.webhookEvent || '';
  const pageId  = payload.page?.id || payload.data?.page?.id;

  // Only process page create/update events
  if (!['page_created','page_updated','page:created','page:updated'].some(e => event.includes(e.split(':')[1] || e))) {
    return res.json({ ok: true, skipped: `event=${event}` });
  }
  if (!pageId) return res.status(400).json({ error: 'No page.id in webhook payload' });

  // Space filter (optional — restrict to specific spaces)
  const allowedSpaces = (process.env.WEBHOOK_SPACES || '').split(',').map(s => s.trim()).filter(Boolean);
  if (allowedSpaces.length) {
    const spaceKey = payload.page?.spaceKey || payload.data?.page?.space?.key || '';
    if (!allowedSpaces.includes(spaceKey)) {
      return res.json({ ok: true, skipped: `space=${spaceKey} not in WEBHOOK_SPACES` });
    }
  }

  // Call the process handler directly (avoid HTTP hop)
  const fakeReq = { method: 'POST', query: { pageId } };
  const fakeResponse = fakeRes();
  await processHandler(fakeReq, fakeResponse);

  const result = fakeResponse._body || {};
  console.log(`[webhook] page ${pageId} processed:`, result);
  res.status(fakeResponse._status).json({ ok: true, pageId, result });
};
