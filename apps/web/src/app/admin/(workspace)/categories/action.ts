"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-guard";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    slug: formData.get("slug") as string,
    name_en: formData.get("name_en") as string,
    name_ar: formData.get("name_ar") as string,
    is_active: formData.get("is_active") === "on",
    sort_order: Number(formData.get("sort_order")) || 1,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("categories").update({
    slug: formData.get("slug") as string,
    name_en: formData.get("name_en") as string,
    name_ar: formData.get("name_ar") as string,
    is_active: formData.get("is_active") === "on",
    sort_order: Number(formData.get("sort_order")) || 1,
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}
