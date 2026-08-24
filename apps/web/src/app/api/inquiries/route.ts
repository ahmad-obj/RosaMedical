import { NextResponse } from "next/server";
import { requireApiOwner, requireApiUser } from "@/lib/supabase/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const OWNER_INQUIRY_SELECT = `
  *,
  quote_request_items(
    id,quote_request_id,sort_order,product_id,product_variant_id,
    product_name,product_code,sku,size,variant_type,quantity,
    unit_price,currency,line_subtotal,notes,created_at
  )
`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope");

  if (scope === "mine") {
    const auth = await requireApiUser();
    if (!auth.ok) return auth.response;

    const { data, error } = await auth.supabase
      .from("quote_requests")
      .select("*")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to load inquiries" }, { status: 500 });
    }
    return NextResponse.json(data || []);
  }

  const auth = await requireApiOwner();
  if (!auth.ok) return auth.response;

  const database = createAdminClient();
  let query = database
    .from("quote_requests")
    .select(OWNER_INQUIRY_SELECT)
    .order("created_at", { ascending: false });

  const search = (searchParams.get("search") || "").replace(/[%,().]/g, " ").trim();
  const status = searchParams.get("status") || "All inquiry states";

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (status !== "All inquiry states") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Failed to load inquiries" }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
