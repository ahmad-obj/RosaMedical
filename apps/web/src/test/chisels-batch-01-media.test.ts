import { existsSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CHISELS_BATCH_01_MEDIA,
  assertCatalogueMediaManifest
} from "@/features/catalogue-media";
import { CHISELS_BATCH_01_CONFIGURATIONS } from "@/features/catalogue-registry/products/chisels-batch-01";

const PUBLIC_ROOT = resolve(process.cwd(), "public");

function publicFile(runtimePath: string): string {
  return resolve(PUBLIC_ROOT, runtimePath.replace(/^\/+/, ""));
}

function expectLocalDerivative(
  runtimePath: string,
  extension: "avif" | "webp"
): void {
  expect(runtimePath).toMatch(
    new RegExp(`^/media/catalogue-preview/chisels/.+\\.${extension}$`)
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

describe("Chisels Batch 01 production media", () => {
  const expectedIds = CHISELS_BATCH_01_CONFIGURATIONS.map(
    (configuration) => configuration.mediaAssetId
  );

  it("covers all 16 approved visible configuration IDs", () => {
    expect(CHISELS_BATCH_01_MEDIA).toHaveLength(16);
    expect(() =>
      assertCatalogueMediaManifest(CHISELS_BATCH_01_MEDIA, expectedIds)
    ).not.toThrow();
  });

  it("stores 16 local AVIF and 16 local WebP derivatives", () => {
    const paths = CHISELS_BATCH_01_MEDIA.flatMap((asset) => [
      asset.avifPath,
      asset.webpPath
    ]);

    expect(paths).toHaveLength(32);
    expect(new Set(paths).size).toBe(32);

    for (const asset of CHISELS_BATCH_01_MEDIA) {
      expectLocalDerivative(asset.avifPath, "avif");
      expectLocalDerivative(asset.webpPath, "webp");
    }
  });

  it("records approved client-catalogue provenance without overstating the curved Stille fallback", () => {
    const curvedStille = CHISELS_BATCH_01_MEDIA.find(
      (asset) => asset.id === "chisels-stille-osteotomes-curved"
    );
    const strongMatches = CHISELS_BATCH_01_MEDIA.filter(
      (asset) => asset.matchGrade === "strong-match"
    );

    expect(strongMatches).toHaveLength(15);
    expect(curvedStille?.matchGrade).toBe("acceptable-similar");

    for (const asset of CHISELS_BATCH_01_MEDIA) {
      expect(asset.familySlug).toBe("chisels");
      expect(asset.sourcePageUrl).toContain(
        "chisels-batch-01-sources.md"
      );
      expect(asset.rightsMode).toBe("preferred-safe");
      expect(asset.background).toBe("transparent");
      expect(asset.reviewStatus).toBe("approved");
      expect(asset.processingNotes.trim()).not.toBe("");
      expect(asset.orientationNotes.trim()).not.toBe("");
      expect(asset.reuseScope.trim()).not.toBe("");
    }
  });
});
