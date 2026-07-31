import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/recovery";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(origin + next);
    }
  }

  // If the hash-based auth is used, redirect to recovery page
  // The client will handle the token from the URL hash
  return NextResponse.redirect(origin + "/admin/recovery?update=true");
}
