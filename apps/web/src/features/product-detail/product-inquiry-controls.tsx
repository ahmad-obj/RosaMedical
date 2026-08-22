"use client";

import { useState, type ReactElement } from "react";
import { AddToInquiryButton, type InquiryItem } from "@/features/inquiry";
import { StaticQuantityField } from "./static-quantity-field";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/features/localization/locales";

export function ProductInquiryControls({ item }: { item: InquiryItem }): ReactElement {
  const [quantity, setQuantity] = useState(item.quantity);
  const [notes, setNotes] = useState(item.notes);
  const ar = getLocaleFromPathname(usePathname()) === "ar";

  return (
    <div className="product-inquiry-controls" id="product-inquiry-controls">
      <StaticQuantityField value={quantity} onChange={setQuantity} />
      <AddToInquiryButton item={{ ...item, quantity, notes }} />
      <label className="product-inquiry-controls__note" htmlFor="product-inquiry-note">
        <span>{ar ? "ملاحظة المتطلب (اختيارية)" : "Requirement note (optional)"}</span>
        <textarea
          id="product-inquiry-note"
          value={notes}
          maxLength={500}
          rows={3}
          placeholder={ar ? "مثال: تعبئة معقمة أو تشطيب بديل أو ملاحظة تسليم" : "For example: sterile packing, alternate finish, or delivery note"}
          onChange={(event) => setNotes(event.currentTarget.value)}
        />
      </label>
    </div>
  );
}
