#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PREFLIGHT="$(cd "$SCRIPT_DIR/.." && pwd)/foundation-preflight.sh"
TMP_ROOT="$(mktemp -d)"
trap 'rm -rf "$TMP_ROOT"' EXIT

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

mkdir -p "$TMP_ROOT/bin"
cat > "$TMP_ROOT/bin/docker" <<'SH'
#!/usr/bin/env bash
if [[ "${1:-}" == "compose" && "${2:-}" == "version" ]]; then
  printf 'Docker Compose version v2-test\n'
  exit 0
fi
exit 0
SH
chmod +x "$TMP_ROOT/bin/docker"

set +e
output="$(PATH="$TMP_ROOT/bin:/usr/bin:/bin" bash "$PREFLIGHT" 2>&1)"
status=$?
set -e

[[ $status -eq 0 ]] || fail "free foundation preflight should pass with Docker + Compose"
[[ "$output" == *"Foundation preflight passed."* ]] || fail "success message missing"
[[ "$output" != *"MEDICASHOP"* ]] || fail "must not reference MedicaShop"
[[ "$output" != *"ELEMENTOR_PRO"* ]] || fail "must not reference Elementor Pro"

printf 'PASS: free foundation preflight contract\n'
