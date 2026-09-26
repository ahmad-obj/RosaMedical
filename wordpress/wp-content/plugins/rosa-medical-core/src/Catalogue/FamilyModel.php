<?php

declare(strict_types=1);

namespace RosaMedical\Core\Catalogue;

final class FamilyModel
{
    public function __construct(
        public readonly int $id,
        public readonly string $slug,
        public readonly string $name,
        public readonly string $nameAr,
        public readonly string $description,
        public readonly string $descriptionAr,
        public readonly int $order,
        public readonly bool $visible,
        public readonly int $coverId,
        public readonly string $coverUrl,
        public readonly int $pdfId,
        public readonly string $pdfUrl,
        public readonly int $productCount = 0
    ) {
    }

    public function getDisplayName(string $locale = 'en'): string
    {
        if ($locale === 'ar' && trim($this->nameAr) !== '') {
            return trim($this->nameAr);
        }
        return $this->name;
    }

    public function getDescription(string $locale = 'en'): string
    {
        if ($locale === 'ar' && trim($this->descriptionAr) !== '') {
            return trim($this->descriptionAr);
        }
        return $this->description;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'name_ar' => $this->nameAr,
            'description' => $this->description,
            'description_ar' => $this->descriptionAr,
            'order' => $this->order,
            'visible' => $this->visible,
            'cover_id' => $this->coverId,
            'cover_url' => $this->coverUrl,
            'pdf_id' => $this->pdfId,
            'pdf_url' => $this->pdfUrl,
            'product_count' => $this->productCount,
        ];
    }
}
