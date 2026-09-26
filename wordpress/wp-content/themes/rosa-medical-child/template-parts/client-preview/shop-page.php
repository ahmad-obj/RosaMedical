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

// If no families found through service (e.g. plugin inactive fallback), query terms directly
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

// Query products grouped by family
$activeFamilySections = [];
$totalProductsFound = 0;

foreach ($allFamilies as $family) {
    $queryArgs = [
        'post_type' => 'product',
        'post_status' => 'publish',
        'posts_per_page' => 100,
        'tax_query' => [
            [
                'taxonomy' => 'product_cat',
                'field' => 'term_id',
                'terms' => $family->id,
            ],
        ],
        'orderby' => [
            'menu_order' => 'ASC',
            'title' => 'ASC',
        ],
    ];

    if ($search !== '') {
        $queryArgs['s'] = $search;
    }

    $q = new WP_Query($queryArgs);
    $products = [];
    if ($q->have_posts()) {
        while ($q->have_posts()) {
            $q->the_post();
            $product = wc_get_product(get_the_ID());
            if ($product instanceof WC_Product) {
                $products[] = $product;
            }
        }
        wp_reset_postdata();
    }

    if (! empty($products)) {
        $activeFamilySections[] = [
            'family' => $family,
            'products' => $products,
        ];
        $totalProductsFound += count($products);
    }
}

$workflow = $locale === 'ar'
    ? [
        ['01', 'حدد فئة الأداة', 'ابدأ بنوع الأداة أو الفئة التي تحتاجها.'],
        ['02', 'شارك المرجع', 'أرسل رمز الكتالوج أو التكوين المتاح لديك.'],
        ['03', 'اطلب عرض سعر', 'تواصل مع روزا للحصول على دعم التوريد.'],
    ]
    : [
        ['01', 'Identify the family', 'Start with the instrument type or family you need.'],
        ['02', 'Share the reference', 'Send the catalogue code or configuration you already have.'],
        ['03', 'Request a quotation', 'Contact Rosa for clear procurement support.'],
    ];
?>
<section class="rosa-preview-shop-hero rosa-live-shop-hero" data-preview-shop-hero>
  <div class="rosa-preview-rail rosa-live-shop-hero__inner">
    <p class="rosa-preview-eyebrow"><?php echo esc_html($c('hero_eyebrow', 'ROSA', 'ROSA')); ?></p>
    <h1><?php echo esc_html($heroTitle); ?></h1>
    <p><?php echo esc_html($c('hero_body', 'Search Rosa instrument families and catalogue references.', 'ابحث في فئات أدوات روزا ومراجع الكتالوج.')); ?></p>
    <form class="rosa-live-shop-search" role="search" method="get" action="<?php echo esc_url($shopUrl); ?>">
      <label class="screen-reader-text" for="rosa-live-shop-search"><?php echo esc_html($c('search_label', 'Search products', 'البحث في المنتجات')); ?></label>
      <input id="rosa-live-shop-search" name="s" type="search" value="<?php echo esc_attr($search); ?>" placeholder="<?php echo esc_attr($c('search_label', 'Search products', 'البحث في المنتجات')); ?>">
      <?php if ($locale === 'en') : ?><input type="hidden" name="post_type" value="product"><?php endif; ?>
      <button type="submit" class="rosa-preview-button rosa-preview-button--accent"><?php echo esc_html($c('search_button', 'Search', 'بحث')); ?></button>
    </form>
  </div>
</section>

<?php if (! empty($activeFamilySections)) : ?>
  <!-- Compact Sticky Family Navigation -->
  <nav class="rosa-catalogue-anchor-nav" aria-label="<?php echo esc_attr($locale === 'ar' ? 'التنقل بين عائلات الكتالوج' : 'Catalogue family navigation'); ?>">
    <div class="rosa-preview-rail rosa-catalogue-anchor-nav__inner">
      <ul class="rosa-catalogue-anchor-nav__list">
        <?php foreach ($activeFamilySections as $section) :
            $f = $section['family'];
            $navLabel = $f instanceof \RosaMedical\Core\Catalogue\FamilyModel ? $f->getDisplayName($locale) : $f->name;
        ?>
          <li>
            <a href="#family-<?php echo esc_attr($f->slug); ?>" class="rosa-catalogue-anchor-nav__link">
              <?php echo esc_html($navLabel); ?>
              <span class="rosa-catalogue-anchor-nav__count">(<?php echo count($section['products']); ?>)</span>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </nav>
<?php endif; ?>

<div class="rosa-live-shop-catalogue" aria-labelledby="rosa-live-shop-catalogue-title">
  <div class="rosa-preview-rail">
    <div class="rosa-live-shop-heading">
      <div>
        <p class="rosa-preview-eyebrow"><?php echo esc_html($locale === 'ar' ? 'كتالوج روزا' : 'ROSA CATALOGUE'); ?></p>
        <h2 id="rosa-live-shop-catalogue-title">
          <?php
          if ($search !== '') {
              echo esc_html(sprintf(
                  $locale === 'ar' ? 'نتائج البحث عن: "%s" (%d منتج)' : 'Search results for: "%s" (%d products)',
                  $search,
                  $totalProductsFound
              ));
          } else {
              echo esc_html($locale === 'ar' ? 'استكشف الأدوات حسب الفئة والمرجع' : 'Explore instruments by family and reference');
          }
          ?>
        </h2>
      </div>
      <p><?php echo esc_html($locale === 'ar' ? 'استخدم اسم الأداة أو مرجع الكتالوج للوصول إلى التكوين المطلوب.' : 'Use the instrument name or catalogue reference to find the configuration you need.'); ?></p>
    </div>

    <?php if (empty($activeFamilySections)) : ?>
      <div class="rosa-preview-shop-empty-wrap" style="padding: 4rem 1rem; text-align: center;">
        <p class="rosa-preview-shop-empty">
          <?php echo esc_html($search !== ''
              ? ($locale === 'ar' ? 'لم يتم العثور على أي منتجات مطابقة لبحثك.' : 'No products matched your search.')
              : $c('empty_state', 'No products matched this view.', 'لا توجد منتجات متاحة في هذه المعاينة.')
          ); ?>
        </p>
        <?php if ($search !== '') : ?>
          <a href="<?php echo esc_url($shopUrl); ?>" class="rosa-preview-button rosa-preview-button--secondary" style="margin-top: 1rem; display: inline-block;">
            <?php echo esc_html($locale === 'ar' ? 'عرض الكتالوج بالكامل' : 'View Full Catalogue'); ?>
          </a>
        <?php endif; ?>
      </div>
    <?php else : ?>
      <?php foreach ($activeFamilySections as $section) :
          $family = $section['family'];
          $products = $section['products'];
          $displayName = $family instanceof \RosaMedical\Core\Catalogue\FamilyModel ? $family->getDisplayName($locale) : $family->name;
          $displayDesc = $family instanceof \RosaMedical\Core\Catalogue\FamilyModel ? $family->getDescription($locale) : $family->description;
      ?>
        <section class="rosa-catalogue-family-section" id="family-<?php echo esc_attr($family->slug); ?>" data-family="<?php echo esc_attr($family->slug); ?>">
          <div class="rosa-catalogue-family-header">
            <div class="rosa-catalogue-family-header__info">
              <p class="rosa-preview-eyebrow"><?php echo esc_html($locale === 'ar' ? 'عائلة الأدوات' : 'INSTRUMENT FAMILY'); ?></p>
              <h3 class="rosa-catalogue-family-title"><?php echo esc_html($displayName); ?></h3>
              <?php if (! empty($displayDesc)) : ?>
                <p class="rosa-catalogue-family-desc"><?php echo esc_html($displayDesc); ?></p>
              <?php endif; ?>
            </div>
            <?php if (! empty($family->pdfUrl)) : ?>
              <div class="rosa-catalogue-family-header__actions">
                <a href="<?php echo esc_url($family->pdfUrl); ?>" target="_blank" rel="noopener noreferrer" class="rosa-preview-button rosa-preview-button--secondary rosa-catalogue-pdf-button">
                  <span class="dashicons dashicons-pdf" aria-hidden="true" style="vertical-align: text-bottom; margin-inline-end: 4px;"></span>
                  <?php echo esc_html(sprintf(
                      $locale === 'ar' ? 'تحميل كتالوج %s (PDF)' : 'Download %s Catalogue (PDF)',
                      $displayName
                  )); ?>
                </a>
              </div>
            <?php endif; ?>
          </div>

          <div class="rosa-preview-shop-grid rosa-live-shop-grid" data-preview-shop-grid>
            <?php foreach ($products as $product) : ?>
              <?php get_template_part('template-parts/client-preview/product-card', null, ['product' => $product, 'locale' => $locale]); ?>
            <?php endforeach; ?>
          </div>
        </section>
      <?php endforeach; ?>
    <?php endif; ?>
  </div>
</div>

<section class="rosa-live-shop-workflow" data-preview-shop-workflow>
  <div class="rosa-preview-rail rosa-live-shop-workflow__layout">
    <div class="rosa-live-shop-workflow__intro">
      <p class="rosa-preview-eyebrow" style="color:#fff"><?php echo esc_html($locale === 'ar' ? 'مسار واضح' : 'A CLEAR WORKFLOW'); ?></p>
      <h2 style="color:#fff"><?php echo esc_html($locale === 'ar' ? 'حوّل احتياجك للأداة إلى طلب توريد واضح.' : 'Turn an instrument need into a clear procurement request.'); ?></h2>
      <p style="color:#fff"><?php echo esc_html($locale === 'ar' ? 'ثلاث خطوات تساعد فريق روزا على فهم ما تحتاجه بسرعة.' : 'Three simple steps help the Rosa team understand exactly what you need.'); ?></p>
    </div>
    <div class="rosa-live-shop-workflow__steps">
      <?php foreach ($workflow as [$number, $title, $body]) : ?>
        <article><span><?php echo esc_html($number); ?></span><div><h3><?php echo esc_html($title); ?></h3><p><?php echo esc_html($body); ?></p></div></article>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="rosa-live-shop-support" data-preview-shop-support>
  <div class="rosa-preview-rail rosa-live-shop-support__layout">
    <div class="rosa-live-shop-support__intro">
      <p class="rosa-preview-eyebrow"><?php echo esc_html($locale === 'ar' ? 'دعم التوريد' : 'PROCUREMENT SUPPORT'); ?></p>
      <h2><?php echo esc_html($locale === 'ar' ? 'دعم واضح من الكتالوج إلى طلب عرض السعر' : 'Clear support from catalogue discovery to quotation'); ?></h2>
      <?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'home-why-01', 'label' => $locale === 'ar' ? 'دعم توريد أدوات روزا' : 'Rosa instrument procurement']); ?>
    </div>
    <div class="rosa-live-shop-support__grid">
      <article><span>01</span><div><h3><?php echo esc_html($locale === 'ar' ? 'مراجع واضحة' : 'Clear references'); ?></h3><p><?php echo esc_html($locale === 'ar' ? 'استخدم أسماء الفئات وأكواد الكتالوج عند تحديد احتياجك.' : 'Use family names and catalogue codes when identifying your requirement.'); ?></p></div></article>
      <article><span>02</span><div><h3><?php echo esc_html($locale === 'ar' ? 'تكوينات دقيقة' : 'Exact configurations'); ?></h3><p><?php echo esc_html($locale === 'ar' ? 'راجع الخيارات المتاحة للأداة قبل إرسال الطلب.' : 'Review the available instrument options before sending your request.'); ?></p></div></article>
      <article><span>03</span><div><h3><?php echo esc_html($locale === 'ar' ? 'تواصل مباشر' : 'Direct support'); ?></h3><p><?php echo esc_html($locale === 'ar' ? 'شارك متطلباتك مع فريق روزا للحصول على دعم عرض السعر.' : 'Share your requirements with the Rosa team for quotation support.'); ?></p></article>
    </div>
  </div>
</section>
