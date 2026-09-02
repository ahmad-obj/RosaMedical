#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
THEME="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
wp(){ "${compose[@]}" run --rm wpcli "$@"; }
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

# Content controls must not add a second public stylesheet. The one image rule
# belongs in the existing preview stylesheet so the default document head stays
# aligned with the approved preview implementation.
grep -Fq '.rosa-preview-media-slot__image' "$THEME/assets/css/client-preview.css" || fail 'media image rule must live in existing client-preview.css'
if grep -Fq 'rosa-client-preview-media' "$THEME/functions.php"; then
  fail 'content controls must not enqueue a second public media stylesheet'
fi
[[ ! -f "$THEME/assets/css/client-preview-media.css" ]] || fail 'standalone public media stylesheet must not exist'

"${compose[@]}" up -d db wordpress >/dev/null
home_url="$(wp option get home)"
options=(rosa_site_content rosa_home_content rosa_about_content rosa_contact_content rosa_shop_content)
state_b64="$(wp eval '
$names=["rosa_site_content","rosa_home_content","rosa_about_content","rosa_contact_content","rosa_shop_content"];
$state=[];
foreach($names as $name){$value=get_option($name,null);$state[$name]=["exists"=>$value!==null,"value"=>$value];}
echo base64_encode(wp_json_encode($state, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
')"
restore(){
  wp eval "\$state=json_decode(base64_decode('${state_b64}'),true); foreach(\$state as \$name=>\$entry){ if(!empty(\$entry['exists'])) update_option(\$name,\$entry['value']); else delete_option(\$name); }" >/dev/null || true
}
trap restore EXIT
for option in "${options[@]}"; do wp option delete "$option" >/dev/null 2>&1 || true; done

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"; restore' EXIT
routes=(/ /about/ /contact/ /shop/ /ar/ /ar/about/ /ar/contact/ /ar/shop/)
slug(){ printf '%s' "$1" | sed 's#^/##; s#/$##; s#/#-#g; s#^$#home#'; }
for route in "${routes[@]}"; do curl -fsSL "${home_url%/}${route}" > "$tmp/before-$(slug "$route").html" || fail "could not fetch $route before defaults"; done

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

printf 'PASS: default Rosa content controls preserve public page output\n'
