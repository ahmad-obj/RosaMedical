import { describe, expect, it } from "vitest";
import { CHISELS_BATCH_01_MEDIA } from "@/features/catalogue-media";
import { getProductDetailModel } from "@/features/catalogue-registry";
import { CHISEL_PRODUCTS } from "@/features/catalogue-registry/products/chisels";
import { CHISELS_BATCH_01_CONFIGURATIONS } from "@/features/catalogue-registry/products/chisels-batch-01";

const mediaById = new Map(
  CHISELS_BATCH_01_MEDIA.map((asset) => [asset.id, asset] as const)
);

const batchProducts = CHISEL_PRODUCTS.filter((product) =>
  product.mediaAssetId?.startsWith("chisels-")
);

describe("Chisels image batch 01", () => {
  it("adds 16 Batch 01 configurations while preserving four established later-page products", () => {
    expect(CHISEL_PRODUCTS).toHaveLength(20);
    expect(batchProducts).toHaveLength(16);
    expect(
      batchProducts.flatMap((product) => product.catalogueCodes ?? [])
    ).toHaveLength(95);
    expect(CHISEL_PRODUCTS.some((product) => product.slug === "codman")).toBe(
      true
    );
  });

  it("joins every Batch 01 configuration to its exact local AVIF and WebP media", () => {
    for (const configuration of CHISELS_BATCH_01_CONFIGURATIONS) {
      const product = batchProducts.find(
        (item) => item.mediaAssetId === configuration.mediaAssetId
      );
      const media = mediaById.get(configuration.mediaAssetId);

      expect(product, configuration.id).toBeDefined();
      expect(media, configuration.mediaAssetId).toBeDefined();
      expect(product?.mediaPath).toBe(media?.avifPath);
      expect(product?.mediaFallbackPath).toBe(media?.webpPath);
      expect(product?.mediaSourceUrl).toBe(media?.sourcePageUrl);
      expect(product?.mediaReviewNote).toBe(
        media
          ? `${media.matchGrade} · ${media.rightsMode} · ${media.background} · ${media.reviewStatus}`
          : undefined
      );
      expect(product?.mediaPath).toMatch(
        /^\/media\/catalogue-preview\/chisels\/.+\.avif$/
      );
      expect(product?.mediaFallbackPath).toMatch(
        /^\/media\/catalogue-preview\/chisels\/.+\.webp$/
      );
    }
  });

  it("exposes exactly 32 distinct local Batch 01 derivative paths", () => {
    const runtimePaths = batchProducts.flatMap((product) => [
      product.mediaPath,
      product.mediaFallbackPath
    ]);

    expect(runtimePaths).toHaveLength(32);
    expect(runtimePaths.every((path) => typeof path === "string")).toBe(true);
    expect(new Set(runtimePaths).size).toBe(32);
    expect(
      runtimePaths.every(
        (path) =>
          typeof path === "string" &&
          path.startsWith("/media/catalogue-preview/chisels/") &&
          !path.includes("Thorhi-tools") &&
          !/^https?:\/\//.test(path)
      )
    ).toBe(true);
  });

  it("resolves a Batch 01 detail route without breaking the established Codman route", () => {
    expect(
      getProductDetailModel("chisels", "osteotomes-13-5cm").kind
    ).toBe("product");
    expect(getProductDetailModel("chisels", "codman").kind).toBe("product");
  });
});
