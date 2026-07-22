/**
 * server.js — Local dev server for Kroki Diagram Tester
 *
 * Run from D:\MVillage:
 *   node kroki-diagram-tester/server.js
 *   npm run kroki
 *
 * On Vercel: api/ serverless functions are used instead (same protocol).
 */

'use strict';

const express = require('express');
const path    = require('path');
const fs      = require('fs');

// ─── Load .env ───────────────────────────────────────────────────────────────
function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const env = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const idx = t.indexOf('=');
    env[t.slice(0, idx).trim()] = t.slice(idx + 1).trim();
  }
  return env;
}

const ENV_PATH = path.join(__dirname, '..', 'confluence-jira-audit', '.env');
const ENV      = loadEnv(ENV_PATH);

function clean(s) { return (s || '').split('').filter(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126).join(''); }

const CF_URL   = clean(process.env.ATLASSIAN_URL   || ENV.ATLASSIAN_URL   || '').replace(/\/$/, '');
const CF_EMAIL = clean(process.env.ATLASSIAN_EMAIL  || ENV.ATLASSIAN_EMAIL  || '');
const CF_TOKEN = clean(process.env.ATLASSIAN_API_TOKEN || ENV.ATLASSIAN_API_TOKEN || '');

if (!CF_URL || !CF_EMAIL || !CF_TOKEN) {
  console.warn('⚠️  Missing credentials. Confluence sync will fail.');
  console.warn('   Check:', ENV_PATH);
  console.warn('   Need: ATLASSIAN_URL, ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN');
  // NOTE: don't process.exit() — this file is local-only; Vercel uses api/ functions
}

const AUTH_HEADER = 'Basic ' + Buffer.from(`${CF_EMAIL}:${CF_TOKEN}`).toString('base64');

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function cfGet(apiPath, query = '') {
  const url = `${CF_URL}/wiki/rest/api${apiPath}${query ? '?' + query : ''}`;
  const res  = await fetch(url, { headers: { Authorization: AUTH_HEADER, Accept: 'application/json' } });
  const body = await res.text();
  return { status: res.status, ok: res.ok, body };
}

// ─── App ─────────────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3333;

app.use(express.static(__dirname));
app.use(express.json({ limit: '10mb' }));  // parse JSON body for upload route

// ── GET /api/confluence/spaces ──────────────────────────────────────────────
app.get('/api/confluence/spaces', async (req, res) => {
  try {
    const { status, body } = await cfGet('/space', 'limit=100&type=global');
    res.status(status).type('json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ── GET /api/confluence/pages/:spaceKey ─────────────────────────────────────
app.get('/api/confluence/pages/:spaceKey', async (req, res) => {
  try {
    const qs = `type=page&spaceKey=${encodeURIComponent(req.params.spaceKey)}&limit=100`;
    const { status, body } = await cfGet('/content', qs);
    res.status(status).type('json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ── GET /api/confluence/check/:pageId ───────────────────────────────────────
app.get('/api/confluence/check/:pageId', async (req, res) => {
  const filename = req.query.filename || 'diagram.png';
  try {
    const { status, ok, body } = await cfGet(
      `/content/${req.params.pageId}/child/attachment`,
      `filename=${encodeURIComponent(filename)}&limit=1`
    );
    if (!ok) return res.status(status).json({ exists: false, error: `Confluence ${status}` });
    const att = JSON.parse(body).results?.[0] || null;
    res.json({
      exists:       !!att,
      version:      att?.version?.number || null,
      lastModified: att?.version?.when   || null,
      url: att ? `${CF_URL}/wiki/download/attachments/${req.params.pageId}/${encodeURIComponent(filename)}` : null
    });
  } catch (err) { res.status(502).json({ exists: false, error: err.message }); }
});

// ── POST /api/confluence/upload/:pageId ─────────────────────────────────────
// Accepts JSON body: { filename: string, data: base64 string }
app.post('/api/confluence/upload/:pageId', async (req, res) => {
  const { filename, data } = req.body || {};
  if (!filename || !data) return res.status(400).json({ error: 'Missing filename or data' });

  const pageId = req.params.pageId;
  const imgBuf = Buffer.from(data, 'base64');

  try {
    // 1. Find existing attachment
    const findRes = await cfGet(
      `/content/${pageId}/child/attachment`,
      `filename=${encodeURIComponent(filename)}&limit=1`
    );
    if (!findRes.ok) {
      return res.status(findRes.status).json({
        error: `Confluence ${findRes.status}: ${findRes.body.substring(0, 200)}`
      });
    }
    const existing = JSON.parse(findRes.body).results?.[0] || null;

    // 2. Upload via multipart (server-side fetch, no CORS)
    const form = new FormData();
    form.append('file', new Blob([imgBuf], { type: 'image/png' }), filename);
    form.append('comment', 'Auto-synced by Kroki Diagram Tester');
    form.append('minorEdit', 'true');

    const uploadUrl = existing
      ? `${CF_URL}/wiki/rest/api/content/${pageId}/child/attachment/${existing.id}/data`
      : `${CF_URL}/wiki/rest/api/content/${pageId}/child/attachment`;

    const uploadRes = await fetch(uploadUrl, {
      method:  'POST',
      headers: { Authorization: AUTH_HEADER, 'X-Atlassian-Token': 'no-check' },
      body:    form
    });

    if (!uploadRes.ok) {
      const txt = await uploadRes.text();
      return res.status(uploadRes.status).json({ error: `Upload ${uploadRes.status}: ${txt.substring(0, 200)}` });
    }

    res.json({ ok: true, updated: !!existing, url: `${CF_URL}/wiki/download/attachments/${pageId}/${filename}` });

  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n◈ Kroki Diagram Tester — local server`);
  console.log(`  URL    : http://localhost:${PORT}`);
  console.log(`  Proxy  : ${CF_URL}`);
  console.log(`  User   : ${CF_EMAIL}`);
  console.log(`\n  Open http://localhost:${PORT} in your browser\n`);
});
