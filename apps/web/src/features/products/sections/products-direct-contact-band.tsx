import type { ReactElement } from "react";
import { Container } from "@/components/layout";
import type { PublicLocale } from "@/features/localization/locales";
import { PUBLIC_CONTENT_VALUES } from "@/features/public-content-registry";

export function ProductsDirectContactBand({
  locale = "en"
}: {
  locale?: PublicLocale;
}): ReactElement {
  const ar = locale === "ar";
  const phoneDigits = PUBLIC_CONTENT_VALUES.contactDetails.phone.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${phoneDigits}`;

  return (
    <section className="products-direct-contact" aria-labelledby="products-contact-title">
      <Container size="wide">
        <div className="products-direct-contact__surface">
          <div className="products-direct-contact__actions">
            <a className="products-direct-contact__action products-direct-contact__action--whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">
              <span aria-hidden="true">◉</span>
              {ar ? "محادثة واتساب" : "WhatsApp Chat"}
            </a>
            <a className="products-direct-contact__action products-direct-contact__action--email" href={PUBLIC_CONTENT_VALUES.contactDetails.emailHref}>
              <span aria-hidden="true">✉</span>
              {ar ? "البريد الإلكتروني" : "Email"}
            </a>
          </div>
          <h2 id="products-contact-title">{ar ? "تواصل معنا الآن" : "Get in Touch Now"}</h2>
        </div>
      </Container>
    </section>
  );
}
