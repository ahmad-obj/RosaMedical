export const INQUIRY_STORAGE_KEY = "rosa-medical-inquiry-v1";
export const INQUIRY_CHANGE_EVENT = "rosa-inquiry-change";
export const INQUIRY_MAX_QUANTITY = 999;

export interface InquiryItem {
  id: string;
  familySlug: string;
  slug: string;
  name: string;
  code: string;
  size: string;
  variant: string;
  quantity: number;
  notes: string;
  mediaPath?: string;
  mediaFallbackPath?: string;
  imageLabel?: string;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isInquiryItem(value: unknown): value is InquiryItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.familySlug === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.code === "string" &&
    typeof item.size === "string" &&
    typeof item.variant === "string" &&
    typeof item.quantity === "number" &&
    Number.isFinite(item.quantity) &&
    typeof item.notes === "string" &&
    isOptionalString(item.mediaPath) &&
    isOptionalString(item.mediaFallbackPath) &&
    isOptionalString(item.imageLabel)
  );
}

function normalizeItem(item: InquiryItem): InquiryItem {
  return {
    ...item,
    quantity: Math.min(INQUIRY_MAX_QUANTITY, Math.max(1, Math.floor(item.quantity || 1))),
    notes: item.notes.slice(0, 500)
  };
}

function isSameInquiryProduct(a: InquiryItem, b: InquiryItem): boolean {
  return a.familySlug === b.familySlug && a.slug === b.slug;
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
    return parsed.filter(isInquiryItem).map(normalizeItem);
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
  const existingIndex = items.findIndex((candidate) =>
    isSameInquiryProduct(candidate, normalized)
  );

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
  id: string,
  patch: Partial<Pick<InquiryItem, "quantity" | "notes">>
): InquiryItem[] {
  return writeInquiry(
    readInquiry().map((item) =>
      item.id === id
        ? normalizeItem({
            ...item,
            quantity: patch.quantity ?? item.quantity,
            notes: patch.notes ?? item.notes
          })
        : item
    )
  );
}

export function removeInquiryItem(id: string): InquiryItem[] {
  return writeInquiry(readInquiry().filter((item) => item.id !== id));
}

export function clearInquiry(): void {
  storage()?.removeItem(INQUIRY_STORAGE_KEY);
  notify();
}
