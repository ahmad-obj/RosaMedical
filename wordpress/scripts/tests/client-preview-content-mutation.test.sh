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
original_b64="$(wp eval '$value=get_option("rosa_home_content",null); echo base64_encode(wp_json_encode(["exists"=>$value!==null,"value"=>$value], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));')"
restore(){
  wp eval "\$entry=json_decode(base64_decode('${original_b64}'),true); if(!empty(\$entry['exists'])) update_option('rosa_home_content',\$entry['value']); else delete_option('rosa_home_content');" >/dev/null || true
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
' >/dev/null
ar_html="$(curl -fsSL "${home_url%/}/ar/")" || fail 'Arabic Home fetch failed after Arabic mutation'
grep -Fq 'عنوان اختبار روزا' <<<"$ar_html" || fail 'Arabic Home did not render saved hero title'
grep -Fq '<html lang="ar" dir="rtl">' <<<"$ar_html" || fail 'Arabic mutation broke RTL metadata'

bash "$ROOT_DIR/wordpress/scripts/client-preview-seed.sh" >/dev/null
after_seed="$(wp eval '$option=get_option("rosa_home_content",[]); echo is_array($option)?(string)($option["en"]["hero_title"]??""):"";')"
[[ "$after_seed" == 'Rosa mutation test title' ]] || fail 'client-preview seed overwrote saved Homepage content'

printf 'PASS: Rosa content edits render independently and survive reseeding\n'
