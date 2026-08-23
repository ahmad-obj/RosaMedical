"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container, Section } from "@/components/layout";
import { QuotationBlockedPage } from "@/features/quotation-preview";
import { LocaleLink, getLocaleFromPathname } from "@/features/localization";
import { formatSar } from "@/features/pricing";
import { inquiryLineSubtotal, summarizeInquiryPricing } from "./inquiry-pricing";
import { clearInquiry, readInquiry, type InquiryItem } from "./inquiry-store";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function QuotationPage() {
  const [items, setItems] = useState<InquiryItem[] | null>(null);
  const [state, setState] = useState<SubmissionState>("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() === true;
  const locale = getLocaleFromPathname(usePathname());
  const ar = locale === "ar";

  useEffect(() => {
    const synchronize = () => setItems(readInquiry());
    const timeout = window.setTimeout(synchronize, 0);
    window.addEventListener("rosa-inquiry-change", synchronize);
    window.addEventListener("storage", synchronize);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("rosa-inquiry-change", synchronize);
      window.removeEventListener("storage", synchronize);
    };
  }, []);

  useEffect(() => {
    if (state !== "success") return;

    const frame = window.requestAnimationFrame(() => successRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [state]);

  if (items === null) {
    return <Section tone="paper"><Container size="wide"><p>{ar ? "جارٍ تحميل طلب عرض السعر…" : "Loading quotation request…"}</p></Container></Section>;
  }
  if (items.length === 0 && state !== "success") return <QuotationBlockedPage />;

  if (state === "success") {
    return (
      <Section tone="paper" className="quotation-blocked-page quotation-success-state">
        <Container size="reading">
          <motion.div
            ref={successRef}
            className="quotation-success-state__content"
            data-conversion-success="true"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.34 }}
          >
            <motion.span
              className="quotation-success-state__mark"
              aria-hidden="true"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.28, delay: reduceMotion ? 0 : 0.04 }}
            >
              ✓
            </motion.span>
            <p className="quotation-blocked-page__eyebrow">{ar ? "تم استلام الطلب" : "Request received"}</p>
            <h1>{ar ? "تم إرسال طلب عرض السعر." : "Your quotation request has been submitted."}</h1>
            <p>{ar ? "يمكن لروزا الآن مراجعة المنتجات المحددة وبيانات التواصل." : "Rosa can now review the selected products and contact details."}</p>
            {reference ? <p>{ar ? "المرجع" : "Reference"}: <bdi dir="ltr">{reference}</bdi></p> : null}
            <div className="quotation-blocked-page__actions">
              <LocaleLink href="/products" className="button button--primary button--standard">{ar ? "استعرض المزيد من المنتجات" : "Browse more products"}</LocaleLink>
            </div>
          </motion.div>
        </Container>
      </Section>
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setError("");

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          company: form.get("company"),
          email: form.get("email"),
          phone: form.get("phone"),
          country: form.get("country"),
          notes: form.get("notes"),
          items
        })
      });

      const data = await response.json().catch(() => ({})) as { error?: string; id?: string };
      if (!response.ok) {
        setError(ar ? "تعذر إرسال طلب عرض السعر. راجع البيانات وحاول مرة أخرى." : data.error || "Unable to submit quotation request.");
        setState("error");
        return;
      }

      clearInquiry();
      setReference(data.id || "");
      setState("success");
    } catch {
      setError(ar ? "تعذر إرسال طلب عرض السعر. تحقق من الاتصال وحاول مرة أخرى." : "Unable to submit quotation request. Check your connection and try again.");
      setState("error");
    }
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const pricing = summarizeInquiryPricing(items);

  return (
    <Section tone="paper" className="quotation-page">
      <Container size="wide">
        <div className="quotation-form-preview" data-conversion-state={state}>
          <form
            className="quotation-form-preview__form"
            aria-label={ar ? "طلب عرض سعر" : "Quotation request"}
            aria-busy={state === "submitting"}
            onSubmit={submit}
          >
            <motion.div
              className="quotation-form-preview__introduction"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.32 }}
            >
              <p className="public-eyebrow">{ar ? "طلب عرض سعر" : "Request quotation"}</p>
              <h1>{ar ? "أرسل متطلبات المنتجات." : "Send your product requirements."}</h1>
              <p>{ar ? "أدخل بيانات التواصل لتتمكن روزا من مراجعة هذا الاستفسار والرد عليه." : "Provide contact details so Rosa can review and respond to this inquiry."}</p>
            </motion.div>

            <motion.div
              className="quotation-form-preview__fields"
              data-motion="quotation-form-fields"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <fieldset data-quotation-fieldset="contact">
                <legend>{ar ? "بيانات التواصل" : "Contact information"}</legend>
                <div className="quotation-form-preview__field-grid">
                  <label className="quotation-field">
                    <span className="quotation-field__label">{ar ? "اسم العميل" : "Customer name"}<span aria-hidden="true"> *</span></span>
                    <input name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder={ar ? "الاسم الكامل" : "Your full name"} />
                  </label>
                  <label className="quotation-field">
                    <span className="quotation-field__label">{ar ? "اسم الشركة" : "Company name"}</span>
                    <input name="company" maxLength={120} autoComplete="organization" placeholder={ar ? "الشركة أو الجهة" : "Company or organisation"} />
                  </label>
                  <label className="quotation-field">
                    <span className="quotation-field__label">{ar ? "البريد الإلكتروني" : "Email"}<span aria-hidden="true"> *</span></span>
                    <input name="email" type="email" required maxLength={254} autoComplete="email" inputMode="email" placeholder="name@company.com" dir="ltr" />
                  </label>
                  <label className="quotation-field">
                    <span className="quotation-field__label">{ar ? "الهاتف" : "Telephone"}<span aria-hidden="true"> *</span></span>
                    <input name="phone" type="tel" required maxLength={30} autoComplete="tel" inputMode="tel" placeholder={ar ? "رمز الدولة والرقم" : "Country code and number"} dir="ltr" />
                  </label>
                  <label className="quotation-field quotation-field--full">
                    <span className="quotation-field__label">{ar ? "الدولة" : "Country"}</span>
                    <input name="country" maxLength={80} autoComplete="country-name" placeholder={ar ? "الدولة" : "Country"} />
                  </label>
                </div>
              </fieldset>

              <fieldset data-quotation-fieldset="notes">
                <legend>{ar ? "ملاحظات الطلب العامة" : "General request notes"}</legend>
                <label className="quotation-field quotation-field--full">
                  <span className="quotation-field__label">{ar ? "سياق المشتريات" : "Procurement context"}</span>
                  <textarea name="notes" maxLength={2000} placeholder={ar ? "التغليف أو الوجهة أو أي متطلبات أخرى" : "Packing, destination or other requirements"} />
                  <small>{ar ? "أضف متطلبات التشطيب أو التغليف أو الوجهة أو الرموز غير المدرجة." : "Add finish, packing, destination, or unlisted-code requirements."}</small>
                </label>
              </fieldset>

              <fieldset data-quotation-fieldset="submission">
                <legend>{ar ? "الإرسال" : "Submission"}</legend>
                <label className="quotation-preview-confirmation">
                  <input type="checkbox" name="confirmation" required />
                  <span>{ar ? "أؤكد صحة تفاصيل المنتجات المحددة وبيانات التواصل." : "I confirm that the selected product details and contact information are correct."}</span>
                </label>
                <AnimatePresence initial={false}>
                  {error ? (
                    <motion.p
                      key="quotation-error"
                      role="alert"
                      className="alert alert--danger"
                      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                      transition={{ duration: reduceMotion ? 0 : 0.16 }}
                    >
                      {error}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
                <div className="quotation-form-preview__submit-row">
                  <button type="submit" className="button button--primary button--standard quotation-submit-button" disabled={state === "submitting"}>
                    <AnimatePresence initial={false} mode="wait">
                      <motion.span
                        key={state === "submitting" ? "submitting" : "ready"}
                        className="quotation-submit-button__label"
                        initial={reduceMotion ? false : { opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -3 }}
                        transition={{ duration: reduceMotion ? 0 : 0.16 }}
                      >
                        {state === "submitting" ? (ar ? "جارٍ الإرسال…" : "Submitting…") : (ar ? "إرسال طلب عرض السعر" : "Submit quotation request")}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </div>
              </fieldset>
            </motion.div>
          </form>

          <motion.aside
            className="quotation-product-summary"
            data-quotation-summary="true"
            aria-labelledby="quotation-products-title"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.34, delay: reduceMotion ? 0 : 0.06 }}
          >
            <p className="quotation-product-summary__eyebrow">{ar ? "المنتجات المحددة" : "Selected products"}</p>
            <h2 id="quotation-products-title">{ar ? `${items.length} تهيئة` : `${items.length} selected ${items.length === 1 ? "configuration" : "configurations"}`}</h2>
            <ul>
              {items.map((item) => {
                const lineSubtotal = inquiryLineSubtotal(item);
                return (
                  <motion.li layout={!reduceMotion} key={item.lineId}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{ar ? "الرمز" : "Code"} <bdi dir="ltr">{item.code}</bdi></span>
                      <span>SKU <bdi dir="ltr">{item.sku}</bdi></span>
                      {item.size ? <span>{ar ? "المقاس" : "Size"} <bdi dir="ltr">{item.size}</bdi></span> : null}
                      {item.variant ? <span>{ar ? "الخيار" : "Variant"} {item.variant}</span> : null}
                      <span>{ar ? "الكمية" : "Quantity"} {item.quantity}</span>
                      <span>{ar ? "سعر الوحدة" : "Unit price"} {item.unitPriceSar ? formatSar(item.unitPriceSar, locale) : ar ? "السعر عند الطلب" : "Price on request"}</span>
                      <span>{ar ? "إجمالي البند" : "Line subtotal"} {lineSubtotal ? formatSar(lineSubtotal, locale) : ar ? "السعر عند الطلب" : "Price on request"}</span>
                    </div>
                    <LocaleLink href="/inquiry">{ar ? "تعديل" : "Edit"}</LocaleLink>
                  </motion.li>
                );
              })}
            </ul>
            <div className="quotation-product-summary__total"><span>{ar ? "الكمية الإجمالية" : "Total quantity"}</span><motion.output key={totalQuantity} className="conversion-value" aria-live="polite" initial={reduceMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>{totalQuantity}</motion.output></div>
            {pricing.allPriced && pricing.totalSar ? (
              <div className="quotation-product-summary__total"><span>{ar ? "الإجمالي التقديري" : "Estimated total"}</span><strong>{formatSar(pricing.totalSar, locale)}</strong></div>
            ) : null}
            {!pricing.allPriced && pricing.pricedSubtotalSar ? (
              <div className="quotation-product-summary__total"><span>{ar ? "الإجمالي الفرعي للعناصر المسعرة" : "Priced items subtotal"}</span><strong>{formatSar(pricing.pricedSubtotalSar, locale)}</strong></div>
            ) : null}
            {pricing.unpricedLineCount > 0 ? (
              <div className="quotation-product-summary__total"><span>{ar ? "السعر عند الطلب" : "Price on request"}</span><strong>{ar ? `${pricing.unpricedLineCount} بند · ${pricing.unpricedQuantity} وحدة` : `${pricing.unpricedLineCount} line(s) · ${pricing.unpricedQuantity} unit(s)`}</strong></div>
            ) : null}
            {!pricing.allPriced ? (
              <div className="quotation-product-summary__total"><span>{ar ? "إجمالي عرض السعر الكامل" : "Complete quotation total"}</span><strong>{ar ? "قيد التسعير" : "Pending"}</strong></div>
            ) : null}
            <LocaleLink className="text-link" href="/inquiry">{ar ? "العودة إلى الاستفسار ←" : "Return to inquiry →"}</LocaleLink>
          </motion.aside>
        </div>
      </Container>
    </Section>
  );
}
