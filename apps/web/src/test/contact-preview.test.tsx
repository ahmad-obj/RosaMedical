import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  CONTACT_INFORMATION,
  ContactFailurePreview,
  ContactFocusPreview,
  ContactLoadingPreview,
  ContactPage,
  ContactSuccessPreview,
  ContactValidationPreview
} from "@/features/contact-preview";

describe("F3D contact normal state", () => {
  it("keeps unconfirmed contact values explicit", () => {
    expect(CONTACT_INFORMATION.map((row) => row.value)).toEqual([
      "Rosa Medical",
      "Awaiting client confirmation",
      "Awaiting client confirmation",
      "Awaiting client confirmation",
      "Awaiting client confirmation",
      "Awaiting client confirmation",
      "Awaiting client confirmation"
    ]);
  });

  it("renders one heading, the connected form and no fake contact links", () => {
    const html = renderToStaticMarkup(<ContactPage />);

    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect(html).toContain("General contact form preview");
    expect(html).toContain('name="email"');
    expect(html).toContain('name="phone"');
    expect(html).toContain('name="message"');
    expect(html).toContain("Send Message");
    expect(html).not.toContain('readOnly=""');
    expect(html).not.toMatch(/mailto:|tel:|wa\.me|contact@placeholder|\+966 XX/i);
    expect(html).not.toContain("MESSAGE SENT");
    expect(html).toContain('href="/inquiry"');
  });
});

describe("F3D contact isolated previews", () => {
  it("renders a visible isolated focus example", () => {
    const html = renderToStaticMarkup(<ContactFocusPreview />);
    expect(html).toContain("contact-preview-field--focused");
    expect(html).toContain("data-preview-only");
  });

  it("connects validation errors to invalid fields", () => {
    const html = renderToStaticMarkup(<ContactValidationPreview />);
    expect((html.match(/aria-invalid="true"/g) ?? [])).toHaveLength(2);
    expect(html).toContain('aria-describedby="contact-invalid-email-error"');
    expect(html).toContain('id="contact-invalid-email-error"');
  });

  it("keeps loading and failure previews noninteractive", () => {
    const html = renderToStaticMarkup(<><ContactLoadingPreview /><ContactFailurePreview /></>);
    expect(html).toContain("Sending preview");
    expect(html).toContain("disabled");
    expect(html).not.toContain("onSubmit");
  });

  it("does not invent a sent message or reference in the default success preview", () => {
    const html = renderToStaticMarkup(<ContactSuccessPreview />);
    expect(html).not.toContain("CONTACT-PLACEHOLDER");
    expect(html).not.toContain("Your general message has been sent");
    expect(html).toContain("Confirmation details appear after a successful submission");
  });
});
