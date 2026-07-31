"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-guard";
import { revalidatePath } from "next/cache";

export async function markMessageRead(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").update({ read: true }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteContactMessage(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteQuoteRequest(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { success: true };
}
