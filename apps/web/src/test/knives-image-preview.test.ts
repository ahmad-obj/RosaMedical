import { describe, expect, it } from "vitest";
import { KNIVES_BATCH_01_MEDIA } from "@/features/catalogue-media";
import { KNIFE_PRODUCTS } from "@/features/catalogue-registry/products/knives";

const mediaById = new Map(
  KNIVES_BATCH_01_MEDIA.map((asset) => [asset.id, asset] as const)
);

describe("Knives image batch 01", () => {
  it("adds 18 Batch 01 configurations while preserving four established records", () => {
    expect(KNIFE_PRODUCTS).toHaveLength(22);
    expect(
      KNIFE_PRODUCTS.filter((product) => Boolean(product.mediaAssetId))
    ).toHaveLength(18);
    expect(
      KNIFE_PRODUCTS.flatMap((product) => product.catalogueCodes ?? [])
    ).toHaveLength(32);

    for (const slug of [
      "scalpel-handle-no-3",
      "bard-parker-handle",
      "amputation-knife",
      "resection-knife"
    ]) {
      const preserved = KNIFE_PRODUCTS.find((product) => product.slug === slug);
      expect(preserved, slug).toBeDefined();
      expect(preserved?.mediaAssetId).toBeUndefined();
    }
  });

  it("keeps every Batch 01 configuration linked to a unique media asset ID", () => {
    const batchProducts = KNIFE_PRODUCTS.filter((product) => product.mediaAssetId);
    const mediaAssetIds = batchProducts.map((product) => product.mediaAssetId);

    expect(batchProducts).toHaveLength(18);
    expect(new Set(mediaAssetIds).size).toBe(18);
  });

  it("joins every Batch 01 configuration to local AVIF and WebP media", () => {
    for (const product of KNIFE_PRODUCTS.filter((item) => item.mediaAssetId)) {
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
        /^\/media\/catalogue-preview\/knives\/.+\.avif$/
      );
      expect(product.mediaFallbackPath).toMatch(
        /^\/media\/catalogue-preview\/knives\/.+\.webp$/
      );
    }
  });

  it("exposes exactly 36 distinct local runtime derivative paths", () => {
    const runtimePaths = KNIFE_PRODUCTS.filter(
      (product) => product.mediaAssetId
    ).flatMap((product) => [product.mediaPath, product.mediaFallbackPath]);

    expect(runtimePaths).toHaveLength(36);
    expect(runtimePaths.every((path) => typeof path === "string")).toBe(true);
    expect(new Set(runtimePaths).size).toBe(36);
    expect(
      runtimePaths.every(
        (path) =>
          typeof path === "string" &&
          path.startsWith("/media/catalogue-preview/knives/") &&
          !/^https?:\/\//.test(path)
      )
    ).toBe(true);
  });

  it("preserves the first Batch 01 route with exact catalogue data", () => {
    const numberThree = KNIFE_PRODUCTS.find(
      (product) => product.slug === "number-3"
    );

    expect(numberThree?.code).toBe("18-0103");
    expect(numberThree?.catalogueCodes).toEqual([
      { code: "18-0103", size: "12.0 cm" },
      { code: "18-0103S", size: "12.0 cm" }
    ]);
  });
});
