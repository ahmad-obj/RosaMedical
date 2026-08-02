import type { Route } from "next";
import { Button, ButtonLink } from "@/components/ui";
import {
  AdminAlert,
  AdminDataTable,
  AdminFilterPreview,
  AdminPageHeader,
  AdminPaginationPreview,
  AdminSearchPreview,
  AdminSection,
  AdminStatusBadge,
  AdminToolbar,
  type AdminDataTableColumn
} from "@/features/admin-primitives";
import { ProductMediaPlaceholder } from "@/features/public-catalogue";
import { getAdminFamilyRows } from "@/features/admin-families";
import { createClient } from "@/lib/supabase/server";
import type { Product, Category } from "@/lib/supabase/types";

interface LiveProductRow {
  id: string;
  name: string;
  code: string;
  familyName: string;
  familyHref: Route<string>;
  optionSummary: string[];
  catalogueReference: string;
  mediaLabel: string;
  publicHref: Route<string>;
  adminHref: Route<string>;
}

const columns: readonly AdminDataTableColumn<LiveProductRow>[] = [
  {
    key: "product",
    header: "Product",
    render: (row) => (
      <div className="admin-product-cell">
        <ProductMediaPlaceholder
          label={row.mediaLabel}
          aspect="square"
          className="admin-product-cell__media"
        />
        <div>
          <strong>{row.name}</strong>
          <span>{row.code}</span>
        </div>
      </div>
    )
  },
  {
    key: "family",
    header: "Family",
    render: (row) => (
      <ButtonLink href={row.familyHref} variant="quiet" size="small">
        {row.familyName}
      </ButtonLink>
    )
  },
  {
    key: "options",
    header: "Documented options",
    render: (row) => row.optionSummary.join(" · ")
  },
  {
    key: "catalogue",
    header: "Catalogue reference",
    render: (row) => row.catalogueReference
  },
  {
    key: "media",
    header: "Media requirement",
    render: (row) => row.mediaLabel
  },
  {
    key: "record",
    header: "Record",
    render: () => <AdminStatusBadge tone="neutral">Live DB Record</AdminStatusBadge>
  },
  {
    key: "actions",
    header: "Actions",
    render: (row) => (
      <div className="admin-table-actions">
        <ButtonLink href={row.publicHref} variant="quiet" size="small">
          View public
        </ButtonLink>
        <ButtonLink href={row.adminHref} variant="secondary" size="small">
          Open editor
        </ButtonLink>
      </div>
    )
  }
];

export async function AdminProductsListPage() {
  const supabase = await createClient();
  const [productsRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").eq("deleted_at", null)
  ]);

  const products = (productsRes.data || []) as Product[];
  const categories = (categoriesRes.data || []) as Category[];
  const families = getAdminFamilyRows();

  const rows: LiveProductRow[] = products.map((product) => {
    const category = categories.find((candidate) => candidate.id === product.category_id);
    const familyHref = (category ? `/products?category=${category.slug}` : "/products") as Route<string>;
    const publicHref = `/products?category=${category?.slug || ""}` as Route<string>;
    const adminHref = "/admin/products" as Route<string>;

    return {
      id: product.id,
      name: product.name_en,
      code: product.item_code || "N/A",
      familyName: category?.name_en || "Uncategorized",
      familyHref,
      optionSummary: [product.stock_status, product.sell_mode].filter(Boolean),
      catalogueReference: category?.name_en || "N/A",
      mediaLabel: "Image required",
      publicHref,
      adminHref
    };
  });

  return (
    <div className="admin-products-page">
      <AdminPageHeader
        eyebrow="Products"
        title="Manage the instrument catalogue."
        description="This composition reflects live backend records from Supabase."
        actions={<Button disabled>Add product</Button>}
      />

      <AdminAlert tone="info" title="Live Database Connection">
        Showing {rows.length} live products from Supabase.
      </AdminAlert>

      <AdminToolbar label="Product collection controls">
        <AdminSearchPreview label="Search products" placeholder="Product name or code" />
        <AdminFilterPreview
          id="admin-products-family-filter"
          label="Family"
          options={["All families", ...families.map((family) => family.name)]}
        />
      </AdminToolbar>

      <p className="admin-collection-count">{rows.length} live products</p>

      <AdminDataTable
        caption="Live product records"
        captionVisibility="screen-reader"
        rows={rows}
        columns={columns}
        getRowKey={(row) => row.id}
      />

      <AdminPaginationPreview label="Product collection pagination" />

      <AdminSection
        title="Instrument families"
        eyebrow="Family summary"
        description="Counts are derived from the live database."
      >
        <div className="admin-family-grid admin-family-grid--summary">
          {families.map((family) => (
            <article className="admin-family-card" data-admin-family-card="true" key={family.slug}>
              <p className="page-eyebrow">{family.sequence}</p>
              <h3>{family.name}</h3>
              <p>{family.productCount} source products</p>
              <div className="admin-card-actions">
                <ButtonLink href={family.publicHref} variant="quiet" size="small">
                  View public
                </ButtonLink>
                <ButtonLink href={family.adminHref} variant="secondary" size="small">
                  Open family
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </AdminSection>
    </div>
  );
}
