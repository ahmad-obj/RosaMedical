import Link from "next/link";

export function AboutPage() {
  return (
    <div className="bg-rosa-dark min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="lang-en">About Rosa Medical</span>
            <span className="lang-ar">عن روزا ميديكال</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-rosa-cream/70">
            <span className="lang-en">Your trusted partner in premium medical supplies.</span>
            <span className="lang-ar">شريكك الموثوق في المستلزمات الطبية المتميزة.</span>
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-rosa-border bg-rosa-card p-8 shadow-lg md:p-12">
            <h2 className="font-heading text-2xl font-bold text-rosa-accent">
              <span className="lang-en">Our Story</span>
              <span className="lang-ar">قصتنا</span>
            </h2>
            <div className="mt-4 space-y-4 text-rosa-cream/80 leading-relaxed">
              <p>
                <span className="lang-en">Rosa Medical is your trusted partner in premium medical supplies. We specialize in providing high-quality products for plastic surgery and orthodontics, ensuring that healthcare professionals have the tools they need to deliver exceptional patient care.</span>
                <span className="lang-ar">روزا ميديكال هي شريكك الموثوق في المستلزمات الطبية المتميزة. نتخصص في توفير منتجات عالية الجودة لجراحة التجميل وتقويم الأسنان، مما يضمن حصول المتخصصين في الرعاية الصحية على الأدوات التي يحتاجونها لتقديم رعاية استثنائية للمرضى.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-rosa-border bg-rosa-card p-8 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rosa-dark text-rosa-accent mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                <span className="lang-en">Our Mission</span>
                <span className="lang-ar">مهمتنا</span>
              </h3>
              <p className="mt-2 text-rosa-muted">
                <span className="lang-en">To provide healthcare professionals with the highest quality medical supplies, backed by exceptional service and expertise. We believe that every practitioner deserves access to premium tools that help them deliver the best possible patient outcomes.</span>
                <span className="lang-ar">تزويد المتخصصين في الرعاية الصحية بأعلى جودة من المستلزمات الطبية، مدعومة بخدمة وخبرة استثنائية. نحن نؤمن بأن كل ممارس يستحق الوصول إلى أدوات متميزة تساعده في تحقيق أفضل النتائج الممكنة للمرضى.</span>
              </p>
            </div>
            <div className="rounded-xl border border-rosa-border bg-rosa-card p-8 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rosa-dark text-rosa-accent mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                <span className="lang-en">Our Vision</span>
                <span className="lang-ar">رؤيتنا</span>
              </h3>
              <p className="mt-2 text-rosa-muted">
                <span className="lang-en">To become the leading provider of specialized medical supplies in the region, known for quality, reliability, and bilingual excellence. We envision a future where every medical practice has access to the tools and support they need to transform lives.</span>
                <span className="lang-ar">أن نصبح المزود الرائد للمستلزمات الطبية المتخصصة في المنطقة، معروفين بالجودة والموثوقية والتميز ثنائي اللغة. نتصور مستقبلاً يكون فيه لكل عيادة طبية وصول إلى الأدوات والدعم التي تحتاجها لتغيير حياة المرضى.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 border-t border-rosa-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-white">
              <span className="lang-en">Why Choose Rosa Medical</span>
              <span className="lang-ar">لماذا تختار روزا ميديكال</span>
            </h2>
            <p className="mt-4 text-rosa-muted">
              <span className="lang-en">What sets us apart in the medical supply industry</span>
              <span className="lang-ar">ما يميزنا في صناعة المستلزمات الطبية</span>
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-rosa-border bg-rosa-card p-6 hover:border-rosa-accent/50 transition-colors">
              <h3 className="font-heading text-lg font-bold text-rosa-accent">
                <span className="lang-en">Quality Guaranteed</span>
                <span className="lang-ar">جودة مضمونة</span>
              </h3>
              <p className="mt-2 text-sm text-rosa-muted">
                <span className="lang-en">Every product in our catalog meets the highest standards of medical-grade quality and safety.</span>
                <span className="lang-ar">كل منتج في كتالوجنا يلبي أعلى معايير الجودة والسلامة الطبية.</span>
              </p>
            </div>
            <div className="rounded-xl border border-rosa-border bg-rosa-card p-6 hover:border-rosa-accent/50 transition-colors">
              <h3 className="font-heading text-lg font-bold text-rosa-accent">
                <span className="lang-en">Bilingual Support</span>
                <span className="lang-ar">دعم ثنائي اللغة</span>
              </h3>
              <p className="mt-2 text-sm text-rosa-muted">
                <span className="lang-en">Full support in English and Arabic, with product descriptions and documentation in both languages.</span>
                <span className="lang-ar">دعم كامل باللغتين الإنجليزية والعربية، مع أوصاف المنتجات والوثائق باللغتين.</span>
              </p>
            </div>
            <div className="rounded-xl border border-rosa-border bg-rosa-card p-6 hover:border-rosa-accent/50 transition-colors">
              <h3 className="font-heading text-lg font-bold text-rosa-accent">
                <span className="lang-en">Expert Consultation</span>
                <span className="lang-ar">استشارة الخبراء</span>
              </h3>
              <p className="mt-2 text-sm text-rosa-muted">
                <span className="lang-en">Our team of specialists can help you find the right products for your practice's unique needs.</span>
                <span className="lang-ar">يمكن لفريقنا من المتخصصين مساعدتك في العثور على المنتجات المناسبة للاحتياجات الفريدة لعيادتك.</span>
              </p>
            </div>
            <div className="rounded-xl border border-rosa-border bg-rosa-card p-6 hover:border-rosa-accent/50 transition-colors">
              <h3 className="font-heading text-lg font-bold text-rosa-accent">
                <span className="lang-en">Fast Delivery</span>
                <span className="lang-ar">توصيل سريع</span>
              </h3>
              <p className="mt-2 text-sm text-rosa-muted">
                <span className="lang-en">Efficient logistics ensure your supplies arrive on time, every time, wherever your practice is located.</span>
                <span className="lang-ar">تضمن الخدمات اللوجستية الفعالة وصول مستلزماتك في الوقت المحدد، في كل مرة، أينما كانت عيادتك.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-rosa-border">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-white">
            <span className="lang-en">Ready to Get Started?</span>
            <span className="lang-ar">جاهز للبدء؟</span>
          </h2>
          <p className="mt-4 text-rosa-muted">
            <span className="lang-en">Browse our catalog or reach out to our team for personalized recommendations.</span>
            <span className="lang-ar">تصفح كتالوجنا أو تواصل مع فريقنا للحصول على توصيات مخصصة.</span>
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/products" className="rounded-lg bg-rosa-accent px-8 py-4 font-semibold text-rosa-dark hover:bg-rosa-accent/90">
              <span className="lang-en">Browse Products</span>
              <span className="lang-ar">تصفح المنتجات</span>
            </Link>
            <Link href="/contact" className="rounded-lg border border-rosa-border px-8 py-4 font-semibold text-white hover:bg-rosa-card">
              <span className="lang-en">Contact Us</span>
              <span className="lang-ar">اتصل بنا</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
