export type SarAmount = string;

const SAR_INPUT_PATTERN = /^\d+(?:\.\d{1,2})?$/;

function canonicalSar(value: string): SarAmount {
  const [wholePart, fractionPart = ""] = value.split(".");
  const whole = BigInt(wholePart || "0").toString();
  const fraction = fractionPart.padEnd(2, "0");
  return `${whole}.${fraction}`;
}

export function validateSarInput(value: string):
  | { ok: true; value: SarAmount | null }
  | { ok: false; error: string } {
  const normalized = value.trim();
  if (!normalized) return { ok: true, value: null };
  if (!SAR_INPUT_PATTERN.test(normalized)) {
    return {
      ok: false,
      error: "Enter a non-negative SAR amount with no more than two decimal places."
    };
  }
  return { ok: true, value: canonicalSar(normalized) };
}

export function normalizeSarAmount(value: unknown): SarAmount | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string" && typeof value !== "number") return null;
  if (typeof value === "number" && (!Number.isFinite(value) || value < 0)) return null;

  const result = validateSarInput(String(value));
  return result.ok ? result.value : null;
}

export function sarToHalalas(value: SarAmount): bigint {
  const normalized = normalizeSarAmount(value);
  if (normalized === null) throw new Error("Invalid SAR amount.");
  const [whole, fraction] = normalized.split(".");
  return BigInt(whole ?? "0") * 100n + BigInt(fraction ?? "00");
}

export function halalasToSar(value: bigint): SarAmount {
  if (value < 0n) throw new Error("SAR amount cannot be negative.");
  const whole = value / 100n;
  const fraction = (value % 100n).toString().padStart(2, "0");
  return `${whole.toString()}.${fraction}`;
}

export function multiplySar(value: SarAmount, quantity: number): SarAmount {
  if (!Number.isSafeInteger(quantity) || quantity < 0) {
    throw new Error("Quantity must be a non-negative integer.");
  }
  return halalasToSar(sarToHalalas(value) * BigInt(quantity));
}

export function formatSar(value: SarAmount, locale: "en" | "ar"): string {
  const normalized = normalizeSarAmount(value);
  if (normalized === null) throw new Error("Invalid SAR amount.");
  const numeric = Number(normalized);
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(numeric);
  return locale === "ar" ? `${formatted} ر.س` : `SAR ${formatted}`;
}

export function minSar(values: readonly SarAmount[]): SarAmount | null {
  if (values.length === 0) return null;
  let minimum = sarToHalalas(values[0]!);
  for (const value of values.slice(1)) {
    const halalas = sarToHalalas(value);
    if (halalas < minimum) minimum = halalas;
  }
  return halalasToSar(minimum);
}
