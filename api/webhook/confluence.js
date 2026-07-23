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

const crypto         = require('crypto');
const processHandler = require('../confluence/process/[pageId]');

// Simple mock of Express res to capture processHandler output
function fakeRes() {
  const r = { _status: 200, _body: null };
  r.status  = (code) => { r._status = code; return r; };
  r.json    = (data) => { r._body  = data; return r; };
  r.end     = ()     => r;
  return r;
}

// Page create/update events — strict set to prevent false positives like
// "content_created", "space_created", etc. matching a substring check.
const VALID_EVENTS = new Set(['page_created', 'page_updated', 'page:created', 'page:updated']);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  // Optional: validate Confluence webhook secret via HMAC-SHA256.
  // Confluence sends: X-Hub-Signature: sha256=<hex>
  const secret = process.env.WEBHOOK_SECRET;
  if (secret) {
    const sig  = req.headers['x-hub-signature'] || '';
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? '');
    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
    let sigValid = false;
    try {
      // timingSafeEqual prevents timing-oracle attacks
      sigValid = sig.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    } catch { sigValid = false; }
    if (!sigValid) {
      return res.status(401).json({ error: 'Invalid webhook secret' });
    }
  }

  const payload = req.body || {};
  const event   = payload.event   || payload.webhookEvent || '';
  const pageId  = payload.page?.id || payload.data?.page?.id;

  // Only process page create/update events
  if (!VALID_EVENTS.has(event)) {
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
  const fakeReq      = { method: 'POST', query: { pageId }, headers: req.headers };
  const fakeResponse = fakeRes();
  await processHandler(fakeReq, fakeResponse);

  const result = fakeResponse._body || {};
  console.log(`[webhook] page ${pageId} processed:`, result);
  res.status(fakeResponse._status).json({ ok: true, pageId, result });
};
