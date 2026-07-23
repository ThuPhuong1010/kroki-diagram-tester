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
  'plantuml-swimlane': {
    type: 'plantuml',
    code: `@startuml
skinparam swimlaneWidth 220
skinparam backgroundColor #0d0f14
skinparam swimlaneBorderColor #3d4258
skinparam activityBackgroundColor #1a1e2a
skinparam activityBorderColor #6c8ef5
skinparam activityFontColor #e8eaf0
skinparam arrowColor #6c8ef5
skinparam noteBackgroundColor #21263a
skinparam noteBorderColor #a78bfa

title Leave Request Approval

|👤 Employee|
start
:Submit Leave Request;
note right
  Start date, end date,
  leave type, reason
end note

|🖥️ HR System|
:Auto-validate dates;
if (Dates valid &\nno overlap?) then (yes)

  |👔 Line Manager|
  :Review Request;
  if (Approved?) then (yes)

    |🖥️ HR System|
    :Deduct leave balance;
    :Send calendar invite;

    |👤 Employee|
    :Receive approval email;
    stop

  else (no)
    |👔 Line Manager|
    :Enter rejection reason;

    |👤 Employee|
    :Receive rejection email;
    stop
  endif

else (no)
  |🖥️ HR System|
  :Notify invalid dates;

  |👤 Employee|
  :Fix dates & resubmit;
  stop
endif
@enduml`
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
  },
  'bpmn-swimlane': {
    type: 'bpmn',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  targetNamespace="http://example.com/bpmn">

  <collaboration id="collab">
    <participant id="pool" name="Order Approval Process" processRef="proc"/>
  </collaboration>

  <process id="proc" isExecutable="false">
    <laneSet id="ls">
      <lane id="l_cust" name="Customer">
        <flowNodeRef>start</flowNodeRef>
        <flowNodeRef>t_submit</flowNodeRef>
        <flowNodeRef>t_receive</flowNodeRef>
        <flowNodeRef>end_ok</flowNodeRef>
        <flowNodeRef>end_rej</flowNodeRef>
      </lane>
      <lane id="l_staff" name="Approver">
        <flowNodeRef>t_review</flowNodeRef>
        <flowNodeRef>gw</flowNodeRef>
        <flowNodeRef>t_reject</flowNodeRef>
      </lane>
    </laneSet>

    <startEvent id="start" name="Order Placed"/>
    <sequenceFlow id="f1" sourceRef="start" targetRef="t_submit"/>
    <userTask id="t_submit" name="Fill Order Form"/>
    <sequenceFlow id="f2" sourceRef="t_submit" targetRef="t_review"/>
    <userTask id="t_review" name="Review Order"/>
    <sequenceFlow id="f3" sourceRef="t_review" targetRef="gw"/>
    <exclusiveGateway id="gw" name="Decision"/>
    <sequenceFlow id="f4" name="Approve" sourceRef="gw" targetRef="t_receive"/>
    <sequenceFlow id="f5" name="Reject"  sourceRef="gw" targetRef="t_reject"/>
    <userTask id="t_receive" name="Receive Confirmation"/>
    <sequenceFlow id="f6" sourceRef="t_receive" targetRef="end_ok"/>
    <endEvent id="end_ok" name="Order Confirmed"/>
    <serviceTask id="t_reject" name="Send Rejection Notice"/>
    <sequenceFlow id="f7" sourceRef="t_reject" targetRef="end_rej"/>
    <endEvent id="end_rej" name="Order Rejected"/>
  </process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane bpmnElement="collab">
      <bpmndi:BPMNShape id="d_pool" bpmnElement="pool" isHorizontal="true">
        <dc:Bounds x="10" y="10" width="810" height="330"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_l_cust" bpmnElement="l_cust" isHorizontal="true">
        <dc:Bounds x="40" y="10" width="780" height="165"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_l_staff" bpmnElement="l_staff" isHorizontal="true">
        <dc:Bounds x="40" y="175" width="780" height="165"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_start" bpmnElement="start">
        <dc:Bounds x="80" y="74" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_t_submit" bpmnElement="t_submit">
        <dc:Bounds x="160" y="54" width="120" height="76"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_t_receive" bpmnElement="t_receive">
        <dc:Bounds x="600" y="54" width="120" height="76"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_end_ok" bpmnElement="end_ok">
        <dc:Bounds x="760" y="74" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_end_rej" bpmnElement="end_rej">
        <dc:Bounds x="760" y="239" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_t_review" bpmnElement="t_review">
        <dc:Bounds x="330" y="219" width="120" height="76"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_gw" bpmnElement="gw" isMarkerVisible="true">
        <dc:Bounds x="500" y="232" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_t_reject" bpmnElement="t_reject">
        <dc:Bounds x="600" y="219" width="120" height="76"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="e_f1" bpmnElement="f1">
        <di:waypoint x="116" y="92"/><di:waypoint x="160" y="92"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="e_f2" bpmnElement="f2">
        <di:waypoint x="220" y="130"/><di:waypoint x="220" y="257"/><di:waypoint x="330" y="257"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="e_f3" bpmnElement="f3">
        <di:waypoint x="450" y="257"/><di:waypoint x="500" y="257"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="e_f4" bpmnElement="f4">
        <di:waypoint x="525" y="232"/><di:waypoint x="525" y="92"/><di:waypoint x="600" y="92"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="e_f5" bpmnElement="f5">
        <di:waypoint x="550" y="257"/><di:waypoint x="600" y="257"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="e_f6" bpmnElement="f6">
        <di:waypoint x="720" y="92"/><di:waypoint x="760" y="92"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="e_f7" bpmnElement="f7">
        <di:waypoint x="720" y="257"/><di:waypoint x="760" y="257"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`
  }
};

// ─── Diagram Library ─────────────────────────────────────────────────────────
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

class DiagramLibrary {
  constructor() {
    this.KEY = 'mvl_diagrams';
    this._d = (() => { try { return JSON.parse(localStorage.getItem(this.KEY)) || {diagrams:[],currentId:null}; } catch { return {diagrams:[],currentId:null}; } })();
  }
  _save() { localStorage.setItem(this.KEY, JSON.stringify(this._d)); }
  get all()       { return this._d.diagrams; }
  get currentId() { return this._d.currentId; }
  set currentId(id){ this._d.currentId = id; this._save(); }
  get current()   { return this._d.diagrams.find(d => d.id === this._d.currentId) || null; }
  find(id)        { return this._d.diagrams.find(d => d.id === id) || null; }

  _upsert(entry) {
    const i = this._d.diagrams.findIndex(d => d.id === entry.id);
    if (i >= 0) this._d.diagrams[i] = entry; else this._d.diagrams.unshift(entry);
    this._save(); return entry;
  }
  create(name, code, type) {
    const e = { id: genId(), name: name||'Untitled', code, type,
      pageId:'', pageName:'', spaceKey:'', filename:'diagram.png',
      confluenceUrl:'', lastSynced:null, syncedCode:null, syncedType:null,
      modifiedSinceSync:false, checkStatus:null, checkAt:null, versions:[], pages:[] };
    this._upsert(e); this.currentId = e.id; return e;
  }
  updateCurrent(patch) {
    const c = this.current; if (!c) return null;
    const u = { ...c, ...patch };
    if (c.lastSynced && (patch.code !== undefined || patch.type !== undefined))
      u.modifiedSinceSync = (u.code !== c.syncedCode) || (u.type !== c.syncedType);
    return this._upsert(u);
  }
  rename(id, name) { const d = this.find(id); if (d) this._upsert({...d, name}); }
  markSynced(id, {pageId, pageName, spaceKey, filename, confluenceUrl}) {
    const d = this.find(id); if (!d) return;
    const now = new Date().toISOString();
    const versions = [...(d.versions||[]),
      {v:(d.versions?.length||0)+1, code:d.code, type:d.type, syncedAt:now, confluenceUrl}
    ].slice(-10);
    // Multi-page tracking: upsert into pages[] by pageId
    const pages = d.pages || [];
    const pi = pages.findIndex(p => p.pageId === pageId);
    const pe = {pageId, pageName, spaceKey, filename, confluenceUrl, lastSynced: now};
    const newPages = pi >= 0 ? pages.map((p,i) => i===pi ? pe : p) : [...pages, pe];
    return this._upsert({...d, pageId, pageName, spaceKey, filename, confluenceUrl,
      lastSynced:now, syncedCode:d.code, syncedType:d.type,
      modifiedSinceSync:false, versions, checkStatus:'live', checkAt:now, pages:newPages});
  }
  delete(id) {
    this._d.diagrams = this._d.diagrams.filter(d => d.id !== id);
    if (this._d.currentId === id) this._d.currentId = null;
    this._save();
  }
}
const library = new DiagramLibrary();

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

const diagramName    = $('diagramName');
const credFields     = $('credFields');
const btnOpenLibrary = $('btnOpenLibrary');
const btnLibNew      = $('btnLibNew');
const btnLibClose    = $('btnLibClose');
const libDrawer      = $('libDrawer');
const libBackdrop    = $('libBackdrop');
const libList        = $('libList');
const libSearch      = $('libSearch');
const libCount       = $('libCount');
const btnSaveDiagram    = $('btnSaveDiagram');
const btnOpenPage       = $('btnOpenPage');
const cfPageIdHint      = $('cfPageIdHint');
const syncModifiedBadge = $('syncModifiedBadge');
const editorStats       = $('editorStats');

// Tracks pageName/spaceKey picked via the page picker (cleared on new browse)
let pickedPageMeta = { pageName: '', spaceKey: '' };

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

// Mermaid encoding: base64url (UTF-8 safe) — mermaid.ink format.
// Standard btoa() produces + and / which are NOT URL-safe; mermaid.ink requires base64url.
function encodeMermaid(text) {
  return btoa(unescape(encodeURIComponent(text)))
    .replace(/\+/g, '-').replace(/\//g, '_');
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
  const urlToCopy = confluenceUrl.value;
  if (!urlToCopy) return;
  try {
    await navigator.clipboard.writeText(urlToCopy);
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
editor.addEventListener('input', () => { scheduleRender(); autoSaveToLibrary(); updateEditorStats(); });

// ─── Editor Stats (line / char count) ─────────────────────────────────────────
function updateEditorStats() {
  if (!editorStats) return;
  const code  = editor.value;
  const lines = code ? code.split('\n').length : 0;
  const chars = code.length;
  editorStats.textContent = lines > 0 ? `${lines}L · ${chars}C` : '';
}

// ─── Ctrl+Scroll Zoom (on preview panel) ──────────────────────────────────────
document.getElementById('previewWrapper')?.addEventListener('wheel', e => {
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  state.zoom = Math.min(Math.max(state.zoom + delta, 0.25), 3);
  applyZoom();
}, { passive: false });

// Tab key → insert spaces
// Ctrl+Enter → immediate render
editor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = editor.selectionStart;
    const end   = editor.selectionEnd;
    editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 2;
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    clearTimeout(state.renderTimer);
    renderDiagram();
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

  // Defensive: extract page ID from URL if user didn't wait for debounce
  const pageId = extractPageId(cfPageId.value.trim()) || cfPageId.value.trim();
  if (pageId !== cfPageId.value.trim()) { cfPageId.value = pageId; cfPageIdHint.textContent = ''; }
  const fname  = cfFileName.value.trim() || 'diagram.png';

  btnSync.disabled = true;
  btnSync.classList.add('btn--loading');
  btnSync.textContent = 'Syncing…';

  try {
    // 1. Render diagram as PNG blob via kroki.io
    const pngUrl = buildDiagramUrl(editor.value.trim(), diagramType.value, 'png');
    const pngRes = await fetch(pngUrl);
    if (!pngRes.ok) throw new Error('Diagram render failed');
    const pngBlob = await pngRes.blob();

    if (!HAS_API) {
      throw new Error('Open the team server URL or run: npm run kroki → http://localhost:3333');
    }

    // 2. Send PNG as base64 JSON — embed endpoint uploads attachment + patches page body
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(pngBlob);
    });
    const res  = await fetch(`/api/confluence/embed/${pageId}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ filename: fname, data: base64, type: diagramType.value }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || `Server ${res.status}`);

    setSyncStatus('success', data.updated ? '✅ Updated!' : '✅ Uploaded!');
    confluenceUrl.value = data.url;
    btnCopyUrl.disabled = false;

    // Show "Open ↗" link to the Confluence page
    const cfPageUrl = (cfUrl.value || '').replace(/\/$/, '') ||
      (data.url ? data.url.split('/wiki/')[0] : '');
    if (cfPageUrl && pageId) {
      btnOpenPage.href = `${cfPageUrl}/wiki/pages/viewpage.action?pageId=${pageId}`;
      btnOpenPage.style.display = '';
    }

    // Save to library
    if (library.currentId) {
      library.markSynced(library.currentId, {
        pageId, filename: fname, confluenceUrl: data.url,
        pageName: pickedPageMeta.pageName || cfPageId.value,
        spaceKey: pickedPageMeta.spaceKey || ''
      });
    } else {
      const name = diagramName.value.trim() || 'Untitled';
      const entry = library.create(name, editor.value.trim(), diagramType.value);
      library.markSynced(entry.id, {
        pageId, filename: fname, confluenceUrl: data.url,
        pageName: pickedPageMeta.pageName || pageId,
        spaceKey: pickedPageMeta.spaceKey || ''
      });
    }
    updateLibCount();
    updateModifiedBadge();

    // Auto-copy Confluence URL + show inline (no modal popup)
    navigator.clipboard.writeText(data.url).catch(() => {});
    showToast(`✅ Synced! URL copied — click "Open ↗" to embed`);

    setTimeout(() => setSyncStatus('', ''), 4000);

  } catch (err) {
    let msg = err.message || 'Unknown error';
    if (msg === 'Failed to fetch' || msg.includes('NetworkError') || msg === 'Load failed') {
      msg = 'Cannot reach server — run: npm run kroki';
    }
    setSyncStatus('error', '❌ ' + msg.substring(0, 100));
    console.error('Confluence sync error:', err);
  } finally {
    btnSync.classList.remove('btn--loading');
    btnSync.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Sync to Confluence`;
    updateSyncBtn();
  }
});

function setSyncStatus(type, msg) {
  syncStatus.textContent = msg;
  syncStatus.className = 'sync-status' + (type ? ' ' + type : '');
}

// ─── Modified Badge ───────────────────────────────────────────────────────────
function updateModifiedBadge() {
  if (!syncModifiedBadge) return;
  const cur = library.current;
  const show = !!(cur?.lastSynced && cur?.modifiedSinceSync);
  syncModifiedBadge.classList.toggle('visible', show);
}

// ─── Process Page ─────────────────────────────────────────────────────────────
const btnProcessPage = $('btnProcessPage');

function updateProcessBtn() {
  btnProcessPage.disabled = !HAS_API || !cfPageId.value.trim();
}
cfPageId.addEventListener('input', updateProcessBtn);

btnProcessPage.addEventListener('click', async () => {
  // Defensive: extract page ID from URL if user didn't wait for debounce
  const pageId = extractPageId(cfPageId.value.trim()) || cfPageId.value.trim();
  if (pageId !== cfPageId.value.trim()) { cfPageId.value = pageId; cfPageIdHint.textContent = ''; }
  if (!pageId) return;
  setSyncStatus('loading', '⏳ Scanning page...');
  btnProcessPage.disabled = true;
  try {
    const res  = await fetch(`/api/confluence/process/${pageId}`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || `Server ${res.status}`);

    if (data.processed === 0) {
      setSyncStatus('', data.message || 'No diagram code blocks found');
      showToast('No diagrams found on this page', 'warn');
    } else {
      const detail = data.bodyUpdated ? 'embedded' : 'images updated';
      setSyncStatus('success', `✅ ${data.processed}/${data.total} diagrams ${detail}`);
      showToast(`Processed ${data.processed} diagram${data.processed > 1 ? 's' : ''} — images now embedded on page`);
    }
    if (data.errors?.length) {
      console.warn('Process errors:', data.errors);
    }
  } catch (err) {
    setSyncStatus('error', '❌ ' + err.message.substring(0, 100));
  } finally {
    updateProcessBtn();
    setTimeout(() => setSyncStatus('', ''), 5000);
  }
});

// ─── Sync Result Modal ────────────────────────────────────────────────────────
function showSyncResult({url, pageName, pageId, filename}) {
  $('srUrl').value = url;
  $('srFilename').textContent = filename;
  $('srPageLink').textContent = pageName || `Page ${pageId}`;
  const cfBase = (cfUrl.value||'').replace(/\/$/,'') ||
    (url ? url.split('/wiki/')[0] : '');
  const pageUrl = cfBase && pageId
    ? `${cfBase}/wiki/pages/viewpage.action?pageId=${pageId}` : '#';
  $('srPageLink').href  = pageUrl;
  $('srOpenPageBtn').href = pageUrl;
  $('syncResultOverlay').classList.add('open');
}
(function initSyncResultModal() {
  const overlay = $('syncResultOverlay');
  const close = () => overlay.classList.remove('open');
  $('syncResultClose').addEventListener('click', close);
  $('syncResultClose2').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  $('btnCopySrUrl').addEventListener('click', async () => {
    const url = $('srUrl').value; if (!url) return;
    await navigator.clipboard.writeText(url).catch(() => {});
    $('srCopyText').textContent = 'Copied!';
    setTimeout(() => $('srCopyText').textContent = 'Copy', 2000);
  });
})();

// ─── How-to Modal ─────────────────────────────────────────────────────────────
const modalOverlay = $('modalOverlay');
const btnHowTo     = $('btnHowTo');
const modalClose   = $('modalClose');

// ─── ESC closes any open modal ────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  [modalOverlay, pagePickerOverlay, $('syncResultOverlay')].forEach(el => {
    if (el?.classList.contains('open')) el.classList.remove('open');
  });
  if (libDrawer?.classList.contains('open')) closeLibrary();
});

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

let pickerMode            = 'spaces';
let pickerAllItems        = [];
let pickerCurrentSpaceKey = '';

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
    pickerCurrentSpaceKey = key;
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
    pickedPageMeta = { pageName: label, spaceKey: pickerCurrentSpaceKey || '' };
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

// Save pageName/spaceKey when picker selects a page
// (injected into onPickerClick via pickedPageMeta)

btnBrowsePages.addEventListener('click', openPicker);
btnPickerClose.addEventListener('click', () => pagePickerOverlay.classList.remove('open'));
pagePickerOverlay.addEventListener('click', e => {
  if (e.target === pagePickerOverlay) pagePickerOverlay.classList.remove('open');
});
pickerSearch.addEventListener('input', applyPickerFilter);

// ─── Library UI ──────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = $('appToast');
  if (!t) return;
  t.textContent = msg;
  t.className = `app-toast app-toast--${type} app-toast--visible`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('app-toast--visible'), 2800);
}

function updateLibCount() {
  const n = library.all.length;
  libCount.textContent = n || '';
  libCount.style.display = n > 0 ? 'inline-flex' : 'none';
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {day:'2-digit',month:'2-digit'}) + ' ' +
         d.toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'});
}

function openLibrary()  { renderLibrary(); libDrawer.classList.add('open'); libBackdrop.classList.add('open'); }
function closeLibrary() { libDrawer.classList.remove('open'); libBackdrop.classList.remove('open'); }

function renderLibrary() {
  const q = (libSearch?.value || '').toLowerCase();
  const items = library.all.filter(d =>
    !q || d.name.toLowerCase().includes(q) ||
    (d.pageName||'').toLowerCase().includes(q) ||
    (d.filename||'').toLowerCase().includes(q)
  );
  updateLibCount();
  if (!items.length) {
    libList.innerHTML = '<div class="lib-empty">No diagrams saved yet.<br>Click <strong>Save</strong> in the sync bar or <strong>+ New</strong> to start.</div>';
    return;
  }
  libList.innerHTML = items.map(d => {
    const isCur  = d.id === library.currentId;
    const hasCf  = !!d.confluenceUrl;
    const hasPg  = !!d.pageId;
    const badge  = !d.lastSynced
      ? '<span class="lib-badge lib-badge--local">Local</span>'
      : d.modifiedSinceSync
        ? '<span class="lib-badge lib-badge--modified">Modified</span>'
        : '<span class="lib-badge lib-badge--synced">Synced</span>';
    const chk = d.checkStatus === 'live'    ? ' <span class="lib-badge lib-badge--live">✓ Live</span>'
              : d.checkStatus === 'missing' ? ' <span class="lib-badge lib-badge--missing">✗ Missing</span>'
              : d.checkStatus === 'checking'? ' <span class="lib-badge lib-badge--checking">…</span>'
              : '';
    const multiPages = (d.pages||[]).length > 1;
    const pagesHtml  = multiPages
      ? `<div class="lib-pages">${d.pages.map(p =>
          `<span class="lib-page-pill" title="${escHtml(p.pageName||p.pageId)}">${escHtml((p.pageName||p.pageId).slice(0,28))}</span>`
        ).join('')}</div>` : '';
    return `<div class="lib-card${isCur?' lib-card--active':''}" data-id="${d.id}">
      <div class="lib-card-top">
        <span class="lib-card-name">${escHtml(d.name)}</span>
        <button class="lib-del-btn" data-del="${d.id}" title="Delete">✕</button>
      </div>
      <div class="lib-card-meta">
        <span class="lib-type">${d.type}</span>
        ${multiPages ? '' : (d.pageName ? `<span class="lib-page">📄 ${escHtml(d.pageName)}</span>` : '<span class="lib-page lib-no-page">no page</span>')}
        ${d.filename && d.filename !== 'diagram.png' ? `<span class="lib-filename" title="filename on Confluence">🖼 ${escHtml(d.filename)}</span>` : ''}
      </div>
      ${pagesHtml}
      <div class="lib-card-status">${badge}${chk}${d.lastSynced?`<span class="lib-time">${fmtDate(d.lastSynced)}</span>`:''}</div>
      <div class="lib-card-actions">
        <button class="btn btn-ghost btn-sm lib-act" data-a="load"    data-id="${d.id}">Load</button>
        ${hasCf ? `<button class="btn btn-ghost btn-sm lib-act" data-a="getlink" data-id="${d.id}">Get Link</button>` : ''}
        ${hasCf&&hasPg ? `<button class="btn btn-ghost btn-sm lib-act" data-a="check"   data-id="${d.id}">Check</button>` : ''}
        ${hasCf ? `<button class="btn btn-ghost btn-sm lib-act" data-a="addpage" data-id="${d.id}" title="Sync này sang trang Confluence khác">+ Page</button>` : ''}
        ${d.versions?.length ? `<button class="btn btn-ghost btn-sm lib-act" data-a="history" data-id="${d.id}">History (${d.versions.length})</button>` : ''}
      </div>
      <div class="lib-versions" id="lv-${d.id}" style="display:none">
        ${(d.versions||[]).slice().reverse().map(v =>
          `<div class="lib-ver-row">v${v.v} · ${fmtDate(v.syncedAt)}
           <button class="btn btn-ghost btn-sm lib-act" data-a="restore" data-id="${d.id}" data-v="${v.v}">Restore</button>
          </div>`
        ).join('')}
      </div>
    </div>`;
  }).join('');

  libList.querySelectorAll('.lib-act').forEach(btn =>
    btn.addEventListener('click', e => { e.stopPropagation(); onLibAction(btn.dataset.a, btn.dataset.id, btn.dataset.v); })
  );
  libList.querySelectorAll('[data-del]').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const d = library.find(btn.dataset.del);
      if (d && confirm(`Delete "${d.name}"?`)) { library.delete(btn.dataset.del); renderLibrary(); }
    })
  );
}

async function onLibAction(action, id, vNum) {
  const d = library.find(id);
  if (!d) return;

  if (action === 'load') {
    editor.value = d.code;
    diagramType.value = d.type;
    diagramName.value = d.name;
    cfPageId.value    = d.pageId   || '';
    cfFileName.value  = d.filename || 'diagram.png';
    if (d.pageName) pickedPageMeta = { pageName: d.pageName, spaceKey: d.spaceKey || '' };
    library.currentId = id;
    saveCreds(); updateSyncBtn(); renderLibrary(); closeLibrary(); scheduleRender();
    updateEditorStats(); updateModifiedBadge();

  } else if (action === 'getlink') {
    if (!d.confluenceUrl) return;
    navigator.clipboard.writeText(d.confluenceUrl).catch(()=>{});
    showToast(`Copied: ${d.confluenceUrl.split('/').pop()}`);

  } else if (action === 'check') {
    if (!d.pageId || !d.filename) return;
    library._upsert({ ...d, checkStatus: 'checking' }); renderLibrary();
    try {
      const r    = await fetch(`/api/confluence/check/${d.pageId}?filename=${encodeURIComponent(d.filename)}`);
      const data = await r.json();
      library._upsert({ ...library.find(id), checkStatus: data.exists ? 'live' : 'missing', checkAt: new Date().toISOString() });
    } catch { library._upsert({ ...library.find(id), checkStatus: 'missing' }); }
    renderLibrary();

  } else if (action === 'history') {
    const el = document.getElementById(`lv-${id}`);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';

  } else if (action === 'restore') {
    const v = (d.versions||[]).find(v => String(v.v) === String(vNum));
    if (!v || !confirm(`Restore v${v.v} (${fmtDate(v.syncedAt)})?`)) return;
    editor.value = v.code; diagramType.value = v.type;
    library.currentId = id;
    library.updateCurrent({ code: v.code, type: v.type });
    diagramName.value = d.name; cfPageId.value = d.pageId||''; cfFileName.value = d.filename||'diagram.png';
    closeLibrary(); scheduleRender();
    showToast(`Restored v${v.v}`);

  } else if (action === 'addpage') {
    // Load diagram + clear page pick → open Browse to pick another page
    editor.value      = d.code;
    diagramType.value = d.type;
    diagramName.value = d.name;
    cfFileName.value  = d.filename || 'diagram.png';
    cfPageId.value    = '';
    pickedPageMeta    = { pageName: '', spaceKey: '' };
    library.currentId = id;
    updateSyncBtn(); closeLibrary(); scheduleRender();
    showToast('Chọn trang mới → Sync để thêm trang');
    setTimeout(() => btnBrowsePages.click(), 400);
  }
}

// Auto-save current library entry when code changes (debounced 2s)
let _autoSaveTimer;
function autoSaveToLibrary() {
  clearTimeout(_autoSaveTimer);
  _autoSaveTimer = setTimeout(() => {
    if (!library.currentId) return;
    library.updateCurrent({ code: editor.value, type: diagramType.value });
    updateLibCount();
    updateModifiedBadge();
  }, 2000);
}

// Save / create library entry from sync bar
btnSaveDiagram.addEventListener('click', () => {
  const name = diagramName.value.trim();
  if (!name) { diagramName.focus(); showToast('Enter a diagram name first', 'warn'); return; }
  if (library.currentId) {
    library.updateCurrent({ code: editor.value, type: diagramType.value });
    library.rename(library.currentId, name);
    showToast(`Saved "${name}"`);
  } else {
    library.create(name, editor.value, diagramType.value);
    showToast(`Saved "${name}" to library`);
  }
  updateLibCount();
});

// Slugify name → safe filename (e.g. "Login Flow" → "login-flow.png")
function slugify(name) {
  return name.trim()
    .toLowerCase()
    .replace(/[àáảãạăằắẳẵặâầấẩẫậ]/g, 'a')
    .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
    .replace(/[ìíỉĩị]/g, 'i')
    .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
    .replace(/[ùúủũụưừứửữự]/g, 'u')
    .replace(/[ỳýỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60) || 'diagram';
}

// Rename when user changes the name field + auto-update filename if still default
diagramName.addEventListener('change', () => {
  const name = diagramName.value.trim();
  if (!name) return;
  if (library.currentId) library.rename(library.currentId, name);
  // Auto-set filename only if still using "diagram.png" default
  if (cfFileName.value === 'diagram.png' || cfFileName.value === '') {
    cfFileName.value = slugify(name) + '.png';
    saveCreds();
  }
});

// Library drawer events
btnOpenLibrary.addEventListener('click', openLibrary);
btnLibClose.addEventListener('click', closeLibrary);
libBackdrop.addEventListener('click', closeLibrary);
btnLibNew.addEventListener('click', () => {
  editor.value = '';
  diagramType.value = 'mermaid';
  diagramName.value = '';
  cfPageId.value = ''; cfFileName.value = 'diagram.png';
  pickedPageMeta = { pageName:'', spaceKey:'' };
  library.currentId = null;
  showState('placeholder'); confluenceUrl.value = ''; state.currentUrl = '';
  btnCopyUrl.disabled = true; btnDownloadConfluence.disabled = true;
  btnOpenPage.style.display = 'none';
  updateSyncBtn(); closeLibrary();
  diagramName.focus();
});
libSearch.addEventListener('input', renderLibrary);

// Extract page ID from a Confluence page URL or plain ID string
function extractPageId(text) {
  if (!text) return null;
  const t = text.trim();
  // ?pageId=123456 or &pageId=123456
  const m1 = t.match(/[?&]pageId=(\d+)/);
  if (m1) return m1[1];
  // /pages/123456/... or /pages/123456
  const m2 = t.match(/\/pages\/(\d+)/);
  if (m2) return m2[1];
  // plain numeric ID
  if (/^\d+$/.test(t)) return t;
  return null;
}

// ─── Page ID field: accept URL → extract ID, show hint ────────────────────────

function tryExtractPageId(raw) {
  const id = extractPageId(raw);
  if (id && id !== raw.trim()) {
    cfPageId.value = id;
    cfPageIdHint.textContent = `↳ extracted from URL`;
    saveCreds(); updateSyncBtn(); updateProcessBtn();
    return true;
  }
  cfPageIdHint.textContent = '';
  return false;
}

// Immediate extraction on paste (intercept before field updates)
cfPageId.addEventListener('paste', e => {
  const text = (e.clipboardData || window.clipboardData).getData('text');
  const id = extractPageId(text);
  if (id && id !== text.trim()) {
    e.preventDefault();
    cfPageId.value = id;
    cfPageIdHint.textContent = '↳ extracted from URL';
    saveCreds(); updateSyncBtn(); updateProcessBtn();
  }
});

// Debounced extraction on manual input (handles typing a URL, auto-fill, etc.)
let _pageIdTimer;
cfPageId.addEventListener('input', () => {
  clearTimeout(_pageIdTimer);
  cfPageIdHint.textContent = '';
  _pageIdTimer = setTimeout(() => tryExtractPageId(cfPageId.value), 350);
});

// ─── Init ─────────────────────────────────────────────────────────────────────
(function init() {
  loadCreds();
  const p = new URLSearchParams(window.location.search);

  // URL params: ?type=mermaid&template=sequence&page=PAGE_ID
  // Used by "Edit in Kroki ↗" links and shareable tool bookmarks.
  const paramType     = p.get('type');
  const paramPage     = p.get('page');
  const paramTemplate = p.get('template');
  if (paramType || paramPage || paramTemplate) {
    if (paramType) diagramType.value = paramType;
    if (paramPage) cfPageId.value    = paramPage;
    if (paramTemplate) {
      const key = paramType ? `${paramType}-${paramTemplate}` : paramTemplate;
      const tpl = TEMPLATES[key] || TEMPLATES[paramTemplate];
      if (tpl) { editor.value = tpl.code.trimStart(); if (!paramType) diagramType.value = tpl.type; }
    }
    // Keep URL params so the link stays bookmarkable and shareable
    if (HAS_API && credFields) credFields.style.display = 'none';
    updateSyncBtn();
    updateProcessBtn();

    // Auto-load diagram code from Confluence when opened via "Edit in Kroki" link
    // (only if no ?template= was given, meaning the user expects to see the Confluence diagram)
    if (paramPage && HAS_API && !paramTemplate) {
      fetch(`/api/confluence/process/${paramPage}`)
        .then(r => r.json())
        .then(data => {
          if (!data.diagrams?.length) return;
          const d = data.diagrams[0];
          editor.value      = d.code;
          diagramType.value = d.type;
          cfFileName.value  = d.filename;
          saveCreds(); updateSyncBtn(); scheduleRender();
        })
        .catch(() => scheduleRender()); // fail silently — just render whatever is in editor
      return; // don't scheduleRender yet — will be called after fetch resolves
    }

    scheduleRender();
    return;
  }

  // Legacy params (bookmarks / manual config)
  if (p.get('cfUrl'))    cfUrl.value      = p.get('cfUrl');
  if (p.get('cfEmail'))  cfEmail.value    = p.get('cfEmail');
  if (p.get('cfPageId') || p.get('page')) cfPageId.value = p.get('cfPageId') || p.get('page');
  if (p.get('cfFname'))  cfFileName.value = p.get('cfFname');

  // Hide credential fields when server handles them
  if (HAS_API && credFields) credFields.style.display = 'none';

  // Restore last active library entry
  const cur = library.current;
  if (cur) {
    editor.value      = cur.code;
    diagramType.value = cur.type;
    diagramName.value = cur.name;
    cfPageId.value    = cur.pageId   || '';
    cfFileName.value  = cur.filename || 'diagram.png';
    if (cur.pageName) pickedPageMeta = { pageName: cur.pageName, spaceKey: cur.spaceKey||'' };
  } else {
    // Load default template
    const tpl = TEMPLATES['mermaid-flowchart'];
    editor.value = tpl.code.trimStart();
    diagramType.value = tpl.type;
  }

  updateLibCount();
  updateSyncBtn();
  updateEditorStats();
  updateModifiedBadge();
  editor.focus();
  setTimeout(renderDiagram, 300);
})();
