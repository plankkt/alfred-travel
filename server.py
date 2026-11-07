"""Local demo server: static site plus a small flight-status API."""

import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "data" / "flight-statuses.json"


class DemoHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        request = urlparse(self.path)
        if request.path != "/api/flight-status":
            return super().do_GET()

        scenario = parse_qs(request.query).get("scenario", ["normal"])[0]
        with DATA_FILE.open(encoding="utf-8") as file:
            data = json.load(file)

        if scenario not in data["scenarios"]:
            return self.send_json({"error": "Unknown scenario"}, 400)

        status = data["scenarios"][scenario]
        response = {
            "flightId": data["flightId"],
            "source": data["source"],
            "scheduled": data["scheduled"],
            **status,
        }
        return self.send_json(response)

    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    print("Альфред запущен: http://localhost:8000", flush=True)
    ThreadingHTTPServer(("127.0.0.1", 8000), DemoHandler).serve_forever()
