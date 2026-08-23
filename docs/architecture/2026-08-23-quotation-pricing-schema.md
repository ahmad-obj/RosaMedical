# Quotation Pricing Snapshot Architecture — 2026-08-23

## Purpose

Rosa Medical quotation requests can contain multiple product configurations, quantities, and a mixture of published SAR prices and `Price on request` lines. Browser/localStorage pricing is useful for immediate UI feedback but is not authoritative commercial data.

The quotation persistence model therefore stores server-resolved line snapshots alongside the existing `quote_requests` parent record.

## Source of truth

At submission time the server resolves:

- `products.price` as the optional base SAR price;
- `product_variants.price_override` as the optional configuration override;
- effective configuration price as `price_override ?? price ?? null`.

Client-supplied `unitPriceSar` is ignored for persisted commercial values.

## Structured line snapshots

Migration `supabase/migrations/202608230001_quote_request_items.sql` adds `public.quote_request_items`.

Each row preserves the state used for that submitted quotation:

- stable line order;
- product and variant foreign keys when still available;
- product name/code and SKU snapshots;
- size/type snapshots;
- quantity;
- resolved unit price or null;
- SAR currency;
- exact line subtotal or null;
- customer line note;
- creation timestamp.

The textual parent `quote_requests.message` remains as a readable compatibility snapshot for historical/admin workflows, but new pricing-aware code should treat `quote_request_items` as the structured line source.

## Atomic creation

`public.create_quote_request_with_items(...)` creates the parent request and all ordered child lines inside one PostgreSQL function call/transaction. A failure in any child line rolls the entire request back.

The function is `SECURITY INVOKER`. Execution is revoked from `public`, `anon`, and `authenticated` and granted only to `service_role`. The child table has RLS enabled, no anonymous policies, and direct privileges are revoked from public browser roles.

## Duplicate protection

Existing request idempotency uses `quote_requests.cart_hash`. Preflight on 2026-08-23 found seven non-null hashes across eight requests and no duplicate non-null hashes, allowing a partial unique index:

```sql
create unique index uq_quote_requests_cart_hash
  on public.quote_requests(cart_hash)
  where cart_hash is not null;
```

The application continues to compute the hash from customer/request identity, product/configuration identity, quantity, and notes—not from price—so a price change does not make an accidental duplicate request appear unique.

## Historical compatibility

Rows created before this migration do not have child snapshots. Admin inquiry rendering must therefore:

1. prefer ordered `quote_request_items` when present;
2. fall back to the existing parent message/details when child rows are absent.

No historical quotation rows are rewritten by this migration.
