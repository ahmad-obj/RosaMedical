import type { Route } from "next";
import { Button, ButtonLink } from "@/components/ui";
import {
  AdminAlert,
  AdminDataTable,
  AdminFilterPreview,
  AdminPageHeader,
  AdminSearchPreview,
  AdminStatusBadge,
  AdminToolbar,
  type AdminDataTableColumn
} from "@/features/admin-primitives";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";

interface LiveCatalogueRow {
  familySlug: string;
  sequence: string;
  familyName: string;
  name: string;
  description: string;
  coverLabel: string;
  sourceStatus: string;
  availability: "Public PDF path registered" | "Awaiting publication";
  publicCataloguesHref: Route<string>;
  publicFamilyHref: Route<string>;
  adminHref: Route<string>;
}

const columns: readonly AdminDataTableColumn<LiveCatalogueRow>[] = [
  {
    key: "document",
    header: "Document",
    render: (row) => (
      <div className="admin-catalogue-cell">
        <div className="admin-catalogue-cover-placeholder" role="img" aria-label={row.coverLabel}>
          <span>{row.sequence}</span>
        </div>
        <div>
          <strong>{row.name}</strong>
          <span>{row.familyName}</span>
        </div>
      </div>
    )
  },
  { key: "description", header: "Description", render: (row) => row.description },
  { key: "cover", header: "Cover requirement", render: (row) => row.coverLabel },
  { key: "source", header: "Source", render: (row) => row.sourceStatus },
  {
    key: "availability",
    header: "PDF availability",
    render: (row) => (
      <AdminStatusBadge tone={row.availability === "Awaiting publication" ? "warning" : "neutral"}>
        {row.availability}
      </AdminStatusBadge>
    )
  },
  {
    key: "actions",
    header: "Actions",
    render: (row) => (
      <div className="admin-table-actions">
        <ButtonLink href={row.publicCataloguesHref} variant="quiet" size="small">Public catalogues</ButtonLink>
        <ButtonLink href={row.publicFamilyHref} variant="quiet" size="small">Public family</ButtonLink>
        <ButtonLink href={row.adminHref} variant="secondary" size="small">Open record</ButtonLink>
      </div>
    )
  }
];

export async function AdminCataloguesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  const categories = (data || []) as Category[];

  const rows: LiveCatalogueRow[] = categories.map((cat, index) => {
    const seq = String(index + 1).padStart(2, "0");
    const publicFamilyHref = `/products?category=${cat.slug}` as Route<string>;

    return {
      familySlug: cat.slug,
      sequence: seq,
      familyName: cat.name_en,
      name: `${cat.name_en} technical catalogue`,
      description: `Catalogue for ${cat.name_en} instruments.`,
      coverLabel: "Technical family catalogue",
      sourceStatus: "Live DB Record",
      availability: "Awaiting publication",
      publicCataloguesHref: "/catalogues",
      publicFamilyHref,
      adminHref: "/admin/catalogues"
    };
  });

  return (
    <div className="admin-catalogues-page">
      <AdminPageHeader
        eyebrow="Catalogues"
        title="Maintain technical document records."
        description="These records are derived from the live Supabase database."
        actions={<Button disabled>Upload catalogue</Button>}
      />

      <AdminAlert tone="info" title="Live Database Connection">
        Showing {rows.length} live catalogue records from Supabase.
      </AdminAlert>

      <AdminToolbar label="Catalogue collection controls">
        <AdminSearchPreview label="Search catalogues" placeholder="Family or catalogue title" />
        <AdminFilterPreview
          id="admin-catalogue-availability"
          label="PDF availability"
          options={["All availability", "Public PDF path registered", "Awaiting publication"]}
        />
      </AdminToolbar>

      <p className="admin-collection-count">{rows.length} live catalogue records</p>

      <AdminDataTable
        caption="Live catalogue records"
        captionVisibility="screen-reader"
        rows={rows}
        columns={columns}
        getRowKey={(row) => row.familySlug}
      />
    </div>
  );
}
