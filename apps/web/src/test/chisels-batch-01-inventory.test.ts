import { describe, expect, it } from "vitest";
import { CHISELS_BATCH_01_CONFIGURATIONS } from "@/features/catalogue-registry/products/chisels-batch-01";

describe("Chisels Batch 01 inventory", () => {
  const allCodes = CHISELS_BATCH_01_CONFIGURATIONS.flatMap((configuration) =>
    configuration.codeOptions.map((option) => option.code)
  );

  it("contains the approved 16 visible configurations from catalogue pages 1 to 3", () => {
    expect(CHISELS_BATCH_01_CONFIGURATIONS).toHaveLength(16);
    expect(
      CHISELS_BATCH_01_CONFIGURATIONS.filter(
        (configuration) => configuration.cataloguePage === "1"
      )
    ).toHaveLength(6);
    expect(
      CHISELS_BATCH_01_CONFIGURATIONS.filter(
        (configuration) => configuration.cataloguePage === "2"
      )
    ).toHaveLength(6);
    expect(
      CHISELS_BATCH_01_CONFIGURATIONS.filter(
        (configuration) => configuration.cataloguePage === "3"
      )
    ).toHaveLength(4);
  });

  it("preserves all 95 exact catalogue codes without duplication", () => {
    expect(allCodes).toHaveLength(95);
    expect(new Set(allCodes).size).toBe(95);
  });

  it("keeps size-only Stille variants grouped under four visible configurations", () => {
    const stille = CHISELS_BATCH_01_CONFIGURATIONS.filter((configuration) =>
      configuration.familyKey.startsWith("stille-")
    );

    expect(stille).toHaveLength(4);
    expect(
      stille.find(
        (configuration) =>
          configuration.familyKey === "stille-osteotomes" &&
          configuration.direction === "Straight"
      )?.codeOptions
    ).toHaveLength(15);
    expect(
      stille.find(
        (configuration) =>
          configuration.familyKey === "stille-gouges" &&
          configuration.direction === "Straight"
      )?.codeOptions
    ).toHaveLength(15);
    expect(
      stille.find(
        (configuration) =>
          configuration.familyKey === "stille-osteotomes" &&
          configuration.direction === "Curved"
      )?.codeOptions
    ).toHaveLength(5);
    expect(
      stille.find(
        (configuration) =>
          configuration.familyKey === "stille-chisels" &&
          configuration.direction === "Straight"
      )?.codeOptions
    ).toHaveLength(5);
  });

  it("uses the catalogue-confirmed page 1 mappings", () => {
    const byId = new Map(
      CHISELS_BATCH_01_CONFIGURATIONS.map((configuration) => [
        configuration.id,
        configuration
      ])
    );

    expect(
      byId
        .get("product-chisels-hoke-osteotomes-straight")
        ?.codeOptions.map((option) => option.code)
    ).toEqual([
      "36-6401",
      "36-6402",
      "36-6403",
      "36-6404",
      "36-6405",
      "36-6406",
      "36-6407"
    ]);
    expect(
      byId
        .get("product-chisels-hoke-osteotomes-curved")
        ?.codeOptions.map((option) => option.code)
    ).toEqual([
      "36-6411",
      "36-6412",
      "36-6413",
      "36-6414",
      "36-6415",
      "36-6416",
      "36-6417"
    ]);
    expect(
      byId.get("product-chisels-round-handle-gouges")?.codeOptions
    ).toEqual([{ code: "36-6500", size: "14 cm · 6 mm" }]);
  });

  it("keeps IDs, slugs, and media IDs unique", () => {
    const ids = CHISELS_BATCH_01_CONFIGURATIONS.map((item) => item.id);
    const slugs = CHISELS_BATCH_01_CONFIGURATIONS.map((item) => item.slug);
    const mediaIds = CHISELS_BATCH_01_CONFIGURATIONS.map(
      (item) => item.mediaAssetId
    );

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(mediaIds).size).toBe(mediaIds.length);
  });
});
