"use client";

import type { ReactElement } from "react";
import { Container, Section } from "@/components/layout";
import { ProductMediaPlaceholder } from "@/features/public-catalogue";
import { LocalizedButtonLink, getLocaleFromPathname } from "@/features/localization";
import { usePathname } from "next/navigation";

export function EmptyInquiryPage(): ReactElement {
  const ar = getLocaleFromPathname(usePathname()) === "ar";
  return (
    <Section tone="paper" className="empty-inquiry-page">
      <Container size="wide">
        <div className="empty-inquiry-page__layout">
          <div className="empty-inquiry-page__content">
            <p className="empty-inquiry-page__eyebrow">{ar ? "استفسار فارغ" : "Empty inquiry"}</p>
            <h2 data-inquiry-empty-focus tabIndex={-1}>{ar ? "قائمة استفسارك فارغة." : "Your inquiry list is empty."}</h2>
            <p>
              {ar ? "استعرض إحدى عائلات الأدوات وحدد المنتجات التي تريد من روزا مراجعتها لعرض السعر." : "Browse an instrument family and review the products you want Rosa to consider for quotation."}
            </p>
            <div className="empty-inquiry-page__actions">
              <LocalizedButtonLink href="/products">{ar ? "استعرض المنتجات" : "Browse products"}</LocalizedButtonLink>
              <LocalizedButtonLink href="/catalogues" variant="secondary">{ar ? "عرض الكتالوجات" : "View catalogues"}</LocalizedButtonLink>
            </div>
          </div>
          <ProductMediaPlaceholder
            label="Empty inquiry instrument placeholder"
            decorative
            aspect="landscape"
            className="empty-inquiry-page__media"
          />
        </div>
      </Container>
    </Section>
  );
}
