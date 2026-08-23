import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  INQUIRY_CHANGE_EVENT,
  INQUIRY_MAX_QUANTITY,
  addInquiryItem,
  clearInquiry,
  createInquiryLineId,
  getInquiryLineCount,
  readInquiry,
  removeInquiryItem,
  updateInquiryItem,
  type InquiryItem
} from "@/features/inquiry/inquiry-store";

const values = new Map<string, string>();
const memoryStorage: Storage = {
  get length() {
    return values.size;
  },
  clear: () => values.clear(),
  getItem: (key) => values.get(key) ?? null,
  key: (index) => [...values.keys()][index] ?? null,
  removeItem: (key) => {
    values.delete(key);
  },
  setItem: (key, value) => {
    values.set(key, String(value));
  }
};

const configurationId = "product:product_scalpel_handle_3";
const item: InquiryItem = {
  lineId: createInquiryLineId("product_scalpel_handle_3", configurationId),
  id: "product_scalpel_handle_3",
  familySlug: "knives",
  slug: "scalpel-handle-no-3",
  name: "Scalpel Handle No. 3",
  code: "01-0103",
  configurationId,
  sku: "01-0103",
  size: "No. 3",
  variant: "Standard",
  quantity: 1,
  notes: "",
  unitPriceSar: null,
  currency: "SAR"
};

describe("inquiry store", () => {
  beforeEach(() => {
    values.clear();
    vi.stubGlobal("window", {
      localStorage: memoryStorage,
      dispatchEvent: vi.fn()
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it("adds an immutable product/configuration snapshot", () => {
    expect(addInquiryItem(item)).toEqual([item]);
    expect(readInquiry()).toEqual([item]);
  });

  it("merges the same line by increasing quantity", () => {
    addInquiryItem(item);
    const result = addInquiryItem({ ...item, quantity: 2 });
    expect(result).toHaveLength(1);
    expect(result[0]?.quantity).toBe(3);
  });

  it("keeps different product identities separate even when the public route matches", () => {
    addInquiryItem(item);
    const otherId = "live-db-uuid";
    const otherConfigurationId = `product:${otherId}`;
    const result = addInquiryItem({
      ...item,
      id: otherId,
      configurationId: otherConfigurationId,
      lineId: createInquiryLineId(otherId, otherConfigurationId),
      quantity: 2
    });

    expect(result).toHaveLength(2);
  });

  it("keeps different configurations of the same product separate", () => {
    addInquiryItem(item);
    const result = addInquiryItem({
      ...item,
      configurationId: "variant-2",
      lineId: createInquiryLineId(item.id, "variant-2"),
      sku: "01-0104",
      size: "No. 4"
    });

    expect(result).toHaveLength(2);
  });

  it("keeps one navigation line and adopts a newer non-empty line note", () => {
    addInquiryItem(item);
    const result = addInquiryItem({ ...item, quantity: 2, notes: "Sterile packing" });

    expect(getInquiryLineCount(result)).toBe(1);
    expect(result[0]).toMatchObject({ quantity: 3, notes: "Sterile packing" });
  });

  it("announces every persisted change to shell consumers", () => {
    addInquiryItem(item);
    updateInquiryItem(item.lineId, { quantity: 2 });
    removeInquiryItem(item.lineId);
    clearInquiry();

    expect(window.dispatchEvent).toHaveBeenCalledTimes(4);
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: INQUIRY_CHANGE_EVENT })
    );
  });

  it("keeps quantities within supported bounds and persists notes", () => {
    addInquiryItem(item);
    const result = updateInquiryItem(item.lineId, { quantity: 0, notes: "Sterile packing" });
    expect(result[0]?.quantity).toBe(1);
    expect(result[0]?.notes).toBe("Sterile packing");

    const bounded = updateInquiryItem(item.lineId, { quantity: INQUIRY_MAX_QUANTITY + 1 });
    expect(bounded[0]?.quantity).toBe(INQUIRY_MAX_QUANTITY);
  });

  it("removes and clears inquiry lines", () => {
    addInquiryItem(item);
    expect(removeInquiryItem(item.lineId)).toEqual([]);
    addInquiryItem(item);
    clearInquiry();
    expect(readInquiry()).toEqual([]);
  });

  it("recovers safely from invalid stored JSON", () => {
    memoryStorage.setItem("rosa-medical-inquiry-v1", "not-json");
    expect(readInquiry()).toEqual([]);
  });
});
