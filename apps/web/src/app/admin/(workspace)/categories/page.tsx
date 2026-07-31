import { getCategories } from "@/lib/supabase/queries";
import { CategoriesClient } from "./categories-client";

export default async function CategoriesPage() {
  const categories = await getCategories();
  
  return <CategoriesClient initialCategories={categories || []} />;
}
