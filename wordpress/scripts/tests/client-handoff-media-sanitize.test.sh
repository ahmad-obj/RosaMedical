#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
SANITIZER="$ROOT_DIR/wordpress/scripts/client-handoff-media-sanitize.sh"
SEED="$ROOT_DIR/wordpress/scripts/client-preview-seed.sh"

compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then
  compose+=(--env-file "$ENV_FILE")
fi

wp() {
  "${compose[@]}" run --rm wpcli "$@"
}

fail() {
  printf 'FAIL: client handoff media sanitization: %s\n' "$1" >&2
  exit 1
}

[[ -f "$COMPOSE_FILE" ]] || fail "missing Docker compose file: $COMPOSE_FILE"
[[ -f "$SEED" ]] || fail "missing client preview seed: $SEED"
"${compose[@]}" up -d db wordpress >/dev/null

# IDs/keys are the authoritative Batch 2B disposition from
# docs/superpowers/reports/2026-09-07-media-provenance-audit.md.
unsafe_ids=(19 20 21 22 23 39 80 81 82 83 84 85)
unsafe_setting_keys=(
  hero
  about_procurement
  about_hospitals
  about_international
  home-hero-01
  procurement_support
  home-specialty-plastic-surgery
  home-specialty-orthopedics
  home-specialty-maxillofacial
  home-specialty-orthodontics
  home-specialty-spine
  home-securing-confidence
)
keep_setting_keys=(
  logo
  home-hero-01-desktop home-hero-01-mobile
  home-hero-02-desktop home-hero-02-mobile
  home-hero-03-desktop home-hero-03-mobile
  home-hero-04-desktop home-hero-04-mobile
  catalogue-pdf-scissors catalogue-pdf-cutters catalogue-pdf-punches
  catalogue-pdf-chisels catalogue-pdf-knives
)
unsafe_seed_sources=(
  apps/web/public/media/editorial/home-hero-surgical-instruments.jpg
  apps/web/public/media/editorial/about-procurement.jpg
  apps/web/public/media/editorial/about-hospitals.jpg
  apps/web/public/media/editorial/about-international-buyers.webp
  apps/web/public/media/editorial/procurement-support.jpg
)

snapshot_state() {
  wp eval '
    function rosa_media_gate_normalize_doc(array $doc, string $path): array {
      $targets = [];
      if ($path === "home" || $path === "ar") {
        $targets = [0];
      } elseif ($path === "about" || $path === "ar/about") {
        $targets = [1, 4];
      }
      if (isset($doc[0]["elements"]) && is_array($doc[0]["elements"])) {
        foreach ($targets as $index) {
          if (isset($doc[0]["elements"][$index]["settings"])
              && is_array($doc[0]["elements"][$index]["settings"])) {
            $doc[0]["elements"][$index]["settings"]["image"] = "__ROSA_MEDIA_SLOT__";
          }
        }
      }
      return $doc;
    }

    $state = ["media_non_unsafe" => [], "keep_media" => [], "elementor_non_media" => [], "woo" => [], "product_cat" => []];
    $media = get_option("rosa_preview_media", []);
    if (! is_array($media)) $media = [];
    $unsafeMap = array_fill_keys([19,20,21,22,23,39,80,81,82,83,84,85], true);
    $normalizedMedia = $media;
    foreach ($normalizedMedia as $key => $value) {
      $id = is_scalar($value) ? (int) $value : 0;
      if ($id > 0 && isset($unsafeMap[$id])) $normalizedMedia[$key] = 0;
    }
    ksort($normalizedMedia);
    $state["media_non_unsafe"] = $normalizedMedia;

    foreach ([
      "logo",
      "home-hero-01-desktop", "home-hero-01-mobile",
      "home-hero-02-desktop", "home-hero-02-mobile",
      "home-hero-03-desktop", "home-hero-03-mobile",
      "home-hero-04-desktop", "home-hero-04-mobile",
      "catalogue-pdf-scissors", "catalogue-pdf-cutters", "catalogue-pdf-punches",
      "catalogue-pdf-chisels", "catalogue-pdf-knives"
    ] as $key) {
      $state["keep_media"][$key] = isset($media[$key]) ? (int) $media[$key] : 0;
    }

    foreach (["home", "about", "contact", "ar", "ar/about", "ar/contact"] as $path) {
      $page = get_page_by_path($path, OBJECT, "page");
      if (! $page instanceof WP_Post) {
        $state["elementor_non_media"][$path] = "__MISSING_PAGE__";
        continue;
      }
      $raw = (string) get_post_meta((int) $page->ID, "_elementor_data", true);
      $doc = json_decode($raw, true);
      if (! is_array($doc)) {
        $state["elementor_non_media"][$path] = "__INVALID_DOC__";
        continue;
      }
      $normalized = rosa_media_gate_normalize_doc($doc, $path);
      $state["elementor_non_media"][$path] = hash("sha256", wp_json_encode($normalized, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }

    $product = get_page_by_path("rosa-foundation-stevens-scissors-regular", OBJECT, "product");
    if ($product instanceof WP_Post) {
      $productId = (int) $product->ID;
      $variationIds = get_posts([
        "post_type" => "product_variation", "post_status" => ["publish", "private"],
        "post_parent" => $productId, "fields" => "ids", "posts_per_page" => -1,
        "orderby" => "ID", "order" => "ASC"
      ]);
      $variations = [];
      foreach ($variationIds as $variationId) {
        $variationId = (int) $variationId;
        $variations[] = [
          "id" => $variationId,
          "sku" => (string) get_post_meta($variationId, "_sku", true),
          "thumbnail_id" => (int) get_post_meta($variationId, "_thumbnail_id", true),
        ];
      }
      $state["woo"] = [
        "product_id" => $productId,
        "thumbnail_id" => (int) get_post_meta($productId, "_thumbnail_id", true),
        "gallery" => (string) get_post_meta($productId, "_product_image_gallery", true),
        "variations" => $variations,
      ];
    }

    if (taxonomy_exists("product_cat")) {
      $terms = get_terms(["taxonomy" => "product_cat", "hide_empty" => false, "orderby" => "term_id", "order" => "ASC"]);
      if (! is_wp_error($terms)) {
        foreach ($terms as $term) {
          $state["product_cat"][(string) $term->term_id] = (int) get_term_meta((int) $term->term_id, "_thumbnail_id", true);
        }
      }
    }

    echo base64_encode(wp_json_encode($state, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
  '
}

find_unsafe_runtime_refs() {
  wp eval '
    $unsafe = [19,20,21,22,23,39,80,81,82,83,84,85];
    $unsafeMap = array_fill_keys($unsafe, true);
    $hits = [];
    $media = get_option("rosa_preview_media", []);
    if (is_array($media)) {
      foreach ($media as $key => $value) {
        $id = is_scalar($value) ? (int) $value : 0;
        if ($id > 0 && isset($unsafeMap[$id])) $hits[] = "settings:{$key}=attachment:{$id}";
      }
    }

    foreach (["home", "about", "contact", "ar", "ar/about", "ar/contact"] as $path) {
      $page = get_page_by_path($path, OBJECT, "page");
      if (! $page instanceof WP_Post) continue;
      $raw = (string) get_post_meta((int) $page->ID, "_elementor_data", true);
      $doc = json_decode($raw, true);
      if (! is_array($doc)) continue;
      $walk = function($node, string $at) use (&$walk, &$hits, $unsafeMap, $path): void {
        if (! is_array($node)) return;
        $isElement = array_key_exists("elType", $node) || array_key_exists("widgetType", $node);
        if (! $isElement && isset($node["id"]) && is_scalar($node["id"])) {
          $id = (int) $node["id"];
          if ($id > 0 && isset($unsafeMap[$id])) $hits[] = "elementor:{$path}:{$at}=attachment:{$id}";
        }
        foreach ($node as $key => $value) {
          if (is_array($value)) $walk($value, $at . "/" . $key);
        }
      };
      $walk($doc, "_elementor_data");
    }

    $productIds = get_posts(["post_type" => "product", "post_status" => "publish", "fields" => "ids", "posts_per_page" => -1]);
    foreach ($productIds as $productId) {
      $featured = (int) get_post_meta((int) $productId, "_thumbnail_id", true);
      if ($featured > 0 && isset($unsafeMap[$featured])) $hits[] = "woo:product:{$productId}:thumbnail=attachment:{$featured}";
      $gallery = array_filter(array_map("absint", explode(",", (string) get_post_meta((int) $productId, "_product_image_gallery", true))));
      foreach ($gallery as $id) if (isset($unsafeMap[$id])) $hits[] = "woo:product:{$productId}:gallery=attachment:{$id}";
    }

    if (taxonomy_exists("product_cat")) {
      $terms = get_terms(["taxonomy" => "product_cat", "hide_empty" => false]);
      if (! is_wp_error($terms)) foreach ($terms as $term) {
        $id = (int) get_term_meta((int) $term->term_id, "_thumbnail_id", true);
        if ($id > 0 && isset($unsafeMap[$id])) $hits[] = "woo:product_cat:{$term->term_id}=attachment:{$id}";
      }
    }

    sort($hits);
    echo implode("\n", $hits);
  '
}

baseline_b64="$(snapshot_state)"
pre_hits="$(find_unsafe_runtime_refs)"

if [[ ! -f "$SANITIZER" ]]; then
  if [[ -n "$pre_hits" ]]; then
    printf '%s\n' "$pre_hits" >&2
    first_hit="$(printf '%s\n' "$pre_hits" | head -n 1)"
    fail "unsafe delivered media reference remains before sanitizer implementation: $first_hit"
  fi
  fail 'sanitizer implementation is missing'
fi

# Once production implementation exists, this same contract performs the
# controlled local mutation and proves that unrelated ownership state survives.
bash "$SANITIZER"

after_b64="$(snapshot_state)"
[[ "$after_b64" == "$baseline_b64" ]] || fail 'sanitizer changed safe media, KEEP media, non-media Elementor structure/content, Woo product media/SKUs, or product-category thumbnails'

post_hits="$(find_unsafe_runtime_refs)"
[[ -z "$post_hits" ]] || {
  printf '%s\n' "$post_hits" >&2
  fail 'unsafe delivered media references remain after sanitization'
}

seed_import_block="$(awk '/^media_lines="/{capture=1} capture{print} capture && /^[)]"$/{exit}' "$SEED")"
for source in "${unsafe_seed_sources[@]}"; do
  if grep -Fq -- "$source" <<< "$seed_import_block"; then
    fail "routine preview seed still imports unsafe media source: $source"
  fi
done

# Make KEEP expectations explicit so a zeroed/corrupted baseline cannot pass by
# comparing two equally wrong snapshots.
keep_values="$(wp eval '
  $media=get_option("rosa_preview_media", []); if(!is_array($media)) $media=[];
  foreach([
    "logo", "home-hero-01-desktop", "home-hero-01-mobile",
    "home-hero-02-desktop", "home-hero-02-mobile", "home-hero-03-desktop", "home-hero-03-mobile",
    "home-hero-04-desktop", "home-hero-04-mobile",
    "catalogue-pdf-scissors", "catalogue-pdf-cutters", "catalogue-pdf-punches", "catalogue-pdf-chisels", "catalogue-pdf-knives"
  ] as $key) echo $key . "=" . (int)($media[$key] ?? 0) . "\n";
')"
while IFS='=' read -r key value; do
  [[ -n "$key" ]] || continue
  [[ "$value" =~ ^[1-9][0-9]*$ ]] || fail "KEEP media key lost its attachment: $key=$value"
done <<< "$keep_values"

printf 'PASS: client handoff media sanitizer removes only classified unsafe media and preserves ownership state\n'
