"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ReactElement
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { getLocaleFromPathname, LanguageSwitcher, localizePath, stripLocalePath } from "@/features/localization";
import { MOTION_DURATION, MOTION_EASING } from "@/features/motion";
import { isPublicNavigationActive } from "./public-navigation-link";
import { PublicBrandMark } from "./public-brand-mark";

export type NavigationItem = readonly [label: string, href: Route<string>];

interface MobileNavigationProps {
  primaryLinks: readonly NavigationItem[];
  utilityLinks: readonly NavigationItem[];
}

const MOBILE_LABELS_AR: Record<string, string> = {
  "/": "الرئيسية",
  "/about": "من نحن",
  "/products": "المنتجات",
  "/inquiry": "الاستفسار",
  "/contact": "اتصل بنا",
  "/catalogues": "الكتالوجات",
  "/search": "بحث"
};

export function MobileNavigation({
  primaryLinks,
  utilityLinks
}: MobileNavigationProps): ReactElement {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() === true;
  const closedX = locale === "ar" ? "-100%" : "100%";

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const close = () => setOpenPath(null);

  return (
    <div className="mobile-navigation">
      <button
        ref={triggerRef}
        type="button"
        className="mobile-navigation__trigger"
        aria-expanded={open}
        aria-controls="rosa-mobile-navigation"
        onClick={() => setOpenPath(open ? null : pathname)}
      >
        <span>{locale === "ar" ? "القائمة" : "Menu"}</span>
        <span className="mobile-navigation__trigger-lines" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              className="mobile-navigation__backdrop"
              aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              ref={panelRef}
              id="rosa-mobile-navigation"
              className="mobile-navigation__panel"
              role="dialog"
              aria-modal="true"
              aria-label={locale === "ar" ? "التنقل عبر الهاتف" : "Mobile navigation"}
              initial={reduceMotion ? false : { x: closedX }}
              animate={{ x: 0 }}
              exit={{ x: closedX }}
              transition={{
                duration: MOTION_DURATION.section,
                ease: MOTION_EASING.emphasized
              }}
            >
              <div className="mobile-navigation__panel-header">
                <PublicBrandMark onClick={close} />
                <button type="button" className="mobile-navigation__close" onClick={close}>
                  {locale === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
              <nav aria-label={locale === "ar" ? "التنقل عبر الهاتف" : "Mobile navigation"}>
                <ul className="mobile-navigation__links">
                  {[...primaryLinks, ...utilityLinks].map(([label, href], index) => (
                    <motion.li
                      key={href}
                      initial={reduceMotion ? false : { opacity: 1, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: reduceMotion ? 0 : 0.08 + index * 0.045,
                        duration: MOTION_DURATION.component,
                        ease: MOTION_EASING.standard
                      }}
                    >
                      <Link
                        href={localizePath(href, locale) as Route<string>}
                        onClick={close}
                        aria-current={isPublicNavigationActive(stripLocalePath(pathname), href) ? "page" : undefined}
                      >
                        {locale === "ar" ? MOBILE_LABELS_AR[href] ?? label : label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <LanguageSwitcher onNavigate={close} />
              <ButtonLink href={localizePath("/request-quotation", locale) as Route<string>} onClick={close}>
                {locale === "ar" ? "اطلب عرض سعر" : "Request a quote"}
              </ButtonLink>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
