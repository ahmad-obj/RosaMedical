import type { ReactElement } from "react";
import { LocalizedText } from "@/features/localization";

export function MobileInquiryBar(): ReactElement {
  return (
    <aside
      className="mobile-inquiry-bar"
      aria-label="Inquiry action"
      data-motion="mobile-inquiry-bar"
    >
      <span><LocalizedText en="Price on request" ar="السعر عند الطلب" /></span>
      <a className="button button--primary button--standard" href="#product-inquiry-controls">
        <LocalizedText en="Choose quantity" ar="اختر الكمية" />
      </a>
    </aside>
  );
}
