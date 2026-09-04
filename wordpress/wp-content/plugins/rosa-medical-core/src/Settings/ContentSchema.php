<?php

declare(strict_types=1);

namespace RosaMedical\Core\Settings;

final class ContentSchema
{
    /** @return array<string, array{option:string,title:string,groups:array<string,list<string>>,fields:array<string,array{type:string,en:string,ar:string}>}> */
    public static function sections(): array
    {
        return [
            'site' => [
                'option' => 'rosa_site_content',
                'title' => 'Site & CTA',
                'groups' => [
                    'Header' => ['announcement_text', 'nav_home', 'nav_about', 'nav_shop', 'nav_contact', 'nav_inquiry'],
                    'Footer' => ['footer_description', 'footer_company_heading', 'footer_about_label', 'footer_contact_label', 'footer_products_label', 'footer_support_heading', 'footer_touch_heading', 'footer_bottom_location'],
                    'Shared labels' => ['request_quote', 'price_request', 'view_details', 'catalogue_family', 'medical_instrument', 'browse_family'],
                    'Pre-footer CTA' => ['cta_title', 'cta_body', 'cta_action_1', 'cta_action_2'],
                ],
                'fields' => [
                    'announcement_text' => self::field('text', 'Catalogue and quotation support', 'دعم الكتالوج وطلبات عروض الأسعار'),
                    'nav_home' => self::field('text', 'Home', 'الرئيسية'),
                    'nav_about' => self::field('text', 'About us', 'من نحن'),
                    'nav_shop' => self::field('text', 'Shop', 'المنتجات'),
                    'nav_contact' => self::field('text', 'Contact us', 'اتصل بنا'),
                    'nav_inquiry' => self::field('text', 'Inquiry', 'الاستفسار'),
                    'footer_description' => self::field('textarea', 'Medical and surgical instruments with clear catalogue and quotation support.', 'أدوات طبية وجراحية مع دعم واضح للكتالوج وطلبات عروض الأسعار.'),
                    'footer_company_heading' => self::field('text', 'Company', 'الشركة'),
                    'footer_about_label' => self::field('text', 'About us', 'من نحن'),
                    'footer_contact_label' => self::field('text', 'Contact us', 'اتصل بنا'),
                    'footer_products_label' => self::field('text', 'Products', 'المنتجات'),
                    'footer_support_heading' => self::field('text', 'Support', 'الدعم'),
                    'footer_touch_heading' => self::field('text', 'Get in touch', 'تواصل معنا'),
                    'footer_bottom_location' => self::field('text', 'Riyadh, Saudi Arabia', 'الرياض، المملكة العربية السعودية'),
                    'request_quote' => self::field('text', 'Request a quote', 'اطلب عرض سعر'),
                    'price_request' => self::field('text', 'Price on request', 'السعر عند الطلب'),
                    'view_details' => self::field('text', 'View details', 'عرض التفاصيل'),
                    'catalogue_family' => self::field('text', 'Catalogue family', 'فئة كتالوج'),
                    'medical_instrument' => self::field('text', 'Medical instrument', 'أداة طبية'),
                    'browse_family' => self::field('text', 'Browse family', 'تصفح الفئة'),
                    'cta_title' => self::field('text', 'Need an instrument reference or quotation?', 'هل تحتاج إلى مرجع أداة أو عرض سعر؟'),
                    'cta_body' => self::field('textarea', 'Share the family and any available reference with the Rosa team.', 'شارك الفئة والمرجع المتاح وسيساعدك فريق روزا.'),
                    'cta_action_1' => self::field('text', 'Choose a family', 'اختر الفئة'),
                    'cta_action_2' => self::field('text', 'Add a reference', 'أضف المرجع'),
                ],
            ],
            'home' => [
                'option' => 'rosa_home_content',
                'title' => 'Homepage',
                'groups' => [
                    'Hero' => ['hero_eyebrow', 'hero_title', 'hero_body', 'hero_button'],
                    'Who We Are' => [
                        'who_eyebrow', 'who_title', 'who_body', 'who_button',
                        'stat_1_value', 'stat_1_label', 'stat_2_value', 'stat_2_label', 'stat_3_value', 'stat_3_label',
                    ],
                    'Featured Products' => [
                        'featured_title',
                        'benefit_1_title', 'benefit_1_body',
                        'benefit_2_title', 'benefit_2_body',
                        'benefit_3_title', 'benefit_3_body',
                    ],
                    'Feature Banner' => ['feature_eyebrow', 'feature_title', 'feature_body', 'feature_button'],
                    'Latest Products' => ['latest_title'],
                    'Promotions' => [
                        'promo_1_title', 'promo_1_body', 'promo_2_title', 'promo_2_body',
                        'promo_3_title', 'promo_3_body', 'promo_4_title', 'promo_4_body',
                    ],
                    'Why Rosa' => [
                        'why_eyebrow', 'why_title',
                        'why_1_title', 'why_1_body', 'why_2_title', 'why_2_body', 'why_3_title', 'why_3_body',
                    ],
                    'Proof Labels' => ['proof_1', 'proof_2', 'proof_3', 'proof_4', 'proof_5', 'proof_6'],
                    'Evidence' => [
                        'evidence_eyebrow', 'evidence_title', 'evidence_body',
                        'evidence_1_title', 'evidence_1_body',
                        'evidence_2_title', 'evidence_2_body',
                        'evidence_3_title', 'evidence_3_body',
                    ],
                ],
                'fields' => [
                    'hero_eyebrow' => self::field('text', 'Rosa Medical', 'روزا ميديكال'),
                    'hero_title' => self::field('text', 'Surgical instruments for professional procurement.', 'أدوات جراحية مخصصة لاحتياجات التوريد المهني.'),
                    'hero_body' => self::field('textarea', 'Explore Rosa instrument families and contact our team for catalogue and quotation support.', 'استكشف فئات أدوات روزا وتواصل مع فريقنا للحصول على الكتالوج ودعم عروض الأسعار.'),
                    'hero_button' => self::field('text', 'Browse products', 'تصفح المنتجات'),

                    'who_eyebrow' => self::field('text', 'Who we are', 'من نحن'),
                    'who_title' => self::field('text', 'Expect more than an instrument catalogue.', 'توقع شريكًا يركز على تفاصيل الأدوات.'),
                    'who_body' => self::field('textarea', 'Rosa helps professional buyers identify instrument families, confirm catalogue references and prepare a clear quotation request.', 'نساعد المشترين على استكشاف فئات الأدوات ومراجع الكتالوج والتواصل للحصول على دعم التوريد.'),
                    'who_button' => self::field('text', 'Discover Rosa', 'تعرف علينا'),
                    'stat_1_value' => self::field('text', '5', '5'),
                    'stat_1_label' => self::field('text', 'Product families', 'فئات منتجات'),
                    'stat_2_value' => self::field('text', '5', '5'),
                    'stat_2_label' => self::field('text', 'Catalogue PDFs', 'كتالوجات'),
                    'stat_3_value' => self::field('text', '2', '2'),
                    'stat_3_label' => self::field('text', 'Preview languages', 'لغات للمعاينة'),

                    'featured_title' => self::field('text', 'Featured Products', 'منتجات مختارة'),
                    'benefit_1_title' => self::field('text', 'Catalogue support', 'دعم الكتالوج'),
                    'benefit_1_body' => self::field('textarea', 'Identify the right reference', 'حدد المرجع الصحيح'),
                    'benefit_2_title' => self::field('text', 'Quotation route', 'عرض السعر'),
                    'benefit_2_body' => self::field('textarea', 'Ask about price and supply', 'اسأل عن السعر والتوريد'),
                    'benefit_3_title' => self::field('text', 'Five families', 'خمس فئات'),
                    'benefit_3_body' => self::field('textarea', 'Browse instrument ranges', 'تصفح عائلات الأدوات'),

                    'feature_eyebrow' => self::field('text', 'Procurement support', 'دعم التوريد'),
                    'feature_title' => self::field('text', 'From catalogue reference to a clear quotation request.', 'من مرجع الكتالوج إلى طلب عرض سعر واضح.'),
                    'feature_body' => self::field('textarea', 'Browse instruments by family and share the exact references your procurement team needs.', 'استكشف الأدوات حسب الفئة وشارك المراجع المطلوبة مع فريق روزا.'),
                    'feature_button' => self::field('text', 'Contact us', 'اتصل بنا'),

                    'latest_title' => self::field('text', 'Latest Products', 'أحدث المنتجات'),

                    'promo_1_title' => self::field('text', 'Surgical knives', 'السكاكين الجراحية'),
                    'promo_1_body' => self::field('text', 'Browse family references', 'تصفح مراجع الفئة'),
                    'promo_2_title' => self::field('text', 'Precision scissors', 'مقصات دقيقة'),
                    'promo_2_body' => self::field('text', 'Straight and curved options', 'خيارات مستقيمة ومنحنية'),
                    'promo_3_title' => self::field('text', 'Punches and chisels', 'المثاقب والأزاميل'),
                    'promo_3_body' => self::field('text', 'Identify the instrument needed', 'حدد الأداة المطلوبة'),
                    'promo_4_title' => self::field('text', 'Five instrument catalogues', 'خمسة كتالوجات للأدوات'),
                    'promo_4_body' => self::field('text', 'Start with the right family', 'ابدأ من الفئة المناسبة'),

                    'why_eyebrow' => self::field('text', 'ROSA', 'ROSA'),
                    'why_title' => self::field('text', 'Support built around instrument procurement', 'دعم يركز على احتياجات توريد الأدوات'),
                    'why_1_title' => self::field('text', 'Clear references', 'مراجع واضحة'),
                    'why_1_body' => self::field('textarea', 'Work with family names and product references.', 'استخدم أسماء الفئات ومراجع المنتجات.'),
                    'why_2_title' => self::field('text', 'Exact configurations', 'تكوينات دقيقة'),
                    'why_2_body' => self::field('textarea', 'Review the real options available for each instrument.', 'راجع الخيارات الفعلية لكل أداة.'),
                    'why_3_title' => self::field('text', 'Direct support', 'تواصل مباشر'),
                    'why_3_body' => self::field('textarea', 'Share requirements for quotation support.', 'شارك متطلباتك لطلب عرض سعر.'),

                    'proof_1' => self::field('text', 'Knives', 'السكاكين'),
                    'proof_2' => self::field('text', 'Scissors', 'المقصات'),
                    'proof_3' => self::field('text', 'Punches', 'المثاقب'),
                    'proof_4' => self::field('text', 'Chisels', 'الأزاميل'),
                    'proof_5' => self::field('text', 'Cutters', 'القواطع'),
                    'proof_6' => self::field('text', 'Catalogues', 'الكتالوجات'),

                    'evidence_eyebrow' => self::field('text', 'A clear workflow', 'مسار واضح'),
                    'evidence_title' => self::field('text', 'Turn an instrument need into a clear procurement request.', 'حوّل احتياجك إلى طلب توريد واضح.'),
                    'evidence_body' => self::field('textarea', 'Three simple steps help our team understand exactly what you need.', 'ثلاث خطوات بسيطة تساعد فريقنا على فهم ما تحتاجه.'),
                    'evidence_1_title' => self::field('text', 'Identify the family', 'حدد الفئة'),
                    'evidence_1_body' => self::field('textarea', 'Start with the instrument type you need.', 'ابدأ بنوع الأداة المطلوبة.'),
                    'evidence_2_title' => self::field('text', 'Share the reference', 'شارك المرجع'),
                    'evidence_2_body' => self::field('textarea', 'Send the available code or configuration.', 'أرسل الرمز أو التكوين المتاح.'),
                    'evidence_3_title' => self::field('text', 'Request a quotation', 'اطلب عرض سعر'),
                    'evidence_3_body' => self::field('textarea', 'Contact Rosa for procurement support.', 'تواصل مع فريق روزا للتوريد.'),
                ],
            ],
            'about' => [
                'option' => 'rosa_about_content',
                'title' => 'About',
                'groups' => [
                    'Page Hero' => ['page_eyebrow', 'page_title', 'page_body'],
                    'Who We Are' => ['who_eyebrow', 'who_title', 'who_body'],
                    'Statistics' => ['stat_1_value', 'stat_1_label', 'stat_2_value', 'stat_2_label', 'stat_3_value', 'stat_3_label'],
                    'Information Cards' => ['card_1_title', 'card_1_body', 'card_1_cta', 'card_2_title', 'card_2_body', 'card_2_cta', 'card_3_title', 'card_3_body', 'card_3_cta'],
                    'Feature Banner' => ['feature_eyebrow', 'feature_title', 'feature_body'],
                    'Why Rosa' => ['why_title', 'why_1_title', 'why_1_body', 'why_2_title', 'why_2_body', 'why_3_title', 'why_3_body'],
                    'Proof Labels' => ['proof_1', 'proof_2', 'proof_3'],
                ],
                'fields' => [
                    'page_eyebrow' => self::field('text', 'ROSA', 'ROSA'),
                    'page_title' => self::field('text', 'About us', 'من نحن'),
                    'page_body' => self::field('textarea', 'Learn about Rosa’s approach to medical-instrument discovery and procurement support.', 'تعرف على نهج روزا في دعم اكتشاف الأدوات الطبية والتوريد.'),
                    'who_eyebrow' => self::field('text', 'Who we are', 'من نحن'),
                    'who_title' => self::field('text', 'A focused medical-instrument supply partner.', 'شريك متخصص في توريد الأدوات الطبية.'),
                    'who_body' => self::field('textarea', 'Rosa helps buyers navigate instrument families and catalogue references, then contact the team for procurement support.', 'يساعد موقع روزا المشترين على التنقل بين فئات الأدوات ومراجع الكتالوج والتواصل للحصول على دعم التوريد.'),
                    'stat_1_value' => self::field('text', '5', '5'),
                    'stat_1_label' => self::field('text', 'Product families', 'فئات منتجات'),
                    'stat_2_value' => self::field('text', '5', '5'),
                    'stat_2_label' => self::field('text', 'Catalogue PDFs', 'كتالوجات'),
                    'stat_3_value' => self::field('text', '2', '2'),
                    'stat_3_label' => self::field('text', 'Preview languages', 'لغات للمعاينة'),
                    'card_1_title' => self::field('text', 'Product Families', 'فئات المنتجات'),
                    'card_1_body' => self::field('textarea', 'Five focused catalogue families for instrument discovery.', 'خمس فئات كتالوج رئيسية لاكتشاف الأدوات.'),
                    'card_1_cta' => self::field('text', 'Browse products', 'تصفح المنتجات'),
                    'card_2_title' => self::field('text', 'Catalogue Support', 'دعم الكتالوج'),
                    'card_2_body' => self::field('textarea', 'Use family catalogues and product references to identify requirements.', 'استخدم الكتالوجات والمراجع لتحديد المتطلبات.'),
                    'card_2_cta' => self::field('text', 'View shop', 'عرض المنتجات'),
                    'card_3_title' => self::field('text', 'Quotation Support', 'دعم عروض الأسعار'),
                    'card_3_body' => self::field('textarea', 'Contact Rosa with the required instrument/reference for procurement assistance.', 'تواصل مع روزا بالمراجع المطلوبة للحصول على مساعدة التوريد.'),
                    'card_3_cta' => self::field('text', 'Contact us', 'اتصل بنا'),
                    'feature_eyebrow' => self::field('text', 'ROSA', 'ROSA'),
                    'feature_title' => self::field('text', 'Clear support for procurement requirements', 'دعم واضح لاحتياجات التوريد'),
                    'feature_body' => self::field('textarea', 'Start with a family or product reference, then contact us with what you need.', 'ابدأ بالفئة أو مرجع المنتج ثم تواصل معنا بالمطلوب.'),
                    'why_title' => self::field('text', 'Support built around instrument procurement', 'دعم يركز على احتياجات توريد الأدوات'),
                    'why_1_title' => self::field('text', 'Organized families', 'فئات منظمة'),
                    'why_1_body' => self::field('textarea', 'Browse instruments across five primary families.', 'تصفح الأدوات ضمن خمس فئات رئيسية.'),
                    'why_2_title' => self::field('text', 'Shareable references', 'مراجع قابلة للمشاركة'),
                    'why_2_body' => self::field('textarea', 'Use product names and references when contacting Rosa.', 'استخدم أسماء المنتجات والمراجع عند التواصل.'),
                    'why_3_title' => self::field('text', 'Direct contact', 'قناة تواصل مباشرة'),
                    'why_3_body' => self::field('textarea', 'Use email or phone for procurement support.', 'تواصل بالبريد أو الهاتف للحصول على مساعدة التوريد.'),
                    'proof_1' => self::field('text', 'Clear catalogue references', 'مراجع كتالوج واضحة'),
                    'proof_2' => self::field('text', 'Contextual product imagery', 'صور سياقية'),
                    'proof_3' => self::field('text', 'Direct contact support', 'دعم تواصل مباشر'),
                ],
            ],
            'contact' => [
                'option' => 'rosa_contact_content',
                'title' => 'Contact',
                'groups' => [
                    'Page Hero' => ['page_eyebrow', 'page_title', 'page_body'],
                    'Contact Details' => ['location_label', 'phone_label', 'email_label'],
                    'Inquiry Form' => ['form_title', 'field_name', 'field_phone', 'field_subject', 'field_message', 'send_email'],
                    'Map' => ['map_eyebrow', 'map_button'],
                ],
                'fields' => [
                    'page_eyebrow' => self::field('text', 'ROSA', 'ROSA'),
                    'page_title' => self::field('text', 'Contact us', 'اتصل بنا'),
                    'page_body' => self::field('textarea', 'Get in touch and let us know how we can help.', 'تواصل معنا وأخبرنا كيف يمكننا مساعدتك.'),
                    'location_label' => self::field('text', 'Location', 'الموقع'),
                    'phone_label' => self::field('text', 'Call us', 'اتصل بنا'),
                    'email_label' => self::field('text', 'Email us', 'البريد الإلكتروني'),
                    'form_title' => self::field('text', 'Share your requirements', 'شارك متطلباتك'),
                    'field_name' => self::field('text', 'Name', 'الاسم'),
                    'field_phone' => self::field('text', 'Phone', 'الهاتف'),
                    'field_subject' => self::field('text', 'Subject', 'الموضوع'),
                    'field_message' => self::field('text', 'Message', 'الرسالة'),
                    'send_email' => self::field('text', 'Send by email', 'إرسال عبر البريد الإلكتروني'),
                    'map_eyebrow' => self::field('text', 'Location', 'الموقع'),
                    'map_button' => self::field('text', 'Search on maps', 'البحث في الخرائط'),
                ],
            ],
            'shop' => [
                'option' => 'rosa_shop_content',
                'title' => 'Shop',
                'groups' => [
                    'Shop Hero' => ['hero_eyebrow', 'hero_title', 'hero_body'],
                    'Search & Empty State' => ['search_label', 'search_button', 'empty_state'],
                ],
                'fields' => [
                    'hero_eyebrow' => self::field('text', 'ROSA', 'ROSA'),
                    'hero_title' => self::field('text', 'Shop', 'المنتجات'),
                    'hero_body' => self::field('textarea', 'Browse Rosa medical-instrument products and contact us for catalogue and quotation support.', 'تصفح منتجات روزا الطبية وتواصل معنا للحصول على دعم الكتالوج وعروض الأسعار.'),
                    'search_label' => self::field('text', 'Search products', 'البحث في المنتجات'),
                    'search_button' => self::field('text', 'Search', 'بحث'),
                    'empty_state' => self::field('text', 'No products matched this view.', 'لا توجد منتجات متاحة في هذه المعاينة.'),
                ],
            ],
        ];
    }

    /** @return array<string, mixed> */
    public static function section(string $section): array
    {
        $sections = self::sections();
        return $sections[$section] ?? [];
    }

    public static function defaultValue(string $section, string $locale, string $key): string
    {
        $locale = $locale === 'ar' ? 'ar' : 'en';
        $definition = self::section($section);
        $field = $definition['fields'][$key] ?? null;
        if (! is_array($field) || ! isset($field[$locale]) || ! is_scalar($field[$locale])) {
            return '';
        }
        return (string) $field[$locale];
    }

    /** @return array{type:string,en:string,ar:string} */
    private static function field(string $type, string $en, string $ar): array
    {
        return ['type' => $type, 'en' => $en, 'ar' => $ar];
    }
}
