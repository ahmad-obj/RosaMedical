import Link from "next/link";
import type { Category, Product } from "@/lib/supabase/types";

interface ProductsPageProps {
  categories: Category[];
  products: Product[];
  activeCategory: string | null;
}

export function ProductsPage({ categories, products, activeCategory }: ProductsPageProps) {
  return (
    <div className="bg-rosa-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="lang-en">Products</span>
            <span className="lang-ar">المنتجات</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-rosa-cream/70">
            <span className="lang-en">Browse our full range of specialist surgical instruments.</span>
            <span className="lang-ar">تصفح مجموعتنا الكاملة من الأدوات الجراحية المتخصصة.</span>
          </p>
        </div>
      </section>

      {/* Category Filter Pills */}
      <div className="sticky top-16 z-20 border-y border-rosa-border bg-rosa-dark/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4">
            <Link
              href="/products"
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors ${!activeCategory ? "bg-rosa-accent text-rosa-dark" : "bg-rosa-card text-rosa-cream hover:bg-rosa-border"}`}
            >
              <span className="lang-en">All Products</span>
              <span className="lang-ar">كل المنتجات</span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors ${activeCategory === cat.slug ? "bg-rosa-accent text-rosa-dark" : "bg-rosa-card text-rosa-cream hover:bg-rosa-border"}`}
              >
                <span className="lang-en">{cat.name_en}</span>
                <span className="lang-ar">{cat.name_ar}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-sm text-rosa-muted">
            {products.length === 0 ? (
              <><span className="lang-en">No products found</span><span className="lang-ar">لا توجد منتجات</span></>
            ) : (
              <>
                <span className="lang-en">{products.length} product(s)</span>
                <span className="lang-ar">{products.length} منتج</span>
              </>
            )}
          </p>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-rosa-border py-20 text-center">
              <h3 className="text-xl font-medium text-white">
                <span className="lang-en">No products available in this category yet.</span>
                <span className="lang-ar">لا توجد منتجات متاحة في هذه الفئة بعد.</span>
              </h3>
              <p className="mt-2 text-rosa-muted">
                <span className="lang-en">Please check back later or contact us directly.</span>
                <span className="lang-ar">يرجى التحقق مرة أخرى لاحقًا أو اتصل بنا مباشرة.</span>
              </p>
              <Link href="/contact" className="mt-6 rounded-full bg-rosa-accent px-6 py-2 text-sm font-medium text-rosa-dark">
                <span className="lang-en">Contact Us</span>
                <span className="lang-ar">اتصل بنا</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product.id} className="group flex flex-col overflow-hidden rounded-xl border border-rosa-border bg-rosa-card transition-all hover:-translate-y-1 hover:border-rosa-accent/50 hover:shadow-xl hover:shadow-black/20">
                  <div className="relative aspect-square w-full overflow-hidden bg-rosa-dark/50">
                    <div className="flex h-full items-center justify-center text-rosa-muted transition-transform group-hover:scale-105">
                      <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    {product.sell_mode === "quote" && (
                      <span className="absolute top-4 right-4 rounded-full bg-rosa-accent px-3 py-1 text-xs font-bold text-rosa-dark">
                        <span className="lang-en">Quote</span>
                        <span className="lang-ar">تسعير</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-rosa-accent">{product.item_code}</p>
                    <h3 className="mt-2 font-heading text-xl font-bold text-white">
                      <span className="lang-en">{product.name_en}</span>
                      <span className="lang-ar">{product.name_ar}</span>
                    </h3>
                    <p className="mt-3 flex-1 text-sm text-rosa-cream/70 line-clamp-2">
                      <span className="lang-en">{product.description_en || "High quality surgical instrument engineered for precision and reliability."}</span>
                      <span className="lang-ar">{product.description_ar || "أداة جراحية عالية الجودة مصممة للدقة والموثوقية."}</span>
                    </p>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <Link 
                        href={`/contact?product=${product.slug}`} 
                        className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-rosa-dark transition-colors hover:bg-rosa-cream"
                      >
                        <span className="lang-en">Request Quote</span>
                        <span className="lang-ar">طلب تسعير</span>
                      </Link>
                      {product.stock_status === "in_stock" && (
                        <span className="flex items-center gap-1.5 text-xs text-green-400">
                          <span className="h-2 w-2 rounded-full bg-green-400"></span> 
                          <span className="lang-en">In Stock</span>
                          <span className="lang-ar">متوفر</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
