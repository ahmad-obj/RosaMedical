#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
COMPOSE_FILE="$ROOT/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT/wordpress/dev/.env"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
wp(){ "${compose[@]}" run --rm wpcli "$@"; }

wp eval '
$targets = ["home", "about", "contact", "ar", "ar/about", "ar/contact"];
if (! class_exists("\\Elementor\\Plugin")) WP_CLI::error("Elementor is inactive");
foreach ($targets as $path) {
    $page = get_page_by_path($path, OBJECT, "page");
    if (! $page) WP_CLI::error("Missing target page: {$path}");
    $id = (int) $page->ID;
    $document = \Elementor\Plugin::$instance->documents->get($id, false);
    if (! $document) WP_CLI::error("Missing Elementor document: {$path}");
    $url = (string) $document->get_edit_url();
    $parts = wp_parse_url($url);
    parse_str((string)($parts["query"] ?? ""), $query);
    if ((int)($query["post"] ?? 0) !== $id || (string)($query["action"] ?? "") !== "elementor") {
        WP_CLI::error("Invalid Elementor edit URL for {$path}: {$url}");
    }
}
WP_CLI::success("Elementor editor URLs verified for all six target pages.");
'
printf 'PASS: Elementor authoring editor-link contract\n'
