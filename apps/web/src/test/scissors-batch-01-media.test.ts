import { describe, expect, it } from "vitest";
import {
  assertCatalogueMediaManifest,
  type CatalogueMediaAsset
} from "@/features/catalogue-media";

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
