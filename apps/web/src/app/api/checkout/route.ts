import { NextRequest, NextResponse } from "next/server";
import { createQuotationHashCandidates } from "@/features/catalogue-migration/legacy-inquiry-hash";
import {
  AuthoritativeQuotationError,
  formatAuthoritativeQuotationMessage,
  mapAuthoritativeProductRow,
  mapAuthoritativeVariantRow,
  quotationLinesForRpc,
  resolveAuthoritativeQuoteLines
} from "@/features/inquiry/quotation-pricing-server";
import {
  createQuotationHash,
  normalizeQuotationPayload
} from "@/features/inquiry/quotation-payload";
import { createAdminClient } from "@/lib/supabase/admin";
import { PublicRequestError, readBoundedJson } from "@/lib/http/public-request";

const DUPLICATE_MESSAGE = "This exact quotation request has already been submitted.";

export async function POST(req: NextRequest) {
  try {
    const result = normalizeQuotationPayload(await readBoundedJson(req, 98_304));
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const payload = result.value;
    const cartHash = createQuotationHash(payload);
    const hashCandidates = createQuotationHashCandidates(payload);
    const supabase = createAdminClient();

    const { data: existing, error: lookupError } = await supabase
      .from("quote_requests")
      .select("id")
      .in("cart_hash", hashCandidates)
      .limit(1)
      .maybeSingle();

    if (lookupError) {
      console.error("Quotation duplicate lookup failed:", lookupError);
      return NextResponse.json({ error: "Unable to submit quotation request." }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({ error: DUPLICATE_MESSAGE }, { status: 409 });
    }

    const routeKeyByDbSlug = new Map(
      payload.items.map((item) => [
        `${item.familySlug}-${item.slug}`,
        `${item.familySlug}/${item.slug}`
      ] as const)
    );
    const dbSlugs = [...routeKeyByDbSlug.keys()];

    const { data: productRows, error: productError } = await supabase
      .from("products")
      .select("id,slug,name_en,item_code,price,is_active")
      .in("slug", dbSlugs);

    if (productError) {
      console.error("Quotation product pricing lookup failed:", productError);
      return NextResponse.json({ error: "Unable to validate selected products." }, { status: 500 });
    }

    const products = (productRows ?? []).map((row) =>
      mapAuthoritativeProductRow(row, routeKeyByDbSlug.get(row.slug))
    );
    const productIds = products.map((product) => product.id);

    let variantRows: Array<{
      id: string;
      product_id: string;
      sku: string | null;
      size: string | null;
      variant_type: string | null;
      price_override: string | number | null;
    }> = [];

    if (productIds.length > 0) {
      const { data, error: variantError } = await supabase
        .from("product_variants")
        .select("id,product_id,sku,size,variant_type,price_override")
        .in("product_id", productIds);

      if (variantError) {
        console.error("Quotation variant pricing lookup failed:", variantError);
        return NextResponse.json({ error: "Unable to validate selected product configurations." }, { status: 500 });
      }
      variantRows = data ?? [];
    }

    let authoritativeLines;
    try {
      authoritativeLines = resolveAuthoritativeQuoteLines(
        payload.items,
        products,
        variantRows.map(mapAuthoritativeVariantRow)
      );
    } catch (error) {
      if (error instanceof AuthoritativeQuotationError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }

    const message = formatAuthoritativeQuotationMessage(
      { company: payload.company, country: payload.country, notes: payload.notes },
      authoritativeLines
    );

    const { data, error } = await supabase.rpc("create_quote_request_with_items", {
      p_name: payload.name,
      p_email: payload.email,
      p_phone: payload.phone,
      p_message: message,
      p_cart_hash: cartHash,
      p_items: quotationLinesForRpc(authoritativeLines)
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: DUPLICATE_MESSAGE }, { status: 409 });
      }
      console.error("Quotation transaction failed:", error);
      return NextResponse.json({ error: "Unable to submit quotation request." }, { status: 500 });
    }

    if (typeof data !== "string" || !data) {
      console.error("Quotation transaction returned no request id.");
      return NextResponse.json({ error: "Unable to submit quotation request." }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data }, { status: 201 });
  } catch (error) {
    if (error instanceof PublicRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Quotation route failed:", error);
    return NextResponse.json({ error: "Unable to submit quotation request." }, { status: 500 });
  }
}
