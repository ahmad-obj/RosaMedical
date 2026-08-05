import { describe, expect, it } from "vitest";
import { CUTTERS_BATCH_01_CONFIGURATIONS } from "@/features/catalogue-registry/products/cutters-batch-01";

describe("Cutters Batch 01 inventory", () => {
  const allCodes = CUTTERS_BATCH_01_CONFIGURATIONS.flatMap((configuration) =>
    configuration.codeOptions.map((option) => option.code)
  );

  it("contains 13 visible configurations from catalogue pages 1 to 3", () => {
    expect(CUTTERS_BATCH_01_CONFIGURATIONS).toHaveLength(13);
    expect(
      CUTTERS_BATCH_01_CONFIGURATIONS.filter(
        (configuration) => configuration.cataloguePage === "1"
      )
    ).toHaveLength(5);
    expect(
      CUTTERS_BATCH_01_CONFIGURATIONS.filter(
        (configuration) => configuration.cataloguePage === "2"
      )
    ).toHaveLength(5);
    expect(
      CUTTERS_BATCH_01_CONFIGURATIONS.filter(
        (configuration) => configuration.cataloguePage === "3"
      )
    ).toHaveLength(3);
  });

  it("preserves all 22 exact catalogue codes without duplication", () => {
    expect(allCodes).toHaveLength(22);
    expect(new Set(allCodes).size).toBe(22);
  });

  it("groups only size-only variants while separating visible direction changes", () => {
    const listonStraight = CUTTERS_BATCH_01_CONFIGURATIONS.find(
      (configuration) => configuration.id === "product-cutters-liston-straight"
    );
    const listonCurved = CUTTERS_BATCH_01_CONFIGURATIONS.find(
      (configuration) => configuration.id === "product-cutters-liston-curved"
    );
    const stilleStraight = CUTTERS_BATCH_01_CONFIGURATIONS.find(
      (configuration) =>
        configuration.id === "product-cutters-stille-liston-straight"
    );
    const stilleCurved = CUTTERS_BATCH_01_CONFIGURATIONS.find(
      (configuration) =>
        configuration.id === "product-cutters-stille-liston-curved"
    );

    expect(listonStraight?.codeOptions).toHaveLength(4);
    expect(listonCurved?.codeOptions).toHaveLength(4);
    expect(stilleStraight?.codeOptions).toHaveLength(2);
    expect(stilleCurved?.codeOptions).toHaveLength(2);
    expect(listonStraight?.mediaAssetId).not.toBe(listonCurved?.mediaAssetId);
    expect(stilleStraight?.mediaAssetId).not.toBe(stilleCurved?.mediaAssetId);
  });

  it("uses catalogue-confirmed code, size, and direction mappings", () => {
    const byId = new Map(
      CUTTERS_BATCH_01_CONFIGURATIONS.map((configuration) => [
        configuration.id,
        configuration
      ])
    );

    expect(byId.get("product-cutters-liston-straight")?.codeOptions).toEqual([
      { code: "36-5101", size: "14.0 cm" },
      { code: "36-5102", size: "17.0 cm" },
      { code: "36-5103", size: "19.0 cm" },
      { code: "36-5104", size: "22.0 cm" }
    ]);
    expect(byId.get("product-cutters-liston-curved")?.codeOptions).toEqual([
      { code: "36-5111", size: "14.0 cm" },
      { code: "36-5112", size: "17.0 cm" },
      { code: "36-5113", size: "19.0 cm" },
      { code: "36-5114", size: "22.0 cm" }
    ]);
    expect(byId.get("product-cutters-ruskin-rowland-angled")?.codeOptions).toEqual([
      { code: "36-5811", size: "17.0 cm" }
    ]);
    expect(byId.get("product-cutters-stille-liston-36-6000")?.codeOptions).toEqual([
      { code: "36-6000", size: "27.0 cm" }
    ]);
  });

  it("keeps IDs, slugs, and media IDs unique", () => {
    const ids = CUTTERS_BATCH_01_CONFIGURATIONS.map((item) => item.id);
    const slugs = CUTTERS_BATCH_01_CONFIGURATIONS.map((item) => item.slug);
    const mediaIds = CUTTERS_BATCH_01_CONFIGURATIONS.map(
      (item) => item.mediaAssetId
    );

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(mediaIds).size).toBe(mediaIds.length);
  });
});
