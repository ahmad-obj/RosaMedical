import type { ReactElement } from "react";
import { getFeaturedCatalogueProducts } from "@/features/catalogue-live";
import { createProductsPageModel } from "./products.data";
import type { PublicLocale } from "@/features/localization";
import { PublicHeroCarousel } from "@/features/public-hero";
import { DiscoveryToolbarShell } from "./sections/discovery-toolbar-shell";
import { FamilyIndex } from "./sections/family-index";
import { ProductPreviewGrid } from "./sections/product-preview-grid";
import { CatalogueSupport } from "./sections/catalogue-support";
import { ProductsProcurementCta } from "./sections/products-procurement-cta";

export async function ProductsOverview({ locale = "en" }: { locale?: PublicLocale }): Promise<ReactElement> {
  const products = await getFeaturedCatalogueProducts();
  const model = createProductsPageModel(products, locale);
  return (
    <div className="public-page public-page--products">
      <PublicHeroCarousel page="products" locale={locale} headingId="products-public-hero-title" />
      <DiscoveryToolbarShell model={model.discovery} />
      <FamilyIndex intro={model.familyIntro} families={model.families} locale={locale} />
      <ProductPreviewGrid intro={model.productsIntro} products={model.products} />
      <CatalogueSupport model={model.catalogue} />
      <ProductsProcurementCta model={model.procurement} />
    </div>
  );
}
