"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { SiteSetting } from "@/lib/supabase/types";

const navLinks = [
  { href: "/", label_en: "Home", label_ar: "الرئيسية" },
  { href: "/about", label_en: "About", label_ar: "من نحن" },
  { href: "/products", label_en: "Products", label_ar: "المنتجات" },
  { href: "/contact", label_en: "Contact", label_ar: "اتصل بنا" },
];

export function PublicShell({ children, settings = [] }: { children: React.ReactNode; settings: SiteSetting[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'en' | 'ar' | null;
    if (savedLang) {
      setLang(savedLang);
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', newLang);
  };

  const getEmail = settings.find(s => s.key === 'contact_email')?.value_en || 'info@rosamedical.com';
  const getEmailAr = settings.find(s => s.key === 'contact_email')?.value_ar || getEmail;
  const getPhone = settings.find(s => s.key === 'contact_phone')?.value_en || '+966 XX XXX XXXX';

  return (
    <div className="flex min-h-screen flex-col bg-rosa-dark">
      <header className="sticky top-0 z-50 border-b border-rosa-border bg-rosa-dark/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-heading text-xl font-bold text-white">
            Rosa<span className="text-rosa-accent">Medical</span>
          </Link>

          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${isActive ? "text-rosa-accent" : "text-rosa-cream/80 hover:text-rosa-accent"}`}
                >
                  <span className="lang-en">{link.label_en}</span>
                  <span className="lang-ar">{link.label_ar}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {/* Fixed Language Toggle Button */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 rounded-full border border-rosa-border px-3 py-1 text-xs font-medium text-rosa-cream hover:border-rosa-accent"
            >
              {lang === 'en' ? 'عربي' : 'English'}
            </button>

            <button
              className="md:hidden text-rosa-cream"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-rosa-border bg-rosa-dark">
            <div className="space-y-1 px-4 py-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-3 py-2 text-base font-medium ${isActive ? "bg-rosa-accent/10 text-rosa-accent" : "text-rosa-cream hover:bg-rosa-card hover:text-rosa-accent"}`}
                  >
                    <span className="lang-en">{link.label_en}</span>
                    <span className="lang-ar">{link.label_ar}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-rosa-border bg-rosa-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Rosa Medical</h3>
              <p className="mt-2 text-sm text-rosa-muted">
                <span className="lang-en">Premium surgical instruments for medical professionals.</span>
                <span className="lang-ar">أدوات جراحية متميزة للمحترفين الطبيين.</span>
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-rosa-cream">
                <span className="lang-en">Quick Links</span>
                <span className="lang-ar">روابط سريعة</span>
              </h4>
              <ul className="mt-4 space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-rosa-muted hover:text-rosa-accent">
                      <span className="lang-en">{link.label_en}</span>
                      <span className="lang-ar">{link.label_ar}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-rosa-cream">
                <span className="lang-en">Contact</span>
                <span className="lang-ar">اتصل بنا</span>
              </h4>
              <ul className="mt-4 space-y-2">
                <li className="text-sm text-rosa-muted">
                  <span className="lang-en">{getEmail}</span>
                  <span className="lang-ar">{getEmailAr}</span>
                </li>
                <li className="text-sm text-rosa-muted">{getPhone}</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-rosa-border pt-8 text-center">
            <p className="text-xs text-rosa-muted">
              <span className="lang-en">&copy; 2026 Rosa Medical. All rights reserved.</span>
              <span className="lang-ar">&copy; 2026 روزا ميديكال. جميع الحقوق محفوظة.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
