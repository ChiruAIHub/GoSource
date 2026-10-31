"""
GoSource Production & Demo Server
Lightweight, zero-external-dependency Python HTTP server that:
1. Serves the high-performance compiled React/Vite frontend (dist/)
2. Serves the REST API endpoints for repositories, beginner issues, AI models, and datasets
3. Enables full CORS for local development (npm run dev)
"""

import sys
import os
import json
import mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 5173
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "dist")

SAMPLE_DATA = {
    "status": "online",
    "service": "GoSource Engine v1.0",
    "project_scope": "Open Source Discovery & Contribution Hub",
    "author": "ChiruAIHub",
    "api_version": "2026.1",
    "capabilities": [
        "GitHub REST v3 API proxy & cache",
        "Hugging Face Model Hub search & tags",
        "Kaggle & open dataset curation",
        "Smart skill match scoring"
    ]
}

class GoSourceHandler(BaseHTTPRequestHandler):
    def _send_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors()
        self.end_headers()

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        # 1. API Endpoints
        if path == "/api/status":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors()
            self.end_headers()
            self.wfile.write(json.dumps(SAMPLE_DATA).encode("utf-8"))
            return

        if path == "/api/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors()
            self.end_headers()
            self.wfile.write(json.dumps({"status": "healthy", "port": PORT}).encode("utf-8"))
            return

        # 2. Static Frontend Serving (dist/)
        if not os.path.exists(DIST_DIR):
            self.send_response(500)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(b"Error: dist folder not found. Please run 'npm run build' first.")
            return

        # Map file path
        rel_path = path.lstrip("/")
        if not rel_path or rel_path == "":
            file_path = os.path.join(DIST_DIR, "index.html")
        else:
            file_path = os.path.join(DIST_DIR, rel_path)

        # Fallback to SPA index.html for client-side routing
        if not os.path.exists(file_path) or os.path.isdir(file_path):
            file_path = os.path.join(DIST_DIR, "index.html")

        # Guess mime type
        mime_type, _ = mimetypes.guess_type(file_path)
        if not mime_type:
            mime_type = "application/octet-stream"
        if file_path.endswith(".js"):
            mime_type = "application/javascript"
        elif file_path.endswith(".css"):
            mime_type = "text/css"
        elif file_path.endswith(".html"):
            mime_type = "text/html; charset=utf-8"

        try:
            with open(file_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Length", str(len(content)))
            self._send_cors()
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f"Server error: {e}".encode("utf-8"))

def run():
    port = int(os.environ.get("PORT", PORT))
    server_address = ("0.0.0.0", port)
    httpd = HTTPServer(server_address, GoSourceHandler)
    print(f"\n==================================================")
    print(f"🚀 GoSource Production Server Running!")
    print(f"🌐 Local URL:   http://localhost:{port}")
    print(f"📡 API Health:  http://localhost:{port}/api/status")
    print(f"==================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shutting down gracefully.")
        httpd.server_close()

if __name__ == "__main__":
    run()


