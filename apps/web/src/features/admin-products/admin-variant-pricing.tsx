import { Button } from "@/components/ui";
import { AdminDataTable, AdminSection, type AdminDataTableColumn } from "@/features/admin-primitives";
import { formatSar } from "@/features/pricing";
import type { AdminVariantPricingRow } from "./admin-product-model";
import { saveVariantPriceOverride } from "./actions";

export function AdminVariantPricing({
  productId,
  familySlug,
  productSlug,
  rows
}: {
  productId: string;
  familySlug: string;
  productSlug: string;
  rows: readonly AdminVariantPricingRow[];
}) {
  const columns: readonly AdminDataTableColumn<AdminVariantPricingRow>[] = [
    { key: "sku", header: "SKU", render: (row) => row.sku || "Not supplied" },
    { key: "size", header: "Size", render: (row) => row.size || "Not supplied" },
    { key: "type", header: "Type / direction", render: (row) => row.variantType || "Not supplied" },
    {
      key: "override",
      header: "Price override — SAR",
      render: (row) => (
        <form action={saveVariantPriceOverride} className="admin-variant-price-form">
          <input type="hidden" name="product_id" value={productId} />
          <input type="hidden" name="variant_id" value={row.id} />
          <input type="hidden" name="family_slug" value={familySlug} />
          <input type="hidden" name="product_slug" value={productSlug} />
          <label className="visually-hidden" htmlFor={`variant-price-${row.id}`}>
            SAR price override for {row.sku || row.id}
          </label>
          <input
            id={`variant-price-${row.id}`}
            name="price_override_sar"
            type="text"
            inputMode="decimal"
            pattern="[0-9]+(?:\\.[0-9]{1,2})?"
            defaultValue={row.priceOverrideSar ?? ""}
            placeholder="Inherit base"
            aria-describedby={`variant-price-${row.id}-hint`}
          />
          <span id={`variant-price-${row.id}-hint`} className="field__hint">
            Blank inherits the base product price.
          </span>
          <Button type="submit" size="small">Save</Button>
        </form>
      )
    },
    {
      key: "effective",
      header: "Effective price",
      render: (row) => row.effectivePriceSar ? formatSar(row.effectivePriceSar, "en") : "Price on request"
    }
  ];

  return (
    <AdminSection
      title="Variant pricing"
      description="Each real SKU can override the base SAR price. Saving one row never partially changes other variants."
    >
      {rows.length ? (
        <AdminDataTable
          caption="Variant SAR pricing"
          captionVisibility="screen-reader"
          rows={rows}
          columns={columns}
          getRowKey={(row) => row.id}
        />
      ) : (
        <p>No live variant rows are registered for this product. The base price applies to the product as a whole.</p>
      )}
    </AdminSection>
  );
}
