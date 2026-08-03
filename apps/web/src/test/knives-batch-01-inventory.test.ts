import { describe, expect, it } from "vitest";
import { KNIVES_BATCH_01_CONFIGURATIONS } from "@/features/catalogue-registry/products/knives-batch-01";

describe("Knives Batch 01 inventory", () => {
  const allCodes = KNIVES_BATCH_01_CONFIGURATIONS.flatMap((configuration) =>
    configuration.codeOptions.map((option) => option.code)
  );

  it("contains 18 visible configurations from catalogue pages 1 to 3", () => {
    expect(KNIVES_BATCH_01_CONFIGURATIONS).toHaveLength(18);
    expect(
      KNIVES_BATCH_01_CONFIGURATIONS.filter(
        (configuration) => configuration.cataloguePage === "1"
      )
    ).toHaveLength(8);
    expect(
      KNIVES_BATCH_01_CONFIGURATIONS.filter(
        (configuration) => configuration.cataloguePage === "2"
      )
    ).toHaveLength(6);
    expect(
      KNIVES_BATCH_01_CONFIGURATIONS.filter(
        (configuration) => configuration.cataloguePage === "3"
      )
    ).toHaveLength(4);
  });

  it("preserves all 32 exact catalogue codes without duplication", () => {
    expect(allCodes).toHaveLength(32);
    expect(new Set(allCodes).size).toBe(32);
  });

  it("groups only true size-only variants", () => {
    const byId = new Map(
      KNIVES_BATCH_01_CONFIGURATIONS.map((configuration) => [
        configuration.id,
        configuration
      ])
    );

    expect(byId.get("product-knives-liston")?.codeOptions).toHaveLength(4);
    expect(
      byId.get("product-knives-fox-lupus-curettes")?.codeOptions
    ).toHaveLength(4);
    expect(
      byId.get("product-knives-keyes-dermal-punches")?.codeOptions
    ).toHaveLength(7);

    for (const configuration of KNIVES_BATCH_01_CONFIGURATIONS) {
      if (
        configuration.id !== "product-knives-liston" &&
        configuration.id !== "product-knives-fox-lupus-curettes" &&
        configuration.id !== "product-knives-keyes-dermal-punches" &&
        configuration.id !== "product-knives-number-3" &&
        configuration.id !== "product-knives-number-4"
      ) {
        expect(configuration.codeOptions).toHaveLength(1);
      }
    }
  });

  it("uses catalogue-confirmed code and size mappings", () => {
    const byId = new Map(
      KNIVES_BATCH_01_CONFIGURATIONS.map((configuration) => [
        configuration.id,
        configuration
      ])
    );

    expect(byId.get("product-knives-number-3")?.codeOptions).toEqual([
      { code: "18-0103", size: "12.0 cm" },
      { code: "18-0103S", size: "12.0 cm" }
    ]);
    expect(byId.get("product-knives-liston")?.codeOptions).toEqual([
      { code: "18-0401", size: "13.0 cm" },
      { code: "18-0402", size: "16.0 cm" },
      { code: "18-0403", size: "19.0 cm" },
      { code: "18-0404", size: "21.5 cm" }
    ]);
    expect(
      byId.get("product-knives-fox-lupus-curettes")?.codeOptions
    ).toEqual([
      { code: "19-0503", size: "3 mm" },
      { code: "19-0504", size: "4 mm" },
      { code: "19-0505", size: "5 mm" },
      { code: "19-0506", size: "6 mm" }
    ]);
    expect(
      byId.get("product-knives-keyes-dermal-punches")?.codeOptions
    ).toEqual([
      { code: "19-0702", size: "2 mm" },
      { code: "19-0703", size: "3 mm" },
      { code: "19-0704", size: "4 mm" },
      { code: "19-0705", size: "5 mm" },
      { code: "19-0706", size: "6 mm" },
      { code: "19-0707", size: "7 mm" },
      { code: "19-0708", size: "8 mm" }
    ]);
  });

  it("keeps IDs, slugs, and media IDs unique", () => {
    const ids = KNIVES_BATCH_01_CONFIGURATIONS.map((item) => item.id);
    const slugs = KNIVES_BATCH_01_CONFIGURATIONS.map((item) => item.slug);
    const mediaIds = KNIVES_BATCH_01_CONFIGURATIONS.map(
      (item) => item.mediaAssetId
    );

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(mediaIds).size).toBe(mediaIds.length);
  });
});
