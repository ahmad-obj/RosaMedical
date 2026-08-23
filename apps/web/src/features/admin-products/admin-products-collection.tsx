"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui";
import { AdminDataTable, AdminStatusBadge, AdminToolbar, type AdminDataTableColumn } from "@/features/admin-primitives";
import { formatProductPriceSummary } from "@/features/pricing";
import { ProductMediaPlaceholder } from "@/features/public-catalogue";
import type { AdminProductRow } from "./admin-product-model";

const columns: readonly AdminDataTableColumn<AdminProductRow>[] = [
  {
    key: "product",
    header: "Product",
    render: (row) => (
      <div className="admin-product-cell">
        <ProductMediaPlaceholder label={row.mediaLabel} aspect="square" className="admin-product-cell__media" src={row.mediaPath} />
        <div><strong>{row.name}</strong><span>{row.code}</span></div>
      </div>
    )
  },
  { key: "family", header: "Family", render: (row) => row.familyName },
  { key: "price", header: "Price", render: (row) => formatProductPriceSummary(row.priceSummary, "en") },
  { key: "status", header: "Status", render: (row) => <AdminStatusBadge tone={row.isActive ? "success" : "draft"}>{row.isActive ? "Live" : "Draft"}</AdminStatusBadge> },
  { key: "options", header: "Options", render: (row) => row.optionSummary.join(" · ") },
  {
    key: "actions",
    header: "Actions",
    render: (row) => (
      <div className="admin-table-actions">
        <ButtonLink href={row.publicHref} variant="quiet" size="small">View public</ButtonLink>
        <ButtonLink href={row.adminHref} variant="secondary" size="small">Edit</ButtonLink>
      </div>
    )
  }
];

export function AdminProductsCollection({
  rows,
  families
}: {
  rows: readonly AdminProductRow[];
  families: readonly { slug: string; name: string }[];
}) {
  const [search, setSearch] = useState("");
  const [family, setFamily] = useState("all");
  const filteredRows = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return rows.filter((row) => {
      const matchesFamily = family === "all" || row.familySlug === family;
      const matchesSearch = !query || `${row.name} ${row.code}`.toLocaleLowerCase().includes(query);
      return matchesFamily && matchesSearch;
    });
  }, [family, rows, search]);

  return (
    <section className="admin-live-collection" aria-label="Product collection">
      <AdminToolbar label="Product collection controls">
        <div className="admin-control-preview">
          <label htmlFor="admin-product-search">Search products</label>
          <input id="admin-product-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Product name or code" />
        </div>
        <div className="admin-control-preview">
          <label htmlFor="admin-products-family-filter">Family</label>
          <select id="admin-products-family-filter" value={family} onChange={(event) => setFamily(event.target.value)}>
            <option value="all">All families</option>
            {families.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </div>
      </AdminToolbar>
      <p className="admin-collection-count" aria-live="polite">{filteredRows.length} of {rows.length} products, including drafts</p>
      {filteredRows.length ? (
        <AdminDataTable caption="Product records" captionVisibility="screen-reader" rows={filteredRows} columns={columns} getRowKey={(row) => row.id} />
      ) : (
        <p className="admin-empty-collection">No products match these filters.</p>
      )}
    </section>
  );
}
