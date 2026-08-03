import { describe, expect, it } from "vitest";
import { PUNCHES_BATCH_01_MEDIA } from "@/features/catalogue-media";
import { PUNCH_PRODUCTS } from "@/features/catalogue-registry/products/punches";

const mediaById = new Map(
  PUNCHES_BATCH_01_MEDIA.map((asset) => [asset.id, asset] as const)
);

describe("Punches image batch 01", () => {
  it("adds 14 Batch 01 configurations while preserving the unrelated Biopsy Punch", () => {
    expect(PUNCH_PRODUCTS).toHaveLength(15);
    expect(
      PUNCH_PRODUCTS.filter((product) => Boolean(product.mediaAssetId))
    ).toHaveLength(14);
    expect(
      PUNCH_PRODUCTS.filter((product) => product.mediaAssetId).flatMap(
        (product) => product.catalogueCodes ?? []
      )
    ).toHaveLength(32);

    const preserved = PUNCH_PRODUCTS.find(
      (product) => product.slug === "biopsy-punch"
    );
    expect(preserved?.code).toBe("23-1204");
    expect(preserved?.mediaAssetId).toBeUndefined();
  });

  it("preserves the three established Yeoman routes", () => {
    expect(PUNCH_PRODUCTS.find((product) => product.id === "product_yeoman")?.slug).toBe(
      "yeoman"
    );
    expect(
      PUNCH_PRODUCTS.find(
        (product) => product.id === "product_yeoman_perforated"
      )?.slug
    ).toBe("yeoman-perforated");
    expect(
      PUNCH_PRODUCTS.find(
        (product) => product.id === "product_yeoman_rectangular"
      )?.slug
    ).toBe("yeoman-rectangular");
  });

  it("keeps every Batch 01 configuration linked to a unique media asset ID", () => {
    const batchProducts = PUNCH_PRODUCTS.filter((product) => product.mediaAssetId);
    const mediaAssetIds = batchProducts.map((product) => product.mediaAssetId);

    expect(batchProducts).toHaveLength(14);
    expect(new Set(mediaAssetIds).size).toBe(14);
  });

  it("joins every Batch 01 configuration to local AVIF and WebP media", () => {
    for (const product of PUNCH_PRODUCTS.filter((item) => item.mediaAssetId)) {
      const asset = product.mediaAssetId
        ? mediaById.get(product.mediaAssetId)
        : undefined;

      expect(asset, product.id).toBeDefined();
      expect(product.mediaPath).toBe(asset?.avifPath);
      expect(product.mediaFallbackPath).toBe(asset?.webpPath);
      expect(product.mediaSourceUrl).toBe(asset?.sourcePageUrl);
      expect(product.mediaReviewNote).toBe(
        asset
          ? `${asset.matchGrade} · ${asset.rightsMode} · ${asset.background} · ${asset.reviewStatus}`
          : undefined
      );
      expect(product.mediaPath).toMatch(
        /^\/media\/catalogue-preview\/punches\/.+\.avif$/
      );
      expect(product.mediaFallbackPath).toMatch(
        /^\/media\/catalogue-preview\/punches\/.+\.webp$/
      );
    }
  });

  it("exposes exactly 28 distinct local runtime derivative paths", () => {
    const runtimePaths = PUNCH_PRODUCTS.filter(
      (product) => product.mediaAssetId
    ).flatMap((product) => [product.mediaPath, product.mediaFallbackPath]);

    expect(runtimePaths).toHaveLength(28);
    expect(runtimePaths.every((path) => typeof path === "string")).toBe(true);
    expect(new Set(runtimePaths).size).toBe(28);
    expect(
      runtimePaths.every(
        (path) =>
          typeof path === "string" &&
          path.startsWith("/media/catalogue-preview/punches/") &&
          !/^https?:\/\//.test(path)
      )
    ).toBe(true);
  });

  it("keeps the established Yeoman route on exact first-code data", () => {
    const yeoman = PUNCH_PRODUCTS.find((product) => product.slug === "yeoman");

    expect(yeoman?.code).toBe("21-1001");
    expect(yeoman?.catalogueCodes?.[0]).toEqual({
      code: "21-1001",
      size: "28.0 cm"
    });
  });
});
