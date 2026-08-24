import { createHash } from "node:crypto";
import { normalizeSarAmount } from "@/features/pricing";
import { createInquiryLineId, type InquiryItem } from "./inquiry-store";

export interface QuotationPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  notes: string;
  items: InquiryItem[];
}

export type QuotationPayloadResult =
  | { ok: true; value: QuotationPayload }
  | { ok: false; error: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizePhone(value: unknown): string | null {
  let phone = text(value, 30).replace(/[^\d+]/g, "");
  if (!/^\+?\d+$/.test(phone)) return null;
  if (!phone.startsWith("+")) phone = `+${phone}`;
  const digits = phone.slice(1);
  if (digits.length < 8 || digits.length > 15 || /^(\d)\1+$/.test(digits)) return null;
  return `+${digits}`;
}

function normalizeItem(value: unknown): InquiryItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const id = text(item.id, 200);
  const familySlug = text(item.familySlug, 100);
  const slug = text(item.slug, 200);
  const name = text(item.name, 200);
  const code = text(item.code, 100);
  const configurationId = text(item.configurationId, 200) || (id ? `product:${id}` : "");
  const sku = text(item.sku, 100) || code;
  const quantity = typeof item.quantity === "number" ? Math.floor(item.quantity) : 0;

  if (!id || !familySlug || !slug || !name || !code || !configurationId || quantity < 1 || quantity > 10000) {
    return null;
  }

  return {
    lineId: createInquiryLineId(id, configurationId),
    id,
    familySlug,
    slug,
    name,
    code,
    configurationId,
    sku,
    size: text(item.size, 100),
    variant: text(item.variant, 100),
    quantity,
    notes: text(item.notes, 500),
    unitPriceSar: normalizeSarAmount(item.unitPriceSar),
    currency: "SAR"
  };
}

export function normalizeQuotationPayload(value: unknown): QuotationPayloadResult {
  if (!value || typeof value !== "object") {
    return { ok: false, error: "Invalid request." };
  }

  const input = value as Record<string, unknown>;
  const name = text(input.name, 120);
  const company = text(input.company, 120);
  const email = text(input.email, 254).toLowerCase();
  const phone = normalizePhone(input.phone);
  const country = text(input.country, 80);
  const notes = text(input.notes, 2000);
  const rawItems = Array.isArray(input.items) ? input.items : [];

  if (name.length < 2) return { ok: false, error: "Enter your name." };
  if (!emailPattern.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (!phone) return { ok: false, error: "Enter a valid telephone number with country code." };
  if (rawItems.length < 1 || rawItems.length > 50) {
    return { ok: false, error: "Select at least one product." };
  }

  const items = rawItems.map(normalizeItem);
  if (items.some((item) => item === null)) {
    return { ok: false, error: "One or more selected products are invalid." };
  }

  return {
    ok: true,
    value: {
      name,
      company,
      email,
      phone,
      country,
      notes,
      items: items as InquiryItem[]
    }
  };
}

export function formatQuotationMessage(payload: QuotationPayload): string {
  const lines = payload.items.map((item, index) => {
    const details = [
      `${index + 1}. ${item.name}`,
      `Code: ${item.code}`,
      `SKU: ${item.sku || item.code}`,
      `Family: ${item.familySlug}`,
      `Size: ${item.size || "Not specified"}`,
      `Variant: ${item.variant || "Not specified"}`,
      `Quantity: ${item.quantity}`,
      item.notes ? `Line note: ${item.notes}` : null
    ].filter(Boolean);
    return details.join(" | ");
  });

  return [
    "Quotation request",
    payload.company ? `Company: ${payload.company}` : null,
    payload.country ? `Country: ${payload.country}` : null,
    "",
    "Selected products:",
    ...lines,
    payload.notes ? "" : null,
    payload.notes ? `General notes: ${payload.notes}` : null
  ].filter((line): line is string => line !== null).join("\n");
}

function hashExactRequest(exactRequest: unknown): string {
  return createHash("sha256").update(JSON.stringify(exactRequest)).digest("hex");
}

function normalizedHashEnvelope(payload: QuotationPayload) {
  return {
    name: payload.name.toLowerCase(),
    company: payload.company.toLowerCase(),
    email: payload.email.toLowerCase(),
    phone: payload.phone,
    country: payload.country.toLowerCase(),
    notes: payload.notes
  };
}

export function createQuotationHash(payload: QuotationPayload): string {
  return hashExactRequest({
    ...normalizedHashEnvelope(payload),
    items: payload.items.map((item) => ({
      familySlug: item.familySlug,
      slug: item.slug,
      configurationId: item.configurationId,
      quantity: item.quantity,
      notes: item.notes
    }))
  });
}

/**
 * Reproduces the immediately pre-pricing route-based hash so quotation rows
 * created before configuration identity was introduced remain detectable.
 */
export function createPrePricingQuotationHash(payload: QuotationPayload): string {
  return hashExactRequest({
    ...normalizedHashEnvelope(payload),
    items: payload.items.map((item) => ({
      familySlug: item.familySlug,
      slug: item.slug,
      name: item.name,
      code: item.code,
      size: item.size,
      variant: item.variant,
      quantity: item.quantity,
      notes: item.notes
    }))
  });
}

/**
 * Reproduces the older implementation-specific id hash. Keep while historical
 * quote rows may carry that format.
 */
export function createLegacyQuotationHash(payload: QuotationPayload): string {
  return hashExactRequest({
    ...normalizedHashEnvelope(payload),
    items: payload.items.map((item) => ({
      id: item.id,
      familySlug: item.familySlug,
      slug: item.slug,
      name: item.name,
      code: item.code,
      size: item.size,
      variant: item.variant,
      quantity: item.quantity,
      notes: item.notes
    }))
  });
}
