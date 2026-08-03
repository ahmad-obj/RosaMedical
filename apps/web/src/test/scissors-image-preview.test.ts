import { describe, expect, it } from "vitest";
import { SCISSORS_BATCH_01_MEDIA } from "@/features/catalogue-media";
import { SCISSOR_PRODUCTS } from "@/features/catalogue-registry/products/scissors";
import { config as middlewareConfig } from "@/middleware";

const mediaById = new Map(
  SCISSORS_BATCH_01_MEDIA.map((asset) => [asset.id, asset] as const)
);

describe("Scissors image batch 01", () => {
  it("groups the catalogue into 42 visible configurations", () => {
    expect(SCISSOR_PRODUCTS).toHaveLength(42);
    expect(
      SCISSOR_PRODUCTS.flatMap((product) => product.catalogueCodes ?? [])
    ).toHaveLength(132);
  });

  it("keeps every Scissors configuration linked to a unique media asset ID", () => {
    const mediaAssetIds = SCISSOR_PRODUCTS.map((product) => product.mediaAssetId);

    expect(mediaAssetIds.every((value) => Boolean(value))).toBe(true);
    expect(new Set(mediaAssetIds).size).toBe(42);
  });

  it("joins every Scissors configuration to its local AVIF and WebP media", () => {
    for (const product of SCISSOR_PRODUCTS) {
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
        /^\/media\/catalogue-preview\/scissors\/.+\.avif$/
      );
      expect(product.mediaFallbackPath).toMatch(
        /^\/media\/catalogue-preview\/scissors\/.+\.webp$/
      );
      expect(product.mediaPath).not.toMatch(/^https?:\/\//);
      expect(product.mediaFallbackPath).not.toMatch(/^https?:\/\//);
    }
  });

  it("exposes exactly 84 distinct local runtime derivative paths", () => {
    const runtimePaths = SCISSOR_PRODUCTS.flatMap((product) => [
      product.mediaPath,
      product.mediaFallbackPath
    ]);

    expect(runtimePaths).toHaveLength(84);
    expect(runtimePaths.every((path) => typeof path === "string")).toBe(true);
    expect(new Set(runtimePaths).size).toBe(84);
    expect(
      runtimePaths.every(
        (path) =>
          typeof path === "string" &&
          path.startsWith("/media/catalogue-preview/scissors/") &&
          !path.includes("Thorhi-tools") &&
          !/^https?:\/\//.test(path)
      )
    ).toBe(true);
  });

  it("preserves the established Mayo product route used by inquiry previews", () => {
    const mayo = SCISSOR_PRODUCTS.find((product) => product.slug === "mayo-scissors");

    expect(mayo?.code).toBe("04-0401");
    expect(mayo?.catalogueCodes?.[0]).toEqual({
      code: "04-0401",
      size: "14.5 cm"
    });
  });

  it("does not require Supabase middleware for public catalogue routes", () => {
    expect(middlewareConfig.matcher).toEqual(["/admin/:path*"]);
  });
});
