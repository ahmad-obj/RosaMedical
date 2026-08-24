-- New quotation creation must pass through /api/checkout and the service-role
-- create_quote_request_with_items RPC so product identity and pricing are
-- re-resolved server-side. Existing authenticated read/update policies remain.

drop policy if exists "public submit quote" on public.quote_requests;
drop policy if exists "authenticated insert quotes" on public.quote_requests;

revoke insert on table public.quote_requests from anon, authenticated;
