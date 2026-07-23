'use strict';
const crypto = require('crypto');
const { getCredentials, authHeader } = require('../../_confluence');

// Diagram types supported in Confluence code blocks
const DIAGRAM_TYPES = new Set([
  'mermaid','plantuml','graphviz','d2','bpmn','erd',
  'nomnoml','wavedrom','pikchr','structurizr','dbml','vega','c4plantuml'
]);

// Auto-detect diagram type from code content (for unlabeled code blocks)
function detectDiagramType(code) {
  const c = code.trim();
  const first = c.split('\n')[0].trim().toLowerCase();

  // Mermaid: starts with any known diagram keyword
  if (/^(flowchart|graph\s+(td|lr|rl|bt|tb)|sequencediagram|gantt|classdiagram|statediagram|erdiagram|gitgraph|pie(\s+title)?|mindmap|timeline|xychart-beta|quadrantchart|journey|requirementdiagram|zenuml)/i.test(first))
    return 'mermaid';

  // PlantUML
  if (/^@startuml/i.test(first)) return 'plantuml';

  // GraphViz / DOT
  if (/^(strict\s+)?(di)?graph(\s+\w+)?\s*\{/i.test(first)) return 'graphviz';

  // D2: common pattern "X -> Y: label" or "X: { shape: ... }"
  if (/^[\w\s"'.-]+\s*(?:->|<->|--)\s*[\w\s"'.-]+/.test(first)) return 'd2';

  // BPMN: XML
  if (/^<\?xml/i.test(first) && c.includes('bpmn')) return 'bpmn';

  return null; // unknown — skip
}

// Deterministic filename from code content so re-runs update same attachment
function diagramFilename(type, code) {
  const hash = crypto.createHash('md5').update(type + '\n' + code).digest('hex').slice(0, 8);
  return `auto-${hash}-${type}.png`;
}

// Extract all diagram code blocks from Confluence storage format HTML.
// Handles three macro patterns:
//   1. ac:structured-macro name="code" with language=mermaid/plantuml/etc  (standard Code Block)
//   2. ac:structured-macro name="mermaid|mermaid-cloud|plantuml|..."       (native diagram macros)
//   3. ac:adf-extension with extensionKey containing a diagram type         (Confluence Cloud ADF)
function extractDiagramBlocks(html) {
  const results    = [];
  const seenBlocks = new Set(); // deduplicate: same fullMatch from different patterns
  const bodyRe     = /<ac:plain-text-body><!\[CDATA\[([\s\S]*?)\]\]><\/ac:plain-text-body>/i;
  let idx = 0;

  function push(entry) {
    if (seenBlocks.has(entry.fullMatch)) return; // skip duplicates across patterns
    seenBlocks.add(entry.fullMatch);
    results.push({ ...entry, idx: idx++ });
  }

  // ── Pattern 1: Standard "Code Block" macro ───────────────────────────────
  const codeRe = /<ac:structured-macro(?:[^>]*)ac:name="code"(?:[^>]*)>([\s\S]*?)<\/ac:structured-macro>/g;
  const langRe = /ac:name="language"[^>]*>([^<]+)<\/ac:parameter>/i;
  let m;
  while ((m = codeRe.exec(html)) !== null) {
    const bm = bodyRe.exec(m[1]);
    if (!bm) continue;
    const code = bm[1].trim();
    if (!code) continue;
    const lm   = langRe.exec(m[1]);
    const lang = lm ? lm[1].trim().toLowerCase() : null;
    let type;
    if (lang && DIAGRAM_TYPES.has(lang)) {
      type = lang;
    } else if (!lang || lang === 'none' || lang === 'text' || lang === 'plain') {
      type = detectDiagramType(code);
    } else {
      continue;
    }
    if (!type) continue;
    push({ type, code, filename: diagramFilename(type, code), fullMatch: m[0] });
  }

  // ── Pattern 2: Native diagram macros (mermaid-cloud, mermaid, plantuml…) ─
  const NATIVE = { 'mermaid': 'mermaid', 'mermaid-cloud': 'mermaid', 'plantuml': 'plantuml',
                   'graphviz': 'graphviz', 'd2': 'd2', 'nomnoml': 'nomnoml' };
  const nativeNames = Object.keys(NATIVE).join('|');
  const nativeRe = new RegExp(
    `<ac:structured-macro(?:[^>]*)ac:name="(${nativeNames})"(?:[^>]*)>([\\s\\S]*?)<\\/ac:structured-macro>`, 'g'
  );
  while ((m = nativeRe.exec(html)) !== null) {
    const type = NATIVE[m[1]];
    const bm   = bodyRe.exec(m[2]);
    if (!bm) continue;
    const code = bm[1].trim();
    if (!code) continue;
    push({ type, code, filename: diagramFilename(type, code), fullMatch: m[0] });
  }

  // ── Pattern 3: ADF Extension (Confluence Cloud newer editor) ─────────────
  // <ac:adf-extension>...<ac:adf-attribute key="extensionKey">mermaid</...>
  // ...<ac:adf-attribute key="text">code here</...>...</ac:adf-extension>
  const adfRe     = /<ac:adf-extension>([\s\S]*?)<\/ac:adf-extension>/g;
  const extKeyRe  = /key="extensionKey"[^>]*>([\w-]+)<\/ac:adf-attribute>/i;
  const adfTextRe = /key="text"[^>]*>([\s\S]*?)<\/ac:adf-attribute>/i;
  const adfCdataRe = /\[CDATA\[([\s\S]*?)\]\]>/i;
  while ((m = adfRe.exec(html)) !== null) {
    const inner   = m[1];
    const keyM    = extKeyRe.exec(inner);
    if (!keyM) continue;
    const extKey  = keyM[1].toLowerCase();
    const type    = NATIVE[extKey] || (DIAGRAM_TYPES.has(extKey) ? extKey : null);
    if (!type) continue;
    // Code may be in key="text" attr or in a nested CDATA block
    let code = '';
    const textM = adfTextRe.exec(inner);
    if (textM) {
      const cdM = adfCdataRe.exec(textM[1]);
      code = cdM ? cdM[1].trim() : textM[1].trim();
    }
    if (!code) code = (() => { const cdM = adfCdataRe.exec(inner); return cdM ? cdM[1].trim() : ''; })();
    if (!code) continue;
    push({ type, code, filename: diagramFilename(type, code), fullMatch: m[0] });
  }

  return results;
}

function isPngBuffer(buf) {
  return buf.length > 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
}

// Render diagram via fallback chain:
//   Mermaid  → mermaid.ink (GET, base64url) → kroki.io POST (fallback)
//   Others   → kroki.io POST only
// mermaid.ink doesn't need Accept header; its /img/ endpoint always returns PNG.
// Falls back to kroki.io if mermaid.ink is unreachable or returns non-PNG
// (e.g. Cloudflare blocking server IPs, rate limit, or unexpected SVG response).
async function renderViaKroki(type, code) {
  if (type === 'mermaid') {
    const encoded = Buffer.from(code, 'utf8').toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_');
    try {
      const r = await fetch(`https://mermaid.ink/img/${encoded}`);
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        if (isPngBuffer(buf)) return buf;
        // Got 200 but not PNG (e.g. SVG or HTML error page) — fall through
      }
      // Non-2xx (403/429/5xx) — fall through to kroki.io
    } catch (_) { /* network error — fall through */ }
  }

  // kroki.io POST: handles all types; for mermaid this is the fallback path
  const r = await fetch(`https://kroki.io/${type}/png`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain', Accept: 'image/png' },
    body: code
  });
  const buf = Buffer.from(await r.arrayBuffer());
  if (!isPngBuffer(buf)) throw new Error(`Render ${r.status}: ${buf.toString('utf8', 0, 120)}`);
  return buf;
}

// Upload PNG as Confluence attachment (create or update)
async function uploadAttachment(cfUrl, pageId, filename, pngBuf, auth) {
  const chk = await fetch(
    `${cfUrl}/wiki/rest/api/content/${pageId}/child/attachment?filename=${encodeURIComponent(filename)}&limit=1`,
    { headers: { Authorization: auth, Accept: 'application/json' } }
  );
  const existing = chk.ok ? (await chk.json()).results?.[0] : null;

  const form = new FormData();
  form.append('file', new Blob([pngBuf], { type: 'image/png' }), filename);
  form.append('comment', 'Auto-rendered by Kroki Diagram Processor');
  form.append('minorEdit', 'true');

  const uploadUrl = existing
    ? `${cfUrl}/wiki/rest/api/content/${pageId}/child/attachment/${existing.id}/data`
    : `${cfUrl}/wiki/rest/api/content/${pageId}/child/attachment`;

  const up = await fetch(uploadUrl, {
    method: 'POST',
    headers: { Authorization: auth, 'X-Atlassian-Token': 'no-check' },
    body: form
  });
  if (!up.ok) {
    const txt = await up.text().catch(() => '');
    throw new Error(`Upload ${up.status}: ${txt.slice(0, 120)}`);
  }
}

// Insert rendered image + "Edit in Kroki" link after each code block.
// Idempotent: uses HTML comment markers keyed by filename (which contains code hash).
// If code changes → filename changes → old marker replaced automatically.
// Link format: ?type=mermaid&page=PAGE_ID — user opens tool and pastes code manually.
function patchPageBody(html, diagrams, pageId, toolUrl) {
  let body = html;
  let changed = false;
  const GEN_END = '<!-- /kroki -->';

  for (const d of diagrams) {
    const codePos = body.indexOf(d.fullMatch);
    if (codePos === -1) continue;
    const insertAt = codePos + d.fullMatch.length;

    const genStart  = `<!-- kroki:${d.filename} -->`;
    const editHref  = `${toolUrl}?type=${d.type}&amp;page=${pageId}`;
    const newBlock  =
      `\n${genStart}` +
      `\n<ac:image ac:align="center"><ri:attachment ri:filename="${d.filename}"/></ac:image>` +
      `\n<p style="text-align:center;font-size:11px">` +
        `<a href="${editHref}" rel="nofollow">✏️ Edit in Kroki ↗</a>` +
      `</p>` +
      `\n${GEN_END}`;

    // Look for any kroki marker immediately after this code block
    const zone       = body.slice(insertAt, insertAt + 300);
    const markerIdx  = zone.indexOf('<!-- kroki:');

    if (markerIdx !== -1) {
      const absStart = insertAt + markerIdx;
      if (body.slice(absStart, absStart + genStart.length) === genStart) {
        continue; // same code hash → nothing changed, skip
      }
      // Different hash: code was edited → find end marker and replace
      const endIdx = body.indexOf(GEN_END, absStart);
      if (endIdx !== -1) {
        body = body.slice(0, absStart) + newBlock.trimStart() + body.slice(endIdx + GEN_END.length);
        changed = true;
        continue;
      }
    }

    // No marker yet → first time, insert
    body = body.slice(0, insertAt) + newBlock + body.slice(insertAt);
    changed = true;
  }
  return { body, changed };
}

// ─── Main handler ─────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  const pageId = req.query.pageId;
  if (!pageId) return res.status(400).json({ error: 'Missing pageId' });

  const { cfUrl, cfEmail, cfToken } = getCredentials();
  if (!cfUrl) return res.status(500).json({ error: 'Server credentials not configured' });
  const auth = authHeader(cfEmail, cfToken);

  // GET — return diagram code blocks found on this page (used by frontend to auto-load editor)
  if (req.method === 'GET') {
    try {
      const pageRes = await fetch(
        `${cfUrl}/wiki/rest/api/content/${pageId}?expand=body.storage`,
        { headers: { Authorization: auth, Accept: 'application/json' } }
      );
      if (!pageRes.ok) return res.status(pageRes.status).json({ error: `Confluence ${pageRes.status}` });
      const page = await pageRes.json();
      const html = page.body.storage.value;
      const diagrams = extractDiagramBlocks(html);
      // Also extract existing attachment filenames from kroki markers so frontend can pre-fill cfFileName
      const markerRe = /<!-- kroki:(auto-[a-f0-9]+-[a-z0-9]+\.png) -->/g;
      const markers = [];
      let m;
      while ((m = markerRe.exec(html)) !== null) markers.push(m[1]);
      return res.json({
        ok: true,
        diagrams: diagrams.map((d, i) => ({ type: d.type, code: d.code, filename: markers[i] || d.filename }))
      });
    } catch (e) {
      return res.status(502).json({ error: e.message });
    }
  }

  try {
    // 1. Fetch page with storage body + version
    const pageRes = await fetch(
      `${cfUrl}/wiki/rest/api/content/${pageId}?expand=body.storage,version,title`,
      { headers: { Authorization: auth, Accept: 'application/json' } }
    );
    if (!pageRes.ok) {
      return res.status(pageRes.status).json({ error: `Confluence ${pageRes.status}` });
    }
    const page = await pageRes.json();
    const storageHtml = page.body.storage.value;
    const version     = page.version.number;
    const title       = page.title;

    // 2. Find diagram code blocks
    const diagrams = extractDiagramBlocks(storageHtml);
    if (!diagrams.length) {
      return res.json({ ok: true, processed: 0, message: 'No diagram code blocks found on this page' });
    }

    // 3. Render each + upload attachment (parallel)
    const errors = [];
    await Promise.all(diagrams.map(async d => {
      try {
        const png = await renderViaKroki(d.type, d.code);
        await uploadAttachment(cfUrl, pageId, d.filename, png, auth);
      } catch (e) {
        errors.push({ idx: d.idx, type: d.type, error: e.message });
      }
    }));

    // 4. Patch page body: add image + "Edit in Kroki" link (only for successfully uploaded)
    const toolUrl  = (() => {
      if (process.env.TOOL_URL) return process.env.TOOL_URL.replace(/\/$/, '');
      // Sanitize forwarded headers to prevent injection into Confluence page body
      const proto = /^https?$/.test(req.headers['x-forwarded-proto']) ? req.headers['x-forwarded-proto'] : 'https';
      const host  = (req.headers['x-forwarded-host'] || req.headers.host || 'mvldiagram.vercel.app')
        .replace(/[^a-zA-Z0-9.:\-]/g, '');
      return `${proto}://${host}`;
    })();
    const uploaded = diagrams.filter(d => !errors.find(e => e.idx === d.idx));
    const { body: newBody, changed } = patchPageBody(storageHtml, uploaded, pageId, toolUrl);

    if (changed) {
      const putRes = await fetch(`${cfUrl}/wiki/rest/api/content/${pageId}`, {
        method: 'PUT',
        headers: { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          version: { number: version + 1 },
          title,
          type: 'page',
          body: { storage: { value: newBody, representation: 'storage' } }
        })
      });
      if (!putRes.ok) {
        const txt = await putRes.text().catch(() => '');
        return res.status(putRes.status).json({
          error: `Page update failed ${putRes.status}: ${txt.slice(0, 200)}`,
          attachmentsUploaded: uploaded.length
        });
      }
    }

    res.json({
      ok: true,
      processed: uploaded.length,
      total: diagrams.length,
      bodyUpdated: changed,
      errors: errors.length ? errors : undefined,
      diagrams: diagrams.map(d => ({ type: d.type, filename: d.filename }))
    });

  } catch (e) {
    console.error('process-page error:', e);
    res.status(502).json({ error: e.message });
  }
};
