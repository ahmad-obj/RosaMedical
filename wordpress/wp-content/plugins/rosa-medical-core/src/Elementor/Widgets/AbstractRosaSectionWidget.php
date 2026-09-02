<?php

declare(strict_types=1);

namespace RosaMedical\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Widget_Base;

abstract class AbstractRosaSectionWidget extends Widget_Base
{
    public function get_icon(): string
    {
        return 'eicon-site-identity';
    }

    /** @return list<string> */
    public function get_categories(): array
    {
        return ['rosa-medical'];
    }

    /** @return list<string> */
    public function get_keywords(): array
    {
        return ['rosa', 'medical'];
    }

    protected function beginContentSection(string $label = 'Content'): void
    {
        $this->start_controls_section('rosa_content', [
            'label' => $label,
            'tab' => Controls_Manager::TAB_CONTENT,
        ]);
    }

    protected function addText(string $id, string $label, string $default = ''): void
    {
        $this->add_control($id, [
            'label' => $label,
            'type' => Controls_Manager::TEXT,
            'default' => $default,
            'label_block' => true,
        ]);
    }

    protected function addTextarea(string $id, string $label, string $default = ''): void
    {
        $this->add_control($id, [
            'label' => $label,
            'type' => Controls_Manager::TEXTAREA,
            'default' => $default,
            'rows' => 4,
        ]);
    }

    protected function addMedia(string $id, string $label, int $defaultId = 0): void
    {
        $default = [];
        if ($defaultId > 0) {
            $default['id'] = $defaultId;
        }
        $this->add_control($id, [
            'label' => $label,
            'type' => Controls_Manager::MEDIA,
            'default' => $default,
        ]);
    }

    protected function locale(): string
    {
        $postId = 0;
        if (function_exists('get_queried_object_id')) {
            $postId = (int) get_queried_object_id();
        }
        if ($postId <= 0 && function_exists('get_the_ID')) {
            $postId = (int) get_the_ID();
        }
        if ($postId <= 0 && is_admin() && isset($_GET['post']) && is_scalar($_GET['post'])) {
            $postId = max(0, (int) $_GET['post']);
        }
        if ($postId <= 0 || ! function_exists('get_post_meta')) {
            return 'en';
        }
        $locale = (string) get_post_meta($postId, defined('ROSA_PREVIEW_LOCALE_META') ? ROSA_PREVIEW_LOCALE_META : '_rosa_preview_locale', true);
        return $locale === 'ar' ? 'ar' : 'en';
    }

    /** @param list<string> $mediaKeys */
    protected function renderSection(string $part, array $mediaKeys = [], array $extraArgs = []): void
    {
        $settings = $this->get_settings_for_display();
        $content = is_array($settings) ? $settings : [];
        $media = [];
        foreach ($mediaKeys as $key) {
            if (array_key_exists($key, $content)) {
                $media[$key] = $content[$key];
                unset($content[$key]);
            }
        }
        $this->renderPart($part, array_merge([
            'locale' => $this->locale(),
            'content' => $content,
            'media' => $media,
        ], $extraArgs));
    }

    protected function renderPart(string $part, array $args): void
    {
        $relative = 'template-parts/client-preview/' . trim($part, '/') . '.php';
        $located = function_exists('locate_template') ? locate_template($relative) : '';
        if (! is_string($located) || $located === '') {
            if (function_exists('esc_html')) {
                echo '<div class="notice notice-warning"><p>' . esc_html('Rosa section template is unavailable: ' . $part) . '</p></div>';
            }
            return;
        }
        get_template_part('template-parts/client-preview/' . trim($part, '/'), null, $args);
    }
}
