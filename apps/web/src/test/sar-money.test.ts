import { describe, expect, it } from "vitest";
import {
  formatSar,
  halalasToSar,
  minSar,
  multiplySar,
  normalizeSarAmount,
  sarToHalalas,
  validateSarInput
} from "@/features/pricing";

describe("exact SAR money primitives", () => {
  it("normalizes valid money without treating zero as missing", () => {
    expect(normalizeSarAmount("")).toBeNull();
    expect(normalizeSarAmount("120")).toBe("120.00");
    expect(normalizeSarAmount("120.5")).toBe("120.50");
    expect(normalizeSarAmount("120.50")).toBe("120.50");
    expect(normalizeSarAmount(0)).toBe("0.00");
    expect(normalizeSarAmount("0.00")).toBe("0.00");
  });

  it("rejects negative malformed and over-precision admin input", () => {
    expect(validateSarInput("-1")).toMatchObject({ ok: false });
    expect(validateSarInput("12.345")).toMatchObject({ ok: false });
    expect(validateSarInput("abc")).toMatchObject({ ok: false });
    expect(validateSarInput("  ")).toEqual({ ok: true, value: null });
    expect(validateSarInput("0")).toEqual({ ok: true, value: "0.00" });
  });

  it("performs arithmetic in integer halalas", () => {
    expect(sarToHalalas("0.10")).toBe(10n);
    expect(halalasToSar(10n)).toBe("0.10");
    expect(multiplySar("0.10", 3)).toBe("0.30");
    expect(multiplySar("120.50", 2)).toBe("241.00");
  });

  it("selects the true minimum and formats SAR for display", () => {
    expect(minSar(["145.50", "120.00", "0.00"])).toBe("0.00");
    expect(minSar([])).toBeNull();
    expect(formatSar("120.00", "en")).toBe("SAR 120.00");
    expect(formatSar("120.50", "ar")).toContain("ر.س");
  });
});
