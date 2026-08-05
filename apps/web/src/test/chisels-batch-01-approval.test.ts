import { describe, expect, it } from "vitest";
import { CHISELS_BATCH_01_MEDIA } from "@/features/catalogue-media";

describe("Chisels Batch 01 review approval", () => {
  it("records Ahmad's approval for all 16 reviewed assets", () => {
    expect(CHISELS_BATCH_01_MEDIA).toHaveLength(16);
    expect(
      CHISELS_BATCH_01_MEDIA.every(
        (asset) => asset.reviewStatus === "approved"
      )
    ).toBe(true);
    expect(
      CHISELS_BATCH_01_MEDIA.filter(
        (asset) => asset.reviewStatus === "candidate"
      )
    ).toHaveLength(0);
    expect(
      CHISELS_BATCH_01_MEDIA.filter(
        (asset) => asset.reviewStatus === "needs-replacement"
      )
    ).toHaveLength(0);
  });
});
