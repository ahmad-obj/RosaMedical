"use client";

import { useState } from "react";
import type { SiteSetting } from "@/lib/supabase/types";

interface ContactPageProps {
  settings: SiteSetting[];
  initialProduct?: string;
}

export function ContactPage({ settings, initialProduct }: ContactPageProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const getEmail = settings.find(s => s.key === 'contact_email')?.value_en || 'info@rosamedical.com';
  const getEmailAr = settings.find(s => s.key === 'contact_email')?.value_ar || getEmail;
  const getPhone = settings.find(s => s.key === 'contact_phone')?.value_en || '+966 XX XXX XXXX';
  const getWhats = settings.find(s => s.key === 'contact_whatsapp')?.value_en || '+966 XX XXX XXXX';
  const getAddress = settings.find(s => s.key === 'contact_address')?.value_en || 'Riyadh, Saudi Arabia';
  const getAddressAr = settings.find(s => s.key === 'contact_address')?.value_ar || 'الرياض، المملكة العربية السعودية';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    
    const formData = new FormData(e.currentTarget);
    const product = formData.get('product') as string;
    const message = formData.get('message') as string;
    
    const finalMessage = product ? `Inquiry about product: ${product}\n\n${message}` : message;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: finalMessage,
          company_name: formData.get('company_name'),
        })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Unknown error');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="bg-rosa-dark min-h-screen">
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="lang-en">Contact Us</span>
            <span className="lang-ar">اتصل بنا</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-rosa-cream/70">
            <span className="lang-en">We're here to help with any inquiries or quotes you need.</span>
            <span className="lang-ar">نحن هنا لمساعدتك في أي استفسارات أو عروض أسعار تحتاجها.</span>
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
            {/* Form Area */}
            <div className="lg:col-span-3 rounded-xl border border-rosa-border bg-rosa-card p-8 shadow-lg">
              <h2 className="font-heading text-2xl font-bold text-white">
                <span className="lang-en">Send us a message</span>
                <span className="lang-ar">أرسل لنا رسالة</span>
              </h2>
              <p className="mt-1 text-sm text-rosa-muted">
                <span className="lang-en">We typically respond within 24 hours.</span>
                <span className="lang-ar">نرد عادة خلال 24 ساعة.</span>
              </p>
              
              {status === 'success' && <div className="mt-6 rounded-lg bg-green-500/10 p-4 text-green-400 border border-green-500/20"><span className="lang-en">Message sent successfully!</span><span className="lang-ar">تم إرسال الرسالة بنجاح!</span></div>}
              {status === 'error' && <div className="mt-6 rounded-lg bg-red-500/10 p-4 text-red-400 border border-red-500/20"><span className="lang-en">Error: {errorMsg}</span><span className="lang-ar">خطأ: {errorMsg}</span></div>}
              
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="hidden" aria-hidden="true">
                  <label>Company Name</label>
                  <input type="text" name="company_name" tabIndex={-1} autoComplete="off" />
                </div>

                {initialProduct && (
                  <div>
                    <label className="block text-sm font-medium text-rosa-muted">
                      <span className="lang-en">Product Inquiry</span>
                      <span className="lang-ar">استفسار عن منتج</span>
                    </label>
                    <input type="text" name="product" defaultValue={initialProduct} readOnly className="mt-1 block w-full rounded-lg border border-rosa-accent/50 bg-rosa-accent/5 px-4 py-3 text-white font-medium" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-rosa-muted">
                    <span className="lang-en">Full Name</span>
                    <span className="lang-ar">الاسم الكامل</span>
                  </label>
                  <input required type="text" name="name" className="mt-1 block w-full rounded-lg border border-rosa-border bg-rosa-dark px-4 py-3 text-white focus:border-rosa-accent focus:ring-1 focus:ring-rosa-accent focus:outline-none transition-colors" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-rosa-muted">
                      <span className="lang-en">Email Address</span>
                      <span className="lang-ar">البريد الإلكتروني</span>
                    </label>
                    <input required type="email" name="email" className="mt-1 block w-full rounded-lg border border-rosa-border bg-rosa-dark px-4 py-3 text-white focus:border-rosa-accent focus:ring-1 focus:ring-rosa-accent focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-rosa-muted">
                      <span className="lang-en">Phone Number</span>
                      <span className="lang-ar">رقم الهاتف</span>
                    </label>
                    <input type="tel" name="phone" className="mt-1 block w-full rounded-lg border border-rosa-border bg-rosa-dark px-4 py-3 text-white focus:border-rosa-accent focus:ring-1 focus:ring-rosa-accent focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-rosa-muted">
                    <span className="lang-en">Message</span>
                    <span className="lang-ar">الرسالة</span>
                  </label>
                  <textarea required name="message" rows={5} className="mt-1 block w-full rounded-lg border border-rosa-border bg-rosa-dark px-4 py-3 text-white focus:border-rosa-accent focus:ring-1 focus:ring-rosa-accent focus:outline-none transition-colors resize-none"></textarea>
                </div>
                <button type="submit" disabled={status === 'loading'} className="w-full rounded-lg bg-rosa-accent px-6 py-3.5 font-semibold text-rosa-dark transition-all hover:bg-rosa-accent/90 hover:shadow-lg hover:shadow-rosa-accent/20 disabled:opacity-50">
                  {status === 'loading' ? '...' : <><span className="lang-en">Send Message</span><span className="lang-ar">إرسال الرسالة</span></>}
                </button>
              </form>
            </div>

            {/* Info Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-rosa-border bg-rosa-card p-8 shadow-lg h-full">
                <h3 className="font-heading text-xl font-bold text-white">
                  <span className="lang-en">Contact Information</span>
                  <span className="lang-ar">معلومات الاتصال</span>
                </h3>
                <p className="mt-2 text-sm text-rosa-muted">
                  <span className="lang-en">Reach out to us directly through any of these channels.</span>
                  <span className="lang-ar">تواصل معنا مباشرة من خلال أي من هذه القنوات.</span>
                </p>
                
                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rosa-dark text-rosa-accent">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-rosa-muted"><span className="lang-en">Email</span><span className="lang-ar">البريد</span></p>
                      <p className="mt-1 font-medium text-white"><span className="lang-en">{getEmail}</span><span className="lang-ar">{getEmailAr}</span></p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rosa-dark text-rosa-accent">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-rosa-muted"><span className="lang-en">Phone</span><span className="lang-ar">الهاتف</span></p>
                      <p className="mt-1 font-medium text-white">{getPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rosa-dark text-rosa-accent">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-rosa-muted"><span className="lang-en">Address</span><span className="lang-ar">العنوان</span></p>
                      <p className="mt-1 font-medium text-white"><span className="lang-en">{getAddress}</span><span className="lang-ar">{getAddressAr}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
