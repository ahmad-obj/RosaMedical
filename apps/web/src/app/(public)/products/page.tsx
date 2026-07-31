import { getCategories, getProducts } from "@/lib/supabase/queries";
import { ProductsPage } from "@/components/sections/products";

export const metadata = {
  title: "Products \u2014 Rosa Medical",
  description: "Browse our full range of medical instruments and supplies.",
};

export default async function ProductsRoute({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  // Filter products by category slug if specified
  const filtered = category
    ? products.filter((p) => {
        const cat = categories.find((c) => c.slug === category);
        return cat ? p.category_id === cat.id : true;
      })
    : products;

  return <ProductsPage categories={categories} products={filtered} activeCategory={category || null} />;
}
