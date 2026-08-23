import { Button, ButtonLink } from "@/components/ui";
import {
  AdminAlert,
  AdminField,
  AdminFormSection,
  AdminPageHeader,
  AdminSelectField,
  AdminSection,
  AdminStatusBadge,
  AdminTextareaField
} from "@/features/admin-primitives";
import { formatProductPriceSummary } from "@/features/pricing";
import { ProductMediaPlaceholder } from "@/features/public-catalogue";
import type { AdminProductEditorModel } from "./admin-product-model";
import { AdminProductCompleteness } from "./admin-product-completeness";
import { AdminProductOptions } from "./admin-product-options";
import { AdminVariantPricing } from "./admin-variant-pricing";
import { ProductImageUploadForm } from "./product-image-upload-form";
import { activateProduct, saveProduct } from "./actions";
import { DeleteProductButton } from "./delete-product-button";
import { getAdminFamilyRows, type AdminFamilyRow } from "@/features/admin-families";

export function AdminProductEditorPage({
  model,
  families = getAdminFamilyRows()
}: {
  model: AdminProductEditorModel;
  families?: readonly AdminFamilyRow[];
}) {
  const { product } = model;
  const priceLabel = formatProductPriceSummary(model.priceSummary, "en");

  return (
    <div className="admin-product-editor">
      <AdminPageHeader
        eyebrow="Live product record"
        title={product.name}
        description="This page reads the same canonical Supabase product record used by the public catalogue."
        actions={
          <>
            {model.isActive ? (
              <AdminStatusBadge tone="success">Live record</AdminStatusBadge>
            ) : (
              <>
                <AdminStatusBadge tone="neutral">Draft — not public</AdminStatusBadge>
                <form action={activateProduct}>
                  <input type="hidden" name="product_id" value={product.id} />
                  <input type="hidden" name="family_slug" value={product.familySlug} />
                  <input type="hidden" name="product_slug" value={product.slug} />
                  <Button type="submit">Activate product</Button>
                </form>
              </>
            )}
            <ButtonLink href={model.publicHref} variant="secondary">View public product</ButtonLink>
            <ButtonLink href={model.publicFamilyHref} variant="quiet">View public family</ButtonLink>
            <DeleteProductButton
              productId={product.id}
              productName={product.name}
              familySlug={product.familySlug}
              productSlug={product.slug}
            />
          </>
        }
      />

      <AdminAlert tone="info" title="Live product editor">
        Saved identity, copy and SAR price changes are used by the public catalogue. Arabic fields fall back to English when left blank.
      </AdminAlert>

      <form action={saveProduct} className="admin-product-edit-form">
        <input type="hidden" name="product_id" value={product.id} />
        <AdminFormSection title="Product details">
          <div className="admin-editor-grid">
            <AdminField id={`admin-product-${product.id}-name-en`} name="name_en" label="Product name — English" defaultValue={product.name} required />
            <AdminField id={`admin-product-${product.id}-name-ar`} name="name_ar" label="Product name — Arabic" defaultValue={product.nameAr || product.name} direction="rtl" />
            <AdminField id={`admin-product-${product.id}-code`} name="item_code" label="Product code" defaultValue={product.code} required />
            <AdminSelectField id={`admin-product-${product.id}-family`} name="family_slug" label="Instrument family" defaultValue={product.familySlug} options={families.map((item) => ({ value: item.slug, label: item.name }))} required />
            <AdminField id={`admin-product-${product.id}-slug`} name="slug" label="URL slug" defaultValue={product.slug} required />
            <AdminTextareaField id={`admin-product-${product.id}-description-en`} name="description_en" label="Short description — English" defaultValue={product.description || ""} rows={4} />
            <AdminTextareaField id={`admin-product-${product.id}-description-ar`} name="description_ar" label="Short description — Arabic" defaultValue={product.descriptionAr || product.description || ""} direction="rtl" rows={4} />
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Pricing"
          description="Base pricing is optional. Variant pricing is managed per real SKU below and overrides this base only for that configuration."
        >
          <div className="admin-editor-grid">
            <div className="admin-field-preview">
              <label htmlFor={`admin-product-${product.id}-price`}>Base price — SAR</label>
              <input
                id={`admin-product-${product.id}-price`}
                name="price_sar"
                type="text"
                inputMode="decimal"
                pattern="[0-9]+(?:\\.[0-9]{1,2})?"
                defaultValue={product.basePriceSar ?? ""}
                placeholder="Price on request"
                aria-describedby={`admin-product-${product.id}-price-hint`}
              />
              <p className="field__hint" id={`admin-product-${product.id}-price-hint`}>
                Blank means Price on request. Current public price state: {priceLabel}.
              </p>
            </div>
          </div>
        </AdminFormSection>

        <div className="admin-card-actions"><Button type="submit">Save product</Button></div>
      </form>

      <AdminVariantPricing
        productId={product.id}
        familySlug={product.familySlug}
        productSlug={product.slug}
        rows={model.variantPricing}
      />

      <AdminProductOptions groups={model.optionGroups} />

      <AdminSection
        title="Catalogue reference"
        description="The product keeps its verified catalogue family and page reference during migration."
      >
        <dl className="admin-definition-grid">
          <div><dt>Catalogue family</dt><dd>{product.catalogueReference.family}</dd></div>
          <div><dt>Page or section</dt><dd>{product.catalogueReference.page ?? "Not supplied"}</dd></div>
        </dl>
        <div className="admin-card-actions">
          <ButtonLink href={model.adminCatalogueHref} variant="secondary">Open catalogue record</ButtonLink>
          <ButtonLink href={model.publicFamilyHref} variant="quiet">View public family</ButtonLink>
        </div>
      </AdminSection>

      <AdminSection
        title="Primary product image"
        description="Replacing this image updates the canonical product media relationship used by public product surfaces."
      >
        <div className="admin-media-requirement-panel">
          <ProductMediaPlaceholder
            label={product.mediaLabel}
            aspect="landscape"
            src={product.mediaPath}
            fallbackSrc={product.mediaFallbackPath}
            spriteIndex={product.mediaIndex}
          />
          <div>
            <p className="page-eyebrow">Current media</p>
            <h3>{product.mediaLabel}</h3>
            <ProductImageUploadForm
              productId={product.id}
              familySlug={product.familySlug}
              productSlug={product.slug}
            />
          </div>
        </div>
      </AdminSection>

      <AdminSection
        title="Public context"
        description="These links show the same live product record in its public catalogue context."
      >
        <div className="admin-card-actions">
          <ButtonLink href={model.publicHref}>Open current product page</ButtonLink>
          <ButtonLink href={model.publicFamilyHref} variant="secondary">Open filtered product family</ButtonLink>
        </div>
      </AdminSection>

      <AdminProductCompleteness items={model.completeness} />
    </div>
  );
}
