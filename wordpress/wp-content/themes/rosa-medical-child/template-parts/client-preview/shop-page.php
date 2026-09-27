<?php
if (! defined('ABSPATH')) { exit; }

$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$locale = $locale === 'ar' ? 'ar' : 'en';
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_content('shop', $key, $locale, $locale === 'ar' ? $ar : $en);

$search = isset($_GET['s']) ? sanitize_text_field(wp_unslash((string) $_GET['s'])) : '';
$shopUrl = $locale === 'ar' ? home_url('/ar/shop/') : (get_post_type_archive_link('product') ?: home_url('/shop/'));

$heroTitle = $c('hero_title', 'Find Product', 'اعثر على المنتج');
if (($locale === 'en' && trim($heroTitle) === 'Shop') || ($locale === 'ar' && trim($heroTitle) === 'المنتجات')) {
    $heroTitle = $locale === 'ar' ? 'اعثر على المنتج' : 'Find Product';
}

// Retrieve dynamic families via FamilyService
$familyService = class_exists(\RosaMedical\Core\Catalogue\FamilyService::class)
    ? new \RosaMedical\Core\Catalogue\FamilyService()
    : null;

$allFamilies = $familyService ? $familyService->getFamilies(false, $locale) : [];

if (empty($allFamilies) && taxonomy_exists('product_cat')) {
    $terms = get_terms([
        'taxonomy' => 'product_cat',
        'hide_empty' => false,
        'exclude' => [get_option('default_product_cat', 0)],
    ]);
    if (! is_wp_error($terms) && is_array($terms)) {
        foreach ($terms as $term) {
            $allFamilies[] = (object) [
                'id' => (int) $term->term_id,
                'name' => (string) $term->name,
                'slug' => (string) $term->slug,
                'description' => (string) $term->description,
                'pdfUrl' => '',
                'coverUrl' => '',
                'productCount' => (int) $term->count,
            ];
        }
    }
}

// Query all published products
$queryArgs = [
    'post_type' => 'product',
    'post_status' => 'publish',
    'posts_per_page' => 250,
    'orderby' => [
        'menu_order' => 'ASC',
        'title' => 'ASC',
    ],
];
if ($search !== '') {
    $queryArgs['s'] = $search;
}

$q = new WP_Query($queryArgs);
$allProducts = [];
$familyCounts = [];
$profileCounts = ['straight' => 0, 'curved' => 0, 'angled' => 0];
$gradeCounts = ['standard' => 0, 'tc' => 0, 'supercut' => 0];
$lengthCounts = ['small' => 0, 'medium' => 0, 'large' => 0, 'xlarge' => 0];

if ($q->have_posts()) {
    while ($q->have_posts()) {
        $q->the_post();
        $p = wc_get_product(get_the_ID());
        if (! $p instanceof WC_Product) {
            continue;
        }

        $pTitle = strtolower($p->get_name());
        $pSku = strtolower(rosa_preview_product_reference($p));
        $pDesc = strtolower($p->get_short_description() . ' ' . $p->get_description());

        // Extract family slug
        $pTerms = wc_get_product_terms($p->get_id(), 'product_cat');
        $pFamilySlug = (! empty($pTerms) && ! is_wp_error($pTerms)) ? $pTerms[0]->slug : 'other';
        $familyCounts[$pFamilySlug] = ($familyCounts[$pFamilySlug] ?? 0) + 1;

        // Profile / Curvature
        if (str_contains($pTitle, 'curv') || str_contains($pDesc, 'curv') || str_contains($pTitle, 'منحن')) {
            $pProfile = 'curved';
        } elseif (str_contains($pTitle, 'angle') || str_contains($pDesc, 'angle') || str_contains($pTitle, 'زاو')) {
            $pProfile = 'angled';
        } else {
            $pProfile = 'straight';
        }
        $profileCounts[$pProfile]++;

        // Grade / Material
        if (str_contains($pTitle, 'tc') || str_contains($pSku, 'tc') || str_contains($pDesc, 'tungsten') || str_contains($pTitle, 'كربيد')) {
            $pGrade = 'tc';
        } elseif (str_contains($pTitle, 'supercut') || str_contains($pSku, 'sc') || str_contains($pTitle, 'سوبر')) {
            $pGrade = 'supercut';
        } else {
            $pGrade = 'standard';
        }
        $gradeCounts[$pGrade]++;

        // Length / Reach
        preg_match('/(\d+(?:\.\d+)?)\s*(?:cm|سم)/iu', $pTitle . ' ' . $pDesc, $matches);
        $lengthVal = ! empty($matches[1]) ? (float) $matches[1] : 14.0;
        if ($lengthVal < 12.0) {
            $pLength = 'small';
        } elseif ($lengthVal <= 16.0) {
            $pLength = 'medium';
        } elseif ($lengthVal <= 20.0) {
            $pLength = 'large';
        } else {
            $pLength = 'xlarge';
        }
        $lengthCounts[$pLength]++;

        $allProducts[] = [
            'product' => $p,
            'family' => $pFamilySlug,
            'profile' => $pProfile,
            'grade' => $pGrade,
            'length' => $pLength,
        ];
    }
    wp_reset_postdata();
}
?>
<section class="rosa-preview-shop-hero rosa-live-shop-hero" data-preview-shop-hero>
  <div class="rosa-preview-rail rosa-live-shop-hero__inner">
    <p class="rosa-preview-eyebrow"><?php echo esc_html($c('hero_eyebrow', 'ROSA', 'ROSA')); ?></p>
    <h1><?php echo esc_html($heroTitle); ?></h1>
    <p><?php echo esc_html($c('hero_body', 'Search Rosa instrument families and catalogue references.', 'ابحث في فئات أدوات روزا ومراجع الكتالوج.')); ?></p>
    <form class="rosa-live-shop-search rosa-preview-shop-search" role="search" method="get" action="<?php echo esc_url($shopUrl); ?>">
      <label class="screen-reader-text" for="rosa-live-shop-search"><?php echo esc_html($c('search_label', 'Search products', 'البحث في المنتجات')); ?></label>
      <input id="rosa-live-shop-search" name="s" type="search" value="<?php echo esc_attr($search); ?>" placeholder="<?php echo esc_attr($c('search_label', 'Search products', 'البحث في المنتجات')); ?>" autocomplete="off">
      <?php if ($locale === 'en') : ?><input type="hidden" name="post_type" value="product"><?php endif; ?>
      <button type="submit" class="rosa-preview-button rosa-preview-button--accent"><?php echo esc_html($c('search_button', 'Search', 'بحث')); ?></button>
    </form>
  </div>
</section>

<!-- Amazon-Style 2-Column Catalogue Layout -->
<div class="rosa-shop-container rosa-preview-rail">

  <!-- Mobile Filter Toggle Button -->
  <button type="button" class="rosa-shop-filter-toggle" data-rosa-filter-toggle aria-expanded="false" aria-controls="rosa-shop-filters">
    <svg class="rosa-shop-filter-toggle__icon" aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M4 7h10m4 0h2M4 17h3m4 0h9M14 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM9 15a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/></svg>
    <span><?php echo esc_html($locale === 'ar' ? 'تصفية وترتيب الأدوات' : 'Filter & Sort'); ?></span>
    <span class="rosa-filter-count-badge" data-rosa-active-count hidden>0</span>
  </button>

  <!-- Left Sidebar Filters -->
  <aside id="rosa-shop-filters" class="rosa-shop-sidebar" data-rosa-shop-sidebar aria-labelledby="rosa-shop-filters-title">
    <div class="rosa-shop-sidebar__header">
      <h3 id="rosa-shop-filters-title"><?php echo esc_html($locale === 'ar' ? 'تصفية الكتالوج' : 'Filter Catalogue'); ?></h3>
      <button type="button" class="rosa-shop-sidebar__close" data-rosa-filter-close aria-label="<?php echo esc_attr($locale === 'ar' ? 'إغلاق الفلاتر' : 'Close filters'); ?>">×</button>
    </div>

    <!-- Active Filter Chips -->
    <div class="rosa-active-filters" data-rosa-active-filters hidden>
      <div class="rosa-active-filters__header">
        <span><?php echo esc_html($locale === 'ar' ? 'الفلاتر النشطة' : 'Active Filters'); ?></span>
        <button type="button" class="rosa-clear-all-btn" data-rosa-clear-filters><?php echo esc_html($locale === 'ar' ? 'مسح الكل' : 'Clear All'); ?></button>
      </div>
      <div class="rosa-active-filters__chips" data-rosa-filter-chips></div>
    </div>

    <!-- Filter Group 1: Families -->
    <div class="rosa-filter-group" data-filter-group="family">
      <h4 class="rosa-filter-group__title"><?php echo esc_html($locale === 'ar' ? 'فئات الأدوات' : 'Instrument Family'); ?></h4>
      <div class="rosa-filter-group__options">
        <label class="rosa-filter-option">
          <input type="radio" name="filter_family" value="all" checked data-filter="family">
          <span class="rosa-filter-option__name"><?php echo esc_html($locale === 'ar' ? 'جميع الفئات' : 'All Families'); ?></span>
          <span class="rosa-filter-option__count">(<?php echo count($allProducts); ?>)</span>
        </label>
        <?php foreach ($allFamilies as $f) :
          $navLabel = $f instanceof \RosaMedical\Core\Catalogue\FamilyModel ? $f->getDisplayName($locale) : $f->name;
          $count = $familyCounts[$f->slug] ?? 0;
        ?>
          <label class="rosa-filter-option" data-family-option="<?php echo esc_attr($f->slug); ?>">
            <input type="radio" name="filter_family" value="<?php echo esc_attr($f->slug); ?>" data-filter="family">
            <span class="rosa-filter-option__name"><?php echo esc_html($navLabel); ?></span>
            <span class="rosa-filter-option__count" data-count-family="<?php echo esc_attr($f->slug); ?>">(<?php echo $count; ?>)</span>
          </label>
        <?php endforeach; ?>
      </div>
    </div>

    <!-- Filter Group 2: Profile / Curvature -->
    <div class="rosa-filter-group" data-filter-group="profile">
      <h4 class="rosa-filter-group__title"><?php echo esc_html($locale === 'ar' ? 'انحناء وشكل الشفرة' : 'Profile / Curvature'); ?></h4>
      <div class="rosa-filter-group__options">
        <label class="rosa-filter-option">
          <input type="checkbox" name="filter_profile" value="straight" data-filter="profile">
          <span class="rosa-filter-option__name"><?php echo esc_html($locale === 'ar' ? 'مستقيم (Straight)' : 'Straight'); ?></span>
          <span class="rosa-filter-option__count" data-count-profile="straight">(<?php echo $profileCounts['straight']; ?>)</span>
        </label>
        <label class="rosa-filter-option">
          <input type="checkbox" name="filter_profile" value="curved" data-filter="profile">
          <span class="rosa-filter-option__name"><?php echo esc_html($locale === 'ar' ? 'منحني (Curved)' : 'Curved'); ?></span>
          <span class="rosa-filter-option__count" data-count-profile="curved">(<?php echo $profileCounts['curved']; ?>)</span>
        </label>
        <label class="rosa-filter-option">
          <input type="checkbox" name="filter_profile" value="angled" data-filter="profile">
          <span class="rosa-filter-option__name"><?php echo esc_html($locale === 'ar' ? 'بزاوية (Angled)' : 'Angled'); ?></span>
          <span class="rosa-filter-option__count" data-count-profile="angled">(<?php echo $profileCounts['angled']; ?>)</span>
        </label>
      </div>
    </div>

    <!-- Filter Group 3: Grade / Feature -->
    <div class="rosa-filter-group" data-filter-group="grade">
      <h4 class="rosa-filter-group__title"><?php echo esc_html($locale === 'ar' ? 'مواصفات وخامات الأداة' : 'Feature / Grade'); ?></h4>
      <div class="rosa-filter-group__options">
        <label class="rosa-filter-option">
          <input type="checkbox" name="filter_grade" value="standard" data-filter="grade">
          <span class="rosa-filter-option__name"><?php echo esc_html($locale === 'ar' ? 'فولاذ قياسي (Standard)' : 'Standard Surgical Steel'); ?></span>
          <span class="rosa-filter-option__count" data-count-grade="standard">(<?php echo $gradeCounts['standard']; ?>)</span>
        </label>
        <label class="rosa-filter-option">
          <input type="checkbox" name="filter_grade" value="tc" data-filter="grade">
          <span class="rosa-filter-option__name"><?php echo esc_html($locale === 'ar' ? 'تنجستن كاربايد (TC / Gold)' : 'Tungsten Carbide (TC)'); ?></span>
          <span class="rosa-filter-option__count" data-count-grade="tc">(<?php echo $gradeCounts['tc']; ?>)</span>
        </label>
        <label class="rosa-filter-option">
          <input type="checkbox" name="filter_grade" value="supercut" data-filter="grade">
          <span class="rosa-filter-option__name"><?php echo esc_html($locale === 'ar' ? 'سوبركت فائق الحدة (Supercut)' : 'Supercut (Black Handles)'); ?></span>
          <span class="rosa-filter-option__count" data-count-grade="supercut">(<?php echo $gradeCounts['supercut']; ?>)</span>
        </label>
      </div>
    </div>

    <!-- Filter Group 4: Length / Reach -->
    <div class="rosa-filter-group" data-filter-group="length">
      <h4 class="rosa-filter-group__title"><?php echo esc_html($locale === 'ar' ? 'الطول والمدى' : 'Length / Reach'); ?></h4>
      <div class="rosa-filter-group__options">
        <label class="rosa-filter-option">
          <input type="checkbox" name="filter_length" value="small" data-filter="length">
          <span class="rosa-filter-option__name">< 12 cm</span>
          <span class="rosa-filter-option__count" data-count-length="small">(<?php echo $lengthCounts['small']; ?>)</span>
        </label>
        <label class="rosa-filter-option">
          <input type="checkbox" name="filter_length" value="medium" data-filter="length">
          <span class="rosa-filter-option__name">12 – 16 cm</span>
          <span class="rosa-filter-option__count" data-count-length="medium">(<?php echo $lengthCounts['medium']; ?>)</span>
        </label>
        <label class="rosa-filter-option">
          <input type="checkbox" name="filter_length" value="large" data-filter="length">
          <span class="rosa-filter-option__name">17 – 20 cm</span>
          <span class="rosa-filter-option__count" data-count-length="large">(<?php echo $lengthCounts['large']; ?>)</span>
        </label>
        <label class="rosa-filter-option">
          <input type="checkbox" name="filter_length" value="xlarge" data-filter="length">
          <span class="rosa-filter-option__name">> 20 cm</span>
          <span class="rosa-filter-option__count" data-count-length="xlarge">(<?php echo $lengthCounts['xlarge']; ?>)</span>
        </label>
      </div>
    </div>
  </aside>

  <!-- Right Main Products Area -->
  <section class="rosa-shop-main" aria-label="<?php echo esc_attr($locale === 'ar' ? 'نتائج الكتالوج' : 'Catalogue results'); ?>">
    <div class="rosa-shop-toolbar">
      <div class="rosa-shop-results-info">
        <span class="rosa-shop-count-label" data-rosa-results-count>
          <?php echo esc_html(sprintf(
            $locale === 'ar' ? 'عرض %d منتج' : 'Showing %d instruments',
            count($allProducts)
          )); ?>
        </span>
      </div>
      <div class="rosa-shop-sort-wrap">
        <label for="rosa-shop-sort" class="screen-reader-text"><?php echo esc_html($locale === 'ar' ? 'ترتيب حسب' : 'Sort by'); ?></label>
        <select id="rosa-shop-sort" class="rosa-shop-sort-select" data-rosa-sort aria-label="<?php echo esc_attr($locale === 'ar' ? 'ترتيب حسب' : 'Sort by'); ?>">
          <option value="featured"><?php echo esc_html($locale === 'ar' ? 'الترتيب الافتراضي' : 'Featured Catalogue Order'); ?></option>
          <option value="alpha-asc"><?php echo esc_html($locale === 'ar' ? 'الاسم: أ إلى ي' : 'Name: A to Z'); ?></option>
          <option value="alpha-desc"><?php echo esc_html($locale === 'ar' ? 'الاسم: ي إلى أ' : 'Name: Z to A'); ?></option>
          <option value="sku"><?php echo esc_html($locale === 'ar' ? 'رمز الكتالوج / SKU' : 'Catalogue Reference / SKU'); ?></option>
        </select>
      </div>
    </div>

    <!-- Product Grid: 4-Columns on Desktop -->
    <div class="rosa-shop-products-grid" data-rosa-products-grid data-preview-shop-grid>
      <?php foreach ($allProducts as $item) :
        $prod = $item['product'];
      ?>
        <div class="rosa-shop-grid-item"
             data-product-card-wrap
             data-family="<?php echo esc_attr($item['family']); ?>"
             data-profile="<?php echo esc_attr($item['profile']); ?>"
             data-grade="<?php echo esc_attr($item['grade']); ?>"
             data-length="<?php echo esc_attr($item['length']); ?>"
             data-name="<?php echo esc_attr(strtolower($prod->get_name())); ?>"
             data-sku="<?php echo esc_attr(strtolower(rosa_preview_product_reference($prod))); ?>">
          <?php get_template_part('template-parts/client-preview/product-card', null, [
            'product' => $prod,
            'locale' => $locale,
          ]); ?>
        </div>
      <?php endforeach; ?>
    </div>

    <!-- Empty State -->
    <div class="rosa-shop-empty" data-rosa-empty-state <?php echo count($allProducts) > 0 ? 'hidden' : ''; ?>>
      <div class="rosa-shop-empty__card">
        <p class="rosa-shop-empty__msg"><?php echo esc_html($locale === 'ar' ? 'لا توجد أدوات تطابق الفلاتر المحددة.' : 'No instruments match the selected filters.'); ?></p>
        <button type="button" class="rosa-preview-button rosa-preview-button--secondary" data-rosa-clear-filters>
          <?php echo esc_html($locale === 'ar' ? 'إعادة تعيين الفلاتر' : 'Clear All Filters'); ?>
        </button>
      </div>
    </div>
  </section>
</div>
