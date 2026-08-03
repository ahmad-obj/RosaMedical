import { describe, expect, it } from "vitest";
import { CUTTERS_BATCH_01_MEDIA } from "@/features/catalogue-media";

describe("Cutters Batch 01 review approval", () => {
  it("records Ahmad's approval for all 13 reviewed assets", () => {
    expect(CUTTERS_BATCH_01_MEDIA).toHaveLength(13);
    expect(
      CUTTERS_BATCH_01_MEDIA.every(
        (asset) => asset.reviewStatus === "approved"
      )
    ).toBe(true);
    expect(
      CUTTERS_BATCH_01_MEDIA.filter(
        (asset) => asset.reviewStatus === "candidate"
      )
    ).toHaveLength(0);
    expect(
      CUTTERS_BATCH_01_MEDIA.filter(
        (asset) => asset.reviewStatus === "needs-replacement"
      )
    ).toHaveLength(0);
  });
});
