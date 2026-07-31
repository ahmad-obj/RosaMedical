/* This file is generated. Do not edit directly. */
export interface paths {
    "/v1/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/public/families": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listPublicFamilies"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/public/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listPublicProducts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/public/products/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getPublicProduct"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/public/inquiries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createPublicInquiry"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        LocalizedText: {
            en: string;
            ar: string | null;
        };
        MediaRef: {
            id: string;
            /** Format: uri-reference */
            url: string;
            alt: components["schemas"]["LocalizedText"];
            width: number;
            height: number;
        };
        HealthResponse: {
            /** @constant */
            status: "ok";
            /** @constant */
            service: "rosa-medical-api";
            version: string;
            /** Format: date-time */
            timestamp: string;
        };
        FamilySummary: {
            id: string;
            slug: string;
            name: components["schemas"]["LocalizedText"];
            introduction: components["schemas"]["LocalizedText"];
            heroImage: components["schemas"]["MediaRef"] | null;
        };
        FamilyListResponse: {
            items: components["schemas"]["FamilySummary"][];
        };
        ProductOption: {
            id: string;
            /** @enum {string} */
            type: "size" | "variant" | "direction" | "shape";
            label: components["schemas"]["LocalizedText"];
            value: string;
        };
        ProductSummary: {
            id: string;
            slug: string;
            code: string;
            familySlug: string;
            name: components["schemas"]["LocalizedText"];
            shortDescription: components["schemas"]["LocalizedText"];
            mainImage: components["schemas"]["MediaRef"] | null;
            optionSummary: string[];
        };
        ProductDetail: components["schemas"]["ProductSummary"] & {
            gallery: components["schemas"]["MediaRef"][];
            options: components["schemas"]["ProductOption"][];
            catalogueReference: {
                familySlug: string;
                page: string | null;
            } | null;
        };
        ProductListResponse: {
            items: components["schemas"]["ProductSummary"][];
            nextCursor: string | null;
        };
        InquiryItemInput: {
            productId: string;
            quantity: number;
            optionIds: string[];
            lineNote?: string;
        };
        InquiryRequest: {
            customerName: string;
            companyName?: string;
            /** Format: email */
            email: string;
            telephone: string;
            country: string;
            generalNotes?: string;
            items: components["schemas"]["InquiryItemInput"][];
        };
        InquiryItemSnapshot: {
            productId: string;
            productCode: string;
            productName: string;
            familyName: string;
            quantity: number;
            selectedOptions: string[];
            lineNote: string | null;
        };
        InquiryResponse: {
            reference: string;
            /** @constant */
            status: "new";
            /** Format: date-time */
            submittedAt: string;
            items: components["schemas"]["InquiryItemSnapshot"][];
        };
        ErrorEnvelope: {
            error: {
                code: string;
                message: string;
                fieldErrors?: {
                    [key: string]: string[];
                };
                requestId: string;
            };
        };
    };
    responses: {
        /** @description Requested published record was not found. */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description Request validation failed. */
        ValidationError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Service is available. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": "ok",
                     *       "service": "rosa-medical-api",
                     *       "version": "0.1.0",
                     *       "timestamp": "2026-07-31T00:00:00.000Z"
                     *     }
                     */
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
        };
    };
    listPublicFamilies: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Published instrument families. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FamilyListResponse"];
                };
            };
        };
    };
    listPublicProducts: {
        parameters: {
            query?: {
                family?: string;
                query?: string;
                cursor?: string;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Published products matching the filters. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductListResponse"];
                };
            };
        };
    };
    getPublicProduct: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Published product detail. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductDetail"];
                };
            };
            404: components["responses"]["NotFound"];
        };
    };
    createPublicInquiry: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InquiryRequest"];
            };
        };
        responses: {
            /** @description Inquiry stored successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InquiryResponse"];
                };
            };
            400: components["responses"]["ValidationError"];
            /** @description The idempotency key was reused with different content. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
}
