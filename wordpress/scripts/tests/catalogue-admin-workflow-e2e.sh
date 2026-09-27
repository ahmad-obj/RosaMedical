#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
RUN_ID="${ROSA_QA_RUN_ID:-$(date +%s)-$$}"
QA_TOKEN="rosa-qa-admin-workflow-${RUN_ID}"
FAMILY_SLUG="rosa-qa-forceps-${RUN_ID}"
PRODUCT_SLUG="rosa-qa-forceps-instrument-${RUN_ID}"
FAMILY_NAME="Rosa QA Forceps Family ${RUN_ID}"
PRODUCT_NAME="Rosa QA Forceps Instrument ${RUN_ID}"

compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then
  compose+=(--env-file "$ENV_FILE")
fi

wp() {
  "${compose[@]}" run --rm \
    -e ROSA_QA_TOKEN="$QA_TOKEN" \
    -e ROSA_QA_FAMILY_SLUG="$FAMILY_SLUG" \
    -e ROSA_QA_PRODUCT_SLUG="$PRODUCT_SLUG" \
    -e ROSA_QA_FAMILY_NAME="$FAMILY_NAME" \
    -e ROSA_QA_PRODUCT_NAME="$PRODUCT_NAME" \
    wpcli "$@"
}

cleanup() {
  # Fixtures are self-marked and removed by marker only. A failed/interrupted
  # test must never target a plausibly client-managed family or product by slug.
  set +e
  wp eval '
    $token = (string) getenv("ROSA_QA_TOKEN");
    if ($token === "") { exit(0); }
    $productIds = get_posts([
      "post_type" => "product", "post_status" => "any", "numberposts" => -1,
      "fields" => "ids", "meta_key" => "_rosa_qa_fixture", "meta_value" => $token,
    ]);
    foreach ($productIds as $productId) { wp_delete_post((int) $productId, true); }
    $terms = get_terms([
      "taxonomy" => "product_cat", "hide_empty" => false,
      "meta_query" => [["key" => "_rosa_qa_fixture", "value" => $token]],
    ]);
    if (! is_wp_error($terms)) {
      $service = new \RosaMedical\Core\Catalogue\FamilyService();
      foreach ($terms as $term) { $service->deleteFamily((int) $term->term_id, 0); }
    }
  ' >/dev/null 2>&1
}
trap cleanup EXIT

echo "=== Step 1: Create a self-marked disposable family ==="
wp eval '
  $service = new \RosaMedical\Core\Catalogue\FamilyService();
  $token = (string) getenv("ROSA_QA_TOKEN");
  $slug = (string) getenv("ROSA_QA_FAMILY_SLUG");
  $name = (string) getenv("ROSA_QA_FAMILY_NAME");
  if ($token === "" || $slug === "" || $name === "") { WP_CLI::error("QA fixture identity missing"); }
  $termId = $service->saveFamily([
    "name" => $name,
    "name_ar" => "فئة ملاقط روزا للاختبار",
    "slug" => $slug,
    "order" => 999999,
    "visible" => 1,
    "description" => "Disposable QA family; automatically removed after this test.",
    "description_ar" => "فئة اختبار مؤقتة تُحذف تلقائيًا بعد الاختبار.",
  ]);
  if (! is_int($termId) || $termId <= 0) { WP_CLI::error("Failed to create QA family: " . print_r($termId, true)); }
  update_term_meta($termId, "_rosa_qa_fixture", $token);
  echo "Created marked QA family term_id: {$termId}\n";

  $product = new WC_Product_Simple();
  $product->set_name((string) getenv("ROSA_QA_PRODUCT_NAME"));
  $product->set_slug((string) getenv("ROSA_QA_PRODUCT_SLUG"));
  $product->set_status("publish");
  $product->set_catalog_visibility("visible");
  $product->set_category_ids([$termId]);
  $productId = $product->save();
  update_post_meta($productId, "_rosa_qa_fixture", $token);
  wc_delete_product_transients($productId);
  clean_post_cache($productId);
  echo "Created marked QA product ID: {$productId}\n";
'

echo "=== Step 2: Verify the public catalogue dynamically renders the family ==="
shop_body="$(curl -fsS http://localhost:8088/shop/)"
[[ "$shop_body" == *"value=\"${FAMILY_SLUG}\""* ]] || { echo "FAIL: marked QA family filter missing on /shop/"; exit 1; }
[[ "$shop_body" == *"data-family=\"${FAMILY_SLUG}\""* ]] || { echo "FAIL: marked QA family was not assigned to its public product card on /shop/"; exit 1; }
[[ "$shop_body" == *"${PRODUCT_NAME}"* ]] || { echo "FAIL: marked QA product missing on /shop/"; exit 1; }
echo "PASS: /shop/ rendered the marked QA family and product dynamically."

ar_shop_body="$(curl -fsS http://localhost:8088/ar/shop/)"
[[ "$ar_shop_body" == *'فئة ملاقط روزا للاختبار'* ]] || { echo "FAIL: marked QA Arabic name missing on /ar/shop/"; exit 1; }
echo "PASS: /ar/shop/ rendered the marked QA Arabic display name dynamically."

echo "=== Step 3: Delete the marked family and explicitly reassign its product ==="
wp eval '
  $service = new \RosaMedical\Core\Catalogue\FamilyService();
  $token = (string) getenv("ROSA_QA_TOKEN");
  $terms = get_terms([
    "taxonomy" => "product_cat", "hide_empty" => false,
    "meta_query" => [["key" => "_rosa_qa_fixture", "value" => $token]],
  ]);
  if (is_wp_error($terms) || count($terms) !== 1) { WP_CLI::error("Expected exactly one marked QA family"); }
  $scissorsTerm = get_term_by("slug", "scissors", "product_cat");
  if (! $scissorsTerm) { WP_CLI::error("Canonical Scissors family missing"); }
  if ($service->deleteFamily((int) $terms[0]->term_id, (int) $scissorsTerm->term_id) !== true) {
    WP_CLI::error("Failed to delete marked QA family with explicit reassignment");
  }
  echo "Deleted marked QA family safely.\n";
'

shop_body_after="$(curl -fsS http://localhost:8088/shop/)"
[[ "$shop_body_after" != *"value=\"${FAMILY_SLUG}\""* ]] || { echo "FAIL: deleted marked QA family remained in /shop/ filters"; exit 1; }
echo "PASS: deleted marked QA family vanished from the public catalogue."

echo "=== Step 4: Verify the marked product survived and was reassigned ==="
wp eval '
  $token = (string) getenv("ROSA_QA_TOKEN");
  $productIds = get_posts([
    "post_type" => "product", "post_status" => "any", "numberposts" => -1,
    "fields" => "ids", "meta_key" => "_rosa_qa_fixture", "meta_value" => $token,
  ]);
  if (count($productIds) !== 1) { WP_CLI::error("Expected exactly one marked QA product after family deletion"); }
  $product = wc_get_product((int) $productIds[0]);
  $scissorsTerm = get_term_by("slug", "scissors", "product_cat");
  if (! $product || ! $scissorsTerm || ! in_array((int) $scissorsTerm->term_id, $product->get_category_ids(), true)) {
    WP_CLI::error("Marked QA product was not safely reassigned to Scissors");
  }
  echo "Marked QA product safely preserved and reassigned.\n";
'

echo "PASS: Catalogue Admin workflow verified with self-marked, automatically cleaned fixtures."
