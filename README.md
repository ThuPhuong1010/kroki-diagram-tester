# Kroki Diagram Tester

> 🔷 Test Mermaid, PlantUML, GraphViz and 25+ diagram types — generate Confluence-ready image URLs instantly.

**Live Demo**: https://thuphuong1010.github.io/kroki-diagram-tester/

---

## ✨ Features

- **25+ diagram types**: Mermaid, PlantUML, GraphViz, D2, BPMN, C4, DBML, ERD...
- **Live preview** — renders as you type (debounced 600ms)
- **Confluence-ready URL** — 1-click copy → paste into Confluence as image
- **Download SVG / PNG**
- **12 built-in templates** covering Flowchart, Sequence, Class, ERD, Gantt, Use Case, Component...
- **Drag-resizable split pane**
- **Zoom controls**
- **Dark mode** with glassmorphism UI

---

## 🚀 How It Works

```
Diagram Code → UTF-8 → Deflate → Base64URL → https://kroki.io/{type}/{format}/{encoded}
```

The generated URL can be embedded as an **image** in Confluence Cloud — **no admin, no plugin needed**.

---

## 🛠 Usage

1. Open the app
2. Select diagram type (Mermaid, PlantUML, etc.)
3. Write or load a template
4. Copy the generated Confluence URL
5. In Confluence: **Insert (+) → Image → Insert from URL** → Paste

---

## 📦 Tech Stack

- Vanilla HTML / CSS / JavaScript (no build step)
- [Kroki.io](https://kroki.io) public API
- [fflate](https://github.com/101arrowz/fflate) for deflate compression
- GitHub Pages for hosting
- GitHub Actions for CI/CD

---

## 🌐 Supported Diagram Types

| Type | Key |
|---|---|
| Mermaid | `mermaid` |
| PlantUML | `plantuml` |
| GraphViz | `graphviz` |
| D2 | `d2` |
| BPMN | `bpmn` |
| C4 (PlantUML) | `c4plantuml` |
| DBML | `dbml` |
| ERD | `erd` |
| Excalidraw | `excalidraw` |
| WaveDrom | `wavedrom` |
| Nomnoml | `nomnoml` |
| + more... | see kroki.io |

---

## 📄 License

MIT
