import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. HONEYPOT SPAM PROTECTION
    // If the hidden "company_name" field is filled out, it's a bot.
    if (body.company_name) {
      // Pretend it succeeded so the bot doesn't try again
      return NextResponse.json({ success: true });
    }

    // 2. BASIC VALIDATION (Security)
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        message: body.message,
      })
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: `Database error` }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Server Catch Error:", err);
    return NextResponse.json({ error: `Server error` }, { status: 500 });
  }
}
