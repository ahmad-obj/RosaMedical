#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SCRIPT="$ROOT/wordpress/scripts/latest-rosa-home-parity-capture.mjs"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

[[ -f "$SCRIPT" ]] || fail 'Homepage parity capture script is missing'

grep -Fq "const templateBase = new URL(process.argv[2] || 'http://localhost:3000/');" "$SCRIPT" || fail 'capture must default to the local pinned-template runtime'
grep -Fq "const wordpressBase = new URL(process.argv[3] || 'http://localhost:8088/');" "$SCRIPT" || fail 'capture must keep WordPress runtime separate from template runtime'
grep -Fq "rosamedical.org is the deployment target, not the template parity reference" "$SCRIPT" || fail 'capture must reject the production URL as template authority'
! grep -Fq "'https://rosamedical.org/'" "$SCRIPT" || fail 'capture must not default to the current production deployment'
grep -Fq "await capture(templateBase, 'template'" "$SCRIPT" || fail 'capture artifacts must identify the pinned template runtime explicitly'
grep -Fq "template/WordPress captures" "$SCRIPT" || fail 'capture success output must describe template-vs-WordPress comparison'

printf 'PASS: latest Rosa Homepage capture is pinned to template runtime rather than production\n'
