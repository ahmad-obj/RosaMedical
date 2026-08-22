import type { ReactElement } from "react";
import { Container, Section } from "@/components/layout";
import { LocalizedButtonLink } from "@/features/localization";
import { Reveal } from "@/features/motion";
import { PublicHeroCarousel } from "@/features/public-hero";
import { SocialLinksRow } from "@/features/social-links";
import { ContactFormPreview } from "./contact-form-preview";
import { ContactInformationPanel } from "./contact-information-panel";
import { buildContactInformation } from "./contact-information-model";
import { RiyadhMap } from "./riyadh-map";
import type { PublicLocale } from "@/features/localization/locales";
import { createClient } from "@/lib/supabase/server";

export async function ContactPage({ locale = "en" }: { locale?: PublicLocale }): Promise<ReactElement> {
  const supabase = await createClient();
  const { data: settingsData } = await supabase
    .from("site_settings")
    .select("key,value_en,value_ar");
  const contactRows = buildContactInformation(settingsData ?? []);
  const ar = locale === "ar";

  return (
    <div className="public-page public-page--contact contact-page">
      <PublicHeroCarousel page="contact" locale={locale} headingId="contact-public-hero-title" />

      <Section tone="warm" className="contact-main-section">
        <Container size="wide">
          <div className="contact-main-layout">
            <Reveal direction="up" className="contact-information-reveal">
              <ContactInformationPanel locale={locale} rows={contactRows} />
            </Reveal>
            <Reveal direction="up" delay={0.06} className="contact-form-reveal">
              <div className="contact-form-region">
                <header className="f3d-section-heading">
                  <p className="page-eyebrow">{ar ? "نموذج التواصل العام" : "General contact form"}</p>
                  <h2>{ar ? "أخبرنا كيف يمكننا مساعدتك." : "Tell us how we can help."}</h2>
                  <p>{ar ? "للكميات أو طلبات عروض الأسعار، استخدم استفسار المنتجات." : "For product quantities or quotation requests, use the product inquiry instead."}</p>
                </header>
                <ContactFormPreview />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="paper" spacing="compact" className="contact-social-section">
        <Container size="wide">
          <Reveal direction="up">
            <div className="contact-social-panel">
              <div>
                <p className="page-eyebrow">{ar ? "تابع روزا" : "Follow Rosa"}</p>
                <h2>{ar ? "ابق على اتصال." : "Stay connected."}</h2>
              </div>
              <SocialLinksRow locale={locale} className="contact-social-links" />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="paper" className="contact-location-section">
        <Container size="wide">
          <Reveal direction="up">
            <RiyadhMap locale={locale} />
          </Reveal>
        </Container>
      </Section>

      <Section tone="warm" className="contact-quotation-section">
        <Container size="wide">
          <Reveal direction="up">
            <div className="f3d-final-cta">
              <div>
                <p className="page-eyebrow">{ar ? "عروض أسعار المنتجات" : "Product quotations"}</p>
                <h2>{ar ? "هل تحتاج عرض سعر لأدوات محددة؟" : "Need a quotation for specific instruments?"}</h2>
                <p>{ar ? "استخدم استفسار المنتجات مع الرموز والخيارات والكميات بدلًا من رسالة عامة." : "Use the product inquiry with codes, options and quantities instead of a general message."}</p>
              </div>
              <LocalizedButtonLink href="/inquiry">{ar ? "افتح استفسار المنتجات" : "Open Product Inquiry"}</LocalizedButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}
