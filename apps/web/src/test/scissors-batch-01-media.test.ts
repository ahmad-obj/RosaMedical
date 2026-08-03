import { existsSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  SCISSORS_BATCH_01_MEDIA,
  assertCatalogueMediaManifest,
  type CatalogueMediaAsset
} from "@/features/catalogue-media";
import { SCISSORS_BATCH_01_CONFIGURATIONS } from "@/features/catalogue-registry/products/scissors-batch-01";

const PUBLIC_ROOT = resolve(process.cwd(), "public");
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
  reuseScope: "Used only for the 10.5 cm regular straight configuration.",
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
  return resolve(PUBLIC_ROOT, runtimePath.replace(/^\/+/, ""));
}

function mediaFor(...familyKeys: readonly string[]): readonly CatalogueMediaAsset[] {
  const expectedIds = new Set(
    SCISSORS_BATCH_01_CONFIGURATIONS.filter((item) =>
      familyKeys.includes(item.familyKey)
    ).map((item) => item.mediaAssetId)
  );
  return SCISSORS_BATCH_01_MEDIA.filter((asset) => expectedIds.has(asset.id));
}

function expectLocalDerivative(
  runtimePath: string,
  extension: "avif" | "webp"
): void {
  expect(runtimePath).toMatch(
    new RegExp(`^/media/catalogue-preview/scissors/.+\\.${extension}$`)
  );
  expect(runtimePath).not.toMatch(/^https?:\/\//);
  expect(runtimePath).not.toContain("Thorhi-tools");

  const file = publicFile(runtimePath);
  const relativePath = relative(PUBLIC_ROOT, file);
  expect(relativePath.startsWith("..")).toBe(false);
  expect(relativePath).not.toBe("");
  expect(existsSync(file), file).toBe(true);
  expect(statSync(file).size, file).toBeGreaterThan(0);
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

describe("Scissors Batch 01 production media", () => {
  const expectedIds = SCISSORS_BATCH_01_CONFIGURATIONS.map(
    (item) => item.mediaAssetId
  );

  it("covers all 42 approved visible configuration IDs", () => {
    expect(SCISSORS_BATCH_01_MEDIA).toHaveLength(42);
    expect(() =>
      assertCatalogueMediaManifest(SCISSORS_BATCH_01_MEDIA, expectedIds)
    ).not.toThrow();
  });

  it("keeps every runtime derivative inside the local Scissors media directory", () => {
    for (const asset of SCISSORS_BATCH_01_MEDIA) {
      expectLocalDerivative(asset.avifPath, "avif");
      expectLocalDerivative(asset.webpPath, "webp");
    }
  });

  it("records complete provenance and review metadata for every asset", () => {
    const matchGrades = ["exact", "strong-match", "acceptable-similar"];
    const rightsModes = ["preferred-safe", "supplier-fallback"];
    const backgrounds = ["transparent", "clean-white"];
    const reviewStatuses = ["candidate", "approved", "needs-replacement"];

    for (const asset of SCISSORS_BATCH_01_MEDIA) {
      expect(asset.sourcePageUrl.trim(), asset.id).not.toBe("");
      expect(asset.processingNotes.trim(), asset.id).not.toBe("");
      expect(asset.orientationNotes.trim(), asset.id).not.toBe("");
      expect(asset.reuseScope.trim(), asset.id).not.toBe("");
      expect(matchGrades, asset.id).toContain(asset.matchGrade);
      expect(rightsModes, asset.id).toContain(asset.rightsMode);
      expect(backgrounds, asset.id).toContain(asset.background);
      expect(reviewStatuses, asset.id).toContain(asset.reviewStatus);
    }
  });

  it("records Wave 1 catalogue montage confidence without claiming exact photos", () => {
    const wave1 = mediaFor("iris", "stevens");
    const straight = wave1.filter((asset) => asset.id.endsWith("-straight"));
    const curved = wave1.filter((asset) => asset.id.endsWith("-curved"));

    expect(wave1).toHaveLength(12);
    expect(straight).toHaveLength(6);
    expect(curved).toHaveLength(6);
    expect(
      straight.every((asset) => asset.matchGrade === "strong-match")
    ).toBe(true);
    expect(
      curved.every((asset) => asset.matchGrade === "acceptable-similar")
    ).toBe(true);
    expect(
      wave1.every(
        (asset) =>
          asset.rightsMode === "preferred-safe" &&
          asset.background === "transparent" &&
          asset.reviewStatus === "candidate"
      )
    ).toBe(true);
  });

  it("records all 12 Mayo and Metzenbaum catalogue-derived candidates honestly", () => {
    const wave2 = mediaFor("mayo", "metzenbaum");
    const straight = wave2.filter((asset) => asset.id.endsWith("-straight"));
    const curved = wave2.filter((asset) => asset.id.endsWith("-curved"));

    expect(wave2).toHaveLength(12);
    expect(wave2.filter((asset) => asset.id.includes("-mayo-"))).toHaveLength(6);
    expect(
      wave2.filter((asset) => asset.id.includes("-metzenbaum-"))
    ).toHaveLength(6);
    expect(straight).toHaveLength(6);
    expect(curved).toHaveLength(6);
    expect(
      straight.every((asset) => asset.matchGrade === "strong-match")
    ).toBe(true);
    expect(
      curved.every((asset) => asset.matchGrade === "acceptable-similar")
    ).toBe(true);
    expect(
      wave2.every(
        (asset) =>
          asset.sourcePageUrl.includes("scissors-batch-01-sources.md") &&
          asset.rightsMode === "preferred-safe" &&
          asset.background === "transparent" &&
          asset.reviewStatus === "candidate"
      )
    ).toBe(true);
  });

  it("records six exact-shape Regular Operating supplier candidates", () => {
    const operating = mediaFor("operating");
    const regular = operating.filter((asset) =>
      asset.id.includes("-operating-regular-")
    );

    expect(operating).toHaveLength(18);
    expect(regular).toHaveLength(6);
    expect(
      regular.every(
        (asset) =>
          asset.sourcePageUrl ===
            "https://www.mpmmedicalsupply.com/products/operating-scissors" &&
          asset.originalImageUrl?.includes("/cdn/shop/products/operating-scissor-") &&
          asset.matchGrade === "strong-match" &&
          asset.rightsMode === "supplier-fallback" &&
          asset.background === "transparent" &&
          asset.reviewStatus === "candidate"
      )
    ).toBe(true);
  });

  it("records twelve finish-specific Operating montage candidates without overstating confidence", () => {
    const operating = mediaFor("operating");
    const montage = operating.filter(
      (asset) => !asset.id.includes("-operating-regular-")
    );

    expect(montage).toHaveLength(12);
    expect(
      montage.every(
        (asset) =>
          asset.sourcePageUrl.includes("#client-catalogue-page-2-operating") &&
          asset.originalImageUrl?.includes("/cdn/shop/products/operating-scissor-") &&
          asset.matchGrade === "acceptable-similar" &&
          asset.rightsMode === "preferred-safe" &&
          asset.background === "transparent" &&
          asset.reviewStatus === "candidate"
      )
    ).toBe(true);
  });
});
