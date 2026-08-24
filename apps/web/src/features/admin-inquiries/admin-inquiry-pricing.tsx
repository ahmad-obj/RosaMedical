import {
  formatSar,
  halalasToSar,
  normalizeSarAmount,
  sarToHalalas,
  type SarAmount
} from "@/features/pricing";
import type { QuoteRequestItem } from "@/lib/supabase/types";

export interface AdminInquiryPricingSummary {
  pricedSubtotalSar: SarAmount | null;
  unpricedLineCount: number;
  totalSar: SarAmount | null;
  allPriced: boolean;
}

export function summarizeAdminInquiryPricing(
  lines: readonly QuoteRequestItem[]
): AdminInquiryPricingSummary {
  let subtotal = 0n;
  let priced = 0;
  let unpricedLineCount = 0;

  for (const line of lines) {
    const amount = normalizeSarAmount(line.line_subtotal);
    if (amount === null) {
      unpricedLineCount += 1;
      continue;
    }
    subtotal += sarToHalalas(amount);
    priced += 1;
  }

  const pricedSubtotalSar = priced > 0 ? halalasToSar(subtotal) : null;
  const allPriced = lines.length > 0 && unpricedLineCount === 0;

  return {
    pricedSubtotalSar,
    unpricedLineCount,
    totalSar: allPriced ? pricedSubtotalSar : null,
    allPriced
  };
}

function money(value: number | string | null): string {
  const amount = normalizeSarAmount(value);
  return amount ? formatSar(amount, "en") : "Price on request";
}

export function AdminInquiryPricing({ lines }: { lines: readonly QuoteRequestItem[] }) {
  const ordered = [...lines].sort((left, right) => left.sort_order - right.sort_order);
  const summary = summarizeAdminInquiryPricing(ordered);

  return (
    <section className="admin-inquiry-pricing" aria-label="Submitted quotation pricing">
      <div className="admin-inquiry-pricing__table-wrap">
        <table>
          <caption>Submitted product configurations and price snapshot</caption>
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Configuration</th>
              <th scope="col">Qty</th>
              <th scope="col">Unit price</th>
              <th scope="col">Line subtotal</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((line) => (
              <tr key={line.id}>
                <td>
                  <strong>{line.product_name}</strong>
                  <span><bdi dir="ltr">{line.product_code}</bdi></span>
                </td>
                <td>
                  <span>SKU <bdi dir="ltr">{line.sku || line.product_code}</bdi></span>
                  {line.size ? <span>{line.size}</span> : null}
                  {line.variant_type ? <span>{line.variant_type}</span> : null}
                  {line.notes ? <small>{line.notes}</small> : null}
                </td>
                <td>{line.quantity}</td>
                <td>{money(line.unit_price)}</td>
                <td>{money(line.line_subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="admin-inquiry-pricing__summary">
        {summary.allPriced && summary.totalSar ? (
          <div><dt>Estimated submitted total</dt><dd>{formatSar(summary.totalSar, "en")}</dd></div>
        ) : null}
        {!summary.allPriced && summary.pricedSubtotalSar ? (
          <div><dt>Priced items subtotal</dt><dd>{formatSar(summary.pricedSubtotalSar, "en")}</dd></div>
        ) : null}
        {summary.unpricedLineCount > 0 ? (
          <div><dt>Price on request</dt><dd>{summary.unpricedLineCount} line(s)</dd></div>
        ) : null}
        {!summary.allPriced ? (
          <div><dt>Complete quotation total</dt><dd>Pending complete pricing</dd></div>
        ) : null}
      </dl>
    </section>
  );
}
