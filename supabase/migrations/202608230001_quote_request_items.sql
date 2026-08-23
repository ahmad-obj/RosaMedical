-- Structured, immutable quotation line snapshots with server-only atomic creation.

create table public.quote_request_items (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references public.quote_requests(id) on delete cascade,
  sort_order integer not null check (sort_order >= 0),
  product_id uuid null references public.products(id) on delete set null,
  product_variant_id uuid null references public.product_variants(id) on delete set null,
  product_name text not null,
  product_code text not null,
  sku text null,
  size text null,
  variant_type text null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(14,2) null check (unit_price is null or unit_price >= 0),
  currency text not null default 'SAR' check (currency = 'SAR'),
  line_subtotal numeric(16,2) null check (line_subtotal is null or line_subtotal >= 0),
  notes text null,
  created_at timestamptz not null default now(),
  unique (quote_request_id, sort_order)
);

create index idx_quote_request_items_request_id
  on public.quote_request_items(quote_request_id);

create unique index uq_quote_requests_cart_hash
  on public.quote_requests(cart_hash)
  where cart_hash is not null;

alter table public.quote_request_items enable row level security;

revoke all on table public.quote_request_items from public, anon, authenticated;
grant select, insert on table public.quote_request_items to service_role;

create or replace function public.create_quote_request_with_items(
  p_name text,
  p_email text,
  p_phone text,
  p_message text,
  p_cart_hash text,
  p_items jsonb
) returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_quote_request_id uuid;
begin
  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'Quotation items must be a non-empty JSON array.';
  end if;

  insert into public.quote_requests (
    product_id,
    name,
    phone,
    email,
    message,
    user_id,
    status,
    cart_hash
  ) values (
    null,
    p_name,
    nullif(btrim(p_phone), ''),
    nullif(btrim(p_email), ''),
    nullif(p_message, ''),
    null,
    'New',
    nullif(btrim(p_cart_hash), '')
  )
  returning id into v_quote_request_id;

  insert into public.quote_request_items (
    quote_request_id,
    sort_order,
    product_id,
    product_variant_id,
    product_name,
    product_code,
    sku,
    size,
    variant_type,
    quantity,
    unit_price,
    currency,
    line_subtotal,
    notes
  )
  select
    v_quote_request_id,
    (entry.ordinality - 1)::integer,
    nullif(entry.item ->> 'productId', '')::uuid,
    nullif(entry.item ->> 'productVariantId', '')::uuid,
    entry.item ->> 'productName',
    entry.item ->> 'productCode',
    nullif(entry.item ->> 'sku', ''),
    nullif(entry.item ->> 'size', ''),
    nullif(entry.item ->> 'variantType', ''),
    (entry.item ->> 'quantity')::integer,
    nullif(entry.item ->> 'unitPriceSar', '')::numeric(14,2),
    'SAR',
    nullif(entry.item ->> 'lineSubtotalSar', '')::numeric(16,2),
    nullif(entry.item ->> 'notes', '')
  from jsonb_array_elements(p_items) with ordinality as entry(item, ordinality);

  return v_quote_request_id;
end;
$$;

revoke all on function public.create_quote_request_with_items(text, text, text, text, text, jsonb)
  from public, anon, authenticated;
grant execute on function public.create_quote_request_with_items(text, text, text, text, text, jsonb)
  to service_role;
