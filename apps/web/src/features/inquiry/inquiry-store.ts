import { normalizeSarAmount, type SarAmount } from "@/features/pricing";

export const INQUIRY_STORAGE_KEY = "rosa-medical-inquiry-v1";
export const INQUIRY_CHANGE_EVENT = "rosa-inquiry-change";
export const INQUIRY_MAX_QUANTITY = 999;

export interface InquiryItem {
  lineId: string;
  id: string;
  familySlug: string;
  slug: string;
  name: string;
  code: string;
  configurationId: string;
  sku: string;
  size: string;
  variant: string;
  quantity: number;
  notes: string;
  unitPriceSar: SarAmount | null;
  currency: "SAR";
  mediaPath?: string;
  mediaFallbackPath?: string;
  imageLabel?: string;
}

export function createInquiryLineId(productId: string, configurationId: string): string {
  return `${productId}:${configurationId}`;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function requiredString(item: Record<string, unknown>, key: string): string | null {
  return typeof item[key] === "string" ? item[key] as string : null;
}

function normalizeQuantity(value: unknown): number {
  const numeric = typeof value === "number" && Number.isFinite(value) ? value : 1;
  return Math.min(INQUIRY_MAX_QUANTITY, Math.max(1, Math.floor(numeric || 1)));
}

function normalizeStoredItem(value: unknown): InquiryItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const id = requiredString(item, "id");
  const familySlug = requiredString(item, "familySlug");
  const slug = requiredString(item, "slug");
  const name = requiredString(item, "name");
  const code = requiredString(item, "code");
  const size = requiredString(item, "size");
  const variant = requiredString(item, "variant");
  const notes = requiredString(item, "notes");

  if (!id || !familySlug || !slug || !name || !code || size === null || variant === null || notes === null) {
    return null;
  }
  if (!isOptionalString(item.mediaPath) || !isOptionalString(item.mediaFallbackPath) || !isOptionalString(item.imageLabel)) {
    return null;
  }

  const configurationId = typeof item.configurationId === "string" && item.configurationId.trim()
    ? item.configurationId
    : `product:${id}`;
  const lineId = typeof item.lineId === "string" && item.lineId.trim()
    ? item.lineId
    : createInquiryLineId(id, configurationId);
  const sku = typeof item.sku === "string" && item.sku.trim() ? item.sku : code;

  return {
    lineId,
    id,
    familySlug,
    slug,
    name,
    code,
    configurationId,
    sku,
    size,
    variant,
    quantity: normalizeQuantity(item.quantity),
    notes: notes.slice(0, 500),
    unitPriceSar: normalizeSarAmount(item.unitPriceSar),
    currency: "SAR",
    ...(item.mediaPath ? { mediaPath: item.mediaPath as string } : {}),
    ...(item.mediaFallbackPath ? { mediaFallbackPath: item.mediaFallbackPath as string } : {}),
    ...(item.imageLabel ? { imageLabel: item.imageLabel as string } : {})
  };
}

function normalizeItem(item: InquiryItem): InquiryItem {
  return {
    ...item,
    lineId: createInquiryLineId(item.id, item.configurationId),
    sku: item.sku.trim() || item.code,
    quantity: normalizeQuantity(item.quantity),
    notes: item.notes.slice(0, 500),
    unitPriceSar: normalizeSarAmount(item.unitPriceSar),
    currency: "SAR"
  };
}

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function notify(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(INQUIRY_CHANGE_EVENT));
  }
}

function writeInquiry(items: InquiryItem[]): InquiryItem[] {
  const next = items.map(normalizeItem);
  storage()?.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(next));
  notify();
  return next;
}

export function readInquiry(): InquiryItem[] {
  const currentStorage = storage();
  if (!currentStorage) return [];

  const raw = currentStorage.getItem(INQUIRY_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((value) => {
      const item = normalizeStoredItem(value);
      return item ? [item] : [];
    });
  } catch {
    currentStorage.removeItem(INQUIRY_STORAGE_KEY);
    return [];
  }
}

export function getInquiryLineCount(items: readonly InquiryItem[] = readInquiry()): number {
  return items.length;
}

export function addInquiryItem(item: InquiryItem): InquiryItem[] {
  const normalized = normalizeItem(item);
  const items = readInquiry();
  const existingIndex = items.findIndex((candidate) => candidate.lineId === normalized.lineId);

  if (existingIndex === -1) return writeInquiry([...items, normalized]);

  const existing = items[existingIndex];
  if (!existing) return writeInquiry([...items, normalized]);

  const next = [...items];
  next[existingIndex] = normalizeItem({
    ...existing,
    ...normalized,
    quantity: existing.quantity + normalized.quantity,
    notes: normalized.notes.trim() ? normalized.notes : existing.notes
  });
  return writeInquiry(next);
}

export function updateInquiryItem(
  lineId: string,
  patch: Partial<Pick<InquiryItem, "quantity" | "notes">>
): InquiryItem[] {
  return writeInquiry(
    readInquiry().map((item) =>
      item.lineId === lineId
        ? normalizeItem({
            ...item,
            quantity: patch.quantity ?? item.quantity,
            notes: patch.notes ?? item.notes
          })
        : item
    )
  );
}

export function removeInquiryItem(lineId: string): InquiryItem[] {
  return writeInquiry(readInquiry().filter((item) => item.lineId !== lineId));
}

export function clearInquiry(): void {
  storage()?.removeItem(INQUIRY_STORAGE_KEY);
  notify();
}
