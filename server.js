/**
 * server.js — Local proxy server for Kroki Diagram Tester
 *
 * Solves CORS: browser → localhost:3333 → Atlassian Cloud
 * Credentials are loaded from ../confluence-jira-audit/.env (never sent to browser)
 *
 * Run from D:\MVillage:
 *   node kroki-diagram-tester/server.js
 *   npm run kroki
 */

'use strict';

const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

// ─── Load .env ───────────────────────────────────────────────────────────────
function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const env = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const idx = trimmed.indexOf('=');
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return env;
}

const ENV_PATH = path.join(__dirname, '..', 'confluence-jira-audit', '.env');
const ENV      = loadEnv(ENV_PATH);

// process.env first (Railway / any cloud), fallback to .env for local dev
const CF_URL   = (process.env.ATLASSIAN_URL   || ENV.ATLASSIAN_URL   || '').replace(/\/$/, '');
const CF_EMAIL = process.env.ATLASSIAN_EMAIL  || ENV.ATLASSIAN_EMAIL  || '';
const CF_TOKEN = process.env.ATLASSIAN_API_TOKEN || ENV.ATLASSIAN_API_TOKEN || '';

if (!CF_URL || !CF_EMAIL || !CF_TOKEN) {
  console.error('❌ Thiếu credentials trong', ENV_PATH);
  console.error('   Cần: ATLASSIAN_URL, ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN');
  process.exit(1);
}

const AUTH_HEADER = 'Basic ' + Buffer.from(`${CF_EMAIL}:${CF_TOKEN}`).toString('base64');

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function cfGet(path, query = '') {
  const url = `${CF_URL}/wiki/rest/api${path}${query ? '?' + query : ''}`;
  const res  = await fetch(url, {
    headers: { 'Authorization': AUTH_HEADER, 'Accept': 'application/json' }
  });
  const body = await res.text();
  return { status: res.status, ok: res.ok, body };
}

// ─── App ─────────────────────────────────────────────────────────────────────
const app    = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT   = process.env.PORT || 3333;
const STATIC = __dirname;

// Serve static files (index.html, app.js, style.css)
app.use(express.static(STATIC));

// ── GET /api/confluence/spaces ──────────────────────────────────────────────
app.get('/api/confluence/spaces', async (req, res) => {
  try {
    const { status, ok, body } = await cfGet('/space', 'limit=100&type=global');
    res.status(status).type('json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ── GET /api/confluence/pages/:spaceKey ─────────────────────────────────────
app.get('/api/confluence/pages/:spaceKey', async (req, res) => {
  try {
    const qs = `type=page&spaceKey=${encodeURIComponent(req.params.spaceKey)}&limit=100`;
    const { status, ok, body } = await cfGet('/content', qs);
    res.status(status).type('json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ── POST /api/confluence/upload/:pageId ─────────────────────────────────────
app.post('/api/confluence/upload/:pageId', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const pageId   = req.params.pageId;
  const filename = req.file.originalname || 'diagram.png';
  const imgBuf   = req.file.buffer;

  try {
    // 1. Find existing attachment
    const findRes  = await cfGet(
      `/content/${pageId}/child/attachment`,
      `filename=${encodeURIComponent(filename)}&limit=1`
    );
    if (!findRes.ok) {
      const data = JSON.parse(findRes.body);
      return res.status(findRes.status).json({
        error: `Confluence ${findRes.status}: ${JSON.stringify(data).substring(0, 200)}`
      });
    }
    const findData = JSON.parse(findRes.body);
    const existing = findData.results?.[0] || null;

    // 2. Build multipart form for upload
    const form = new FormData();
    form.append('file', new Blob([imgBuf], { type: 'image/png' }), filename);
    form.append('comment', 'Auto-synced by Kroki Diagram Tester');
    form.append('minorEdit', 'true');

    let uploadUrl;
    if (existing) {
      uploadUrl = `${CF_URL}/wiki/rest/api/content/${pageId}/child/attachment/${existing.id}/data`;
    } else {
      uploadUrl = `${CF_URL}/wiki/rest/api/content/${pageId}/child/attachment`;
    }

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization':       AUTH_HEADER,
        'X-Atlassian-Token':   'no-check',
      },
      body: form
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return res.status(uploadRes.status).json({
        error: `Upload failed ${uploadRes.status}: ${errText.substring(0, 200)}`
      });
    }

    // 3. Return stable URL (does not change across updates)
    const stableUrl = `${CF_URL}/wiki/download/attachments/${pageId}/${filename}`;
    res.json({ ok: true, updated: !!existing, url: stableUrl });

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
