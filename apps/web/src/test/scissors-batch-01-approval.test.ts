import { describe, expect, it } from "vitest";
import { SCISSORS_BATCH_01_MEDIA } from "@/features/catalogue-media";

describe("Scissors Batch 01 review approval", () => {
  it("records Ahmad's approval for all 42 reviewed assets", () => {
    expect(SCISSORS_BATCH_01_MEDIA).toHaveLength(42);
    expect(
      SCISSORS_BATCH_01_MEDIA.every(
        (asset) => asset.reviewStatus === "approved"
      )
    ).toBe(true);
  });
});
