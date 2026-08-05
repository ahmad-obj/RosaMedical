import { describe, expect, it } from "vitest";
import { KNIVES_BATCH_01_MEDIA } from "@/features/catalogue-media";

describe("Knives Batch 01 review approval", () => {
  it("records Ahmad's approval for all 18 reviewed assets", () => {
    expect(KNIVES_BATCH_01_MEDIA).toHaveLength(18);
    expect(
      KNIVES_BATCH_01_MEDIA.every(
        (asset) => asset.reviewStatus === "approved"
      )
    ).toBe(true);
    expect(
      KNIVES_BATCH_01_MEDIA.filter(
        (asset) => asset.reviewStatus === "candidate"
      )
    ).toHaveLength(0);
    expect(
      KNIVES_BATCH_01_MEDIA.filter(
        (asset) => asset.reviewStatus === "needs-replacement"
      )
    ).toHaveLength(0);
  });
});
