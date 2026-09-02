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
$names=["rosa_home_content","rosa_preview_media"];
$state=[];
foreach($names as $name){$value=get_option($name,null);$state[$name]=["exists"=>$value!==null,"value"=>$value];}
echo base64_encode(wp_json_encode($state, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
')"
restore(){
  wp eval "\$state=json_decode(base64_decode('${original_b64}'),true); foreach(\$state as \$name=>\$entry){ if(!empty(\$entry['exists'])) update_option(\$name,\$entry['value']); else delete_option(\$name); }" >/dev/null || true
}
trap restore EXIT

wp eval '
$option=get_option("rosa_home_content",[]); if(!is_array($option)) $option=[];
if(!isset($option["en"])||!is_array($option["en"])) $option["en"]=[];
$option["en"]["hero_title"]="Rosa mutation test title";
update_option("rosa_home_content",$option);
' >/dev/null
home_html="$(curl -fsSL "${home_url%/}/")" || fail 'English Home fetch failed after content mutation'
grep -Fq 'Rosa mutation test title' <<<"$home_html" || fail 'English Home did not render saved hero title'
for marker in hero who featured feature latest promos why proof evidence; do grep -Fq "data-home-section=\"$marker\"" <<<"$home_html" || fail "Home structure marker disappeared after edit: $marker"; done

ar_html="$(curl -fsSL "${home_url%/}/ar/")" || fail 'Arabic Home fetch failed after English mutation'
grep -Fq 'أدوات جراحية مخصصة لاحتياجات التوريد المهني.' <<<"$ar_html" || fail 'English mutation overwrote Arabic hero default'

wp eval '
$option=get_option("rosa_home_content",[]); if(!is_array($option)) $option=[];
if(!isset($option["ar"])||!is_array($option["ar"])) $option["ar"]=[];
$option["ar"]["hero_title"]="عنوان اختبار روزا";
update_option("rosa_home_content",$option);
$media=get_option("rosa_preview_media",[]); if(!is_array($media)) $media=[];
$media["home-hero-01"]=777;
update_option("rosa_preview_media",$media);
' >/dev/null
ar_html="$(curl -fsSL "${home_url%/}/ar/")" || fail 'Arabic Home fetch failed after Arabic mutation'
grep -Fq 'عنوان اختبار روزا' <<<"$ar_html" || fail 'Arabic Home did not render saved hero title'
grep -Fq '<html lang="ar" dir="rtl">' <<<"$ar_html" || fail 'Arabic mutation broke RTL metadata'

bash "$ROOT_DIR/wordpress/scripts/client-preview-seed.sh" >/dev/null
after_seed="$(wp eval '$option=get_option("rosa_home_content",[]); echo is_array($option)?(string)($option["en"]["hero_title"]??""):"";')"
[[ "$after_seed" == 'Rosa mutation test title' ]] || fail 'client-preview seed overwrote saved Homepage content'
media_after_seed="$(wp eval '$media=get_option("rosa_preview_media",[]); echo is_array($media)?(string)($media["home-hero-01"]??""):"";')"
[[ "$media_after_seed" == '777' ]] || fail 'client-preview seed overwrote an editor-selected Homepage media slot'

printf 'PASS: Rosa content/media edits render independently and survive reseeding\n'
