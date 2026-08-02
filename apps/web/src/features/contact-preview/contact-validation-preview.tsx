import type { ReactElement } from "react";
import { ContactFieldPreview } from "./contact-field-preview";

export function ContactValidationPreview(): ReactElement {
  return (
    <section data-preview-only="true" aria-labelledby="contact-validation-title">
      <h2 id="contact-validation-title">Validation example</h2>
      <div className="contact-preview-state__grid">
        <ContactFieldPreview
          id="contact-invalid-email"
          label="Email"
          placeholder="Business email"
          defaultValue="name@company"
          error="Enter a valid email address"
        />
        <ContactFieldPreview
          id="contact-invalid-telephone"
          label="Telephone"
          placeholder="Country code and number"
          defaultValue="Number required"
          error="Enter a valid telephone number"
        />
      </div>
    </section>
  );
}
