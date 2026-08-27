#!/usr/bin/env bash
set -euo pipefail

mode="${ROSA_GATE0_MODE:-free}"
case "$mode" in
  free|pro) ;;
  *)
    printf 'Gate 0 preflight failed: ROSA_GATE0_MODE must be "free" or "pro" (got %q).\n' "$mode" >&2
    exit 2
    ;;
esac

if ! command -v docker >/dev/null 2>&1; then
  printf 'Gate 0 preflight failed: Docker is required for the isolated local spike.\n' >&2
  exit 2
fi

if ! docker compose version >/dev/null 2>&1; then
  printf 'Gate 0 preflight failed: Docker Compose v2 is required.\n' >&2
  exit 2
fi

kit_zip="${ROSA_MEDICASHOP_KIT_ZIP:-}"
if [[ -z "$kit_zip" ]]; then
  printf 'Gate 0 preflight failed: set ROSA_MEDICASHOP_KIT_ZIP to the purchased MedicaShop Template Kit ZIP.\n' >&2
  exit 2
fi
if [[ ! -f "$kit_zip" ]]; then
  printf 'Gate 0 preflight failed: ROSA_MEDICASHOP_KIT_ZIP path does not exist: %s\n' "$kit_zip" >&2
  exit 2
fi

if [[ "$mode" == "pro" ]]; then
  pro_zip="${ROSA_ELEMENTOR_PRO_ZIP:-}"
  if [[ -z "$pro_zip" ]]; then
    printf 'Gate 0 preflight failed: pro comparison mode requires ROSA_ELEMENTOR_PRO_ZIP.\n' >&2
    exit 2
  fi
  if [[ ! -f "$pro_zip" ]]; then
    printf 'Gate 0 preflight failed: ROSA_ELEMENTOR_PRO_ZIP path does not exist: %s\n' "$pro_zip" >&2
    exit 2
  fi
fi

printf 'Gate 0 preflight passed (mode: %s).\n' "$mode"
