import { Button } from "@/components/ui";
import { AdminField, AdminFormSection, AdminSelectField, AdminTextareaField } from "@/features/admin-primitives";
import { getLiveAdminFamilyRows } from "@/features/admin-families";
import { SAR_HTML_PATTERN } from "@/features/pricing";
import { createProduct } from "./actions";

type AdminFamilyRow = Awaited<ReturnType<typeof getLiveAdminFamilyRows>>[number];

export function AdminProductCreateForm({
  families
}: {
  families: readonly AdminFamilyRow[];
}) {
  return (
    <form action={createProduct} className="admin-product-create-form">
      <AdminFormSection
        title="New product"
        description="Products are created as drafts (inactive) and won't appear on the public catalogue until activated from the product editor."
      >
        <div className="admin-editor-grid">
          <AdminSelectField
            id="admin-new-product-family"
            name="family_slug"
            label="Instrument family"
            options={families.map((family) => ({ value: family.slug, label: family.name }))}
            required
          />
          <AdminField
            id="admin-new-product-name-en"
            name="name_en"
            label="Product name — English"
            required
          />
          <AdminField
            id="admin-new-product-name-ar"
            name="name_ar"
            label="Product name — Arabic"
            direction="rtl"
          />
          <AdminField
            id="admin-new-product-item-code"
            name="item_code"
            label="Item code"
            required
          />
          <AdminField
            id="admin-new-product-slug"
            name="slug"
            label="URL slug"
            hint="Leave blank to generate automatically from the product name."
          />
          <div className="admin-field-preview">
            <label htmlFor="admin-new-product-price">Base price — SAR</label>
            <input
              id="admin-new-product-price"
              name="price_sar"
              type="text"
              inputMode="decimal"
              pattern={SAR_HTML_PATTERN}
              placeholder="e.g. 120.00"
              aria-describedby="admin-new-product-price-hint"
            />
            <p className="field__hint" id="admin-new-product-price-hint">
              Optional. Leave blank to show Price on request. Variant overrides can be added after creation.
            </p>
          </div>
          <AdminTextareaField
            id="admin-new-product-description-en"
            name="description_en"
            label="Short description — English"
          />
          <AdminTextareaField
            id="admin-new-product-description-ar"
            name="description_ar"
            label="Short description — Arabic"
            direction="rtl"
          />
        </div>
      </AdminFormSection>

      <div className="admin-card-actions">
        <Button type="submit">Create draft product</Button>
      </div>
    </form>
  );
}
