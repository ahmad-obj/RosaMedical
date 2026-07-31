import { http, HttpResponse } from "msw";
import {
  healthFixture,
  familyFixtures,
  productFixtures,
  productDetailFixture,
  inquiryResponseFixture
} from "@rosa/contracts/fixtures";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const handlers = [
  http.get(`${API_BASE_URL}/v1/health`, () => {
    return HttpResponse.json(healthFixture);
  }),

  http.get(`${API_BASE_URL}/v1/public/families`, () => {
    return HttpResponse.json({ items: familyFixtures });
  }),

  http.get(`${API_BASE_URL}/v1/public/products`, ({ request }) => {
    const url = new URL(request.url);
    const family = url.searchParams.get("family");
    const query = url.searchParams.get("query")?.toLowerCase();

    let items = productFixtures;
    if (family) {
      items = items.filter((p) => p.familySlug === family);
    }
    if (query) {
      items = items.filter((p) => p.name.en.toLowerCase().includes(query));
    }

    return HttpResponse.json({ items, nextCursor: null });
  }),

  http.get(`${API_BASE_URL}/v1/public/products/:slug`, ({ params }) => {
    const { slug } = params;
    if (slug !== productDetailFixture.slug) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Product not found", requestId: "mock-request" } },
        { status: 404 }
      );
    }
    return HttpResponse.json(productDetailFixture);
  }),

  http.post(`${API_BASE_URL}/v1/public/inquiries`, async ({ request }) => {
    const idempotencyKey = request.headers.get("Idempotency-Key");
    if (!idempotencyKey) {
      return HttpResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Idempotency-Key header is required",
            requestId: "mock-request"
          }
        },
        { status: 400 }
      );
    }
    return HttpResponse.json(inquiryResponseFixture, { status: 201 });
  })
];
