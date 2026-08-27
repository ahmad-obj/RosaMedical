#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PREFLIGHT="$(cd "$SCRIPT_DIR/.." && pwd)/gate0-preflight.sh"
TMP_ROOT="$(mktemp -d)"
trap 'rm -rf "$TMP_ROOT"' EXIT

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

make_fake_docker() {
  mkdir -p "$TMP_ROOT/bin"
  cat > "$TMP_ROOT/bin/docker" <<'SH'
#!/usr/bin/env bash
exit 0
SH
  chmod +x "$TMP_ROOT/bin/docker"
}

run_preflight() {
  env PATH="$TMP_ROOT/bin:/usr/bin:/bin" "$@" bash "$PREFLIGHT" 2>&1
}

make_fake_docker
KIT="$TMP_ROOT/medicashop.zip"
PRO="$TMP_ROOT/elementor-pro.zip"
: > "$KIT"
: > "$PRO"

set +e
output="$(run_preflight ROSA_GATE0_MODE=free 2>&1)"
status=$?
set -e
[[ $status -ne 0 ]] || fail "free mode should fail when MedicaShop ZIP is missing"
[[ "$output" == *"ROSA_MEDICASHOP_KIT_ZIP"* ]] || fail "missing kit error must name ROSA_MEDICASHOP_KIT_ZIP"

output="$(run_preflight ROSA_GATE0_MODE=free ROSA_MEDICASHOP_KIT_ZIP="$KIT")" || fail "free mode should not require Elementor Pro"
[[ "$output" == *"Gate 0 preflight passed (mode: free)"* ]] || fail "free-mode success message missing"

set +e
output="$(run_preflight ROSA_GATE0_MODE=pro ROSA_MEDICASHOP_KIT_ZIP="$KIT" 2>&1)"
status=$?
set -e
[[ $status -ne 0 ]] || fail "pro mode should fail when Elementor Pro ZIP is missing"
[[ "$output" == *"ROSA_ELEMENTOR_PRO_ZIP"* ]] || fail "pro-mode error must name ROSA_ELEMENTOR_PRO_ZIP"

output="$(run_preflight ROSA_GATE0_MODE=pro ROSA_MEDICASHOP_KIT_ZIP="$KIT" ROSA_ELEMENTOR_PRO_ZIP="$PRO")" || fail "pro mode should pass with both ZIPs"
[[ "$output" == *"Gate 0 preflight passed (mode: pro)"* ]] || fail "pro-mode success message missing"

set +e
output="$(run_preflight ROSA_GATE0_MODE=free ROSA_MEDICASHOP_KIT_ZIP="$TMP_ROOT/nope.zip" 2>&1)"
status=$?
set -e
[[ $status -ne 0 ]] || fail "missing kit path should fail"
[[ "$output" == *"does not exist"* ]] || fail "missing-path error should be explicit"

printf 'PASS: gate0-preflight free/pro dependency contract\n'
