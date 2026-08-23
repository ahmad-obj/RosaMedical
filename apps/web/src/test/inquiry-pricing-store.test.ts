import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  INQUIRY_STORAGE_KEY,
  addInquiryItem,
  createInquiryLineId,
  readInquiry,
  removeInquiryItem,
  updateInquiryItem,
  type InquiryItem
} from "@/features/inquiry/inquiry-store";

const values = new Map<string, string>();
const memoryStorage: Storage = {
  get length() { return values.size; },
  clear: () => values.clear(),
  getItem: (key) => values.get(key) ?? null,
  key: (index) => [...values.keys()][index] ?? null,
  removeItem: (key) => { values.delete(key); },
  setItem: (key, value) => { values.set(key, String(value)); }
};

const line = (configurationId = "variant-a"): InquiryItem => ({
  lineId: createInquiryLineId("product-1", configurationId),
  id: "product-1",
  familySlug: "scissors",
  slug: "iris-test",
  name: "Iris Test",
  code: "04-0001",
  configurationId,
  sku: configurationId === "variant-a" ? "04-0001" : "04-0002",
  size: configurationId === "variant-a" ? "14 cm" : "16 cm",
  variant: configurationId === "variant-a" ? "Straight" : "Curved",
  quantity: 1,
  notes: "",
  unitPriceSar: configurationId === "variant-a" ? "100.00" : "125.00",
  currency: "SAR"
});

describe("configuration-aware inquiry storage", () => {
  beforeEach(() => {
    values.clear();
    vi.stubGlobal("window", { localStorage: memoryStorage, dispatchEvent: vi.fn() });
  });

  afterEach(() => vi.unstubAllGlobals());

  it("migrates a legacy saved line without losing the product snapshot", () => {
    memoryStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify([{
      id: "product-1",
      familySlug: "scissors",
      slug: "iris-test",
      name: "Iris Test",
      code: "04-0001",
      size: "14 cm",
      variant: "Straight",
      quantity: 2,
      notes: "Sterile packing"
    }]));

    expect(readInquiry()).toEqual([{
      id: "product-1",
      lineId: "product-1:product:product-1",
      familySlug: "scissors",
      slug: "iris-test",
      name: "Iris Test",
      code: "04-0001",
      configurationId: "product:product-1",
      sku: "04-0001",
      size: "14 cm",
      variant: "Straight",
      quantity: 2,
      notes: "Sterile packing",
      unitPriceSar: null,
      currency: "SAR"
    }]);
  });

  it("merges only the same configuration line", () => {
    addInquiryItem(line("variant-a"));
    addInquiryItem({ ...line("variant-a"), quantity: 2 });
    addInquiryItem(line("variant-b"));

    const items = readInquiry();
    expect(items).toHaveLength(2);
    expect(items.find((item) => item.configurationId === "variant-a")?.quantity).toBe(3);
    expect(items.find((item) => item.configurationId === "variant-b")?.quantity).toBe(1);
  });

  it("updates and removes by deterministic line id instead of product id", () => {
    const first = line("variant-a");
    const second = line("variant-b");
    addInquiryItem(first);
    addInquiryItem(second);

    expect(updateInquiryItem(second.lineId, { quantity: 4 }).find((item) => item.lineId === second.lineId)?.quantity).toBe(4);
    expect(removeInquiryItem(first.lineId).map((item) => item.lineId)).toEqual([second.lineId]);
  });

  it("degrades malformed stored snapshot money to Price on request", () => {
    memoryStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify([{ ...line(), unitPriceSar: "not-money" }]));
    expect(readInquiry()[0]?.unitPriceSar).toBeNull();
  });
});
