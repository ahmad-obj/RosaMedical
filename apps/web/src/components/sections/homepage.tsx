import Link from "next/link";

export function Homepage() {
  const families = [
    { en: "Knives", ar: "سكاكين" },
    { en: "Scissors", ar: "مقصات" },
    { en: "Punches", ar: "مثاقب" },
    { en: "Chisels", ar: "إزميل" },
    { en: "Cutters", ar: "قواطع" }
  ];

  return (
    <div className="bg-rosa-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-block rounded-full border border-rosa-border bg-rosa-card px-4 py-1.5 text-xs font-medium tracking-wide text-rosa-accent uppercase">
            <span className="lang-en">Trusted Surgical Excellence</span>
            <span className="lang-ar">التميز الجراحي الموثوق</span>
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
            <span className="lang-en">Premium Medical Supplies</span>
            <span className="lang-ar">مستلزمات طبية متميزة</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-rosa-cream/80 sm:text-xl">
            <span className="lang-en">Trusted by professionals across surgical specialties. Quality instruments you can rely on, delivered with care.</span>
            <span className="lang-ar">موثوق من قبل المحترفين في مختلف التخصصات الجراحية. أدوات عالية الجودة يمكنك الاعتماد عليها، تُسلّم بعناية.</span>
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/products" className="w-full rounded-lg bg-rosa-accent px-8 py-4 text-center font-semibold text-rosa-dark transition-all hover:bg-rosa-accent/90 hover:shadow-lg hover:shadow-rosa-accent/20 sm:w-auto">
              <span className="lang-en">Browse Products</span>
              <span className="lang-ar">تصفح المنتجات</span>
            </Link>
            <Link href="/contact" className="w-full rounded-lg border border-rosa-border bg-rosa-card/50 px-8 py-4 text-center font-semibold text-white backdrop-blur transition-all hover:border-rosa-accent/50 hover:bg-rosa-card sm:w-auto">
              <span className="lang-en">Request Quotation</span>
              <span className="lang-ar">طلب عرض سعر</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Instrument Families Section */}
      <section className="border-t border-rosa-border py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <span className="lang-en">Instrument Families</span>
              <span className="lang-ar">عائلات الأدوات</span>
            </h2>
            <p className="mt-4 text-lg text-rosa-muted">
              <span className="lang-en">Explore our curated ranges of specialist surgical instruments.</span>
              <span className="lang-ar">استكشف مجموعاتنا المنتقاة من الأدوات الجراحية المتخصصة.</span>
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {families.map((family) => (
              <Link 
                key={family.en} 
                href={`/products?category=${family.en.toLowerCase()}`}
                className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-rosa-border bg-rosa-card p-10 transition-all hover:-translate-y-1 hover:border-rosa-accent hover:shadow-xl hover:shadow-rosa-dark"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-rosa-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                
                <span className="relative font-heading text-xl font-medium text-white transition-colors group-hover:text-rosa-accent">
                  <span className="lang-en">{family.en}</span>
                  <span className="lang-ar">{family.ar}</span>
                </span>
                <span className="relative mt-2 text-xs text-rosa-muted opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="lang-en">View Collection →</span>
                  <span className="lang-ar">عرض المجموعة ←</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-t border-rosa-border bg-rosa-card py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-rosa-accent)_0%,_transparent_70%)] opacity-5"></div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="lang-en">Ready to Get Started?</span>
            <span className="lang-ar">جاهز للبدء؟</span>
          </h2>
          <p className="mt-4 text-lg text-rosa-muted">
            <span className="lang-en">Browse our catalog or reach out to our team for personalized recommendations.</span>
            <span className="lang-ar">تصفح كتالوجنا أو تواصل مع فريقنا للحصول على توصيات مخصصة.</span>
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/products" className="rounded-lg bg-white px-8 py-4 font-semibold text-rosa-dark transition-colors hover:bg-rosa-cream">
              <span className="lang-en">View Products</span>
              <span className="lang-ar">عرض المنتجات</span>
            </Link>
            <Link href="/about" className="rounded-lg border border-rosa-border bg-transparent px-8 py-4 font-semibold text-white transition-colors hover:bg-rosa-dark">
              <span className="lang-en">Learn More About Us</span>
              <span className="lang-ar">اعرف المزيد عنا</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
