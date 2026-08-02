import { describe, expect, it } from "vitest";
import { SCISSORS_BATCH_01_CONFIGURATIONS } from "@/features/catalogue-registry/products/scissors-batch-01";

describe("Scissors Batch 01 inventory", () => {
  it("contains the approved 42 visible configurations", () => {
    expect(SCISSORS_BATCH_01_CONFIGURATIONS).toHaveLength(42);

    const counts = Object.fromEntries(
      ["iris", "stevens", "operating", "mayo", "metzenbaum"].map((family) => [
        family,
        SCISSORS_BATCH_01_CONFIGURATIONS.filter((item) => item.familyKey === family).length
      ])
    );

    expect(counts).toEqual({
      iris: 6,
      stevens: 6,
      operating: 18,
      mayo: 6,
      metzenbaum: 6
    });
  });

  it("preserves all 132 exact catalogue codes without duplication", () => {
    const codes = SCISSORS_BATCH_01_CONFIGURATIONS.flatMap((item) =>
      item.codeOptions.map((option) => option.code)
    );

    expect(codes).toHaveLength(132);
    expect(new Set(codes).size).toBe(132);
  });

  it("uses the catalogue-confirmed Iris and Stevens mappings", () => {
    const irisCodes = SCISSORS_BATCH_01_CONFIGURATIONS
      .filter((item) => item.familyKey === "iris")
      .flatMap((item) => item.codeOptions.map((option) => option.code));
    const stevensCodes = SCISSORS_BATCH_01_CONFIGURATIONS
      .filter((item) => item.familyKey === "stevens")
      .flatMap((item) => item.codeOptions.map((option) => option.code));

    expect(irisCodes).toEqual([
      "04-0901",
      "04-0911",
      "05-0901",
      "05-0911",
      "06-0901",
      "06-0911"
    ]);
    expect(stevensCodes).toEqual([
      "04-0800",
      "04-0802",
      "04-0810",
      "04-0812",
      "05-0800",
      "05-0802",
      "05-0810",
      "05-0812",
      "06-0800",
      "06-0802",
      "06-0810",
      "06-0812"
    ]);
  });

  it("keeps IDs, slugs, and media IDs unique", () => {
    const ids = SCISSORS_BATCH_01_CONFIGURATIONS.map((item) => item.id);
    const slugs = SCISSORS_BATCH_01_CONFIGURATIONS.map((item) => item.slug);
    const mediaIds = SCISSORS_BATCH_01_CONFIGURATIONS.map((item) => item.mediaAssetId);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(mediaIds).size).toBe(mediaIds.length);
  });

  it("preserves the established Mayo inquiry route", () => {
    const mayo = SCISSORS_BATCH_01_CONFIGURATIONS.find(
      (item) => item.slug === "mayo-scissors"
    );

    expect(mayo?.codeOptions[0]?.code).toBe("04-0401");
  });
});
