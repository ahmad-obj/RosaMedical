<?php

declare(strict_types=1);

namespace RosaMedical\Core\Elementor\Widgets;

final class HomeHeroCarouselWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-hero-carousel'; }
    public function get_title(): string { return 'Rosa Home — Hero Carousel'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Hero carousel');
        $this->addText('hero_1_eyebrow', 'Slide 1 eyebrow', 'Medical instruments supplier');
        $this->addText('hero_1_title', 'Slide 1 heading', 'Precision instruments. Procurement made clear.');
        $this->addTextarea('hero_1_body', 'Slide 1 body', 'A composed catalogue and quotation experience for hospitals, distributors and procurement teams.');
        $this->addMedia('desktop_1', 'Slide 1 desktop image');
        $this->addMedia('mobile_1', 'Slide 1 mobile image');

        $this->addText('hero_2_eyebrow', 'Slide 2 eyebrow', 'Structured product discovery');
        $this->addText('hero_2_title', 'Slide 2 heading', 'A clearer view of the instruments you need.');
        $this->addTextarea('hero_2_body', 'Slide 2 body', 'Browse focused instrument families, review product codes and variants, and carry the right details into your inquiry.');
        $this->addMedia('desktop_2', 'Slide 2 desktop image');
        $this->addMedia('mobile_2', 'Slide 2 mobile image');

        $this->addText('hero_3_eyebrow', 'Slide 3 eyebrow', 'Instrument selection');
        $this->addText('hero_3_title', 'Slide 3 heading', 'Clearer instrument selection, from the start.');
        $this->addTextarea('hero_3_body', 'Slide 3 body', 'Move from family browsing to product codes, configurations and quantities in one composed quotation path.');
        $this->addMedia('desktop_3', 'Slide 3 desktop image');
        $this->addMedia('mobile_3', 'Slide 3 mobile image');

        $this->addText('hero_4_eyebrow', 'Slide 4 eyebrow', 'Catalogue to quotation');
        $this->addText('hero_4_title', 'Slide 4 heading', 'From catalogue detail to one organised request.');
        $this->addTextarea('hero_4_body', 'Slide 4 body', 'Identify the instrument family, review available configurations, and bring quantities together without losing product context.');
        $this->addMedia('desktop_4', 'Slide 4 desktop image');
        $this->addMedia('mobile_4', 'Slide 4 mobile image');
        $this->end_controls_section();
    }

    protected function render(): void
    {
        $this->renderSection('latest-home-hero', [
            'desktop_1', 'mobile_1', 'desktop_2', 'mobile_2',
            'desktop_3', 'mobile_3', 'desktop_4', 'mobile_4',
        ]);
    }
}

final class HomeFamilyDiscoveryWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-family-discovery'; }
    public function get_title(): string { return 'Rosa Home — Product Range'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Product range');
        $this->addText('family_title', 'Heading', 'Our range of products');
        $this->end_controls_section();
    }

    protected function render(): void { $this->renderSection('latest-home-family-discovery'); }
}

final class HomeComprehensiveWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-comprehensive'; }
    public function get_title(): string { return 'Rosa Home — Comprehensive Plans'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Comprehensive Plans');
        $this->addText('comprehensive_title', 'Heading', 'Comprehensive Plans');
        $this->addTextarea('comprehensive_body', 'Body', 'Rosa offers comprehensive surgical and dental instrument plans engineered to support clinical excellence across multiple specialties.');
        $this->addText('comprehensive_lead_specialty', 'Lead specialty', 'Plastic Surgery');
        $this->addText('comprehensive_specialty_1', 'Specialty 1', 'Orthopedics');
        $this->addText('comprehensive_specialty_2', 'Specialty 2', 'Maxillofacial');
        $this->addText('comprehensive_specialty_3', 'Specialty 3', 'Orthodontics');
        $this->addText('comprehensive_specialty_4', 'Specialty 4', 'Spine');
        $this->addMedia('lead_image', 'Lead specialty image');
        $this->addMedia('specialty_1_image', 'Specialty 1 image');
        $this->addMedia('specialty_2_image', 'Specialty 2 image');
        $this->addMedia('specialty_3_image', 'Specialty 3 image');
        $this->addMedia('specialty_4_image', 'Specialty 4 image');
        $this->end_controls_section();
    }

    protected function render(): void
    {
        $this->renderSection('latest-home-comprehensive', [
            'lead_image', 'specialty_1_image', 'specialty_2_image', 'specialty_3_image', 'specialty_4_image',
        ]);
    }
}

final class HomeConfidenceWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-confidence'; }
    public function get_title(): string { return 'Rosa Home — Securing Confidence'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Securing Confidence');
        $this->addText('confidence_title', 'Heading', 'Securing Confidence');
        $this->addTextarea('confidence_body', 'Body', 'Rosa Medical Devices stands as a trusted partner in the GCC medical trading sector, dedicated to delivering uncompromising quality and precision.');
        $this->addText('confidence_image_alt', 'Image alt text', 'Medical instrument quality and precision');
        $this->addMedia('image', 'Section image');
        $this->end_controls_section();
    }

    protected function render(): void { $this->renderSection('latest-home-confidence', ['image']); }
}

final class HomeContactBandWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-contact-band'; }
    public function get_title(): string { return 'Rosa Home — Direct Support'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Direct Support');
        $this->addText('contact_eyebrow', 'Eyebrow', 'Direct support');
        $this->addText('contact_title', 'Heading', 'Get in Touch Now');
        $this->addText('contact_whatsapp_label', 'WhatsApp label', 'WhatsApp Chat');
        $this->addText('contact_email_label', 'Email label', 'Email');
        $this->end_controls_section();
    }

    protected function render(): void { $this->renderSection('latest-home-contact-band'); }
}

final class HomeAssuranceWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-assurance'; }
    public function get_title(): string { return 'Rosa Home — Client Success'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Client Success');
        $this->addText('assurance_title', 'Heading', 'Services Assure our Clients Success');
        $this->addText('assurance_badge', 'Badge', 'SACS');
        $this->addText('assurance_1_title', 'Card 1 heading', 'Customization');
        $this->addTextarea('assurance_1_body', 'Card 1 body', 'We offer and deliver tailored, high-precision surgical and dental instruments customized precisely to meet your clinical specifications and unique procedural requirements.');
        $this->addText('assurance_2_title', 'Card 2 heading', 'Compliance');
        $this->addTextarea('assurance_2_body', 'Card 2 body', 'We ensure complete regulatory compliance through strict adherence to Saudi SFDA standards, helping guarantee safe and authorized medical products.');
        $this->addText('assurance_3_title', 'Card 3 heading', 'Quality Standards');
        $this->addTextarea('assurance_3_body', 'Card 3 body', 'We maintain exceptional quality standards, sourcing ISO-certified, surgical-grade instruments built for precision, durability and safety for medical professionals.');
        $this->addText('assurance_4_title', 'Card 4 heading', 'Supply Chain');
        $this->addTextarea('assurance_4_body', 'Card 4 body', 'We ensure reliable, efficient supply chain management, offering seamless import clearance and timely delivery of critical medical and dental instruments directly to our customers.');
        $this->end_controls_section();
    }

    protected function render(): void { $this->renderSection('latest-home-assurance'); }
}

final class HomeQuotationWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-quotation'; }
    public function get_title(): string { return 'Rosa Home — Quotation CTA'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Quotation CTA');
        $this->addText('quotation_eyebrow', 'Eyebrow', 'Request a quotation');
        $this->addText('quotation_title', 'Heading', 'Prepare your instruments inquiry.');
        $this->addTextarea('quotation_body', 'Body', 'Build a structured product list and send one clear request to Rosa Medical.');
        $this->addText('quotation_button', 'Button label', 'Request a Quote');
        $this->end_controls_section();
    }

    protected function render(): void { $this->renderSection('latest-home-quotation'); }
}
