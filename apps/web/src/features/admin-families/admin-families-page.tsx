import type { Route } from "next";
import { Button, ButtonLink } from "@/components/ui";
import {
  AdminAlert,
  AdminPageHeader
} from "@/features/admin-primitives";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/supabase/types";

interface LiveFamilyRow {
  slug: string;
  sequence: string;
  name: string;
  introduction: string;
  productCount: number;
  catalogueLabel: string;
  publicHref: Route<string>;
  adminHref: Route<string>;
}

export async function AdminFamiliesPage() {
  const supabase = await createClient();

  const [catRes, prodRes] = await Promise.all([
    supabase.from("categories").select("*").is("deleted_at", null).order("sort_order", { ascending: true }),
    supabase.from("products").select("category_id")
  ]);

  const categories = (catRes.data || []) as Category[];
  const products = (prodRes.data || []) as Product[];

  const families: LiveFamilyRow[] = categories.map((cat, index) => {
    const count = products.filter((product) => product.category_id === cat.id).length;
    const seq = String(index + 1).padStart(2, "0");
    const publicHref = `/products?category=${cat.slug}` as Route<string>;
    const adminHref = "/admin/families" as Route<string>;

    return {
      slug: cat.slug,
      sequence: seq,
      name: cat.name_en,
      introduction: "Live category managed from Supabase.",
      productCount: count,
      catalogueLabel: `${cat.name_en} catalogue`,
      publicHref,
      adminHref
    };
  });

  return (
    <div className="admin-families-page">
      <AdminPageHeader
        eyebrow="Families"
        title="Organise the five instrument families."
        description="Every card is derived from the live Supabase database."
        actions={<Button disabled>Add family</Button>}
      />

      <AdminAlert tone="info" title="Live Database Connection">
        Showing {families.length} live families from Supabase.
      </AdminAlert>

      <div className="admin-family-grid">
        {families.map((family) => (
          <article
            className="admin-family-card"
            data-admin-family-card="true"
            key={family.slug}
          >
            <p className="page-eyebrow">{family.sequence}</p>
            <h2>{family.name}</h2>
            <p>{family.introduction}</p>
            <dl>
              <div><dt>Products</dt><dd>{family.productCount}</dd></div>
              <div><dt>Catalogue label</dt><dd>{family.catalogueLabel}</dd></div>
            </dl>
            <div className="admin-card-actions">
              <ButtonLink href={family.publicHref} variant="quiet" size="small">
                View public family
              </ButtonLink>
              <ButtonLink href={family.adminHref} variant="secondary" size="small">
                Open family editor
              </ButtonLink>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
