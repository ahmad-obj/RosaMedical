"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-guard";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const name_en = formData.get("name_en") as string;
  const { error } = await supabase.from("products").insert({
    item_code: formData.get("item_code") as string,
    category_id: formData.get("category_id") as string,
    name_en,
    name_ar: formData.get("name_ar") as string,
    description_en: formData.get("description_en") as string,
    description_ar: formData.get("description_ar") as string,
    sell_mode: formData.get("sell_mode") as string,
    stock_status: formData.get("stock_status") as string || "in_stock",
    is_active: formData.get("is_active") === "on",
    slug: slugify(name_en),
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const name_en = formData.get("name_en") as string;
  const { error } = await supabase.from("products").update({
    item_code: formData.get("item_code") as string,
    category_id: formData.get("category_id") as string,
    name_en,
    name_ar: formData.get("name_ar") as string,
    description_en: formData.get("description_en") as string,
    description_ar: formData.get("description_ar") as string,
    sell_mode: formData.get("sell_mode") as string,
    stock_status: formData.get("stock_status") as string || "in_stock",
    is_active: formData.get("is_active") === "on",
    slug: slugify(name_en),
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}
