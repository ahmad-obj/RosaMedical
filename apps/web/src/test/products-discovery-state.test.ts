import { describe, expect, it } from "vitest";
import {
  discoveryStateFromSearchParams,
  discoveryStateToSearchParams,
  initialProductsVisibleCount,
  nextProductsVisibleCount
} from "@/features/products/products-discovery-state";

describe("products discovery URL and reveal state", () => {
  it("hydrates supported filters from a shareable URL", () => {
    const state = discoveryStateFromSearchParams(new URLSearchParams(
      "q=iris&family=scissors&size=14.0+cm&size=16.0+cm&direction=Straight&variant=Regular&code=04-09xx&sort=name-asc&view=list"
    ));

    expect(state).toEqual({
      query: "iris",
      family: "scissors",
      sizes: ["14.0 cm", "16.0 cm"],
      directions: ["Straight"],
      variants: ["Regular"],
      codeGroups: ["04-09xx"],
      sort: "name-asc",
      view: "list"
    });
  });

  it("ignores unsupported family/sort/view values and serializes only active state", () => {
    const state = discoveryStateFromSearchParams(new URLSearchParams("family=unknown&sort=nope&view=nope"));
    expect(state.family).toBe("all");
    expect(state.sort).toBe("recommended");
    expect(state.view).toBe("grid");

    const params = discoveryStateToSearchParams({
      ...state,
      family: "cutters",
      sizes: ["4 mm"],
      variants: ["Horizontal cutting"],
      query: ""
    });

    expect(params.toString()).toBe("family=cutters&size=4+mm&variant=Horizontal+cutting");
  });

  it("uses compact and desktop initial batches and never reveals past the result total", () => {
    expect(initialProductsVisibleCount(false)).toBe(12);
    expect(initialProductsVisibleCount(true)).toBe(8);
    expect(nextProductsVisibleCount(12, 37, 12)).toBe(24);
    expect(nextProductsVisibleCount(24, 29, 12)).toBe(29);
    expect(nextProductsVisibleCount(29, 29, 12)).toBe(29);
  });
});
