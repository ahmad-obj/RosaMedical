"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-guard";
import { revalidatePath } from "next/cache";

export async function approveQuote(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const date = formData.get("appointment_date") as string;
  const { error } = await supabase.from("quote_requests").update({ status: "approved", appointment_date: date }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function declineQuote(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").update({ status: "declined" }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { success: true };
}
