#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SCRIPT="$ROOT_DIR/wordpress/scripts/tests/catalogue-admin-workflow-e2e.sh"

fail() { echo "FAIL: $*" >&2; exit 1; }

bash -n "$SCRIPT" || fail "admin workflow script has invalid shell syntax"
grep -Fq 'trap cleanup EXIT' "$SCRIPT" || fail "admin workflow must cleanup fixtures even after an interrupted run"
grep -Fq '_rosa_qa_fixture' "$SCRIPT" || fail "admin workflow must identify cleanup targets with a private fixture marker"
grep -Fq '"meta_query" => [["key" => "_rosa_qa_fixture"' "$SCRIPT" || fail "admin workflow must query family fixtures by their marker, not all catalogue terms"
grep -Fq 'ROSA_QA_RUN_ID' "$SCRIPT" || fail "admin workflow must create a unique fixture namespace"
if grep -Eq 'forceps-test|test-rosa-forceps-instrument' "$SCRIPT"; then
  fail "admin workflow still contains a fixed client-like destructive fixture slug"
fi

echo "PASS: Catalogue Admin workflow only creates and cleans self-marked disposable fixtures"
