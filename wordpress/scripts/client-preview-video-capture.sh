#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
ARTIFACT_DIR="$ROOT_DIR/wordpress/.client-preview-artifacts/video"
TEMP_SCRIPT="$ROOT_DIR/apps/web/.rosa-client-preview-video.mjs"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
wp(){ "${compose[@]}" run --rm wpcli "$@"; }
fail(){ printf 'Client preview video capture failed: %s\n' "$1" >&2; exit 1; }
page_url(){ local path="$1"; wp eval "\$p=get_page_by_path('${path}',OBJECT,'page'); if(!\$p){WP_CLI::error('Missing page: ${path}');} echo get_permalink((int)\$p->ID);"; }

cd "$ROOT_DIR"
command -v pnpm >/dev/null 2>&1 || fail 'pnpm is required for Playwright video capture'
mkdir -p "$ARTIFACT_DIR"
trap 'rm -f "$TEMP_SCRIPT"' EXIT

home_url="$(wp option get home)"
about_url="$(page_url 'about')"
contact_url="$(page_url 'contact')"
shop_id="$(wp option get woocommerce_shop_page_id)"
[[ "$shop_id" =~ ^[0-9]+$ && "$shop_id" -gt 0 ]] || fail 'WooCommerce Shop page ID is missing'
shop_url="$(wp post url "$shop_id")"
ar_about_url="$(page_url 'ar/about')"

cat >"$TEMP_SCRIPT" <<'JS'
import { chromium } from '@playwright/test';
import { copyFile } from 'node:fs/promises';
import path from 'node:path';

const required = ['ROSA_VIDEO_HOME','ROSA_VIDEO_ABOUT','ROSA_VIDEO_CONTACT','ROSA_VIDEO_SHOP','ROSA_VIDEO_AR_ABOUT','ROSA_VIDEO_OUTPUT'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing ${key}`);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: path.dirname(process.env.ROSA_VIDEO_OUTPUT),
    size: { width: 1440, height: 900 },
  },
});
const page = await context.newPage();
const video = page.video();

async function beat(ms = 450) {
  await page.waitForTimeout(ms);
}
async function visit(url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator('body').waitFor({ state: 'visible' });
  await beat(650);
}
async function show(selector) {
  const target = page.locator(selector).first();
  if (await target.count()) {
    await target.scrollIntoViewIfNeeded();
    await target.waitFor({ state: 'visible' });
    await beat();
  }
}

await visit(process.env.ROSA_VIDEO_HOME);
for (const selector of ['[data-preview-hero]','[data-preview-who-we-are]','[data-preview-featured-products]','[data-preview-feature-banner]','[data-preview-contact-cta]']) await show(selector);

await visit(process.env.ROSA_VIDEO_ABOUT);
for (const selector of ['[data-preview-page-hero]','[data-preview-who-we-are]','[data-preview-about-cards]','[data-preview-why-us]','[data-preview-contact-cta]']) await show(selector);

await visit(process.env.ROSA_VIDEO_CONTACT);
for (const selector of ['[data-preview-page-hero]','[data-preview-contact-layout]','[data-preview-map-role]']) await show(selector);

await visit(process.env.ROSA_VIDEO_SHOP);
await show('[data-preview-shop-grid]');

await page.locator('.rosa-preview-header__actions .rosa-preview-language').click();
await page.waitForURL(/\/ar\/?$/);
await page.waitForLoadState('networkidle');
for (const selector of ['[data-preview-hero]','[data-preview-who-we-are]','[data-preview-feature-banner]','[data-preview-contact-cta]']) await show(selector);

await visit(process.env.ROSA_VIDEO_AR_ABOUT);
for (const selector of ['[data-preview-page-hero]','[data-preview-about-cards]','[data-preview-why-us]']) await show(selector);

await page.setViewportSize({ width: 390, height: 844 });
await visit(process.env.ROSA_VIDEO_HOME);
await page.locator('[data-rosa-preview-menu-trigger]').click();
await page.locator('[data-rosa-preview-menu-drawer]').waitFor({ state: 'visible' });
await beat(700);
await page.keyboard.press('Escape');
await page.locator('[data-rosa-preview-menu-drawer]').waitFor({ state: 'hidden' });
await beat(450);

await context.close();
await browser.close();
const generated = await video.path();
await copyFile(generated, process.env.ROSA_VIDEO_OUTPUT);
console.log(process.env.ROSA_VIDEO_OUTPUT);
JS

output="$ARTIFACT_DIR/rosa-client-preview.webm"
ROSA_VIDEO_HOME="$home_url" \
ROSA_VIDEO_ABOUT="$about_url" \
ROSA_VIDEO_CONTACT="$contact_url" \
ROSA_VIDEO_SHOP="$shop_url" \
ROSA_VIDEO_AR_ABOUT="$ar_about_url" \
ROSA_VIDEO_OUTPUT="$output" \
  pnpm --filter @rosa/web exec node "$TEMP_SCRIPT"

[[ -s "$output" ]] || fail "video artifact was not created: $output"
printf 'PASS: client preview walkthrough video created at %s\n' "$output"
