"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-guard";
import { revalidatePath } from "next/cache";

const FIELDS = ["about_us", "contact_email", "contact_phone", "contact_whatsapp", "contact_address"];

export async function saveSiteContent(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  for (const key of FIELDS) {
    const value_en = (formData.get(key + "_en") as string) || "";
    const value_ar = (formData.get(key + "_ar") as string) || "";
    const { error } = await supabase.from("site_settings").update({ value_en, value_ar }).eq("key", key);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/site-content");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/");
  return { success: true };
}
