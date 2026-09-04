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
original_b64="$(wp eval '
$names=["rosa_home_content","rosa_site_content","rosa_shop_content","rosa_preview_media"];
$state=[];
foreach($names as $name){$value=get_option($name,null);$state[$name]=["exists"=>$value!==null,"value"=>$value];}
echo base64_encode(wp_json_encode($state, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
')"
restore(){
  wp eval "\$state=json_decode(base64_decode('${original_b64}'),true); foreach(\$state as \$name=>\$entry){ if(!empty(\$entry['exists'])) update_option(\$name,\$entry['value']); else delete_option(\$name); }" >/dev/null || true
}
trap restore EXIT

wp eval '
$home=get_option("rosa_home_content",[]); if(!is_array($home)) $home=[];
if(!isset($home["en"])||!is_array($home["en"])) $home["en"]=[];
$home["en"]["hero_title"]="ROLLBACK ONLY HOME TITLE";
update_option("rosa_home_content",$home);

$site=get_option("rosa_site_content",[]); if(!is_array($site)) $site=[];
if(!isset($site["en"])||!is_array($site["en"])) $site["en"]=[];
$site["en"]["cta_title"]="LIVE SHARED CTA TITLE";
update_option("rosa_site_content",$site);

$shop=get_option("rosa_shop_content",[]); if(!is_array($shop)) $shop=[];
if(!isset($shop["en"])||!is_array($shop["en"])) $shop["en"]=[];
$shop["en"]["hero_title"]="LIVE SHOP TITLE";
update_option("rosa_shop_content",$shop);

$media=get_option("rosa_preview_media",[]); if(!is_array($media)) $media=[];
$media["home-hero-01"]=777;
update_option("rosa_preview_media",$media);
' >/dev/null

home_html="$(curl -fsSL "${home_url%/}/")" || fail 'English Home fetch failed after ownership mutation'
! grep -Fq 'ROLLBACK ONLY HOME TITLE' <<<"$home_html" || fail 'legacy Homepage option still competes with Elementor public content'
! grep -Fq 'LIVE SHARED CTA TITLE' <<<"$home_html" || fail 'latest Homepage rendered duplicate shared Site/CTA prefooter'

about_html="$(curl -fsSL "${home_url%/}/about/")" || fail 'English About fetch failed after ownership mutation'
grep -Fq 'LIVE SHARED CTA TITLE' <<<"$about_html" || fail 'Site & CTA setting no longer renders dynamically on About'

shop_html="$(curl -fsSL "${home_url%/}/shop/")" || fail 'English Shop fetch failed after ownership mutation'
grep -Fq 'LIVE SHOP TITLE' <<<"$shop_html" || fail 'Shop setting no longer renders dynamically'

bash "$ROOT_DIR/wordpress/scripts/client-preview-seed.sh" >/dev/null

home_value="$(wp eval '$option=get_option("rosa_home_content",[]); echo is_array($option)?(string)($option["en"]["hero_title"]??""):"";')"
[[ "$home_value" == 'ROLLBACK ONLY HOME TITLE' ]] || fail 'routine seed overwrote preserved Homepage rollback content'
site_value="$(wp eval '$option=get_option("rosa_site_content",[]); echo is_array($option)?(string)($option["en"]["cta_title"]??""):"";')"
[[ "$site_value" == 'LIVE SHARED CTA TITLE' ]] || fail 'routine seed overwrote Site & CTA content'
shop_value="$(wp eval '$option=get_option("rosa_shop_content",[]); echo is_array($option)?(string)($option["en"]["hero_title"]??""):"";')"
[[ "$shop_value" == 'LIVE SHOP TITLE' ]] || fail 'routine seed overwrote Shop content'
media_after_seed="$(wp eval '$media=get_option("rosa_preview_media",[]); echo is_array($media)?(string)($media["home-hero-01"]??""):"";')"
[[ "$media_after_seed" == '777' ]] || fail 'routine seed overwrote preserved Rosa media mapping'

template="$(wp eval '$page=get_page_by_path("home", OBJECT, "page"); echo $page?(string)get_post_meta((int)$page->ID,"_wp_page_template",true):"";')"
[[ "$template" == 'page-templates/rosa-elementor-authoring.php' ]] || fail 'routine seed reverted migrated Home to legacy template'

home_html="$(curl -fsSL "${home_url%/}/")" || fail 'English Home refetch failed after routine seed'
! grep -Fq 'ROLLBACK ONLY HOME TITLE' <<<"$home_html" || fail 'rollback-only Homepage data became public after routine seed'
! grep -Fq 'LIVE SHARED CTA TITLE' <<<"$home_html" || fail 'latest Homepage rendered duplicate shared Site/CTA prefooter after routine seed'

about_html="$(curl -fsSL "${home_url%/}/about/")" || fail 'English About refetch failed after routine seed'
grep -Fq 'LIVE SHARED CTA TITLE' <<<"$about_html" || fail 'live shared CTA edit disappeared from About after routine seed'

printf 'PASS: Elementor owns page bodies while latest Home suppresses duplicate Site/CTA and shared settings survive routine reseeding\n'
