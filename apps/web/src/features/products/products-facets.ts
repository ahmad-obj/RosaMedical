import type { ProductsFacetValues } from "./products-discovery.types";

export type ProductsFacetKey = keyof ProductsFacetValues;

export const PRODUCTS_FACET_KEYS = [
  "sizes",
  "directions",
  "variants",
  "codeGroups"
] as const satisfies readonly ProductsFacetKey[];

export function deriveCodeGroup(code: string): string | null {
  const normalized = code.trim();
  const match = normalized.match(/^(\d{2})-(\d{2})\d{2}[A-Za-z]*$/);
  if (!match) return null;
  return `${match[1]}-${match[2]}xx`;
}

export function uniqueFacetValues(values: readonly (string | null | undefined)[]): readonly string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const normalized = value?.trim();
    if (!normalized) continue;
    const key = normalized.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }

  return result;
}
