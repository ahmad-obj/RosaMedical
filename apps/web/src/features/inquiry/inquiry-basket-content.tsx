"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container, Section } from "@/components/layout";
import { EmptyInquiryPage } from "@/features/inquiry-preview";
import { InquiryLineMedia } from "./inquiry-line-media";
import {
  clearInquiry,
  INQUIRY_MAX_QUANTITY,
  readInquiry,
  removeInquiryItem,
  updateInquiryItem,
  type InquiryItem
} from "./inquiry-store";
import { FAMILY_NAMES_AR, LocaleLink, getLocaleFromPathname } from "@/features/localization";

function familyLabel(slug: string, ar: boolean): string {
  if (!ar || !(slug in FAMILY_NAMES_AR)) return slug;
  return FAMILY_NAMES_AR[slug as keyof typeof FAMILY_NAMES_AR];
}

export function InquiryBasketContent(): ReactElement {
  const [items, setItems] = useState<InquiryItem[] | null>(null);
  const reduceMotion = useReducedMotion() === true;
  const ar = getLocaleFromPathname(usePathname()) === "ar";
  const pendingFocusTarget = useRef<string | null>(null);
  const removeButtonRefs = useRef(new Map<string, HTMLButtonElement>());

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
    const target = pendingFocusTarget.current;
    if (!items || !target) return;

    pendingFocusTarget.current = null;
    const frame = window.requestAnimationFrame(() => {
      if (target === "empty") {
        document.querySelector<HTMLElement>("[data-inquiry-empty-focus]")?.focus();
        return;
      }
      removeButtonRefs.current.get(target)?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [items]);

  function handleRemove(id: string) {
    if (!items) return;
    const removedIndex = items.findIndex((item) => item.id === id);
    const nextItems = removeInquiryItem(id);
    const nextFocusItem = nextItems[Math.min(Math.max(removedIndex, 0), nextItems.length - 1)];
    pendingFocusTarget.current = nextFocusItem?.id ?? "empty";
    setItems(nextItems);
  }

  function handleClear() {
    pendingFocusTarget.current = "empty";
    clearInquiry();
    setItems([]);
  }

  if (items === null) {
    return (
      <Section tone="paper">
        <Container size="wide">
          <p>{ar ? "جارٍ تحميل الاستفسار…" : "Loading inquiry…"}</p>
        </Container>
      </Section>
    );
  }

  if (items.length === 0) return <EmptyInquiryPage />;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="populated-inquiry-preview" data-conversion-state="ready">
      <Section tone="paper" spacing="compact" className="inquiry-preview-intro">
        <Container size="wide">
          <motion.div
            className="inquiry-preview-intro__heading"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.34 }}
          >
            <div>
              <p className="inquiry-preview-intro__eyebrow">{ar ? "المنتجات المحددة" : "Selected products"}</p>
              <h2>{ar ? "راجع استفسار عرض السعر." : "Review your quotation inquiry."}</h2>
              <p>{ar ? "عدّل الكميات وأضف ملاحظات المتطلبات قبل إرسال طلب عرض السعر." : "Adjust quantities and line notes before sending the quotation request."}</p>
              <strong aria-live="polite">
                {ar ? `${items.length} منتج فريد · الكمية الإجمالية ${totalQuantity}` : `${items.length} unique products · ${totalQuantity} total quantity`}
              </strong>
            </div>
            <LocaleLink href="/products" className="button button--secondary button--standard">{ar ? "متابعة الاستعراض" : "Continue browsing"}</LocaleLink>
          </motion.div>
        </Container>
      </Section>

      <Section tone="paper" className="inquiry-preview-content">
        <Container size="wide">
          <div className="inquiry-preview-layout">
            <motion.div className="inquiry-preview-lines" layout={!reduceMotion}>
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.article
                    className="inquiry-preview-line"
                    data-inquiry-line={item.id}
                    key={item.id}
                    layout={!reduceMotion}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, borderWidth: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.24 }}
                  >
                    <div className="inquiry-preview-line__media">
                      <InquiryLineMedia
                        mediaPath={item.mediaPath}
                        mediaFallbackPath={item.mediaFallbackPath}
                        alt={item.imageLabel || item.name}
                      />
                    </div>
                    <div className="inquiry-preview-line__identity">
                      <p className="inquiry-preview-line__family">{familyLabel(item.familySlug, ar)}</p>
                      <h2>{item.name}</h2>
                      <p className="inquiry-preview-line__code">{ar ? "الرمز" : "Code"} <bdi dir="ltr">{item.code}</bdi></p>
                      <p className="inquiry-preview-line__options">{ar ? "المقاس" : "Size"}: {item.size || (ar ? "غير محدد" : "Not specified")} · {ar ? "الخيار" : "Variant"}: {item.variant || (ar ? "غير محدد" : "Not specified")}</p>
                    </div>
                    <div className="inquiry-preview-line__controls">
                      <div className="inquiry-preview-quantity">
                        <span className="inquiry-preview-control-label">{ar ? "الكمية" : "Quantity"}</span>
                        <div>
                          <button
                            type="button"
                            aria-label={ar ? `تقليل كمية ${item.name}` : `Decrease ${item.name} quantity`}
                            disabled={item.quantity <= 1}
                            onClick={() => setItems(updateInquiryItem(item.id, { quantity: item.quantity - 1 }))}
                          >−</button>
                          <motion.output
                            key={`${item.id}-${item.quantity}`}
                            className="conversion-value"
                            aria-live="polite"
                            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.16 }}
                          >
                            {item.quantity}
                          </motion.output>
                          <button
                            type="button"
                            aria-label={ar ? `زيادة كمية ${item.name}` : `Increase ${item.name} quantity`}
                            disabled={item.quantity >= INQUIRY_MAX_QUANTITY}
                            onClick={() => setItems(updateInquiryItem(item.id, { quantity: item.quantity + 1 }))}
                          >+</button>
                        </div>
                      </div>
                      <label className="inquiry-preview-note">
                        <span className="inquiry-preview-control-label">{ar ? "ملاحظة البند" : "Line note"}</span>
                        <input value={item.notes} maxLength={500} placeholder={ar ? "متطلب اختياري" : "Optional requirement"} onChange={(event) => setItems(updateInquiryItem(item.id, { notes: event.target.value }))} />
                      </label>
                      <button
                        type="button"
                        className="text-link"
                        ref={(node) => {
                          if (node) removeButtonRefs.current.set(item.id, node);
                          else removeButtonRefs.current.delete(item.id);
                        }}
                        onClick={() => handleRemove(item.id)}
                      >
                        {ar ? "إزالة" : "Remove"}
                      </button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.aside
              className="inquiry-preview-summary"
              aria-labelledby="inquiry-summary-title"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.34, delay: reduceMotion ? 0 : 0.08 }}
            >
              <p className="inquiry-preview-summary__eyebrow">{ar ? "ملخص الاستفسار" : "Inquiry summary"}</p>
              <h2 id="inquiry-summary-title">{ar ? "هل أنت جاهز لطلب عرض السعر؟" : "Ready to request a quotation?"}</h2>
              <dl>
                <div><dt>{ar ? "المنتجات الفريدة" : "Unique products"}</dt><dd><motion.output key={`products-${items.length}`} className="conversion-value" aria-live="polite" initial={reduceMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>{items.length}</motion.output></dd></div>
                <div><dt>{ar ? "الكمية الإجمالية" : "Total quantity"}</dt><dd><motion.output key={`quantity-${totalQuantity}`} className="conversion-value" aria-live="polite" initial={reduceMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>{totalQuantity}</motion.output></dd></div>
              </dl>
              <p>{ar ? "ستراجع روزا المنتجات المحددة قبل إعداد عرض السعر." : "Rosa will review the selected products before preparing a quotation."}</p>
              <LocaleLink href="/request-quotation" className="button button--primary button--standard">{ar ? "طلب عرض سعر" : "Request quotation"}</LocaleLink>
              <button type="button" className="text-link" onClick={handleClear}>{ar ? "مسح الاستفسار" : "Clear inquiry"}</button>
            </motion.aside>
          </div>
        </Container>
      </Section>
    </div>
  );
}
