# Diagram Type Guide — Kroki Diagram Tool

> Hướng dẫn chọn loại diagram, cú pháp yêu cầu, và pipeline từ phân tích đến ảnh trên Confluence.

---

## Pipeline tổng quan

```
Có yêu cầu
    │
    ▼
Chọn loại diagram (bảng bên dưới)
    │
    ▼
Viết code trong Confluence code block (label = diagram type)
hoặc viết trực tiếp trong tool editor
    │
    ▼
Tool phát hiện code block → render → upload attachment → embed vào page
    │
    ├─ Đã có ảnh cùng nội dung → skip render (dùng cache)
    ├─ Code mới → render qua mermaid.ink / kroki.io → upload
    └─ Code cũ thay đổi → render mới → upload mới → xóa attachment cũ
```

---

## Khi nào dùng type nào

| Nhu cầu | Type | Format | Ghi chú |
|---------|------|--------|---------|
| Flow công việc đơn giản | `mermaid` (flowchart) | PNG | Nhanh nhất, đọc dễ nhất |
| Sequence giữa các service/actor | `mermaid` (sequenceDiagram) | PNG | API call, auth flow, webhook |
| State machine (đơn/vừa) | `mermaid` (stateDiagram-v2) | PNG | Đủ cho hầu hết use case |
| Class diagram / UML | `mermaid` (classDiagram) | PNG | Nếu phức tạp thì dùng plantuml |
| ER diagram nhanh | `mermaid` (erDiagram) | PNG | Syntax ngắn, dễ đọc |
| Timeline / Gantt | `mermaid` (gantt) | PNG | Project schedule |
| Sequence phức tạp / nhiều nhánh | `plantuml` | PNG | Nhiều tính năng hơn mermaid |
| Toàn bộ UML diagram | `plantuml` | PNG | Component, deployment, activity... |
| Architecture theo C4 model | `c4plantuml` | PNG | Chuẩn C4 (Context/Container/Component) |
| Architecture dạng code (modern) | `structurizr` | PNG | Cần `autolayout` trong views ⚠️ |
| Architecture diagram đẹp | `d2` | SVG | Visual đẹp, clean |
| Graph / dependency network | `graphviz` | PNG | DOT language, tốt cho complex graph |
| Database schema (thiết kế) | `dbml` | SVG | DBML syntax, export được sang SQL |
| ER diagram chi tiết | `erd` | PNG | Kroki erd tool, cú pháp riêng ⚠️ |
| Business Process (BPMN chuẩn) | `bpmn` | SVG | Cần full XML với layout section ⚠️ |
| Timing diagram (hardware) | `wavedrom` | SVG | Chuyên biệt cho digital signals |
| Technical figures | `pikchr` | SVG | Nhúng trong documentation |
| Data visualization | `vega` | SVG | Vega JSON (không phải Vega-Lite) |
| Quick UML prototype | `nomnoml` | SVG | `[A]->[B]` syntax đơn giản |

---

## Render pipeline chi tiết

```
Type = mermaid
  └─→ mermaid.ink (GET, base64, timeout 12s)
        ├─ OK (PNG) → dùng luôn
        └─ Fail    → fallback xuống kroki.io

Type = bất kỳ (kể cả mermaid nếu mermaid.ink fail)
  └─→ kroki.io GET (zlib-deflate + base64url, timeout 20s)
        ├─ URL < 8KB → GET (cache-friendly, lợi nếu diagram phổ biến)
        ├─ URL ≥ 8KB → POST (diagram code dài)
        └─ Fail      → retry 1 lần sau 1.5s → throw nếu vẫn fail
```

**Format output:**
- PNG: `mermaid`, `plantuml`, `graphviz`, `c4plantuml`, `structurizr`, `erd`
- SVG: `d2`, `bpmn`, `nomnoml`, `wavedrom`, `pikchr`, `dbml`, `vega`

Confluence hiển thị được cả PNG lẫn SVG. SVG có chất lượng cao hơn (vector, zoom không vỡ).

---

## Cú pháp đặc biệt cần chú ý ⚠️

### `bpmn` — Cần full BPMN XML với layout

Không render được nếu chỉ có `<process>`. Phải có `<bpmndi:BPMNDiagram>` với tọa độ từng element:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  id="d1" targetNamespace="http://bpmn.io/schema/bpmn">
  <process id="p1" isExecutable="false">
    <startEvent id="s1"/>
    <userTask id="t1" name="Tên task"/>
    <endEvent id="e1"/>
    <sequenceFlow id="f1" sourceRef="s1" targetRef="t1"/>
    <sequenceFlow id="f2" sourceRef="t1" targetRef="e1"/>
  </process>
  <bpmndi:BPMNDiagram>
    <bpmndi:BPMNPlane bpmnElement="p1">
      <bpmndi:BPMNShape bpmnElement="s1"><dc:Bounds x="100" y="100" width="36" height="36"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="t1"><dc:Bounds x="200" y="80" width="100" height="80"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="e1"><dc:Bounds x="360" y="100" width="36" height="36"/></bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```

> 💡 Thực tế: dùng bpmn.io editor để vẽ, export XML, paste vào code block.

### `structurizr` — Bắt buộc có `autolayout` trong views

```
workspace {
  model {
    u = person "User"
    s = softwareSystem "My System"
    u -> s "Uses"
  }
  views {
    systemContext s {
      include *
      autolayout lr    ← BẮT BUỘC, không có → render ra trang trắng
    }
  }
}
```

### `erd` — Cú pháp riêng của kroki (không phải mermaid erDiagram)

```
[Person]
*name
height
weight

[Location]
*name
country

Person 1--+ Location
```

Ký hiệu quan hệ: `?` (0 hoặc 1), `1` (đúng 1), `+` (1 hoặc nhiều), `*` (0 hoặc nhiều)

### `dbml` — Dùng cho database schema thiết kế

```
Table users {
  id integer [pk, increment]
  email varchar [unique, not null]
  created_at timestamp
}

Table posts {
  id integer [pk]
  user_id integer [ref: > users.id]
  title varchar
}
```

### `vega` — Phải là Vega v5 JSON, không phải Vega-Lite

```json
{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 400, "height": 200,
  "data": [{"name": "table", "values": [{"x": 1, "y": 10}, {"x": 2, "y": 20}]}],
  "marks": [{"type": "rect", "from": {"data": "table"},
    "encode": {"enter": {"x": {"field": "x", "scale": "xscale"},
      "width": {"value": 30}, "y": {"field": "y", "scale": "yscale"},
      "y2": {"value": 0}, "fill": {"value": "steelblue"}}}}]
}
```

---

## Auto-detect (code block không có label)

Nếu code block trong Confluence không có language label, tool tự detect:

| Pattern trong code | Detect thành |
|-------------------|-------------|
| Bắt đầu bằng `flowchart`, `sequenceDiagram`, `gantt`, `classDiagram`... | `mermaid` |
| Bắt đầu bằng `@startuml` + có `C4Context/C4Container` | `c4plantuml` |
| Bắt đầu bằng `@startuml` | `plantuml` |
| Bắt đầu bằng `<?xml` + có `bpmn` | `bpmn` |
| Bắt đầu bằng `workspace {` | `structurizr` |
| Bắt đầu bằng `{` + có từ `signal` hoặc `head` | `wavedrom` |
| Bắt đầu bằng `{` + có `"$schema"` + `vega` | `vega` |
| Bắt đầu bằng `graph {` hoặc `digraph {` | `graphviz` |
| Pattern `Word -> Word` trên dòng đầu | `d2` |
| Bắt đầu bằng `[` + có `]->[` hoặc `]-[` | `nomnoml` |
| Bắt đầu bằng `[` + có dòng `*field` | `erd` |
| Bắt đầu bằng `Table word {` | `dbml` |
| Không khớp gì | Bỏ qua (không render) |

---

## Quy trình làm việc trên Confluence

### Cách 1 — Viết code trong Confluence (khuyến nghị)

1. Tạo code block trong Confluence page, set language = diagram type (vd: `mermaid`)
2. Viết diagram code vào block
3. Vào tool → nhập Page ID → **Process Page**
4. Tool tìm tất cả code block → render → upload attachment → embed ảnh vào page
5. Ảnh xuất hiện ngay dưới code block (code được fold vào "View diagram source")

### Cách 2 — Viết trong tool editor, lưu vào page

1. Vào tool → chọn type → viết code trong editor
2. Nhập Confluence Page ID
3. **Save** → tool render → upload → embed vào page
4. Nếu page đã có diagram (edit mode): **Update** thay thế đúng ảnh đó, xóa ảnh cũ

### Idempotency — Không bị duplicate

- Filename của attachment = `auto-{md5(type+code)}-{type}.{ext}`
- Cùng code → cùng hash → skip render, không upload lại
- Code đổi → hash mới → upload file mới → **tự động xóa file cũ**

---

## Availability test (tested 2026-07-23)

| Type | Service | Format | Status | Latency |
|------|---------|--------|--------|---------|
| mermaid | mermaid.ink → kroki.io | PNG | ✅ | ~900ms |
| plantuml | kroki.io | PNG | ✅ | ~630ms |
| graphviz | kroki.io | PNG | ✅ | ~1250ms |
| d2 | kroki.io | SVG | ✅ | ~1340ms |
| bpmn | kroki.io | SVG | ✅ (cần full XML) | ~720ms |
| nomnoml | kroki.io | SVG | ✅ | ~585ms |
| wavedrom | kroki.io | SVG | ✅ | ~590ms |
| pikchr | kroki.io | SVG | ✅ | ~585ms |
| dbml | kroki.io | SVG | ✅ | ~1450ms |
| vega | kroki.io | SVG | ✅ | ~1520ms |
| structurizr | kroki.io | PNG | ✅ (cần autolayout) | ~1200ms |
| c4plantuml | kroki.io | PNG | ✅ | ~1840ms |
| erd | kroki.io | PNG | ✅ (cú pháp riêng) | ~480ms |

> kroki.io không có SLA. Nếu cần production-grade reliability → self-host với `docker pull yuzutech/kroki`.
