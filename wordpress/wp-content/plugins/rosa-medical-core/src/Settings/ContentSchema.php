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
                    'Hero carousel' => [
                        'hero_1_eyebrow', 'hero_1_title', 'hero_1_body',
                        'hero_2_eyebrow', 'hero_2_title', 'hero_2_body',
                        'hero_3_eyebrow', 'hero_3_title', 'hero_3_body',
                        'hero_4_eyebrow', 'hero_4_title', 'hero_4_body',
                    ],
                    'Product range' => ['family_title'],
                    'Comprehensive Plans' => [
                        'comprehensive_title', 'comprehensive_body', 'comprehensive_lead_specialty',
                        'comprehensive_specialty_1', 'comprehensive_specialty_2', 'comprehensive_specialty_3', 'comprehensive_specialty_4',
                    ],
                    'Securing Confidence' => ['confidence_title', 'confidence_body', 'confidence_image_alt'],
                    'Direct Support' => ['contact_eyebrow', 'contact_title', 'contact_whatsapp_label', 'contact_email_label'],
                    'Client Success' => [
                        'assurance_title', 'assurance_badge',
                        'assurance_1_title', 'assurance_1_body',
                        'assurance_2_title', 'assurance_2_body',
                        'assurance_3_title', 'assurance_3_body',
                        'assurance_4_title', 'assurance_4_body',
                    ],
                    'Quotation CTA' => ['quotation_eyebrow', 'quotation_title', 'quotation_body', 'quotation_button'],
                ],
                'fields' => [
                    'hero_1_eyebrow' => self::field('text', 'Medical instruments supplier', 'مورّد أدوات طبية'),
                    'hero_1_title' => self::field('text', 'Precision instruments. Procurement made clear.', 'أدوات دقيقة. ومشتريات أكثر وضوحًا.'),
                    'hero_1_body' => self::field('textarea', 'A composed catalogue and quotation experience for hospitals, distributors and procurement teams.', 'تجربة منظمة لاستعراض الكتالوجات وطلب عروض الأسعار للمستشفيات والموزعين وفرق المشتريات.'),
                    'hero_2_eyebrow' => self::field('text', 'Structured product discovery', 'استعراض منظم للمنتجات'),
                    'hero_2_title' => self::field('text', 'A clearer view of the instruments you need.', 'رؤية أوضح للأدوات التي تحتاجها.'),
                    'hero_2_body' => self::field('textarea', 'Browse focused instrument families, review product codes and variants, and carry the right details into your inquiry.', 'استعرض عائلات الأدوات المركزة، وراجع الرموز والخيارات، واحتفظ بالتفاصيل الصحيحة داخل استفسارك.'),
                    'hero_3_eyebrow' => self::field('text', 'Instrument selection', 'اختيار الأدوات'),
                    'hero_3_title' => self::field('text', 'Clearer instrument selection, from the start.', 'اختيار أوضح للأدوات منذ البداية.'),
                    'hero_3_body' => self::field('textarea', 'Move from family browsing to product codes, configurations and quantities in one composed quotation path.', 'انتقل من استعراض العائلات إلى رموز المنتجات وخياراتها وكمياتها ضمن مسار واحد منظم لطلب عرض السعر.'),
                    'hero_4_eyebrow' => self::field('text', 'Catalogue to quotation', 'من الكتالوج إلى عرض السعر'),
                    'hero_4_title' => self::field('text', 'From catalogue detail to one organised request.', 'حوّل تفاصيل الكتالوج إلى طلب واحد منظم.'),
                    'hero_4_body' => self::field('textarea', 'Identify the instrument family, review available configurations, and bring quantities together without losing product context.', 'حدد عائلة الأداة، وراجع الخيارات المتاحة، واجمع الكميات مع الحفاظ على سياق كل منتج.'),

                    'family_title' => self::field('text', 'Our range of products', 'مجموعة منتجاتنا'),

                    'comprehensive_title' => self::field('text', 'Comprehensive Plans', 'خطط شاملة'),
                    'comprehensive_body' => self::field('textarea', 'Rosa offers comprehensive surgical and dental instrument plans engineered to support clinical excellence across multiple specialties. For advanced surgical fields—including plastic surgery, orthopedic surgery, spine surgery, gynecology and maxillofacial surgery—the portfolio provides robust, high-precision tools. Rosa’s dental care solutions also support general dentistry and orthodontics with dependable instruments designed for accurate handling and patient comfort. By organizing its product lines around clinical needs, Rosa helps surgical teams and dental professionals work with reliable, regulatory-compliant tools for specific procedures.', 'تقدم روزا خططًا شاملة للأدوات الجراحية وأدوات طب الأسنان لدعم التميز السريري عبر تخصصات متعددة. وتشمل المجالات المتقدمة جراحة التجميل والعظام والعمود الفقري وأمراض النساء وجراحة الوجه والفكين، مع أدوات متينة وعالية الدقة. كما تدعم حلول طب الأسنان لدى روزا طب الأسنان العام وتقويم الأسنان بأدوات موثوقة تساعد على دقة الاستخدام وراحة المريض. ومن خلال تنظيم خطوط المنتجات وفق الاحتياجات السريرية، تساعد روزا الفرق الجراحية وأطباء الأسنان على العمل بأدوات موثوقة ومتوافقة مع المتطلبات التنظيمية لكل إجراء.'),
                    'comprehensive_lead_specialty' => self::field('text', 'Plastic Surgery', 'جراحة التجميل'),
                    'comprehensive_specialty_1' => self::field('text', 'Orthopedics', 'جراحة العظام'),
                    'comprehensive_specialty_2' => self::field('text', 'Maxillofacial', 'الوجه والفكين'),
                    'comprehensive_specialty_3' => self::field('text', 'Orthodontics', 'تقويم الأسنان'),
                    'comprehensive_specialty_4' => self::field('text', 'Spine', 'العمود الفقري'),

                    'confidence_title' => self::field('text', 'Securing Confidence', 'ترسيخ الثقة'),
                    'confidence_body' => self::field('textarea', 'Rosa Medical Devices stands as a trusted partner in the GCC medical trading sector, dedicated to delivering uncompromising quality and precision. Specializing in advanced surgical and dental instruments, the company provides healthcare professionals with reliable tools designed to support superior patient outcomes. By adhering to local and international standards through regulatory channels including ISO and SFDA compliance, Rosa maintains transparency and safety across its product lines. Backed by expertise in metallurgy, engineering, skilled manpower and a commitment to innovation, Rosa continues to bridge advanced surgical engineering with the demands of modern medical practice.', 'تُعد روزا ميديكال ديفايسز شريكًا موثوقًا في قطاع تجارة الأجهزة الطبية بدول مجلس التعاون الخليجي، مع التزام بالجودة والدقة. وتتخصص الشركة في الأدوات الجراحية وأدوات طب الأسنان المتقدمة، وتوفر للمتخصصين أدوات موثوقة تدعم نتائج علاجية أفضل. ومن خلال الالتزام بالمعايير المحلية والدولية عبر القنوات التنظيمية، بما في ذلك متطلبات ISO وSFDA، تحافظ روزا على الشفافية والسلامة عبر خطوط منتجاتها. وبالاستناد إلى الخبرة في المعادن والهندسة والكوادر الماهرة والالتزام بالابتكار، تواصل روزا الربط بين الهندسة الجراحية المتقدمة ومتطلبات الممارسة الطبية الحديثة.'),
                    'confidence_image_alt' => self::field('text', 'Medical instrument quality and precision', 'جودة ودقة الأدوات الطبية'),

                    'contact_eyebrow' => self::field('text', 'Direct support', 'دعم مباشر'),
                    'contact_title' => self::field('text', 'Get in Touch Now', 'تواصل معنا الآن'),
                    'contact_whatsapp_label' => self::field('text', 'WhatsApp Chat', 'محادثة واتساب'),
                    'contact_email_label' => self::field('text', 'Email', 'البريد الإلكتروني'),

                    'assurance_title' => self::field('text', 'Services Assure our Clients Success', 'خدمات تدعم نجاح عملائنا'),
                    'assurance_badge' => self::field('text', 'SACS', 'SACS'),
                    'assurance_1_title' => self::field('text', 'Customization', 'التخصيص'),
                    'assurance_1_body' => self::field('textarea', 'We offer and deliver tailored, high-precision surgical and dental instruments customized precisely to meet your clinical specifications and unique procedural requirements.', 'نقدم أدوات جراحية وأدوات لطب الأسنان عالية الدقة ومصممة وفق المواصفات السريرية والمتطلبات الخاصة بكل إجراء.'),
                    'assurance_2_title' => self::field('text', 'Compliance', 'الامتثال'),
                    'assurance_2_body' => self::field('textarea', 'We ensure complete regulatory compliance through strict adherence to Saudi SFDA standards, helping guarantee safe and authorized medical products.', 'نلتزم بالمتطلبات التنظيمية من خلال التقيد الصارم بمعايير هيئة الغذاء والدواء السعودية SFDA بما يدعم توفير منتجات طبية آمنة ومصرح بها.'),
                    'assurance_3_title' => self::field('text', 'Quality Standards', 'معايير الجودة'),
                    'assurance_3_body' => self::field('textarea', 'We maintain exceptional quality standards, sourcing ISO-certified, surgical-grade instruments built for precision, durability and safety for medical professionals.', 'نحافظ على معايير جودة مرتفعة من خلال توريد أدوات جراحية معتمدة وفق ISO ومصنوعة للاستخدام الطبي بما يدعم الدقة والمتانة والسلامة.'),
                    'assurance_4_title' => self::field('text', 'Supply Chain', 'سلسلة الإمداد'),
                    'assurance_4_body' => self::field('textarea', 'We ensure reliable, efficient supply chain management, offering seamless import clearance and timely delivery of critical medical and dental instruments directly to our customers.', 'نوفر إدارة موثوقة وفعالة لسلسلة الإمداد، مع دعم إجراءات الاستيراد والتخليص والتسليم في الوقت المناسب للأدوات الطبية وأدوات طب الأسنان.'),

                    'quotation_eyebrow' => self::field('text', 'Request a quotation', 'اطلب عرض سعر'),
                    'quotation_title' => self::field('text', 'Prepare your instruments inquiry.', 'جهّز استفسارك عن الأدوات.'),
                    'quotation_body' => self::field('textarea', 'Build a structured product list and send one clear request to Rosa Medical.', 'أنشئ قائمة منظمة بالمنتجات وأرسل طلبًا واضحًا إلى روزا ميديكال.'),
                    'quotation_button' => self::field('text', 'Request a Quote', 'اطلب عرض سعر'),
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
