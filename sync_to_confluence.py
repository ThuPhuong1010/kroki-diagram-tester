#!/usr/bin/env python3
"""
sync_to_confluence.py
─────────────────────
Render diagram (Mermaid/PlantUML/GraphViz/D2) → Upload lên Confluence page
dưới dạng attachment PNG. Attachment URL KHÔNG đổi → diagram tự update.

Render routing (hybrid — mirrors app.js):
  Mermaid  → mermaid.ink   (purpose-built, stable)
  Others   → kroki.io      (PlantUML, GraphViz, D2, BPMN, C4, DBML, ...)

Cách dùng:
    python sync_to_confluence.py <diagram_file> [--page-id ID] [--type mermaid]

Ví dụ:
    python sync_to_confluence.py diagrams/flow.mmd
    python sync_to_confluence.py diagrams/arch.puml --type plantuml --page-id 858128386

Đọc credentials từ .env trong thư mục confluence-jira-audit (cùng project).
"""

import os
import sys
import zlib
import base64
import argparse
import requests
from pathlib import Path
from urllib.parse import quote

# Fix Windows terminal encoding
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ─── Load .env ──────────────────────────────────────────────────────────────
def load_env(env_path: Path):
    if not env_path.exists():
        return {}
    env = {}
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, _, v = line.partition("=")
            env[k.strip()] = v.strip()
    return env

SCRIPT_DIR = Path(__file__).parent
ENV_PATH   = SCRIPT_DIR.parent / "confluence-jira-audit" / ".env"
ENV        = load_env(ENV_PATH)

def clean_ascii(s: str) -> str:
    """Remove invisible Unicode characters (combining diacritics etc.)"""
    return ''.join(c for c in s if 32 <= ord(c) <= 126)

CF_URL   = clean_ascii(ENV.get("ATLASSIAN_URL", "")).rstrip("/")
CF_EMAIL = clean_ascii(ENV.get("ATLASSIAN_EMAIL", ""))
CF_TOKEN = clean_ascii(ENV.get("ATLASSIAN_API_TOKEN", ""))

# ─── Encoding ───────────────────────────────────────────────────────────────

MERMAID_TYPES = {"mermaid"}

def encode_mermaid_ink(code: str) -> str:
    """Plain base64url (UTF-8) for mermaid.ink."""
    return base64.urlsafe_b64encode(code.encode("utf-8")).decode("ascii")

def encode_kroki(code: str) -> str:
    """zlib deflate → base64url for kroki.io (PlantUML, GraphViz, D2, BPMN, etc.)"""
    compressed = zlib.compress(code.encode("utf-8"), level=9)
    return base64.urlsafe_b64encode(compressed).decode("ascii")

def build_url(code: str, diagram_type: str, fmt: str = "png") -> str:
    """Hybrid routing: Mermaid → mermaid.ink (stable), others → kroki.io."""
    if diagram_type in MERMAID_TYPES:
        endpoint = "img" if fmt == "png" else "svg"
        return f"https://mermaid.ink/{endpoint}/{encode_mermaid_ink(code)}"
    return f"https://kroki.io/{diagram_type}/{fmt}/{encode_kroki(code)}"

# ─── Detect diagram type from file extension ────────────────────────────────
EXT_MAP = {
    ".mmd":     "mermaid",
    ".mermaid": "mermaid",
    ".puml":    "plantuml",
    ".pu":      "plantuml",
    ".gv":      "graphviz",
    ".dot":     "graphviz",
    ".d2":      "d2",
}

def detect_type(path: Path) -> str:
    return EXT_MAP.get(path.suffix.lower(), "mermaid")

# ─── Confluence API (v1 REST) ────────────────────────────────────────────────
def cf_session() -> requests.Session:
    s = requests.Session()
    token = base64.b64encode(f"{CF_EMAIL}:{CF_TOKEN}".encode("utf-8")).decode("ascii")
    s.headers.update({
        "Authorization": f"Basic {token}",
        "Accept": "application/json",
    })
    return s

def find_attachment(session: requests.Session, page_id: str, filename: str):
    """Find attachment by filename using v1 REST API with server-side filter."""
    url = f"{CF_URL}/wiki/rest/api/content/{page_id}/child/attachment?filename={quote(filename)}&limit=1"
    r = session.get(url)
    if not r.ok:
        print(f"  [DEBUG find] {r.status_code}: {r.text[:400]}")
    r.raise_for_status()
    results = r.json().get("results", [])
    return results[0] if results else None

def upload_attachment(session: requests.Session, page_id: str, filename: str,
                      img_bytes: bytes, existing=None) -> dict:
    """Upload or update attachment via v1 REST API."""
    cf_headers = {"X-Atlassian-Token": "no-check"}
    files = {"file": (filename, img_bytes, "image/png")}
    data  = {"comment": "Auto-synced by sync_to_confluence.py", "minorEdit": "true"}

    if existing:
        att_id = existing["id"]
        url = f"{CF_URL}/wiki/rest/api/content/{page_id}/child/attachment/{att_id}/data"
        r = session.post(url, headers=cf_headers, files=files, data=data)
    else:
        url = f"{CF_URL}/wiki/rest/api/content/{page_id}/child/attachment"
        r = session.post(url, headers=cf_headers, files=files, data=data)

    if not r.ok:
        print(f"  [DEBUG upload] {r.status_code}: {r.text[:400]}")
    r.raise_for_status()
    result  = r.json()
    results = result.get("results", [result])
    return results[0] if results else result

# ─── Main ───────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Sync diagram to Confluence attachment")
    parser.add_argument("diagram_file",     help="Path to diagram file (.mmd, .puml, .gv, .d2)")
    parser.add_argument("--page-id",  "-p", default="858128386",
                        help="Confluence page ID (default: 858128386)")
    parser.add_argument("--type",     "-t", default=None,
                        help="Diagram type: mermaid|plantuml|graphviz|d2 (auto-detect from extension)")
    parser.add_argument("--filename", "-f", default=None,
                        help="Attachment filename in Confluence (default: <stem>.png)")
    parser.add_argument("--format",         default="png", choices=["png", "svg"],
                        help="Output format (default: png)")
    args = parser.parse_args()

    # ── Validate credentials ──
    if not all([CF_URL, CF_EMAIL, CF_TOKEN]):
        print(f"❌ Thiếu credentials. Kiểm tra file: {ENV_PATH}")
        print(f"   Cần: ATLASSIAN_URL, ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN")
        sys.exit(1)

    # ── Validate diagram file ──
    diagram_path = Path(args.diagram_file)
    if not diagram_path.exists():
        print(f"❌ File không tồn tại: {diagram_path}")
        sys.exit(1)

    code         = diagram_path.read_text(encoding="utf-8")
    diagram_type = args.type or detect_type(diagram_path)
    att_filename = args.filename or (diagram_path.stem + f".{args.format}")
    page_id      = args.page_id

    print(f"[RENDER] {diagram_path.name} ({diagram_type} → {args.format.upper()})")

    # ── 1. Render via kroki.io ──
    render_url = build_url(code, diagram_type, args.format)
    try:
        resp = requests.get(render_url, timeout=30)
    except requests.exceptions.SSLError as e:
        print(f"❌ SSL error khi gọi kroki.io: {e}")
        sys.exit(1)
    except requests.exceptions.ConnectionError:
        print(f"❌ Không kết nối được đến kroki.io — kiểm tra mạng")
        sys.exit(1)
    except requests.exceptions.Timeout:
        print(f"❌ kroki.io timeout sau 30s")
        sys.exit(1)

    if resp.status_code != 200:
        print(f"❌ Render thất bại [{resp.status_code}]: {resp.text[:300]}")
        sys.exit(1)

    img_bytes = resp.content
    print(f"   OK  Rendered ({len(img_bytes):,} bytes)")

    # ── 2. Upload to Confluence ──
    print(f"[UPLOAD] {att_filename} → Page {page_id}")
    session = cf_session()

    try:
        existing = find_attachment(session, page_id, att_filename)
    except requests.exceptions.HTTPError as e:
        print(f"❌ Lỗi khi tìm attachment: {e}")
        print(f"   Kiểm tra lại page ID ({page_id}) và quyền truy cập")
        sys.exit(1)
    except requests.exceptions.ConnectionError:
        print(f"❌ Không kết nối được đến {CF_URL}")
        sys.exit(1)

    action = "Updating" if existing else "Creating"
    print(f"   ...  {action} attachment...")

    try:
        upload_attachment(session, page_id, att_filename, img_bytes, existing)
    except requests.exceptions.HTTPError as e:
        print(f"❌ Upload thất bại: {e}")
        sys.exit(1)

    # ── Stable URL (không thay đổi qua các lần update) ──
    stable_url = f"{CF_URL}/wiki/download/attachments/{page_id}/{att_filename}"

    print()
    print(f"   DONE  {'Updated' if existing else 'Uploaded'} successfully!")
    print(f"   Stable URL:")
    print(f"     {stable_url}")
    print()
    print("   [TIP] Lần đầu: paste URL vào Confluence → Insert → Image → URL")
    print("   [TIP] Lần sau: chạy lại script → image tự update, URL không đổi")

if __name__ == "__main__":
    main()
