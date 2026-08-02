import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  SCISSORS_BATCH_01_MEDIA,
  assertCatalogueMediaManifest,
  type CatalogueMediaAsset
} from "@/features/catalogue-media";
import { SCISSORS_BATCH_01_CONFIGURATIONS } from "@/features/catalogue-registry/products/scissors-batch-01";

const VALID_ASSET: CatalogueMediaAsset = {
  id: "scissors-iris-regular-straight",
  familySlug: "scissors",
  configurationKey: "scissors-iris-regular-straight",
  avifPath:
    "/media/catalogue-preview/scissors/scissors-iris-regular-straight.avif",
  webpPath:
    "/media/catalogue-preview/scissors/scissors-iris-regular-straight.webp",
  sourcePageUrl: "https://example.com/iris-scissors",
  originalImageUrl: "https://example.com/iris-scissors.jpg",
  matchGrade: "exact",
  rightsMode: "supplier-fallback",
  background: "transparent",
  processingNotes: "Background removed without changing instrument geometry.",
  orientationNotes: "Working end oriented toward the upper-right.",
  reuseScope: "Used only for the 9.5 cm and 11.5 cm regular straight configuration.",
  reviewStatus: "candidate"
};

function expectManifestFailure(
  assets: readonly CatalogueMediaAsset[],
  expectedIds: readonly string[],
  message: RegExp
): void {
  expect(() => assertCatalogueMediaManifest(assets, expectedIds)).toThrow(message);
}

function publicFile(runtimePath: string): string {
  return resolve(process.cwd(), "public", runtimePath.replace(/^\//, ""));
}

describe("catalogue media manifest validation", () => {
  it("accepts a complete local media record", () => {
    expect(() =>
      assertCatalogueMediaManifest([VALID_ASSET], [VALID_ASSET.id])
    ).not.toThrow();
  });

  it("rejects a remote runtime AVIF path", () => {
    expectManifestFailure(
      [{ ...VALID_ASSET, avifPath: "https://example.com/iris.avif" }],
      [VALID_ASSET.id],
      /remote runtime path/
    );
  });

  it("rejects a missing WebP fallback", () => {
    expectManifestFailure(
      [{ ...VALID_ASSET, webpPath: "" }],
      [VALID_ASSET.id],
      /empty webpPath/
    );
  });

  it("rejects an empty source page URL", () => {
    expectManifestFailure(
      [{ ...VALID_ASSET, sourcePageUrl: "" }],
      [VALID_ASSET.id],
      /empty sourcePageUrl/
    );
  });

  it("rejects duplicate media IDs", () => {
    expectManifestFailure(
      [VALID_ASSET, VALID_ASSET],
      [VALID_ASSET.id],
      /Duplicate catalogue media id/
    );
  });

  it("rejects a missing expected asset ID", () => {
    expectManifestFailure(
      [VALID_ASSET],
      [VALID_ASSET.id, "scissors-iris-regular-curved"],
      /Missing expected catalogue media id/
    );
  });
});

describe("Iris and Stevens Wave 1 media", () => {
  const expectedIds = SCISSORS_BATCH_01_CONFIGURATIONS.filter(
    (item) => item.familyKey === "iris" || item.familyKey === "stevens"
  ).map((item) => item.mediaAssetId);

  it("covers the exact 12 approved configuration IDs", () => {
    expect(SCISSORS_BATCH_01_MEDIA).toHaveLength(12);
    expect(() =>
      assertCatalogueMediaManifest(SCISSORS_BATCH_01_MEDIA, expectedIds)
    ).not.toThrow();
  });

  it("stores non-empty AVIF and WebP derivatives locally", () => {
    for (const asset of SCISSORS_BATCH_01_MEDIA) {
      expect(asset.avifPath).toMatch(
        /^\/media\/catalogue-preview\/scissors\/.+\.avif$/
      );
      expect(asset.webpPath).toMatch(
        /^\/media\/catalogue-preview\/scissors\/.+\.webp$/
      );

      for (const path of [asset.avifPath, asset.webpPath]) {
        const file = publicFile(path);
        expect(existsSync(file), file).toBe(true);
        expect(statSync(file).size, file).toBeGreaterThan(0);
      }
    }
  });

  it("records catalogue montage confidence without claiming exact photos", () => {
    const straight = SCISSORS_BATCH_01_MEDIA.filter((asset) =>
      asset.id.endsWith("-straight")
    );
    const curved = SCISSORS_BATCH_01_MEDIA.filter((asset) =>
      asset.id.endsWith("-curved")
    );

    expect(straight).toHaveLength(6);
    expect(curved).toHaveLength(6);
    expect(straight.every((asset) => asset.matchGrade === "strong-match")).toBe(true);
    expect(
      curved.every((asset) => asset.matchGrade === "acceptable-similar")
    ).toBe(true);
    expect(
      SCISSORS_BATCH_01_MEDIA.every(
        (asset) =>
          asset.rightsMode === "preferred-safe" &&
          asset.reviewStatus === "candidate"
      )
    ).toBe(true);
  });
});
