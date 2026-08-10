import { RouteTransition, ScrollHeaderController } from "@/features/motion";
import { PUBLIC_CONTENT_VALUES } from "@/features/public-content-registry";
import { InquiryCountLabel } from "@/features/inquiry";
import {
  LanguageSwitcher,
  LocaleDocumentController,
  LocaleLink,
  LocalizedButtonLink,
  LocalizedText
} from "@/features/localization";
import { Container } from "./container";
import {
  MobileNavigation,
  type NavigationItem
} from "./mobile-navigation";
import { PublicNavigationLink } from "./public-navigation-link";
import { PublicBrandMark } from "./public-brand-mark";
import { PublicContactStrip } from "./public-contact-strip";

const primaryLinks = [
  ["Products", "/products"],
  ["Catalogues", "/catalogues"],
  ["About", "/about"],
  ["Contact", "/contact"]
] as const satisfies readonly NavigationItem[];

const utilityLinks = [
  ["Search", "/search"],
  ["Inquiry", "/inquiry"]
] as const satisfies readonly NavigationItem[];

const familyLinks = [
  ["Knives", "المشارط والسكاكين الجراحية", "/products/knives"],
  ["Scissors", "المقصات الجراحية", "/products/scissors"],
  ["Punches", "أدوات الثقب", "/products/punches"],
  ["Chisels", "الأزاميل الجراحية", "/products/chisels"],
  ["Cutters", "أدوات القطع", "/products/cutters"]
] as const;

export function PublicShell({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();
  return (
    <>
      <ScrollHeaderController>
        <LocaleDocumentController />
        <Container className="site-header__bar" size="wide">
          <PublicBrandMark />
          <nav className="site-header__nav" aria-label="Primary navigation / التنقل الرئيسي">
            <ul className="nav-list">
              {primaryLinks.map(([label, href]) => (
                <li key={href}>
                  <PublicNavigationLink
                    href={href}
                    label={
                      href === "/products" ? <LocalizedText en={label} ar="المنتجات" /> :
                      href === "/catalogues" ? <LocalizedText en={label} ar="الكتالوجات" /> :
                      href === "/about" ? <LocalizedText en={label} ar="من نحن" /> :
                      <LocalizedText en={label} ar="اتصل بنا" />
                    }
                  />
                </li>
              ))}
            </ul>
          </nav>
          <div className="cluster site-header__actions">
            {utilityLinks.map(([label, href]) => (
              <PublicNavigationLink
                href={href}
                label={href === "/inquiry" ? <InquiryCountLabel /> : <LocalizedText en={label} ar="بحث" />}
                key={href}
              />
            ))}
            <LanguageSwitcher />
            <LocalizedButtonLink href="/request-quotation" size="small">
              <LocalizedText en="Request a quote" ar="اطلب عرض سعر" />
            </LocalizedButtonLink>
          </div>
          <MobileNavigation primaryLinks={primaryLinks} utilityLinks={utilityLinks} />
        </Container>
      </ScrollHeaderController>
      <main className="page-main" id="main-content">
        <RouteTransition>{children}</RouteTransition>
      </main>
      <PublicContactStrip />
      <footer className="site-footer">
        <Container className="site-footer__grid" size="wide">
          <div className="site-footer__brand stack">
            <LocaleLink className="brand" href="/">ROSA</LocaleLink>
            <p><LocalizedText en={PUBLIC_CONTENT_VALUES.footerDescription.copy} ar="كتالوج منظم للأدوات الطبية ودعم واضح لطلبات عروض الأسعار والمشتريات المهنية." /></p>
          </div>
          <nav aria-label="Product families / عائلات المنتجات">
            <p className="site-footer__title"><LocalizedText en="Products" ar="المنتجات" /></p>
            <ul className="site-footer__links">
              {familyLinks.map(([label, labelAr, href]) => <li key={href}><LocaleLink href={href}><LocalizedText en={label} ar={labelAr} /></LocaleLink></li>)}
              <li><LocaleLink href="/catalogues"><LocalizedText en="Catalogues" ar="الكتالوجات" /></LocaleLink></li>
            </ul>
          </nav>
          <nav aria-label="Company navigation / روابط الشركة">
            <p className="site-footer__title"><LocalizedText en="Company" ar="الشركة" /></p>
            <ul className="site-footer__links">
              <li><LocaleLink href="/about"><LocalizedText en="About" ar="من نحن" /></LocaleLink></li>
              <li><LocaleLink href="/procurement-support"><LocalizedText en="Procurement support" ar="دعم المشتريات" /></LocaleLink></li>
              <li><LocaleLink href="/contact"><LocalizedText en="Contact" ar="اتصل بنا" /></LocaleLink></li>
            </ul>
          </nav>
          <nav aria-label="Footer navigation / روابط التذييل">
            <p className="site-footer__title"><LocalizedText en="Support" ar="الدعم" /></p>
            <ul className="site-footer__links">
              <li><LocaleLink href="/inquiry"><LocalizedText en="Inquiry" ar="الاستفسار" /></LocaleLink></li>
              <li><LocaleLink href="/search"><LocalizedText en="Search" ar="بحث" /></LocaleLink></li>
              <li><LocaleLink href="/privacy"><LocalizedText en="Privacy Policy" ar="سياسة الخصوصية" /></LocaleLink></li>
              <li><LocaleLink href="/terms"><LocalizedText en="Terms" ar="الشروط" /></LocaleLink></li>
            </ul>
          </nav>
        </Container>
        <Container className="site-footer__bottom cluster" size="wide">
          <span><LocalizedText en={`© ${year} Rosa Medical. All rights reserved.`} ar={`© ${year} روزا ميديكال. جميع الحقوق محفوظة.`} /></span>
          <span><LocalizedText en="Medical instrument catalogue and quotation support." ar="كتالوج أدوات طبية ودعم طلبات عروض الأسعار." /></span>
        </Container>
      </footer>
    </>
  );
}
