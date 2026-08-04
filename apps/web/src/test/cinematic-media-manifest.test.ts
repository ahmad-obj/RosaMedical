import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CINEMATIC_MEDIA,
  REQUIRED_CINEMATIC_SLOTS
} from "@/features/cinematic-media";

const PUBLIC_ROOT = resolve(process.cwd(), "public");

function publicFile(runtimePath: string): string {
  return resolve(PUBLIC_ROOT, runtimePath.replace(/^\/+/, ""));
}

describe("cinematic media manifest", () => {
  it("defines exactly the nine approved release slots", () => {
    expect(REQUIRED_CINEMATIC_SLOTS).toEqual([
      "homepage-hero",
      "homepage-procurement",
      "homepage-catalogue-knives",
      "homepage-catalogue-scissors",
      "homepage-catalogue-punches",
      "homepage-catalogue-chisels",
      "homepage-catalogue-cutters",
      "about-hero",
      "about-procurement"
    ]);
    expect(Object.keys(CINEMATIC_MEDIA).sort()).toEqual(
      [...REQUIRED_CINEMATIC_SLOTS].sort()
    );
  });

  it("uses complete local source-backed media records", () => {
    const sources = new Set<string>();

    for (const slot of REQUIRED_CINEMATIC_SLOTS) {
      const asset = CINEMATIC_MEDIA[slot];

      expect(asset.slot).toBe(slot);
      expect(asset.src).toMatch(/^\/media\/(cinematic|catalogue-covers)\/.+\.webp$/);
      expect(asset.alt.trim()).not.toBe("");
      expect(asset.focalPoint).toMatch(/^\d+% \d+%$/);
      expect(asset.sizes.trim()).not.toBe("");
      expect(asset.sourceRecord).toContain("Catalog(1).pdf");
      expect(asset.rightsStatus).toBe("client-confirmation-required");

      const file = publicFile(asset.src);
      expect(existsSync(file), file).toBe(true);
      expect(statSync(file).size, file).toBeGreaterThan(1_000);
      sources.add(asset.src);
    }

    expect(sources.size).toBe(REQUIRED_CINEMATIC_SLOTS.length);
  });

  it("keeps generated catalogue artwork on the locked ROSA-only brand", () => {
    const renderer = readFileSync(
      resolve(process.cwd(), "scripts/build_cinematic_media.mjs"),
      "utf8"
    );

    expect(renderer).toContain(">ROSA</text>");
    expect(renderer).not.toMatch(/ROSA\s+MEDICAL/i);
  });
});
