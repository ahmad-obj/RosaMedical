#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"

compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then
  compose+=(--env-file "$ENV_FILE")
fi

wp() {
  "${compose[@]}" run --rm wpcli "$@"
}

echo "=== Step 1: Pre-clean any existing test family or product ==="
wp eval '
  $service = new \RosaMedical\Core\Catalogue\FamilyService();
  $existing = get_term_by("slug", "forceps-test", "product_cat");
  if ($existing) {
    $service->deleteFamily((int) $existing->term_id);
  }
  $post = get_page_by_path("test-rosa-forceps-instrument", OBJECT, "product");
  if ($post) {
    wp_delete_post((int) $post->ID, true);
  }
'

echo "=== Step 2: Create new test family Forceps via FamilyService ==="
wp eval '
  $service = new \RosaMedical\Core\Catalogue\FamilyService();
  $saveData = [
    "name" => "Forceps Test Family",
    "name_ar" => "الملاقط الجراحية التجريبية",
    "slug" => "forceps-test",
    "order" => 99,
    "visible" => 1,
    "description" => "Surgical forceps test family description.",
    "description_ar" => "وصف فئة الملاقط الجراحية التجريبية.",
  ];
  $termId = $service->saveFamily($saveData);
  if (! is_int($termId) || $termId <= 0) {
    WP_CLI::error("Failed to create test family: " . print_r($termId, true));
  }
  echo "Created test family term_id: {$termId}\n";

  $product = new WC_Product_Simple();
  $product->set_name("Test Rosa Forceps Instrument");
  $product->set_slug("test-rosa-forceps-instrument");
  $product->set_status("publish");
  $product->set_catalog_visibility("visible");
  $product->set_category_ids([$termId]);
  $productId = $product->save();
  echo "Created test product ID: {$productId}\n";

  wc_delete_product_transients($productId);
  clean_post_cache($productId);
'

echo "=== Step 3: Verify Public Shop dynamically renders Forceps section ==="
sleep 1
shop_body="$(curl -s http://localhost:8088/shop/)"
[[ "$shop_body" == *'id="family-forceps-test"'* ]] || { echo "FAIL: family-forceps-test section missing on /shop/"; exit 1; }
[[ "$shop_body" == *'Test Rosa Forceps Instrument'* ]] || { echo "FAIL: Test Rosa Forceps Instrument missing on /shop/"; exit 1; }
echo "PASS: /shop/ rendered new family section and product dynamically."

ar_shop_body="$(curl -s http://localhost:8088/ar/shop/)"
[[ "$ar_shop_body" == *'الملاقط الجراحية التجريبية'* ]] || { echo "FAIL: Arabic name missing on /ar/shop/"; exit 1; }
echo "PASS: /ar/shop/ rendered Arabic display name dynamically."

echo "=== Step 4: Safely delete test family and reassign products to Scissors ==="
wp eval '
  $service = new \RosaMedical\Core\Catalogue\FamilyService();
  $term = get_term_by("slug", "forceps-test", "product_cat");
  if (! $term) {
    WP_CLI::error("Test family not found");
  }
  $scissorsTerm = get_term_by("slug", "scissors", "product_cat");
  $scissorsId = (int) $scissorsTerm->term_id;

  $res = $service->deleteFamily((int) $term->term_id, $scissorsId);
  if ($res !== true) {
    WP_CLI::error("Failed to delete family safely: " . print_r($res, true));
  }
  echo "Deleted family safely.\n";
'

echo "=== Step 5: Verify Public Shop no longer has Forceps section ==="
sleep 1
shop_body_after="$(curl -s http://localhost:8088/shop/)"
if [[ "$shop_body_after" == *'id="family-forceps-test"'* ]]; then
  echo "FAIL: family-forceps-test should no longer exist on /shop/"
  exit 1
fi
echo "PASS: Deleted family section cleanly vanished from public catalogue."

echo "=== Step 6: Verify product survived and is now under Scissors, then cleanup ==="
wp eval '
  $post = get_page_by_path("test-rosa-forceps-instrument", OBJECT, "product");
  if (! $post) {
    WP_CLI::error("Product was deleted! Deleting family must never delete products!");
  }
  $product = wc_get_product((int) $post->ID);
  $scissorsTerm = get_term_by("slug", "scissors", "product_cat");
  $scissorsId = (int) $scissorsTerm->term_id;
  if (! in_array($scissorsId, $product->get_category_ids(), true)) {
    WP_CLI::error("Product was not reassigned to Scissors");
  }
  echo "Product verified safely preserved and reassigned.\n";

  // Cleanup test product
  wp_delete_post((int) $post->ID, true);
  echo "Test product cleaned up.\n";
'

echo "=========================================================="
echo "PASS: Catalogue Admin Workflow E2E Verified Successfully!"
echo "=========================================================="
