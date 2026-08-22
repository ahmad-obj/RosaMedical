import type { ReactElement } from "react";
import { Container, Section } from "@/components/layout";
import { CATALOGUE_DOCUMENTS, CatalogueCover } from "@/features/catalogues";
import { FAMILY_NAMES_AR } from "@/features/localization/public-copy";
import type { PublicLocale } from "@/features/localization/locales";

export function ProductsCatalogueCards({
  locale = "en"
}: {
  locale?: PublicLocale;
}): ReactElement {
  const ar = locale === "ar";

  return (
    <Section tone="paper" className="products-catalogue-section" data-section="products-catalogues">
      <Container size="wide">
        <header className="products-catalogue-section__heading">
          <p className="public-eyebrow">{ar ? "الكتالوجات التقنية" : "Technical catalogues"}</p>
          <h2>{ar ? "فئات المنتجات" : "Product Categories"}</h2>
          <p>{ar ? "افتح كتالوج العائلة للمراجعة أو نزّل ملف PDF مباشرة." : "Open a family catalogue for review or download the PDF directly."}</p>
        </header>

        <ul className="products-catalogue-grid">
          {CATALOGUE_DOCUMENTS.map((document) => {
            const familyName = ar ? FAMILY_NAMES_AR[document.familySlug] : document.name;
            return (
              <li key={document.familySlug} data-products-catalogue={document.familySlug}>
                <article className="products-catalogue-card">
                  <a
                    className="products-catalogue-card__cover-link"
                    href={document.pdfPath}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={ar ? `فتح كتالوج ${familyName}` : `Open ${familyName} catalogue`}
                  >
                    <CatalogueCover document={document} locale={locale} />
                  </a>
                  <div className="products-catalogue-card__actions">
                    <strong>{familyName}</strong>
                    <a
                      className="products-catalogue-card__download"
                      href={document.pdfPath}
                      download={`rosa-${document.familySlug}-catalogue.pdf`}
                    >
                      {ar ? "تنزيل الكتالوج" : "Download catalogue"}
                    </a>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
