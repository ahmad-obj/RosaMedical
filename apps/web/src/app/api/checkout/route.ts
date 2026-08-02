import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface CheckoutRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CheckoutRequestBody;
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user === null) return NextResponse.json({ error: "Auth required" }, { status: 401 });
    let p = (body.phone || "").split(" ").join("").split("-").join("");
    if (p.indexOf("+") !== 0) p = "+" + p;
    if (p.length < 8) return NextResponse.json({ error: "Invalid phone." }, { status: 400 });

    const message = body.message || "";
    const cartHash = crypto.createHash("sha256").update(message).digest("hex");
    const { data: existing } = await supabase.from("quote_requests").select("id").eq("user_id", data.user.id).eq("cart_hash", cartHash).maybeSingle();
    if (existing) return NextResponse.json({ error: "You have already placed this exact order." }, { status: 400 });

    const { error } = await supabase.from("quote_requests").insert({ user_id: data.user.id, name: body.name, email: body.email, phone: p, message, cart_hash: cartHash });
    if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
