import { describe, expect, it } from "vitest";
import { CUTTERS_BATCH_01_MEDIA } from "@/features/catalogue-media";
import { CUTTER_PRODUCTS } from "@/features/catalogue-registry/products/cutters";

const mediaById = new Map(
  CUTTERS_BATCH_01_MEDIA.map((asset) => [asset.id, asset] as const)
);

describe("Cutters image batch 01", () => {
  it("adds 13 Batch 01 configurations while preserving SC-01T", () => {
    expect(CUTTER_PRODUCTS).toHaveLength(14);
    expect(
      CUTTER_PRODUCTS.filter((product) => Boolean(product.mediaAssetId))
    ).toHaveLength(13);
    expect(
      CUTTER_PRODUCTS.flatMap((product) => product.catalogueCodes ?? [])
    ).toHaveLength(22);

    const preserved = CUTTER_PRODUCTS.find((product) => product.slug === "sc-01t");
    expect(preserved?.code).toBe("SC-01T");
    expect(preserved?.mediaAssetId).toBeUndefined();
  });

  it("keeps every Batch 01 configuration linked to a unique media asset ID", () => {
    const batchProducts = CUTTER_PRODUCTS.filter((product) => product.mediaAssetId);
    const mediaAssetIds = batchProducts.map((product) => product.mediaAssetId);

    expect(batchProducts).toHaveLength(13);
    expect(new Set(mediaAssetIds).size).toBe(13);
  });

  it("joins every Batch 01 configuration to local AVIF and WebP media", () => {
    for (const product of CUTTER_PRODUCTS.filter(
      (item) => item.mediaAssetId
    )) {
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
        /^\/media\/catalogue-preview\/cutters\/.+\.avif$/
      );
      expect(product.mediaFallbackPath).toMatch(
        /^\/media\/catalogue-preview\/cutters\/.+\.webp$/
      );
    }
  });

  it("exposes exactly 26 distinct local runtime derivative paths", () => {
    const runtimePaths = CUTTER_PRODUCTS.filter(
      (product) => product.mediaAssetId
    ).flatMap((product) => [product.mediaPath, product.mediaFallbackPath]);

    expect(runtimePaths).toHaveLength(26);
    expect(runtimePaths.every((path) => typeof path === "string")).toBe(true);
    expect(new Set(runtimePaths).size).toBe(26);
    expect(
      runtimePaths.every(
        (path) =>
          typeof path === "string" &&
          path.startsWith("/media/catalogue-preview/cutters/") &&
          !/^https?:\/\//.test(path)
      )
    ).toBe(true);
  });

  it("preserves the established Liston route with exact first code data", () => {
    const liston = CUTTER_PRODUCTS.find((product) => product.slug === "liston");

    expect(liston?.code).toBe("36-5101");
    expect(liston?.catalogueCodes?.[0]).toEqual({
      code: "36-5101",
      size: "14.0 cm"
    });
  });
});
