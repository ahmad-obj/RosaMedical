import { existsSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CUTTERS_BATCH_01_MEDIA,
  assertCatalogueMediaManifest
} from "@/features/catalogue-media";
import { CUTTERS_BATCH_01_CONFIGURATIONS } from "@/features/catalogue-registry/products/cutters-batch-01";

const PUBLIC_ROOT = resolve(process.cwd(), "public");

function publicFile(runtimePath: string): string {
  return resolve(PUBLIC_ROOT, runtimePath.replace(/^\/+/, ""));
}

function expectLocalDerivative(
  runtimePath: string,
  extension: "avif" | "webp"
): void {
  expect(runtimePath).toMatch(
    new RegExp(`^/media/catalogue-preview/cutters/.+\\.${extension}$`)
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

describe("Cutters Batch 01 production media", () => {
  const expectedIds = CUTTERS_BATCH_01_CONFIGURATIONS.map(
    (configuration) => configuration.mediaAssetId
  );

  it("covers all 13 visible configuration IDs", () => {
    expect(CUTTERS_BATCH_01_MEDIA).toHaveLength(13);
    expect(() =>
      assertCatalogueMediaManifest(CUTTERS_BATCH_01_MEDIA, expectedIds)
    ).not.toThrow();
  });

  it("stores 13 local AVIF and 13 local WebP derivatives", () => {
    const paths = CUTTERS_BATCH_01_MEDIA.flatMap((asset) => [
      asset.avifPath,
      asset.webpPath
    ]);

    expect(paths).toHaveLength(26);
    expect(new Set(paths).size).toBe(26);

    for (const asset of CUTTERS_BATCH_01_MEDIA) {
      expectLocalDerivative(asset.avifPath, "avif");
      expectLocalDerivative(asset.webpPath, "webp");
    }
  });

  it("records approved conservative match grades for shared full-body direction variants", () => {
    const strongMatches = CUTTERS_BATCH_01_MEDIA.filter(
      (asset) => asset.matchGrade === "strong-match"
    );
    const acceptableSimilar = CUTTERS_BATCH_01_MEDIA.filter(
      (asset) => asset.matchGrade === "acceptable-similar"
    );

    expect(strongMatches).toHaveLength(7);
    expect(acceptableSimilar).toHaveLength(6);

    for (const asset of CUTTERS_BATCH_01_MEDIA) {
      expect(asset.familySlug).toBe("cutters");
      expect(asset.sourcePageUrl).toContain("cutters-batch-01-sources.md");
      expect(asset.rightsMode).toBe("preferred-safe");
      expect(asset.background).toBe("transparent");
      expect(asset.reviewStatus).toBe("approved");
      expect(asset.processingNotes.trim()).not.toBe("");
      expect(asset.orientationNotes.trim()).not.toBe("");
      expect(asset.reuseScope.trim()).not.toBe("");
    }
  });
});
