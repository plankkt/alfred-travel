#!/bin/zsh
cd -- "${0:A:h}" || exit 1
url='http://127.0.0.1:8000'
if curl --noproxy '*' -fsS --max-time 2 "$url/api/flight-status" 2>/dev/null | grep -q 'SU2402-2026-11-12'; then
  open "$url/?page=overview"
else
  exec python3 server.py --open
fi
