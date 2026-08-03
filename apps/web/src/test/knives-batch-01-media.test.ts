import { existsSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  KNIVES_BATCH_01_MEDIA,
  assertCatalogueMediaManifest
} from "@/features/catalogue-media";
import { KNIVES_BATCH_01_CONFIGURATIONS } from "@/features/catalogue-registry/products/knives-batch-01";

const PUBLIC_ROOT = resolve(process.cwd(), "public");

function publicFile(runtimePath: string): string {
  return resolve(PUBLIC_ROOT, runtimePath.replace(/^\/+/, ""));
}

function expectLocalDerivative(
  runtimePath: string,
  extension: "avif" | "webp"
): void {
  expect(runtimePath).toMatch(
    new RegExp(`^/media/catalogue-preview/knives/.+\\.${extension}$`)
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

describe("Knives Batch 01 production media", () => {
  const expectedIds = KNIVES_BATCH_01_CONFIGURATIONS.map(
    (configuration) => configuration.mediaAssetId
  );

  it("covers all 18 visible configuration IDs", () => {
    expect(KNIVES_BATCH_01_MEDIA).toHaveLength(18);
    expect(() =>
      assertCatalogueMediaManifest(KNIVES_BATCH_01_MEDIA, expectedIds)
    ).not.toThrow();
  });

  it("stores 18 local AVIF and 18 local WebP derivatives", () => {
    const paths = KNIVES_BATCH_01_MEDIA.flatMap((asset) => [
      asset.avifPath,
      asset.webpPath
    ]);

    expect(paths).toHaveLength(36);
    expect(new Set(paths).size).toBe(36);

    for (const asset of KNIVES_BATCH_01_MEDIA) {
      expectLocalDerivative(asset.avifPath, "avif");
      expectLocalDerivative(asset.webpPath, "webp");
    }
  });

  it("records complete client-catalogue provenance for all candidates", () => {
    for (const asset of KNIVES_BATCH_01_MEDIA) {
      expect(asset.familySlug).toBe("knives");
      expect(asset.sourcePageUrl).toContain("knives-batch-01-sources.md");
      expect(asset.matchGrade).toBe("strong-match");
      expect(asset.rightsMode).toBe("preferred-safe");
      expect(asset.background).toBe("transparent");
      expect(asset.reviewStatus).toBe("candidate");
      expect(asset.processingNotes.trim()).not.toBe("");
      expect(asset.orientationNotes.trim()).not.toBe("");
      expect(asset.reuseScope.trim()).not.toBe("");
    }
  });
});
