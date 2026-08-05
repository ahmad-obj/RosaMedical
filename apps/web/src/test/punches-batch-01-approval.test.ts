import { describe, expect, it } from "vitest";
import { PUNCHES_BATCH_01_MEDIA } from "@/features/catalogue-media";

describe("Punches Batch 01 review approval", () => {
  it("records Ahmad's approval for all 14 reviewed assets", () => {
    expect(PUNCHES_BATCH_01_MEDIA).toHaveLength(14);
    expect(
      PUNCHES_BATCH_01_MEDIA.every(
        (asset) => asset.reviewStatus === "approved"
      )
    ).toBe(true);
    expect(
      PUNCHES_BATCH_01_MEDIA.filter(
        (asset) => asset.reviewStatus === "candidate"
      )
    ).toHaveLength(0);
    expect(
      PUNCHES_BATCH_01_MEDIA.filter(
        (asset) => asset.reviewStatus === "needs-replacement"
      )
    ).toHaveLength(0);
  });
});
