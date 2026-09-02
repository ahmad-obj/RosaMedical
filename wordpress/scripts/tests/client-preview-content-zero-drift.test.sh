#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
wp(){ "${compose[@]}" run --rm wpcli "$@"; }
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

"${compose[@]}" up -d db wordpress >/dev/null
home_url="$(wp option get home)"
options=(rosa_site_content rosa_home_content rosa_about_content rosa_contact_content rosa_shop_content rosa_preview_media)
state_b64="$(wp eval '
$names=["rosa_site_content","rosa_home_content","rosa_about_content","rosa_contact_content","rosa_shop_content","rosa_preview_media"];
$state=[];
foreach($names as $name){$value=get_option($name,null);$state[$name]=["exists"=>$value!==null,"value"=>$value];}
echo base64_encode(wp_json_encode($state, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
')"
restore(){
  wp eval "\$state=json_decode(base64_decode('${state_b64}'),true); foreach(\$state as \$name=>\$entry){ if(!empty(\$entry['exists'])) update_option(\$name,\$entry['value']); else delete_option(\$name); }" >/dev/null || true
}
trap restore EXIT
for option in rosa_site_content rosa_home_content rosa_about_content rosa_contact_content rosa_shop_content; do wp option delete "$option" >/dev/null 2>&1 || true; done

# Preserve legacy media such as logo/About imagery while removing only the new
# editable media-slot overrides. With no override selected, the public head must
# remain on the same stylesheet set as the approved preview baseline.
wp eval '
$media=get_option("rosa_preview_media",[]);
if(!is_array($media)) $media=[];
foreach([
 "home-hero-01","home-who-01","home-feature-01",
 "home-promo-01","home-promo-02","home-promo-03","home-promo-04",
 "home-why-01","home-evidence-01","prefooter-person-01"
] as $key){ unset($media[$key]); }
update_option("rosa_preview_media",$media);
' >/dev/null

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"; restore' EXIT
routes=(/ /about/ /contact/ /shop/ /ar/ /ar/about/ /ar/contact/ /ar/shop/)
slug(){ printf '%s' "$1" | sed 's#^/##; s#/$##; s#/#-#g; s#^$#home#'; }
for route in "${routes[@]}"; do
  target="$tmp/before-$(slug "$route").html"
  curl -fsSL "${home_url%/}${route}" > "$target" || fail "could not fetch $route before defaults"
  if grep -Fq 'rosa-client-preview-media-css' "$target"; then
    fail "default route unexpectedly enqueues optional media stylesheet: $route"
  fi
done

wp eval '\RosaMedical\Core\Settings\ContentSettings::installDefaults();' >/dev/null

for route in "${routes[@]}"; do
  before="$tmp/before-$(slug "$route").html"
  after="$tmp/after-$(slug "$route").html"
  curl -fsSL "${home_url%/}${route}" > "$after" || fail "could not fetch $route after defaults"
  if ! cmp -s "$before" "$after"; then
    diff -u "$before" "$after" | head -200 >&2 || true
    fail "default content settings changed public HTML for $route"
  fi
done

printf 'PASS: default Rosa content controls preserve public page output and asset set\n'
