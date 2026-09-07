<?php
/**
 * Virtual quotation-request routes, canonical Woo presentation data and protected handoff submission.
 */
if (! defined('ABSPATH')) {
    exit;
}

const ROSA_QUOTE_SUBMIT_ACTION = 'rosa_submit_quote_request';
const ROSA_QUOTE_SUBMIT_NONCE_ACTION = 'rosa_quote_submission';
const ROSA_QUOTE_SUBMIT_MAX_ITEMS = 50;
const ROSA_QUOTE_SUBMIT_MAX_QUANTITY = 999;
const ROSA_QUOTE_WHATSAPP_NUMBER = '966597204394';

function rosa_quote_request_route_locale(): ?string
{
    $requestUri = (string) ($_SERVER['REQUEST_URI'] ?? '');
    $requestPath = (string) wp_parse_url($requestUri, PHP_URL_PATH);
    $homePath = rtrim((string) wp_parse_url(home_url('/'), PHP_URL_PATH), '/');

    if ($homePath !== '' && $homePath !== '/' && strncmp($requestPath, $homePath . '/', strlen($homePath) + 1) === 0) {
        $requestPath = substr($requestPath, strlen($homePath));
    }

    $path = trim($requestPath, '/');
    if ($path === 'quote-request') {
        return 'en';
    }
    if ($path === 'ar/quote-request') {
        return 'ar';
    }

    return null;
}

function rosa_is_quote_request_route(): bool
{
    return rosa_quote_request_route_locale() !== null;
}

function rosa_quote_request_catalog_payload(): array
{
    if (! function_exists('wc_get_products')) {
        return [];
    }

    $products = wc_get_products([
        'status' => 'publish',
        'limit' => -1,
        'orderby' => 'ID',
        'order' => 'ASC',
        'return' => 'objects',
    ]);

    $rows = [];
    foreach ($products as $product) {
        if (! ($product instanceof WC_Product)) {
            continue;
        }

        $productId = (int) $product->get_id();
        $title = trim((string) $product->get_name());
        if ($productId <= 0 || $title === '') {
            continue;
        }

        if ($product instanceof WC_Product_Variable) {
            foreach ($product->get_children() as $variationId) {
                $variation = wc_get_product((int) $variationId);
                if (! ($variation instanceof WC_Product_Variation) || $variation->get_status() !== 'publish') {
                    continue;
                }

                $sku = trim((string) $variation->get_sku());
                if ($sku === '') {
                    continue;
                }

                $rows[] = [
                    'productId' => $productId,
                    'variationId' => (int) $variation->get_id(),
                    'sku' => $sku,
                    'title' => $title,
                    'configuration' => rosa_quote_request_variation_configuration($product, $variation, $sku),
                ];
            }
            continue;
        }

        $sku = trim((string) $product->get_sku());
        if ($sku === '') {
            continue;
        }

        $rows[] = [
            'productId' => $productId,
            'variationId' => 0,
            'sku' => $sku,
            'title' => $title,
            'configuration' => $sku,
        ];
    }

    return $rows;
}

function rosa_quote_request_variation_configuration(WC_Product $product, WC_Product_Variation $variation, string $fallback): string
{
    $parts = [];
    foreach ($variation->get_attributes() as $taxonomy => $value) {
        $value = (string) $value;
        if ($value === '') {
            continue;
        }

        $label = function_exists('wc_attribute_label')
            ? wc_attribute_label((string) $taxonomy, $product)
            : ucwords(str_replace(['pa_', '-', '_'], ['', ' ', ' '], (string) $taxonomy));

        $display = $value;
        if (taxonomy_exists((string) $taxonomy)) {
            $term = get_term_by('slug', $value, (string) $taxonomy);
            if ($term instanceof WP_Term) {
                $display = $term->name;
            }
        }

        $parts[] = trim((string) $label) . ': ' . $display;
    }

    return $parts !== [] ? implode(' · ', $parts) : $fallback;
}

function rosa_quote_submission_endpoint(): string
{
    return admin_url('admin-ajax.php?action=' . rawurlencode(ROSA_QUOTE_SUBMIT_ACTION));
}

function rosa_quote_submission_nonce(): string
{
    return wp_create_nonce(ROSA_QUOTE_SUBMIT_NONCE_ACTION);
}

function rosa_quote_submission_reject(string $message, int $status = 422): void
{
    wp_send_json([
        'accepted' => false,
        'message' => $message,
    ], $status);
}

function rosa_quote_submission_clean_text($value, int $maxLength): string
{
    $clean = sanitize_text_field(is_scalar($value) ? (string) $value : '');
    if (function_exists('mb_substr')) {
        return mb_substr($clean, 0, $maxLength);
    }
    return substr($clean, 0, $maxLength);
}

function rosa_quote_submission_clean_notes($value, int $maxLength = 2000): string
{
    $clean = sanitize_textarea_field(is_scalar($value) ? (string) $value : '');
    if (function_exists('mb_substr')) {
        return mb_substr($clean, 0, $maxLength);
    }
    return substr($clean, 0, $maxLength);
}

function rosa_quote_submission_canonical_item(array $candidate): ?array
{
    if (! function_exists('wc_get_product')) {
        return null;
    }

    $productId = filter_var($candidate['productId'] ?? null, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1],
    ]);
    $variationId = filter_var($candidate['variationId'] ?? 0, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 0],
    ]);
    $quantity = filter_var($candidate['quantity'] ?? null, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1, 'max_range' => ROSA_QUOTE_SUBMIT_MAX_QUANTITY],
    ]);
    $sku = rosa_quote_submission_clean_text($candidate['sku'] ?? '', 160);

    if ($productId === false || $variationId === false || $quantity === false || $sku === '') {
        return null;
    }

    $product = wc_get_product((int) $productId);
    if (! ($product instanceof WC_Product) || $product->get_status() !== 'publish') {
        return null;
    }

    $title = trim((string) $product->get_name());
    if ($title === '') {
        return null;
    }

    if ((int) $variationId > 0) {
        $variation = wc_get_product((int) $variationId);
        if (! ($variation instanceof WC_Product_Variation)
            || $variation->get_status() !== 'publish'
            || (int) $variation->get_parent_id() !== (int) $productId) {
            return null;
        }

        $canonicalSku = trim((string) $variation->get_sku());
        if ($canonicalSku === '' || $canonicalSku !== $sku) {
            return null;
        }

        return [
            'productId' => (int) $productId,
            'variationId' => (int) $variationId,
            'sku' => $canonicalSku,
            'quantity' => (int) $quantity,
            'title' => $title,
            'configuration' => rosa_quote_request_variation_configuration($product, $variation, $canonicalSku),
        ];
    }

    if ($product instanceof WC_Product_Variable) {
        return null;
    }

    $canonicalSku = trim((string) $product->get_sku());
    if ($canonicalSku === '' || $canonicalSku !== $sku) {
        return null;
    }

    return [
        'productId' => (int) $productId,
        'variationId' => 0,
        'sku' => $canonicalSku,
        'quantity' => (int) $quantity,
        'title' => $title,
        'configuration' => $canonicalSku,
    ];
}

function rosa_quote_submission_message(array $customer, array $items, string $locale): string
{
    $isArabic = $locale === 'ar';
    $labels = $isArabic
        ? [
            'heading' => 'طلب عرض سعر من ROSA Medical',
            'name' => 'الاسم',
            'email' => 'البريد الإلكتروني',
            'phone' => 'واتساب / الهاتف',
            'institution' => 'المؤسسة / المستشفى',
            'location' => 'الدولة / المدينة',
            'notes' => 'ملاحظات',
            'items' => 'الأدوات المحددة',
            'sku' => 'SKU',
            'configuration' => 'التكوين',
            'quantity' => 'الكمية',
        ]
        : [
            'heading' => 'ROSA Medical quotation inquiry',
            'name' => 'Name',
            'email' => 'Email',
            'phone' => 'WhatsApp / Phone',
            'institution' => 'Institution / Hospital',
            'location' => 'Country / City',
            'notes' => 'Notes',
            'items' => 'Selected instruments',
            'sku' => 'SKU',
            'configuration' => 'Configuration',
            'quantity' => 'Quantity',
        ];

    $lines = [
        $labels['heading'],
        '',
        $labels['name'] . ': ' . $customer['name'],
        $labels['email'] . ': ' . $customer['email'],
        $labels['phone'] . ': ' . $customer['phone'],
        $labels['institution'] . ': ' . $customer['institution'],
        $labels['location'] . ': ' . $customer['location'],
        $labels['notes'] . ': ' . $customer['notes'],
        '',
        $labels['items'] . ':',
    ];

    foreach ($items as $index => $item) {
        $lines[] = ((int) $index + 1) . '. ' . $item['title'];
        $lines[] = $labels['sku'] . ': ' . $item['sku'];
        $lines[] = $labels['configuration'] . ': ' . $item['configuration'];
        $lines[] = $labels['quantity'] . ': ' . $item['quantity'];
        $lines[] = '';
    }

    return trim(implode("\n", $lines));
}

function rosa_quote_submission_recipient(): string
{
    $configured = function_exists('rosa_theme_business_value')
        ? trim((string) rosa_theme_business_value('email', ''))
        : '';
    if ($configured !== '' && is_email($configured)) {
        return $configured;
    }

    return sanitize_email((string) get_option('admin_email', ''));
}

function rosa_quote_submission_handle(): void
{
    if (strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? '')) !== 'POST') {
        rosa_quote_submission_reject('POST required.', 405);
    }

    $decoded = json_decode((string) file_get_contents('php://input'), true);
    if (! is_array($decoded)) {
        rosa_quote_submission_reject('Invalid request payload.', 400);
    }

    $nonce = rosa_quote_submission_clean_text($decoded['nonce'] ?? '', 128);
    if ($nonce === '' || ! wp_verify_nonce($nonce, ROSA_QUOTE_SUBMIT_NONCE_ACTION)) {
        rosa_quote_submission_reject('Invalid quotation nonce.', 403);
    }

    if (rosa_quote_submission_clean_text($decoded['website'] ?? '', 255) !== '') {
        rosa_quote_submission_reject('Invalid submission.', 422);
    }

    $customerRaw = isset($decoded['customer']) && is_array($decoded['customer']) ? $decoded['customer'] : [];
    $customer = [
        'name' => rosa_quote_submission_clean_text($customerRaw['name'] ?? '', 160),
        'email' => sanitize_email(is_scalar($customerRaw['email'] ?? null) ? (string) $customerRaw['email'] : ''),
        'phone' => rosa_quote_submission_clean_text($customerRaw['phone'] ?? '', 80),
        'institution' => rosa_quote_submission_clean_text($customerRaw['institution'] ?? '', 200),
        'location' => rosa_quote_submission_clean_text($customerRaw['location'] ?? '', 200),
        'notes' => rosa_quote_submission_clean_notes($customerRaw['notes'] ?? ''),
    ];

    if ($customer['name'] === '') {
        rosa_quote_submission_reject('Name is required.', 422);
    }
    if ($customer['email'] === '' || ! is_email($customer['email'])) {
        rosa_quote_submission_reject('A valid email address is required.', 422);
    }

    $locale = ($decoded['locale'] ?? '') === 'ar' ? 'ar' : 'en';
    $incomingItems = isset($decoded['items']) && is_array($decoded['items']) ? $decoded['items'] : [];
    if ($incomingItems === [] || count($incomingItems) > ROSA_QUOTE_SUBMIT_MAX_ITEMS) {
        rosa_quote_submission_reject('Select at least one valid instrument.', 422);
    }

    $canonicalItems = [];
    $indexByIdentity = [];
    foreach ($incomingItems as $candidate) {
        if (! is_array($candidate)) {
            rosa_quote_submission_reject('Invalid instrument selection.', 422);
        }

        $item = rosa_quote_submission_canonical_item($candidate);
        if ($item === null) {
            rosa_quote_submission_reject('Instrument identity could not be verified.', 422);
        }

        $key = $item['productId'] . ':' . $item['variationId'] . ':' . $item['sku'];
        if (isset($indexByIdentity[$key])) {
            $index = $indexByIdentity[$key];
            $nextQuantity = $canonicalItems[$index]['quantity'] + $item['quantity'];
            if ($nextQuantity > ROSA_QUOTE_SUBMIT_MAX_QUANTITY) {
                rosa_quote_submission_reject('Instrument quantity is too large.', 422);
            }
            $canonicalItems[$index]['quantity'] = $nextQuantity;
            continue;
        }

        $indexByIdentity[$key] = count($canonicalItems);
        $canonicalItems[] = $item;
    }

    $message = rosa_quote_submission_message($customer, $canonicalItems, $locale);
    $recipient = rosa_quote_submission_recipient();
    $subjectInstitution = $customer['institution'] !== '' ? $customer['institution'] : $customer['name'];
    $subject = $locale === 'ar'
        ? 'طلب عرض سعر - ' . $subjectInstitution
        : 'Quotation inquiry - ' . $subjectInstitution;
    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $customer['name'] . ' <' . $customer['email'] . '>',
    ];

    $mailSent = (bool) wp_mail($recipient, $subject, $message, $headers);
    $whatsappUrl = 'https://wa.me/' . ROSA_QUOTE_WHATSAPP_NUMBER . '?text=' . rawurlencode($message);

    wp_send_json([
        'accepted' => true,
        'email' => [
            'attempted' => true,
            'sent' => $mailSent,
        ],
        'whatsapp' => [
            'prepared' => true,
            'url' => $whatsappUrl,
        ],
    ], 200);
}

add_action('wp_ajax_nopriv_' . ROSA_QUOTE_SUBMIT_ACTION, 'rosa_quote_submission_handle');
add_action('wp_ajax_' . ROSA_QUOTE_SUBMIT_ACTION, 'rosa_quote_submission_handle');

add_action('init', static function (): void {
    add_rewrite_rule('^quote-request/?$', 'index.php?rosa_quote_request=1&rosa_quote_locale=en', 'top');
    add_rewrite_rule('^ar/quote-request/?$', 'index.php?rosa_quote_request=1&rosa_quote_locale=ar', 'top');
});

add_filter('query_vars', static function (array $vars): array {
    $vars[] = 'rosa_quote_request';
    $vars[] = 'rosa_quote_locale';
    return $vars;
});

add_action('template_redirect', static function (): void {
    if (! rosa_is_quote_request_route()) {
        return;
    }

    global $wp_query;
    if ($wp_query instanceof WP_Query) {
        $wp_query->is_404 = false;
        $wp_query->is_page = true;
    }

    $routeLocale = rosa_quote_request_route_locale() === 'ar' ? 'ar' : 'en';
    if (defined('ROSA_PREVIEW_ROUTE_LOCALE_QUERY')) {
        set_query_var(ROSA_PREVIEW_ROUTE_LOCALE_QUERY, $routeLocale === 'ar' ? 'ar' : '');
    }

    status_header(200);
    nocache_headers();

    $template = get_stylesheet_directory() . '/page-templates/quote-request.php';
    if (is_readable($template)) {
        include $template;
        exit;
    }
}, 0);
