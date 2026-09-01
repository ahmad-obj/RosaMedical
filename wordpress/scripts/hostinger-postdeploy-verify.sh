#!/usr/bin/env bash
set -euo pipefail

TARGET_URL="${TARGET_URL:-}"
[[ -n "$TARGET_URL" ]] || { printf 'Post-deploy verification failed: TARGET_URL is required.\n' >&2; exit 2; }
[[ "$TARGET_URL" =~ ^https?:// ]] || { printf 'Post-deploy verification failed: TARGET_URL must start with http:// or https://.\n' >&2; exit 2; }

BASE="${TARGET_URL%/}"
PHONE="${ROSA_PREVIEW_PHONE:-+966 59 720 4394}"
EMAIL="${ROSA_PREVIEW_EMAIL:-info@rosamedical.org}"
ADDRESS="${ROSA_PREVIEW_ADDRESS:-King Fahd Road, Al Olaya, Riyadh 12214, Saudi Arabia}"

fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
pass(){ printf 'PASS: %s\n' "$1"; }

fetch(){
  local path="$1"
  curl -fsSL --connect-timeout 10 --max-time 45 "$BASE$path"
}

assert_no_local_leakage(){
  local label="$1" html="$2"
  if grep -Eqi 'localhost|127\.0\.0\.1|/rosa-reference-media|apps/web/public/media|file:///' <<<"$html"; then
    fail "$label contains a local-only URL/path reference"
  fi
}

assert_page(){
  local label="$1" path="$2" locale="$3" required="${4:-}" html
  html="$(fetch "$path")" || fail "$label did not return HTTP success: $BASE$path"
  grep -Eqi '<main([[:space:]>])' <<<"$html" || fail "$label has no <main> landmark"
  grep -Fqi 'Rosa' <<<"$html" || fail "$label does not render Rosa branding"
  assert_no_local_leakage "$label" "$html"
  if grep -Eqi 'Coming Soon' <<<"$html"; then
    fail "$label is intercepted by WooCommerce Coming Soon mode"
  fi
  if [[ "$locale" == "ar" ]]; then
    [[ "$html" == *'lang="ar"'* ]] || fail "$label is missing lang=\"ar\""
    [[ "$html" == *'dir="rtl"'* ]] || fail "$label is missing dir=\"rtl\""
  else
    [[ "$html" == *'dir="ltr"'* ]] || fail "$label is missing dir=\"ltr\""
  fi
  if [[ -n "$required" ]]; then
    grep -Fq -- "$required" <<<"$html" || fail "$label is missing required content: $required"
  fi
  pass "$label"
}

assert_page 'English Home' '/' en
assert_page 'English About' '/about/' en
assert_page 'English Contact' '/contact/' en "$EMAIL"
assert_page 'English Shop' '/shop/' en
assert_page 'Arabic Home' '/ar/' ar
assert_page 'Arabic About' '/ar/about/' ar
assert_page 'Arabic Contact' '/ar/contact/' ar
assert_page 'Arabic Shop' '/ar/shop/' ar
assert_page 'Stevens Product Detail' '/product/rosa-foundation-stevens-scissors-regular/' en 'Stevens Scissors'

home_html="$(fetch '/')"
contact_html="$(fetch '/contact/')"
product_html="$(fetch '/product/rosa-foundation-stevens-scissors-regular/')"

for value in "$PHONE" "$EMAIL" "$ADDRESS"; do
  if grep -Fq -- "$value" <<<"$home_html" || grep -Fq -- "$value" <<<"$contact_html"; then
    pass "verified business value is rendered: $value"
  else
    fail "verified business value is missing from Home/Contact: $value"
  fi
done

for product_token in 'Stevens Scissors' '04-0901' '04-0911'; do
  grep -Fq -- "$product_token" <<<"$product_html" || fail "product detail is missing: $product_token"
done
pass 'canonical Stevens product data'

# Verify same-origin stylesheet/script/image assets referenced by the homepage.
asset_urls="$(
  python3 -c '
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
import sys
base = sys.argv[1]
base_host = urlparse(base).netloc
html = sys.stdin.read()
class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.urls = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag in {"img", "script"} and d.get("src"):
            self.urls.append(d["src"])
        if tag == "link" and d.get("href") and "stylesheet" in (d.get("rel") or ""):
            self.urls.append(d["href"])
p = P(); p.feed(html)
seen = set()
for raw in p.urls:
    full = urljoin(base + "/", raw)
    parsed = urlparse(full)
    if parsed.scheme in {"http", "https"} and parsed.netloc == base_host and full not in seen:
        seen.add(full); print(full)
' "$BASE" <<<"$home_html"
)"

asset_checked=0
while IFS= read -r asset; do
  [[ -n "$asset" ]] || continue
  asset_checked=$((asset_checked + 1))
  curl -fsSL --connect-timeout 10 --max-time 45 -o /dev/null "$asset" || fail "same-origin asset failed: $asset"
done <<<"$asset_urls"
pass "same-origin homepage assets checked: $asset_checked"

effective="$(curl -fsSL -o /dev/null -w '%{url_effective}' --connect-timeout 10 --max-time 45 "$BASE/" || true)"
if [[ "$effective" == http://localhost* || "$effective" == http://127.0.0.1* || "$effective" == https://localhost* || "$effective" == https://127.0.0.1* ]]; then
  fail "production homepage redirects to a local URL: $effective"
fi
pass "effective production URL remains remote: ${effective:-unknown}"

printf 'PASS: Rosa Medical Hostinger post-deploy verification\n'
