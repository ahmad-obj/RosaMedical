<?php

declare(strict_types=1);

namespace RosaMedical\Core\Elementor\Widgets;

final class AboutHeroWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-page-hero-about'; }
    public function get_title(): string { return 'Rosa About — Page Hero'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Page Hero');
        $this->addText('page_eyebrow', 'Eyebrow', 'ROSA');
        $this->addText('page_title', 'Heading', 'About us');
        $this->addTextarea('page_body', 'Body', 'Learn about Rosa’s approach to medical-instrument discovery and procurement support.');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('page-hero', [], ['section' => 'about']); }
}

final class AboutWhoWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-about-who'; }
    public function get_title(): string { return 'Rosa About — Who We Are'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Who We Are');
        $this->addText('who_eyebrow', 'Eyebrow', 'Who we are');
        $this->addText('who_title', 'Heading', 'A focused medical-instrument supply partner.');
        $this->addTextarea('who_body', 'Body', 'Rosa helps buyers navigate instrument families and catalogue references, then contact the team for procurement support.');
        $this->addMedia('image', 'Section image');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('about-who', ['image']); }
}

final class AboutStatsWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-about-stats'; }
    public function get_title(): string { return 'Rosa About — Statistics'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Statistics');
        $this->addText('stat_1_value', 'Statistic 1 value', '5');
        $this->addText('stat_1_label', 'Statistic 1 label', 'Product families');
        $this->addText('stat_2_value', 'Statistic 2 value', '5');
        $this->addText('stat_2_label', 'Statistic 2 label', 'Catalogue PDFs');
        $this->addText('stat_3_value', 'Statistic 3 value', '2');
        $this->addText('stat_3_label', 'Statistic 3 label', 'Preview languages');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('about-stats'); }
}

final class AboutCardsWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-about-cards'; }
    public function get_title(): string { return 'Rosa About — Information Cards'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Information Cards');
        $this->addText('card_1_title', 'Card 1 heading', 'Product Families');
        $this->addTextarea('card_1_body', 'Card 1 text', 'Five focused catalogue families for instrument discovery.');
        $this->addText('card_1_cta', 'Card 1 link label', 'Browse products');
        $this->addText('card_2_title', 'Card 2 heading', 'Catalogue Support');
        $this->addTextarea('card_2_body', 'Card 2 text', 'Use family catalogues and product references to identify requirements.');
        $this->addText('card_2_cta', 'Card 2 link label', 'View shop');
        $this->addText('card_3_title', 'Card 3 heading', 'Quotation Support');
        $this->addTextarea('card_3_body', 'Card 3 text', 'Contact Rosa with the required instrument/reference for procurement assistance.');
        $this->addText('card_3_cta', 'Card 3 link label', 'Contact us');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('about-cards'); }
}

final class AboutFeatureWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-about-feature'; }
    public function get_title(): string { return 'Rosa About — Feature Banner'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Feature Banner');
        $this->addText('feature_eyebrow', 'Eyebrow', 'ROSA');
        $this->addText('feature_title', 'Heading', 'Clear support for procurement requirements');
        $this->addTextarea('feature_body', 'Body', 'Start with a family or product reference, then contact us with what you need.');
        $this->addMedia('image', 'Banner image');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('about-feature', ['image']); }
}

final class AboutWhyWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-about-why'; }
    public function get_title(): string { return 'Rosa About — Why Rosa'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Why Rosa');
        $this->addText('why_title', 'Heading', 'Support built around instrument procurement');
        $this->addText('why_1_title', 'Card 1 heading', 'Organized families');
        $this->addTextarea('why_1_body', 'Card 1 text', 'Browse instruments across five primary families.');
        $this->addText('why_2_title', 'Card 2 heading', 'Shareable references');
        $this->addTextarea('why_2_body', 'Card 2 text', 'Use product names and references when contacting Rosa.');
        $this->addText('why_3_title', 'Card 3 heading', 'Direct contact');
        $this->addTextarea('why_3_body', 'Card 3 text', 'Use email or phone for procurement support.');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('about-why'); }
}

final class AboutProofWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-about-proof'; }
    public function get_title(): string { return 'Rosa About — Proof Labels'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Proof Labels');
        $this->addText('proof_1', 'Label 1', 'Clear catalogue references');
        $this->addText('proof_2', 'Label 2', 'Contextual product imagery');
        $this->addText('proof_3', 'Label 3', 'Direct contact support');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('about-proof'); }
}
