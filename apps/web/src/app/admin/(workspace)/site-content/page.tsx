import { requireAdmin } from "@/lib/supabase/auth-guard";
import { createClient } from "@/lib/supabase/server";
import { SiteContentClient } from "./site-content-client";

export default async function SiteContentPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*");
  const map: Record<string, { value_en: string; value_ar: string }> = {};
  for (const row of settings || []) {
    map[row.key] = { value_en: row.value_en, value_ar: row.value_ar };
  }
  return <SiteContentClient settings={map} />;
}
