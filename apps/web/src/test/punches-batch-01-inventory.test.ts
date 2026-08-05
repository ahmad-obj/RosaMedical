import { describe, expect, it } from "vitest";
import { PUNCHES_BATCH_01_CONFIGURATIONS } from "@/features/catalogue-registry/products/punches-batch-01";

describe("Punches Batch 01 inventory", () => {
  const allCodes = PUNCHES_BATCH_01_CONFIGURATIONS.flatMap((configuration) =>
    configuration.codeOptions.map((option) => option.code)
  );

  it("contains 14 visible configurations from catalogue pages 1 to 3", () => {
    expect(PUNCHES_BATCH_01_CONFIGURATIONS).toHaveLength(14);
    expect(
      PUNCHES_BATCH_01_CONFIGURATIONS.filter(
        (configuration) => configuration.cataloguePage === "1"
      )
    ).toHaveLength(4);
    expect(
      PUNCHES_BATCH_01_CONFIGURATIONS.filter(
        (configuration) => configuration.cataloguePage === "2"
      )
    ).toHaveLength(4);
    expect(
      PUNCHES_BATCH_01_CONFIGURATIONS.filter(
        (configuration) => configuration.cataloguePage === "3"
      )
    ).toHaveLength(6);
  });

  it("preserves all 32 exact catalogue codes without duplication", () => {
    expect(allCodes).toHaveLength(32);
    expect(new Set(allCodes).size).toBe(32);
  });

  it("groups only shaft-length or opening-size variants", () => {
    for (const configuration of PUNCHES_BATCH_01_CONFIGURATIONS) {
      if (configuration.familyKey === "yeoman-fixed") {
        expect(configuration.codeOptions).toHaveLength(3);
      } else if (configuration.familyKey === "yeoman-turnable") {
        expect(configuration.codeOptions).toHaveLength(3);
      } else if (configuration.id === "product-punches-citelly") {
        expect(configuration.codeOptions).toHaveLength(3);
      } else {
        expect(configuration.codeOptions).toHaveLength(1);
      }
    }
  });

  it("uses catalogue-confirmed representative mappings and preserves established routes", () => {
    const byId = new Map(
      PUNCHES_BATCH_01_CONFIGURATIONS.map((configuration) => [
        configuration.id,
        configuration
      ])
    );

    expect(byId.get("product_yeoman")?.slug).toBe("yeoman");
    expect(byId.get("product_yeoman")?.codeOptions).toEqual([
      { code: "21-1001", size: "28.0 cm" },
      { code: "21-1002", size: "35.0 cm" },
      { code: "21-1003", size: "42.0 cm" }
    ]);
    expect(byId.get("product_yeoman_perforated")?.slug).toBe(
      "yeoman-perforated"
    );
    expect(byId.get("product_yeoman_rectangular")?.slug).toBe(
      "yeoman-rectangular"
    );
    expect(byId.get("product-punches-turrel-21-16")?.codeOptions).toEqual([
      { code: "21-1601", size: "28.0 cm" },
      { code: "21-1602", size: "35.0 cm" },
      { code: "21-1603", size: "40.0 cm" }
    ]);
    expect(byId.get("product-punches-citelly")?.codeOptions).toEqual([
      { code: "38-2501", size: "1.0 mm" },
      { code: "38-2502", size: "2.0 mm" },
      { code: "38-2503", size: "3.0 mm" }
    ]);
  });

  it("keeps IDs, slugs, and media IDs unique", () => {
    const ids = PUNCHES_BATCH_01_CONFIGURATIONS.map((item) => item.id);
    const slugs = PUNCHES_BATCH_01_CONFIGURATIONS.map((item) => item.slug);
    const mediaIds = PUNCHES_BATCH_01_CONFIGURATIONS.map(
      (item) => item.mediaAssetId
    );

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(mediaIds).size).toBe(mediaIds.length);
  });
});
