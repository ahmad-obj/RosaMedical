import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/layout";
import { getProductCatalogueContext } from "@/features/catalogue-live";
import { Reveal } from "@/features/motion";
import { ProcurementPanel } from "@/features/public-catalogue";
import { createProductDetailData } from "./product-detail.data";
import { ProductBreadcrumbs } from "./product-breadcrumbs";
import { ProductGallery } from "./product-gallery";
import { ProductProcurementSummary } from "./product-procurement-summary";
import { ProductSpecificationTable } from "./product-specification-table";
import { ProductProcurementNote } from "./product-procurement-note";
import { MobileInquiryBar } from "./mobile-inquiry-bar";
import type { PublicLocale } from "@/features/localization/locales";
import { FAMILY_NAMES_AR } from "@/features/localization/public-copy";

export async function ProductDetailPage({
  familySlug,
  productSlug,
  locale = "en"
}: {
  familySlug: string;
  productSlug: string;
  locale?: PublicLocale;
}): Promise<ReactElement | null> {
  const products = await getProductCatalogueContext(familySlug, productSlug);
  const data = createProductDetailData(familySlug, productSlug, products);
  if (!data) {
    notFound();
    return null;
  }
  const ar = locale === "ar";
  const family = ar ? { ...data.family, name: FAMILY_NAMES_AR[data.family.slug] } : data.family;
  const product = ar ? {
    ...data.product,
    name: data.product.nameAr?.trim() || data.product.name,
    ...(data.product.descriptionAr?.trim()
      ? { description: data.product.descriptionAr.trim() }
      : {})
  } : data.product;

  return (
    <div className="public-page public-page--product-detail">
      <Section tone="paper" spacing="compact" className="product-detail-intro">
        <Container size="wide">
          <Reveal direction="none" className="product-detail__breadcrumbs-reveal">
            <ProductBreadcrumbs family={family} product={data.product} locale={locale} />
          </Reveal>
          <div className="product-detail-layout">
            <Reveal direction="right" delay={0.04} className="product-detail-layout__gallery-reveal">
              <ProductGallery product={product} />
            </Reveal>
            <Reveal direction="left" delay={0.1} className="product-detail-layout__summary-reveal">
              <ProductProcurementSummary
                family={family}
                product={product}
                catalogueReference={data.catalogueReference}
                configurationOptions={data.configurationOptions}
                locale={locale}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container size="wide">
          <Reveal direction="up">
            <ProductSpecificationTable rows={data.specifications} locale={locale} />
          </Reveal>
          <Reveal direction="up" delay={0.08}>
            <ProductProcurementNote locale={locale} />
          </Reveal>
        </Container>
      </Section>

      <Section tone="paper" className="product-detail-final-cta">
        <Container size="wide">
          <Reveal direction="up">
            <ProcurementPanel
              eyebrow={ar ? "الاستفسار جاهز" : "Inquiry ready"}
              title={ar ? "واصل إعداد قائمة المنتجات." : "Continue building your product list."}
              copy={ar ? "راجع الأدوات والكميات وملاحظات البنود قبل طلب عرض السعر." : "Review selected instruments, quantities and line notes before requesting a quotation."}
              primary={{ label: ar ? "عرض الاستفسار" : "View inquiry", href: "/inquiry" }}
              tone="dark"
            />
          </Reveal>
        </Container>
      </Section>
      <MobileInquiryBar />
    </div>
  );
}
