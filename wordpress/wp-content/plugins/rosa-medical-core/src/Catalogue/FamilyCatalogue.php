<?php

declare(strict_types=1);

namespace RosaMedical\Core\Catalogue;

final class FamilyCatalogue
{
    public const META_KEY = '_rosa_catalogue_attachment_id';

    /** @return ?array{attachment_id:int,url:string,title:string} */
    public static function fromAttachmentId(int $attachmentId): ?array
    {
        if ($attachmentId <= 0 || get_post_mime_type($attachmentId) !== 'application/pdf') {
            return null;
        }

        $url = wp_get_attachment_url($attachmentId);
        if (! is_string($url) || trim($url) === '') {
            return null;
        }

        $title = trim((string) get_the_title($attachmentId));
        if ($title === '') {
            $title = __('Reference catalogue', 'rosa-medical');
        }

        return [
            'attachment_id' => $attachmentId,
            'url' => $url,
            'title' => $title,
        ];
    }

    /** @return ?array{attachment_id:int,url:string,title:string,family_name:string,family_slug:string} */
    public static function forTerm(\WP_Term $term): ?array
    {
        $attachmentId = (int) get_term_meta($term->term_id, self::META_KEY, true);
        $catalogue = self::fromAttachmentId($attachmentId);
        if ($catalogue === null) {
            return null;
        }

        return $catalogue + [
            'family_name' => (string) $term->name,
            'family_slug' => (string) $term->slug,
        ];
    }

    /** @return ?array{attachment_id:int,url:string,title:string,family_name:string,family_slug:string} */
    public static function forProduct(\WC_Product $product): ?array
    {
        $terms = wc_get_product_terms($product->get_id(), 'product_cat', ['fields' => 'all']);
        if (! is_array($terms) || $terms === []) {
            return null;
        }

        usort($terms, static fn ($a, $b): int => ((int) $a->term_id) <=> ((int) $b->term_id));
        foreach ($terms as $term) {
            if ($term instanceof \WP_Term) {
                $catalogue = self::forTerm($term);
                if ($catalogue !== null) {
                    return $catalogue;
                }
            }
        }

        return null;
    }
}
