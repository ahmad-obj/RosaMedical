-- Cover quotation snapshot foreign keys used by delete/set-null maintenance and admin lookup paths.

create index idx_quote_request_items_product_id
  on public.quote_request_items(product_id)
  where product_id is not null;

create index idx_quote_request_items_product_variant_id
  on public.quote_request_items(product_variant_id)
  where product_variant_id is not null;
