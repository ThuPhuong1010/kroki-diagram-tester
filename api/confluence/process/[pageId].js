'use strict';
const crypto = require('crypto');
const zlib   = require('zlib');
const { getCredentials, authHeader } = require('../../_confluence');

// Encode code for "Edit in Kroki" URL param — deflateRaw + base64url (same scheme as pako on client)
function encodeCodeParam(code) {
  return zlib.deflateRawSync(Buffer.from(code, 'utf8'))
    .toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

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

// Types kroki.io only supports as SVG (not PNG)
const SVG_ONLY = new Set(['bpmn', 'vega', 'dbml', 'nomnoml', 'pikchr', 'wavedrom']);

function diagramExt(type) { return SVG_ONLY.has(type) ? 'svg' : 'png'; }

// Deterministic filename from code content so re-runs update same attachment
function diagramFilename(type, code) {
  const hash = crypto.createHash('md5').update(type + '\n' + code).digest('hex').slice(0, 8);
  return `auto-${hash}-${type}.${diagramExt(type)}`;
}

function stripStorageHtml(html) {
  return (html || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function diagramContext(html, fullMatch) {
  const pos = html.indexOf(fullMatch);
  if (pos === -1) return { contextBefore: '', contextAfter: '' };
  return {
    contextBefore: stripStorageHtml(html.slice(Math.max(0, pos - 900), pos)).slice(-260),
    contextAfter: stripStorageHtml(html.slice(pos + fullMatch.length, pos + fullMatch.length + 900)).slice(0, 260)
  };
}

function markerForCodeBlock(html, fullMatch) {
  const GEN_END = '<!-- /kroki -->';
  const pos = html.indexOf(fullMatch);
  if (pos === -1) return null;

  const before = html.slice(0, pos);
  const openIdx = before.lastIndexOf('<!-- kroki:');
  if (openIdx !== -1) {
    const closeIdx = html.indexOf(GEN_END, openIdx);
    if (closeIdx !== -1 && closeIdx > pos) {
      const marker = /^<!-- kroki:([^>]+?) -->/.exec(html.slice(openIdx, openIdx + 120));
      if (marker) return marker[1];
    }
  }

  const after = html.slice(pos + fullMatch.length, pos + fullMatch.length + 500);
  const marker = /<!-- kroki:([^>]+?) -->/.exec(after);
  return marker ? marker[1] : null;
}

function buildDiagramMetadata(html, diagrams) {
  return diagrams.map(d => {
    const marker = markerForCodeBlock(html, d.fullMatch);
    return {
      idx: d.idx,
      type: d.type,
      code: d.code,
      filename: marker || d.filename,
      generatedFilename: d.filename,
      marker,
      hasKrokiBlock: !!marker,
      ...diagramContext(html, d.fullMatch)
    };
  });
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
function isSvgBuffer(buf) {
  const s = buf.toString('utf8', 0, 300);
  return s.includes('<svg') || s.includes('<?xml');
}

// Render diagram → returns { buf, ext } where ext is 'png' or 'svg'
// Fallback chain for mermaid: mermaid.ink GET → kroki.io POST
// SVG_ONLY types always use SVG format from kroki.io
async function renderViaKroki(type, code) {
  if (type === 'mermaid') {
    const encoded = Buffer.from(code, 'utf8').toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_');
    try {
      const r = await fetch(`https://mermaid.ink/img/${encoded}`);
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        if (isPngBuffer(buf)) return { buf, ext: 'png' };
      }
    } catch (_) { /* fall through to kroki.io */ }
  }

  const fmt = SVG_ONLY.has(type) ? 'svg' : 'png';
  const r = await fetch(`https://kroki.io/${type}/${fmt}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: code
  });
  const buf = Buffer.from(await r.arrayBuffer());
  if (fmt === 'svg') {
    if (!isSvgBuffer(buf)) throw new Error(`Render ${r.status}: ${buf.toString('utf8', 0, 120)}`);
    return { buf, ext: 'svg' };
  }
  if (!isPngBuffer(buf)) throw new Error(`Render ${r.status}: ${buf.toString('utf8', 0, 120)}`);
  return { buf, ext: 'png' };
}

// Upload diagram image as Confluence attachment (create or update)
async function uploadAttachment(cfUrl, pageId, filename, imgBuf, auth) {
  const chk = await fetch(
    `${cfUrl}/wiki/rest/api/content/${pageId}/child/attachment?filename=${encodeURIComponent(filename)}&limit=1`,
    { headers: { Authorization: auth, Accept: 'application/json' } }
  );
  const existing = chk.ok ? (await chk.json()).results?.[0] : null;

  const mimeType = filename.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  const form = new FormData();
  form.append('file', new Blob([imgBuf], { type: mimeType }), filename);
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

// Check if a Confluence attachment with this exact filename already exists.
// filename encodes an MD5 hash of type+code, so existence → code unchanged → skip re-render.
async function checkAttachmentExists(cfUrl, pageId, filename, auth) {
  const r = await fetch(
    `${cfUrl}/wiki/rest/api/content/${pageId}/child/attachment?filename=${encodeURIComponent(filename)}&limit=1`,
    { headers: { Authorization: auth, Accept: 'application/json' } }
  );
  const json = r.ok ? await r.json() : null;
  return !!(json?.results?.[0]);
}

// Build the kroki block: image + Edit/Re-sync links.
// Code block stays in its original position (always visible). This block is inserted AFTER the code.
function buildKrokiBlock(d, pageId, toolUrl) {
  const editHref   = `${toolUrl}?type=${d.type}&amp;page=${pageId}&amp;idx=${d.idx}&amp;code=${encodeCodeParam(d.code)}`;
  const resyncHref = `${toolUrl}?page=${pageId}&amp;autoprocess=1`;
  return (
    `\n<!-- kroki:${d.filename} -->` +
    `\n<ac:image ac:align="center"><ri:attachment ri:filename="${d.filename}"/></ac:image>` +
    `\n<p style="text-align:center;font-size:11px">` +
      `<a href="${editHref}" rel="nofollow">✏️ Edit in Kroki ↗</a>` +
      ` &nbsp;·&nbsp; <a href="${resyncHref}" rel="nofollow">🔄 Re-sync</a>` +
    `</p>` +
    `\n<!-- /kroki -->`
  );
}

// Patch Confluence storage HTML: insert rendered image AFTER each code block.
// Code block stays in place so both source and image are always visible.
//
// Idempotency — 3 cases:
//   1. Code block is INSIDE an existing kroki block (old expand format → migrate):
//      extract code back out, place it before new kroki block (image only).
//   2. Kroki marker already follows code block (correct format):
//      same hash → skip; different hash → replace marker only.
//   3. First time → insert kroki block AFTER code block.
function patchPageBody(html, diagrams, pageId, toolUrl) {
  let body    = html;
  let changed = false;
  const GEN_END = '<!-- /kroki -->';

  for (const d of diagrams) {
    const genStart = `<!-- kroki:${d.filename} -->`;
    const newBlock = buildKrokiBlock(d, pageId, toolUrl);

    const codePos = body.indexOf(d.fullMatch);
    if (codePos === -1) continue;

    // ── Case 1: code is INSIDE a kroki block (old format → migrate) ──────────
    const beforeCode   = body.slice(0, codePos);
    const krokiOpenIdx = beforeCode.lastIndexOf('<!-- kroki:');
    if (krokiOpenIdx !== -1) {
      const krokiCloseIdx = body.indexOf(GEN_END, krokiOpenIdx);
      if (krokiCloseIdx !== -1 && krokiCloseIdx > codePos) {
        // Migrate: code → expand(code) + kroki block after
        body = body.slice(0, krokiOpenIdx)
             + wrapInExpand(d.fullMatch) + '\n'
             + newBlock
             + body.slice(krokiCloseIdx + GEN_END.length);
        changed = true;
        continue;
      }
    }

    const insertAt = codePos + d.fullMatch.length;

    // ── Case 2: kroki marker follows code block (or its expand wrapper) ───────
    // Look for kroki marker up to 600 chars after code block end
    // (may be further if code is already inside an expand macro)
    const expandWrapper = findExpandWrapper(body, codePos, d.fullMatch.length);
    const searchFrom    = expandWrapper ? expandWrapper.end : insertAt;
    const zone          = body.slice(searchFrom, searchFrom + 600);
    const markerIdx     = zone.indexOf('<!-- kroki:');
    if (markerIdx !== -1 && markerIdx < 500) {
      const absStart = searchFrom + markerIdx;
      if (body.slice(absStart, absStart + genStart.length) === genStart) {
        continue; // same hash → already up to date
      }
      // Different hash → replace kroki block only (code/expand stays as-is)
      const endIdx = body.indexOf(GEN_END, absStart);
      if (endIdx !== -1) {
        body = body.slice(0, absStart) + newBlock.trimStart() + body.slice(endIdx + GEN_END.length);
        changed = true;
        continue;
      }
    }

    // ── Case 3: first time → wrap code in expand + insert kroki block after ──
    body = body.slice(0, codePos)
         + wrapInExpand(d.fullMatch) + '\n'
         + newBlock
         + body.slice(insertAt);
    changed = true;
  }
  return { body, changed };
}

// Wrap a code block macro in an Expand macro (collapsible) so code is hidden by default.
function wrapInExpand(codeBlockHtml) {
  return (
    '<ac:structured-macro ac:name="expand" ac:schema-version="1">' +
    '<ac:parameter ac:name="title">View diagram source</ac:parameter>' +
    '<ac:rich-text-body>' +
    '\n' + codeBlockHtml + '\n' +
    '</ac:rich-text-body>' +
    '</ac:structured-macro>'
  );
}

// Detect if the code block at codePos is already wrapped in an Expand macro.
// Returns { start, end } (absolute positions in body) or null.
function findExpandWrapper(body, codePos, codeLen) {
  const EXPAND_OPEN_TAG = '<ac:structured-macro ac:name="expand"';
  const RTB_OPEN        = '<ac:rich-text-body>';
  const RTB_CLOSE       = '</ac:rich-text-body>';
  const SM_CLOSE        = '</ac:structured-macro>';

  const lookStart = Math.max(0, codePos - 600);
  const lookback  = body.slice(lookStart, codePos);
  const relIdx    = lookback.lastIndexOf(EXPAND_OPEN_TAG);
  if (relIdx === -1) return null;
  // Verify that <ac:rich-text-body> immediately precedes the code block
  const rtbRel = lookback.lastIndexOf(RTB_OPEN, lookback.length);
  if (rtbRel === -1 || rtbRel < relIdx) return null;

  const expandStart = lookStart + relIdx;

  const afterCode = body.slice(codePos + codeLen, codePos + codeLen + 400);
  const rtbCloseIdx = afterCode.indexOf(RTB_CLOSE);
  if (rtbCloseIdx === -1 || rtbCloseIdx > 200) return null;
  const smCloseIdx  = afterCode.indexOf(SM_CLOSE, rtbCloseIdx);
  if (smCloseIdx === -1 || smCloseIdx > rtbCloseIdx + 100) return null;
  const expandEnd = codePos + codeLen + smCloseIdx + SM_CLOSE.length;
  return { start: expandStart, end: expandEnd };
}

function codeBlockMacro(type, code) {
  const lang = DIAGRAM_TYPES.has(type) ? type : 'text';
  return (
    `<ac:structured-macro ac:name="code" ac:schema-version="1">` +
      `<ac:parameter ac:name="language">${lang}</ac:parameter>` +
      `<ac:plain-text-body><![CDATA[${code}]]></ac:plain-text-body>` +
    `</ac:structured-macro>`
  );
}

function patchOneDiagram(html, target, pageId, toolUrl) {
  const replacement = {
    idx: typeof target.idx === 'number' ? target.idx : -1,
    type: target.type,
    code: target.code,
    filename: target.filename || diagramFilename(target.type, target.code),
    fullMatch: codeBlockMacro(target.type, target.code)
  };
  const newCodeWithExpand = wrapInExpand(replacement.fullMatch);
  const newBlock = buildKrokiBlock(replacement, pageId, toolUrl).trimStart();
  const GEN_END = '<!-- /kroki -->';

  if (target.mode === 'add' || target.idx === null || target.idx === undefined || target.idx < 0) {
    // Add: append expand(code) + image at end of page
    return { body: html + '\n' + newCodeWithExpand + '\n' + newBlock, changed: true, filename: replacement.filename };
  }

  const diagrams = extractDiagramBlocks(html);
  const current = diagrams.find(d => d.idx === Number(target.idx));
  if (!current) throw new Error(`Diagram index ${target.idx} not found on page`);
  const codePos = html.indexOf(current.fullMatch);
  if (codePos === -1) throw new Error('Diagram source block not found on page');

  // Detect if code is already inside an expand wrapper
  const ew = findExpandWrapper(html, codePos, current.fullMatch.length);
  const sourceStart = ew ? ew.start : codePos;
  const sourceEnd   = ew ? ew.end   : codePos + current.fullMatch.length;

  // Case 1: source (code ± expand) is inside an old kroki block → migrate
  const beforeSource = html.slice(0, sourceStart);
  const krokiOpenIdx = beforeSource.lastIndexOf('<!-- kroki:');
  if (krokiOpenIdx !== -1) {
    const krokiCloseIdx = html.indexOf(GEN_END, krokiOpenIdx);
    if (krokiCloseIdx !== -1 && krokiCloseIdx > sourceStart) {
      return {
        body: html.slice(0, krokiOpenIdx) + newCodeWithExpand + '\n' + newBlock + html.slice(krokiCloseIdx + GEN_END.length),
        changed: true,
        filename: replacement.filename
      };
    }
  }

  // Case 2: kroki marker follows source → replace source + kroki block
  const zone = html.slice(sourceEnd, sourceEnd + 600);
  const markerIdx = zone.indexOf('<!-- kroki:');
  if (markerIdx !== -1 && markerIdx < 500) {
    const absStart = sourceEnd + markerIdx;
    const endIdx = html.indexOf(GEN_END, absStart);
    if (endIdx !== -1) {
      return {
        body: html.slice(0, sourceStart) + newCodeWithExpand + '\n' + newBlock + html.slice(endIdx + GEN_END.length),
        changed: true,
        filename: replacement.filename
      };
    }
  }

  // Case 3: no kroki marker yet → replace source with expand(new code) + image
  return {
    body: html.slice(0, sourceStart) + newCodeWithExpand + '\n' + newBlock + html.slice(sourceEnd),
    changed: true,
    filename: replacement.filename
  };
}

function toolUrlFromReq(req) {
  if (process.env.TOOL_URL) return process.env.TOOL_URL.replace(/\/$/, '');
  const host = (req.headers['x-forwarded-host'] || req.headers.host || 'mvldiagram.vercel.app')
    .replace(/[^a-zA-Z0-9.:\-]/g, '');
  const proto = /^https?$/.test(req.headers['x-forwarded-proto'])
    ? req.headers['x-forwarded-proto']
    : host.startsWith('localhost') ? 'http' : 'https';
  return `${proto}://${host}`;
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
        `${cfUrl}/wiki/rest/api/content/${pageId}?expand=body.storage,version,title`,
        { headers: { Authorization: auth, Accept: 'application/json' } }
      );
      if (!pageRes.ok) return res.status(pageRes.status).json({ error: `Confluence ${pageRes.status}` });
      const page = await pageRes.json();
      const html = page.body.storage.value;
      const diagrams = extractDiagramBlocks(html);
      return res.json({
        ok: true,
        pageId,
        pageTitle: page.title,
        pageVersion: page.version?.number || null,
        diagrams: buildDiagramMetadata(html, diagrams)
      });
    } catch (e) {
      return res.status(502).json({ error: e.message });
    }
  }

  if (req.method === 'PATCH') {
    const { idx, mode = 'update', type = 'mermaid', code = '', filename = '' } = req.body || {};
    if (!code.trim()) return res.status(400).json({ error: 'Missing diagram code' });

    try {
      const pageRes = await fetch(
        `${cfUrl}/wiki/rest/api/content/${pageId}?expand=body.storage,version,title`,
        { headers: { Authorization: auth, Accept: 'application/json' } }
      );
      if (!pageRes.ok) return res.status(pageRes.status).json({ error: `Confluence ${pageRes.status}` });
      const page = await pageRes.json();
      const storageHtml = page.body.storage.value;
      const version = page.version.number;
      const title = page.title;

      const expectedExt = diagramExt(type);
      let finalFilename = filename || diagramFilename(type, code);
      finalFilename = finalFilename.replace(/\.(png|svg)$/i, '') + `.${expectedExt}`;
      const { buf } = await renderViaKroki(type, code);
      await uploadAttachment(cfUrl, pageId, finalFilename, buf, auth);

      const { body: newBody, changed } = patchOneDiagram(
        storageHtml,
        { idx, mode, type, code, filename: finalFilename },
        pageId,
        toolUrlFromReq(req)
      );

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
            uploaded: true
          });
        }
      }

      const stableUrl = `${cfUrl}/wiki/download/attachments/${pageId}/${finalFilename}`;
      return res.json({ ok: true, mode, updated: mode !== 'add', filename: finalFilename, url: stableUrl });
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

    // 3. Render + upload — skip if attachment already exists with same filename (hash = same code)
    const errors  = [];
    let   cached  = 0;
    await Promise.all(diagrams.map(async d => {
      try {
        const exists = await checkAttachmentExists(cfUrl, pageId, d.filename, auth);
        if (exists) { cached++; return; } // same code hash → no re-render needed
        const { buf } = await renderViaKroki(d.type, d.code);
        await uploadAttachment(cfUrl, pageId, d.filename, buf, auth);
      } catch (e) {
        errors.push({ idx: d.idx, type: d.type, error: e.message });
      }
    }));

    // 4. Patch page body: add image + "Edit in Kroki" link (only for successfully uploaded)
    const toolUrl  = toolUrlFromReq(req);
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
      rendered: uploaded.length - cached,
      cached,
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
