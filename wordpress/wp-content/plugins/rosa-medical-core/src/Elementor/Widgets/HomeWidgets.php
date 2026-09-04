<?php

declare(strict_types=1);

namespace RosaMedical\Core\Elementor\Widgets;

final class HomeHeroWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-hero'; }
    public function get_title(): string { return 'Rosa Home — Hero'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Hero');
        $this->addText('hero_eyebrow', 'Eyebrow', 'Rosa Medical');
        $this->addText('hero_title', 'Heading', 'Surgical instruments for professional procurement.');
        $this->addTextarea('hero_body', 'Body', 'Explore Rosa instrument families and contact our team for catalogue and quotation support.');
        $this->addText('hero_button', 'Button label', 'Browse products');
        $this->addMedia('image', 'Hero image');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('hero', ['image']); }
}

final class HomeWhoWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-who'; }
    public function get_title(): string { return 'Rosa Home — Who We Are'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Who We Are');
        $this->addText('who_eyebrow', 'Eyebrow', 'Who we are');
        $this->addText('who_title', 'Heading', 'Expect more than an instrument catalogue.');
        $this->addTextarea('who_body', 'Body', 'Rosa helps professional buyers identify instrument families, confirm catalogue references and prepare a clear quotation request.');
        $this->addText('who_button', 'Button label', 'Discover Rosa');
        $this->addText('stat_1_value', 'Statistic 1 value', '5');
        $this->addText('stat_1_label', 'Statistic 1 label', 'Product families');
        $this->addText('stat_2_value', 'Statistic 2 value', '5');
        $this->addText('stat_2_label', 'Statistic 2 label', 'Catalogue PDFs');
        $this->addText('stat_3_value', 'Statistic 3 value', '2');
        $this->addText('stat_3_label', 'Statistic 3 label', 'Preview languages');
        $this->addMedia('image', 'Section image');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('home-who', ['image']); }
}

final class HomeFeaturedWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-featured'; }
    public function get_title(): string { return 'Rosa Home — Featured Products'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Featured Products Support');
        $this->addText('featured_title', 'Section heading', 'Featured Products');
        $this->addText('benefit_1_title', 'Benefit 1 heading', 'Catalogue support');
        $this->addText('benefit_1_body', 'Benefit 1 text', 'Identify the right reference');
        $this->addText('benefit_2_title', 'Benefit 2 heading', 'Quotation route');
        $this->addText('benefit_2_body', 'Benefit 2 text', 'Ask about price and supply');
        $this->addText('benefit_3_title', 'Benefit 3 heading', 'Five families');
        $this->addText('benefit_3_body', 'Benefit 3 text', 'Browse instrument ranges');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('home-featured'); }
}

final class HomeFeatureBannerWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-feature-banner'; }
    public function get_title(): string { return 'Rosa Home — Feature Banner'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Feature Banner');
        $this->addText('feature_eyebrow', 'Eyebrow', 'Procurement support');
        $this->addText('feature_title', 'Heading', 'From catalogue reference to a clear quotation request.');
        $this->addTextarea('feature_body', 'Body', 'Browse instruments by family and share the exact references your procurement team needs.');
        $this->addText('feature_button', 'Button label', 'Contact us');
        $this->addMedia('image', 'Banner image');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('home-feature', ['image']); }
}

final class HomeLatestWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-latest'; }
    public function get_title(): string { return 'Rosa Home — Latest Products'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Latest Products');
        $this->addText('latest_title', 'Section heading', 'Latest Products');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('home-latest'); }
}

final class HomePromotionsWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-promotions'; }
    public function get_title(): string { return 'Rosa Home — Promotions'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Promotion Tiles');
        $this->addText('promo_1_title', 'Tile 1 heading', 'Surgical knives');
        $this->addText('promo_1_body', 'Tile 1 text', 'Browse family references');
        $this->addText('promo_2_title', 'Tile 2 heading', 'Precision scissors');
        $this->addText('promo_2_body', 'Tile 2 text', 'Straight and curved options');
        $this->addText('promo_3_title', 'Tile 3 heading', 'Punches and chisels');
        $this->addText('promo_3_body', 'Tile 3 text', 'Identify the instrument needed');
        $this->addText('promo_4_title', 'Tile 4 heading', 'Five instrument catalogues');
        $this->addText('promo_4_body', 'Tile 4 text', 'Start with the right family');
        $this->addMedia('image_1', 'Tile 1 image');
        $this->addMedia('image_2', 'Tile 2 image');
        $this->addMedia('image_3', 'Tile 3 image');
        $this->addMedia('image_4', 'Tile 4 image');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('home-promos', ['image_1', 'image_2', 'image_3', 'image_4']); }
}

final class HomeWhyWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-why'; }
    public function get_title(): string { return 'Rosa Home — Why Rosa'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Why Rosa');
        $this->addText('why_eyebrow', 'Eyebrow', 'ROSA');
        $this->addText('why_title', 'Heading', 'Support built around instrument procurement');
        $this->addText('why_1_title', 'Card 1 heading', 'Clear references');
        $this->addTextarea('why_1_body', 'Card 1 text', 'Work with family names and product references.');
        $this->addText('why_2_title', 'Card 2 heading', 'Exact configurations');
        $this->addTextarea('why_2_body', 'Card 2 text', 'Review the real options available for each instrument.');
        $this->addText('why_3_title', 'Card 3 heading', 'Direct support');
        $this->addTextarea('why_3_body', 'Card 3 text', 'Share requirements for quotation support.');
        $this->addMedia('image', 'Section image');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('home-why', ['image']); }
}

final class HomeProofWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-proof'; }
    public function get_title(): string { return 'Rosa Home — Catalogue Strip'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Catalogue Strip');
        $this->addText('proof_1', 'Label 1', 'Knives');
        $this->addText('proof_2', 'Label 2', 'Scissors');
        $this->addText('proof_3', 'Label 3', 'Punches');
        $this->addText('proof_4', 'Label 4', 'Chisels');
        $this->addText('proof_5', 'Label 5', 'Cutters');
        $this->addText('proof_6', 'Label 6', 'Catalogues');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('home-proof'); }
}

final class HomeEvidenceWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-evidence'; }
    public function get_title(): string { return 'Rosa Home — Workflow'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Workflow');
        $this->addText('evidence_eyebrow', 'Eyebrow', 'A clear workflow');
        $this->addText('evidence_title', 'Heading', 'Turn an instrument need into a clear procurement request.');
        $this->addTextarea('evidence_body', 'Body', 'Three simple steps help our team understand exactly what you need.');
        $this->addText('evidence_1_title', 'Step 1 heading', 'Identify the family');
        $this->addTextarea('evidence_1_body', 'Step 1 text', 'Start with the instrument type you need.');
        $this->addText('evidence_2_title', 'Step 2 heading', 'Share the reference');
        $this->addTextarea('evidence_2_body', 'Step 2 text', 'Send the available code or configuration.');
        $this->addText('evidence_3_title', 'Step 3 heading', 'Request a quotation');
        $this->addTextarea('evidence_3_body', 'Step 3 text', 'Contact Rosa for procurement support.');
        $this->addMedia('image', 'Workflow image');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('home-evidence', ['image']); }
}
