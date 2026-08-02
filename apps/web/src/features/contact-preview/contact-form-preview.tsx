"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { ContactFieldPreview } from "./contact-field-preview";

export function ContactFormPreview() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setError("");
    const formData = new FormData(form);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      company_name: formData.get("company_name")
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setError(data.error || "Failed to send");
      }
    } catch {
      setStatus("error");
      setError("Network error");
    }
  };

  return (
    <form className="contact-form-preview" onSubmit={handleSubmit} aria-label="General contact form preview">
      <div className="hidden" aria-hidden="true">
        <input type="text" name="company_name" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="contact-form-preview__grid">
        <ContactFieldPreview id="contact-name" name="name" label="Name" placeholder="Your full name" required />
        <ContactFieldPreview id="contact-company" name="company" label="Company" placeholder="Company or organisation" />
        <ContactFieldPreview id="contact-email" name="email" label="Email" placeholder="Business email" required type="email" />
        <ContactFieldPreview id="contact-telephone" name="phone" label="Telephone" placeholder="Country code and number" required />
        <ContactFieldPreview id="contact-country" name="country" label="Country" placeholder="Country" />
        <ContactFieldPreview id="contact-subject" name="subject" label="Subject" placeholder="General message subject" />
      </div>
      <ContactFieldPreview id="contact-message" name="message" label="Message" placeholder="Write your message" multiline required />
      <div className="contact-form-preview__actions">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send Message"}
        </Button>
        {status === "success" && <p style={{ color: "#4ade80" }}>Message sent successfully</p>}
        {status === "error" && <p style={{ color: "#f87171" }}>Error: {error}</p>}
      </div>
    </form>
  );
}
