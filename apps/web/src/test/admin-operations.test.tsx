import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ADMIN_INQUIRY_WORKFLOW,
  AdminInquiriesPage,
  AdminInquiryClosePreview,
  AdminInquiryDetailPreview,
  AdminInquiryInternalNotePreview,
  AdminInquiryListFailurePreview,
  AdminInquiryListLoadingPreview,
  AdminInquiryMarkContactedPreview,
  AdminInquiryMarkReviewedPreview,
  AdminInquiryMobileDetailPreview,
  AdminInquiryNoResultsPreview,
  AdminInquiryOpenEmailPreview,
  AdminInquiryPopulatedListPreview,
  AdminInquirySnapshotWarningPreview,
  AdminInquiryStatusTransitionPreview,
  getInquiryStatusTone
} from "@/features/admin-inquiries";
import {
  ADMIN_MESSAGE_WORKFLOW,
  AdminMessageClosePreview,
  AdminMessageConvertToInquiryPreview,
  AdminMessageDetailPreview,
  AdminMessageInternalNotePreview,
  AdminMessageListFailurePreview,
  AdminMessageListLoadingPreview,
  AdminMessageMarkReadPreview,
  AdminMessageMarkRepliedPreview,
  AdminMessageMobileDetailPreview,
  AdminMessageNoResultsPreview,
  AdminMessagePopulatedListPreview,
  AdminMessagePricingGuidancePreview,
  AdminMessagesPage,
  getMessageStatusTone
} from "@/features/admin-messages";
import {
  isAdminOperationsRoot,
  resolveAdminOperationsRoute
} from "@/features/admin-operations-routing";

describe("F3E-C normal operations pages", () => {
  it("renders the connected Inquiry queue controls without fabricated records", () => {
    const html = renderToStaticMarkup(<AdminInquiriesPage />);
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect((html.match(/<main/g) ?? [])).toHaveLength(0);
    expect(html).toContain("Product requirements awaiting connection.");
    expect(html).toContain("Search by name or email...");
    expect(html).toContain("All Statuses");
    expect(html).toContain("Filter");
    expect(html).not.toContain("data-preview-only");
    expect((html.match(/<form/g) ?? [])).toHaveLength(1);
    expect(html).not.toContain("<table");
    expect(html).not.toMatch(/EXAMPLE-INQUIRY|buyer@example.invalid|Last synced/i);
  });

  it("renders the connected Message queue boundary without fabricated records", () => {
    const html = renderToStaticMarkup(<AdminMessagesPage />);
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect((html.match(/<main/g) ?? [])).toHaveLength(0);
    expect(html).toContain("Contact messages remain separate.");
    expect(html).toContain("Keep general communication separate from structured product requirements.");
    expect(html).not.toContain("data-preview-only");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<table");
    expect(html).not.toMatch(/EXAMPLE-MESSAGE|sender@example.invalid|Last synced/i);
  });

  it("keeps the two status vocabularies exact and deterministic", () => {
    expect(ADMIN_INQUIRY_WORKFLOW).toEqual(["New", "Reviewed", "Contacted", "Closed"]);
    expect(ADMIN_MESSAGE_WORKFLOW).toEqual(["New", "Read", "Replied", "Closed"]);
    expect(ADMIN_INQUIRY_WORKFLOW.map(getInquiryStatusTone)).toEqual(["warning", "review", "ready", "archived"]);
    expect(ADMIN_MESSAGE_WORKFLOW.map(getMessageStatusTone)).toEqual(["warning", "review", "ready", "archived"]);
  });
});

describe("F3E-C exact operations routing", () => {
  it("resolves only the two exact normal routes", () => {
    expect(resolveAdminOperationsRoute(["inquiries"])).toEqual({ kind: "inquiries" });
    expect(resolveAdminOperationsRoute(["messages"])).toEqual({ kind: "messages" });
    expect(isAdminOperationsRoot("inquiries")).toBe(true);
    expect(isAdminOperationsRoot("messages")).toBe(true);
    expect(isAdminOperationsRoot("products")).toBe(false);
  });

  it.each([
    { segments: [] },
    { segments: ["inquiries", "EXAMPLE-INQUIRY"] },
    { segments: ["messages", "EXAMPLE-MESSAGE"] },
    { segments: ["inquiries", "EXAMPLE-INQUIRY", "notes"] },
    { segments: ["messages", "EXAMPLE-MESSAGE", "reply"] },
    { segments: ["unknown"] }
  ] as const)("rejects unsupported shape $segments", ({ segments }) => {
    expect(resolveAdminOperationsRoute(segments)).toEqual({ kind: "not-found" });
  });
});

describe("F3E-C isolated previews", () => {
  it("marks all thirteen Inquiry compositions preview-only", () => {
    const previews = [
      <AdminInquiryPopulatedListPreview key="list" />,
      <AdminInquiryDetailPreview key="detail" />,
      <AdminInquiryMobileDetailPreview key="mobile" />,
      <AdminInquiryListLoadingPreview key="loading" />,
      <AdminInquiryListFailurePreview key="failure" />,
      <AdminInquiryNoResultsPreview key="none" />,
      <AdminInquiryStatusTransitionPreview key="transition" />,
      <AdminInquiryInternalNotePreview key="note" />,
      <AdminInquiryMarkReviewedPreview key="reviewed" />,
      <AdminInquiryMarkContactedPreview key="contacted" />,
      <AdminInquiryClosePreview key="close" />,
      <AdminInquiryOpenEmailPreview key="email" />,
      <AdminInquirySnapshotWarningPreview key="snapshot" />
    ];
    const html = renderToStaticMarkup(<>{previews}</>);
    expect((html.match(/data-preview-only=/g) ?? [])).toHaveLength(13);
    expect((html.match(/No customer record was loaded or changed\./g) ?? [])).toHaveLength(13);
    expect(html).toContain("buyer@example.invalid");
    expect(html).toContain("EXAMPLE-INQUIRY");
    expect(html).not.toMatch(/Nora Rahman|Al Noor Medical|RM-260731/i);
    expect(html).not.toContain("<form");
  });

  it("marks all twelve Message compositions preview-only", () => {
    const previews = [
      <AdminMessagePopulatedListPreview key="list" />,
      <AdminMessageDetailPreview key="detail" />,
      <AdminMessageMobileDetailPreview key="mobile" />,
      <AdminMessageListLoadingPreview key="loading" />,
      <AdminMessageListFailurePreview key="failure" />,
      <AdminMessageNoResultsPreview key="none" />,
      <AdminMessagePricingGuidancePreview key="pricing" />,
      <AdminMessageMarkReadPreview key="read" />,
      <AdminMessageMarkRepliedPreview key="replied" />,
      <AdminMessageClosePreview key="close" />,
      <AdminMessageInternalNotePreview key="note" />,
      <AdminMessageConvertToInquiryPreview key="convert" />
    ];
    const html = renderToStaticMarkup(<>{previews}</>);
    expect((html.match(/data-preview-only=/g) ?? [])).toHaveLength(12);
    expect((html.match(/No message was classified, updated, replied to or converted\./g) ?? [])).toHaveLength(12);
    expect(html).toContain("sender@example.invalid");
    expect(html).toContain("Example general message");
    expect(html).not.toMatch(/Amal Hassan|Riyadh Health Supplies|Fatima Noor/i);
    expect(html).not.toContain("<form");
  });
});
