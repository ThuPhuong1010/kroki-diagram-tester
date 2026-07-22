/* ===========================
   app.js — Kroki Diagram Tester
   GitHub: thuphuong1010/kroki-diagram-tester
   =========================== */

'use strict';

// ─── Templates ───────────────────────────────────────────────────────────────
const TEMPLATES = {
  'mermaid-flowchart': {
    type: 'mermaid',
    code: `flowchart TD
    A([Start]) --> B{Login OK?}
    B -- Yes --> C[Load Dashboard]
    B -- No  --> D[Show Error]
    C --> E{Role?}
    E -- Admin --> F[Admin Panel]
    E -- User  --> G[User Panel]
    D --> H([End])
    F --> I([Done])
    G --> I`
  },
  'mermaid-sequence': {
    type: 'mermaid',
    code: `sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Login (email, password)
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: SELECT user WHERE email=?
    Database-->>Backend: User record
    Backend-->>Frontend: JWT Token
    Frontend-->>User: Redirect to Dashboard

    Note over Backend,Database: Password verified with bcrypt`
  },
  'mermaid-class': {
    type: 'mermaid',
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound() String
        +move() void
    }
    class Dog {
        +String breed
        +fetch() void
    }
    class Cat {
        +bool isIndoor
        +purr() void
    }
    class Bird {
        +float wingspan
        +fly() void
    }

    Animal <|-- Dog
    Animal <|-- Cat
    Animal <|-- Bird`
  },
  'mermaid-erd': {
    type: 'mermaid',
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT }|--|{ ORDER_ITEM : "included in"

    CUSTOMER {
        int    id         PK
        string name
        string email      UK
        date   created_at
    }
    ORDER {
        int    id         PK
        date   ordered_at
        string status
        int    customer_id FK
    }
    ORDER_ITEM {
        int   order_id   FK
        int   product_id FK
        int   quantity
        float unit_price
    }
    PRODUCT {
        int    id    PK
        string name
        float  price
        int    stock
    }`
  },
  'mermaid-gantt': {
    type: 'mermaid',
    code: `gantt
    title Sprint Q3 2026
    dateFormat  YYYY-MM-DD
    excludes    weekends

    section Backend
    API Design       :done,    api1, 2026-07-01, 5d
    Core Services    :active,  api2, 2026-07-07, 10d
    Unit Tests       :         api3, after api2, 4d

    section Frontend
    UI Mockup        :done,    ui1, 2026-07-01, 7d
    Component Build  :         ui2, 2026-07-08, 10d
    Integration      :         ui3, after ui2, 3d

    section Deploy
    Staging          :         dep1, after api3, 2d
    Production       :         dep2, after dep1, 1d`
  },
  'mermaid-state': {
    type: 'mermaid',
    code: `stateDiagram
    [*] --> Pending

    Pending --> Processing : Approve
    Pending --> Cancelled : Cancel

    Processing --> Completed : Success
    Processing --> Failed : Error

    Failed --> Processing : Retry
    Failed --> Cancelled : Give up

    Completed --> [*]
    Cancelled --> [*]`
  },
  'plantuml-sequence': {
    type: 'plantuml',
    code: `@startuml
skinparam backgroundColor #0d0f14
skinparam sequenceArrowColor #6c8ef5
skinparam sequenceLifeLineBorderColor #6c8ef5
skinparam sequenceParticipantBackgroundColor #1a1e2a
skinparam sequenceParticipantBorderColor #6c8ef5
skinparam sequenceParticipantFontColor #e8eaf0
skinparam noteBorderColor #a78bfa
skinparam noteBackgroundColor #21263a

title API Authentication Flow

actor "User" as user
participant "Frontend" as fe
participant "API Gateway" as gw
participant "Auth Service" as auth
database "Redis Cache" as cache
database "PostgreSQL" as db

user -> fe : Login (email, pwd)
fe -> gw : POST /auth/login
gw -> auth : Validate credentials
auth -> cache : Check token blacklist
cache --> auth : Not blacklisted
auth -> db : Query user record
db --> auth : User found
auth --> gw : JWT + Refresh token
gw --> fe : 200 OK + tokens
fe --> user : Redirect Dashboard
@enduml`
  },
  'plantuml-usecase': {
    type: 'plantuml',
    code: `@startuml
left to right direction
skinparam packageStyle rectangle

actor "Customer" as customer
actor "Admin" as admin
actor "System" as system

rectangle "E-Commerce Platform" {
    usecase "Browse Products"  as UC1
    usecase "Add to Cart"      as UC2
    usecase "Checkout"         as UC3
    usecase "Track Order"      as UC4
    usecase "Manage Products"  as UC5
    usecase "View Reports"     as UC6
    usecase "Send Email"       as UC7
}

customer --> UC1
customer --> UC2
customer --> UC3
customer --> UC4

admin --> UC5
admin --> UC6

UC3 ..> UC7 : <<include>>
UC4 ..> UC7 : <<include>>
@enduml`
  },
  'plantuml-component': {
    type: 'plantuml',
    code: `@startuml
skinparam componentStyle rectangle

package "Client Layer" {
    [Web App] as web
    [Mobile App] as mobile
}

package "API Layer" {
    [API Gateway] as gw
    [Auth Service] as auth
    [Order Service] as order
    [Product Service] as product
}

package "Data Layer" {
    database "PostgreSQL" as pg
    database "Redis" as redis
    queue "RabbitMQ" as mq
}

cloud "External" {
    [Payment Gateway] as payment
    [Email Service] as email
}

web    --> gw
mobile --> gw
gw --> auth
gw --> order
gw --> product
auth --> redis
order --> pg
order --> mq
product --> pg
mq --> email
order --> payment
@enduml`
  },
  'plantuml-deployment': {
    type: 'plantuml',
    code: `@startuml
node "AWS Cloud" {
    node "VPC" {
        node "Public Subnet" {
            component [Load Balancer] as lb
        }
        node "Private Subnet" {
            node "EKS Cluster" {
                component [API Pods x3] as api
                component [Worker Pods x2] as worker
            }
            database "RDS PostgreSQL\n(Multi-AZ)" as rds
            database "ElastiCache Redis" as redis
        }
    }
    storage "S3 Bucket" as s3
}

node "CDN" {
    component [CloudFront] as cdn
}

actor "User" as user

user --> cdn
cdn --> lb
lb --> api
api --> rds
api --> redis
worker --> s3
@enduml`
  },
  'graphviz-simple': {
    type: 'graphviz',
    code: `digraph MicroservicesDependencies {
    rankdir=LR
    bgcolor="#0d0f14"
    node [shape=box, style="rounded,filled", fillcolor="#1a1e2a",
          fontcolor="#e8eaf0", fontname="Inter", color="#6c8ef5"]
    edge [color="#6c8ef5", fontcolor="#8b91a8"]

    Gateway   [label="API Gateway", fillcolor="#21263a"]
    Auth      [label="Auth Service"]
    Order     [label="Order Service"]
    Product   [label="Product Service"]
    Notify    [label="Notification"]
    DB_Order  [label="Orders DB", shape=cylinder]
    DB_Prod   [label="Products DB", shape=cylinder]
    Queue     [label="RabbitMQ", shape=parallelogram]

    Gateway  -> Auth
    Gateway  -> Order
    Gateway  -> Product
    Order    -> DB_Order
    Product  -> DB_Prod
    Order    -> Queue
    Queue    -> Notify
}`
  },
  'd2-simple': {
    type: 'd2',
    code: `vars: {
  d2-theme-id: 200
}

title: System Architecture {
  shape: text
  style.font-size: 24
}

user: 👤 User {
  shape: person
}

frontend: Frontend {
  shape: rectangle
  web: Web App
  mobile: Mobile App
}

backend: Backend Services {
  api: API Gateway
  auth: Auth Service
  order: Order Service
}

data: Data Layer {
  pg: PostgreSQL {shape: cylinder}
  redis: Redis {shape: cylinder}
}

user -> frontend.web
user -> frontend.mobile
frontend.web -> backend.api
frontend.mobile -> backend.api
backend.api -> backend.auth
backend.api -> backend.order
backend.auth -> data.redis
backend.order -> data.pg`
  }
};

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  currentUrl: '',
  zoom: 1,
  renderTimer: null,
  isRendering: false
};

// API available when NOT on GitHub Pages (works on localhost, Railway, any custom domain)
const HAS_API = !window.location.hostname.endsWith('github.io');

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const editor        = $('codeEditor');
const diagramType   = $('diagramType');
const outputFormat  = $('outputFormat');
const templateSel   = $('templateSelect');

const previewPlaceholder = $('previewPlaceholder');
const previewLoading     = $('previewLoading');
const previewError       = $('previewError');
const previewContent     = $('previewContent');
const errorMessage       = $('errorMessage');

const confluenceUrl  = $('confluenceUrl');
const btnCopyUrl     = $('btnCopyUrl');
const copyBtnText    = $('copyBtnText');
const btnDownloadConfluence = $('btnDownloadConfluence');
const btnDownloadSvg = null; // removed from UI
const btnDownloadPng = null; // removed from UI

const statusDot  = $('statusDot');
const statusText = $('statusText');

const zoomLabel  = $('zoomLabel');

// ─── Encoding & URL Building ─────────────────────────────────────────────────
/**
 * HYBRID ROUTING:
 *   Mermaid  → mermaid.ink  (uses headless browser on dedicated infra, always stable)
 *   Others   → kroki.io     (PlantUML, GraphViz, D2, BPMN, C4, DBML, etc.)
 *
 * Why: kroki.io public instance uses Puppeteer/Chromium for Mermaid rendering
 * and frequently hits resource limits ("Resource temporarily unavailable").
 * mermaid.ink is purpose-built for Mermaid and is much more reliable.
 */

// Mermaid encoding: plain Base64 (UTF-8 safe) — mermaid.ink format
function encodeMermaid(text) {
  // unescape+encodeURIComponent handles full UTF-8 before btoa
  return btoa(unescape(encodeURIComponent(text)));
}

// Kroki encoding: pako zlib deflate → base64url — used by PlantUML, GraphViz, D2, etc.
function encodeKroki(text) {
  const compressed = pako.deflate(text, { level: 9 });
  let binary = '';
  const len = compressed.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(compressed[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_');
}

// Diagram types routed to mermaid.ink
const MERMAID_TYPES = new Set(['mermaid']);

function buildDiagramUrl(code, type, format) {
  if (MERMAID_TYPES.has(type)) {
    // mermaid.ink supports svg and img (png)
    const endpoint = format === 'png' ? 'img' : 'svg';
    return `https://mermaid.ink/${endpoint}/${encodeMermaid(code)}`;
  }
  // All other types → kroki.io
  return `https://kroki.io/${type}/${format}/${encodeKroki(code)}`;
}

// Keep backward compat alias
function buildKrokiUrl(code, type, format) {
  return buildDiagramUrl(code, type, format);
}

// ─── Render ───────────────────────────────────────────────────────────────────
function showState(s) {
  previewPlaceholder.style.display = s === 'placeholder' ? 'flex' : 'none';
  previewLoading.classList.toggle('visible', s === 'loading');
  previewError.classList.toggle('visible', s === 'error');
  previewContent.classList.toggle('visible', s === 'content');
}

function setStatus(type, text) {
  statusDot.className = 'status-dot' + (type ? ' ' + type : '');
  statusText.textContent = text;
}

async function renderDiagram() {
  const code = editor.value.trim();
  if (!code) {
    showState('placeholder');
    setStatus('', 'Ready');
    confluenceUrl.value = '';
    btnCopyUrl.disabled = true;
    btnDownloadConfluence.disabled = true;
    state.currentUrl = '';
    return;
  }

  const type   = diagramType.value;
  const format = outputFormat.value;
  const url    = buildDiagramUrl(code, type, format);

  showState('loading');
  setStatus('loading', 'Rendering...');
  state.isRendering = true;

  // Use an Image object to test if the URL loads successfully
  // then display it — works for both SVG and PNG without fetch/CORS issues
  const img = new Image();

  img.onload = () => {
    previewContent.innerHTML = '';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.alt = 'Diagram';
    previewContent.appendChild(img);

    previewContent.classList.add('animate');
    setTimeout(() => previewContent.classList.remove('animate'), 400);

    showState('content');
    setStatus('success', 'Rendered ✓');

    state.currentUrl = url;
    confluenceUrl.value = url;
    btnCopyUrl.disabled = false;
    btnDownloadConfluence.disabled = false;
    state.isRendering = false;
  };

  img.onerror = () => {
    showState('error');
    errorMessage.textContent = 'Render failed: invalid diagram syntax or unsupported diagram type.';
    setStatus('error', 'Error');
    state.currentUrl = '';
    confluenceUrl.value = '';
    btnCopyUrl.disabled = true;
    btnDownloadConfluence.disabled = true;
    state.isRendering = false;
  };

  // Set src — browser loads directly from mermaid.ink or kroki.io
  img.src = url;
}

// Debounced auto-render
function scheduleRender() {
  clearTimeout(state.renderTimer);
  setStatus('loading', 'Waiting...');
  state.renderTimer = setTimeout(renderDiagram, 600);
}

// ─── Copy URL ─────────────────────────────────────────────────────────────────
btnCopyUrl.addEventListener('click', async () => {
  if (!state.currentUrl) return;
  try {
    await navigator.clipboard.writeText(state.currentUrl);
    btnCopyUrl.classList.add('copied');
    copyBtnText.textContent = 'Copied!';
    setTimeout(() => {
      btnCopyUrl.classList.remove('copied');
      copyBtnText.textContent = 'Copy';
    }, 2000);
  } catch {
    // Fallback
    confluenceUrl.select();
    document.execCommand('copy');
  }
});

// ─── Download for Confluence (PNG) ───────────────────────────────────────────
btnDownloadConfluence.addEventListener('click', async () => {
  const code = editor.value.trim();
  if (!code) return;
  // Always download as PNG for Confluence compatibility
  const pngUrl = buildDiagramUrl(code, diagramType.value, 'png');
  try {
    const res  = await fetch(pngUrl);
    const blob = await res.blob();
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `diagram-${diagramType.value}.png`;
    a.click();
  } catch {
    alert('Download failed. Please try again.');
  }
});

// ─── Templates ───────────────────────────────────────────────────────────────
templateSel.addEventListener('change', () => {
  const key = templateSel.value;
  if (!key || !TEMPLATES[key]) return;
  const tpl = TEMPLATES[key];
  editor.value = tpl.code.trimStart();
  diagramType.value = tpl.type;
  templateSel.value = '';
  scheduleRender();
});

// ─── Render Button ────────────────────────────────────────────────────────────
$('btnRender').addEventListener('click', () => {
  clearTimeout(state.renderTimer);
  renderDiagram();
});

// ─── Clear ────────────────────────────────────────────────────────────────────
$('btnClear').addEventListener('click', () => {
  editor.value = '';
  previewContent.innerHTML = '';
  showState('placeholder');
  setStatus('', 'Ready');
  confluenceUrl.value = '';
  btnCopyUrl.disabled = true;
  btnDownloadConfluence.disabled = true;
  state.currentUrl = '';
});

// ─── Zoom ─────────────────────────────────────────────────────────────────────
function applyZoom() {
  previewContent.style.transform = `scale(${state.zoom})`;
  zoomLabel.textContent = Math.round(state.zoom * 100) + '%';
}

$('btnZoomIn').addEventListener('click', () => {
  state.zoom = Math.min(state.zoom + 0.15, 3);
  applyZoom();
});

$('btnZoomOut').addEventListener('click', () => {
  state.zoom = Math.max(state.zoom - 0.15, 0.25);
  applyZoom();
});

$('btnZoomReset').addEventListener('click', () => {
  state.zoom = 1;
  applyZoom();
});

// ─── Split Pane Drag ─────────────────────────────────────────────────────────
const divider     = $('divider');
const mainContent = document.querySelector('.main-content');
const editorPanel = document.querySelector('.editor-panel');

let isDragging = false;

divider.addEventListener('mousedown', e => {
  isDragging = true;
  divider.classList.add('dragging');
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const rect = mainContent.getBoundingClientRect();
  const pct  = ((e.clientX - rect.left) / rect.width) * 100;
  const clamped = Math.min(Math.max(pct, 20), 80);
  editorPanel.style.flex = `0 0 ${clamped}%`;
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  divider.classList.remove('dragging');
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
});

// ─── Editor Events ────────────────────────────────────────────────────────────
editor.addEventListener('input', scheduleRender);

// Tab key → insert spaces
editor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = editor.selectionStart;
    const end   = editor.selectionEnd;
    editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 2;
  }
});

// Re-render on type change
diagramType.addEventListener('change', () => {
  if (editor.value.trim()) scheduleRender();
});

outputFormat.addEventListener('change', () => {
  if (editor.value.trim()) scheduleRender();
});

// ─── Confluence Sync ──────────────────────────────────────────────────────────
const cfUrl      = $('cfUrl');
const cfEmail    = $('cfEmail');
const cfToken    = $('cfToken');
const cfPageId   = $('cfPageId');
const cfFileName = $('cfFileName');
const btnSync    = $('btnSync');
const syncStatus = $('syncStatus');

// Persist credentials in localStorage (token stored locally only)
function saveCreds() {
  localStorage.setItem('cf_url',    cfUrl.value);
  localStorage.setItem('cf_email',  cfEmail.value);
  localStorage.setItem('cf_pageid', cfPageId.value);
  localStorage.setItem('cf_fname',  cfFileName.value);
  // Note: token NOT saved to localStorage for security
}
function loadCreds() {
  cfUrl.value      = localStorage.getItem('cf_url')    || '';
  cfEmail.value    = localStorage.getItem('cf_email')  || '';
  cfPageId.value   = localStorage.getItem('cf_pageid') || '';
  cfFileName.value = localStorage.getItem('cf_fname')  || 'diagram.png';
}
[cfUrl, cfEmail, cfPageId, cfFileName].forEach(el => el.addEventListener('input', saveCreds));

function syncReady() {
  if (HAS_API) return !!cfPageId.value && !!state.currentUrl;
  return !!(cfUrl.value && cfEmail.value && cfToken.value && cfPageId.value && state.currentUrl);
}
function updateSyncBtn() {
  if (!HAS_API) {
    btnSync.disabled = true;
    btnSync.title    = 'Run "npm run kroki" then open http://localhost:3333 to enable sync';
    return;
  }
  btnSync.disabled = !syncReady();
  btnSync.title    = '';
}
[cfUrl, cfEmail, cfToken, cfPageId].forEach(el => el.addEventListener('input', updateSyncBtn));

// Upload PNG diagram to Confluence via local proxy (server.js handles auth).
// Stable URL: /wiki/download/attachments/{pageId}/{filename} — never changes on re-upload.
btnSync.addEventListener('click', async () => {
  if (!syncReady()) return;

  const pageId = cfPageId.value.trim();
  const fname  = cfFileName.value.trim() || 'diagram.png';

  setSyncStatus('loading', '⏳ Uploading...');
  btnSync.disabled = true;

  try {
    // 1. Render diagram as PNG blob via kroki.io
    const pngUrl = buildDiagramUrl(editor.value.trim(), diagramType.value, 'png');
    const pngRes = await fetch(pngUrl);
    if (!pngRes.ok) throw new Error('Diagram render failed');
    const pngBlob = await pngRes.blob();

    if (!HAS_API) {
      throw new Error('Open the team server URL or run: npm run kroki → http://localhost:3333');
    }

    // 2. Send PNG as base64 JSON — works on Vercel serverless + local server
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(pngBlob);
    });
    const res  = await fetch(`/api/confluence/upload/${pageId}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ filename: fname, data: base64 }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || `Server ${res.status}`);

    setSyncStatus('success', data.updated ? '✅ Updated!' : '✅ Uploaded!');
    confluenceUrl.value = data.url;
    btnCopyUrl.disabled = false;
    setTimeout(() => setSyncStatus('', ''), 4000);

  } catch (err) {
    let msg = err.message || 'Unknown error';
    if (msg === 'Failed to fetch' || msg.includes('NetworkError') || msg === 'Load failed') {
      msg = 'Cannot reach server — run: npm run kroki';
    }
    setSyncStatus('error', '❌ ' + msg.substring(0, 100));
    console.error('Confluence sync error:', err);
  } finally {
    updateSyncBtn();
  }
});

function setSyncStatus(type, msg) {
  syncStatus.textContent = msg;
  syncStatus.className = 'sync-status' + (type ? ' ' + type : '');
}

// ─── How-to Modal ─────────────────────────────────────────────────────────────
const modalOverlay = $('modalOverlay');
const btnHowTo     = $('btnHowTo');
const modalClose   = $('modalClose');

btnHowTo.addEventListener('click', () => modalOverlay.classList.add('open'));
modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('open');
});

// ─── Page Picker ──────────────────────────────────────────────────────────────
const pagePickerOverlay = $('pagePickerOverlay');
const btnPickerClose    = $('btnPickerClose');
const pickerTitle       = $('pickerTitle');
const pickerSearch      = $('pickerSearch');
const pickerList        = $('pickerList');
const pickerBreadcrumb  = $('pickerBreadcrumb');
const btnBrowsePages    = $('btnBrowsePages');

let pickerMode     = 'spaces';
let pickerAllItems = [];

function setPickerContent(html) { pickerList.innerHTML = html; }

function applyPickerFilter() {
  const q = pickerSearch.value.toLowerCase();
  const items = q ? pickerAllItems.filter(i => i.label.toLowerCase().includes(q)) : pickerAllItems;
  if (!items.length) { setPickerContent('<div class="picker-empty">No results</div>'); return; }
  const icon = pickerMode === 'spaces' ? '📁' : '📄';
  setPickerContent(items.map(i =>
    `<div class="picker-item" data-id="${i.id}" data-key="${i.key||''}" data-label="${encodeURIComponent(i.label)}">
      <span class="picker-icon">${icon}</span>
      <span class="picker-item-label">${i.label}</span>
      <span class="picker-item-meta">${i.key || '#'+i.id}</span>
    </div>`
  ).join(''));
  pickerList.querySelectorAll('.picker-item').forEach(el =>
    el.addEventListener('click', () => onPickerClick(el))
  );
}

async function onPickerClick(el) {
  const id    = el.dataset.id;
  const key   = el.dataset.key;
  const label = decodeURIComponent(el.dataset.label);

  if (pickerMode === 'spaces') {
    pickerMode = 'pages';
    pickerTitle.textContent = label;
    pickerBreadcrumb.innerHTML =
      `<button class="picker-back-btn" id="crumbBack">← Spaces</button>
       <span class="picker-crumb-sep">›</span>
       <span class="picker-crumb-active">${label}</span>`;
    $('crumbBack').addEventListener('click', openPicker);
    pickerSearch.value = '';
    setPickerContent('<div class="picker-loading"><div class="spinner" style="width:18px;height:18px;border-width:2px"></div><span>Loading pages…</span></div>');
    try {
      const res  = await fetch(`/api/confluence/pages/${key}`);
      if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).substring(0, 80)}`);
      const data = await res.json();
      pickerAllItems = (data.results || []).map(p => ({ id: p.id, label: p.title }));
      applyPickerFilter();
    } catch (e) {
      setPickerContent(`<div class="picker-error">⚠ ${e.message}</div>`);
    }
  } else {
    cfPageId.value = id;
    saveCreds();
    updateSyncBtn();
    pagePickerOverlay.classList.remove('open');
  }
}

async function openPicker() {
  pickerMode = 'spaces';
  pickerTitle.textContent = 'Browse Confluence';
  pickerBreadcrumb.innerHTML = '<span class="picker-crumb-active">Spaces</span>';
  pickerSearch.value = '';
  pagePickerOverlay.classList.add('open');
  setPickerContent('<div class="picker-loading"><div class="spinner" style="width:18px;height:18px;border-width:2px"></div><span>Loading spaces…</span></div>');

  if (!HAS_API) {
    setPickerContent('<div class="picker-error">⚠ Browse requires local server — run <code>npm run kroki</code> then open <code>http://localhost:3333</code></div>');
    return;
  }

  try {
    const res  = await fetch('/api/confluence/spaces');
    if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).substring(0, 80)}`);
    const data = await res.json();
    pickerAllItems = (data.results || []).map(s => ({ id: s.id, key: s.key, label: s.name }));
    applyPickerFilter();
  } catch (e) {
    setPickerContent(`<div class="picker-error">⚠ ${e.message}</div>`);
  }
}

btnBrowsePages.addEventListener('click', openPicker);
btnPickerClose.addEventListener('click', () => pagePickerOverlay.classList.remove('open'));
pagePickerOverlay.addEventListener('click', e => {
  if (e.target === pagePickerOverlay) pagePickerOverlay.classList.remove('open');
});
pickerSearch.addEventListener('input', applyPickerFilter);

// ─── Init ─────────────────────────────────────────────────────────────────────
(function init() {
  loadCreds();
  // URL params override localStorage (useful for bookmarks / pre-configured links)
  // Usage: ?cfUrl=https://site.atlassian.net&cfEmail=you@co.com&cfPageId=123&cfFname=arch.png
  const p = new URLSearchParams(window.location.search);
  if (p.get('cfUrl'))    cfUrl.value      = p.get('cfUrl');
  if (p.get('cfEmail'))  cfEmail.value    = p.get('cfEmail');
  if (p.get('cfPageId')) cfPageId.value   = p.get('cfPageId');
  if (p.get('cfFname'))  cfFileName.value = p.get('cfFname');

  updateSyncBtn();
  // Load default template
  const tpl = TEMPLATES['mermaid-flowchart'];
  editor.value = tpl.code.trimStart();
  diagramType.value = tpl.type;
  editor.focus();
  // Auto render on load
  setTimeout(renderDiagram, 300);
})();
