"use server";

import { createClient } from "@/lib/supabase/server";

export async function recover(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: new URL("/admin/recovery", process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000").toString(),
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email for a reset link" };
}
