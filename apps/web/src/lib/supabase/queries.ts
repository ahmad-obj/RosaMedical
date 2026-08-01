import { createClient } from "@/lib/supabase/server";
import type { Category, Product, SiteSetting } from "./types";

// PUBLIC: Only get active categories (deleted_at is null)
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });
  
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data as Category[];
}

// ADMIN: Get ALL categories (including trashed)
export async function getAdminCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("deleted_at", { ascending: true, nullsFirst: false }); // Active first, then trashed
  
  if (error) {
    console.error("Error fetching admin categories:", error);
    return [];
  }
  return data as Category[];
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data as Product[];
}

export async function getSiteSettings(): Promise<SiteSetting[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*");
  
  if (error) {
    console.error("Error fetching site settings:", error);
    return [];
  }
  return data as SiteSetting[];
}

export async function getSettingValue(key: string): Promise<string | null> {
  const settings = await getSiteSettings();
  const setting = settings.find(s => s.key === key);
  return setting ? setting.value_en : null;
}
