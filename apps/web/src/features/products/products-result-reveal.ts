import type { ProductsView } from "./products-discovery.types";

const LIST_INITIAL_COUNT = 8;
const LIST_BATCH_COUNT = 8;

function normalizeColumns(columns: number): number {
  if (!Number.isFinite(columns)) return 1;
  return Math.max(1, Math.floor(columns));
}

function initialGridRows(columns: number): number {
  if (columns <= 1) return 6;
  if (columns === 2) return 4;
  return 3;
}

function roundUpToCompleteRow(count: number, columns: number): number {
  const safeColumns = normalizeColumns(columns);
  return Math.ceil(Math.max(0, count) / safeColumns) * safeColumns;
}

export function initialProductsVisibleCount(columns: number, view: ProductsView): number {
  if (view === "list") return LIST_INITIAL_COUNT;
  const safeColumns = normalizeColumns(columns);
  return safeColumns * initialGridRows(safeColumns);
}

export function alignProductsVisibleCount(
  current: number,
  total: number,
  columns: number,
  view: ProductsView
): number {
  const safeTotal = Math.max(0, total);
  const safeCurrent = Math.min(Math.max(0, current), safeTotal);
  if (view === "list" || safeCurrent >= safeTotal) return safeCurrent;
  return Math.min(safeTotal, roundUpToCompleteRow(safeCurrent, columns));
}

export function nextProductsVisibleCount(
  current: number,
  total: number,
  columns: number,
  view: ProductsView
): number {
  const safeTotal = Math.max(0, total);
  if (current >= safeTotal) return safeTotal;

  if (view === "list") {
    return Math.min(safeTotal, Math.max(0, current) + LIST_BATCH_COUNT);
  }

  const safeColumns = normalizeColumns(columns);
  const alignedCurrent = roundUpToCompleteRow(current, safeColumns);
  return Math.min(safeTotal, alignedCurrent + safeColumns * 2);
}
