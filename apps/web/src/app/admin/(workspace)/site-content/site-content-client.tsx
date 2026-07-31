"use client";

import { useState, useTransition } from "react";
import { saveSiteContent } from "./action";

interface SiteContentClientProps {
  settings: Record<string, { value_en: string; value_ar: string }>;
}

const FIELDS = [
  { key: "about_us", label: "About Us", multiline: true },
  { key: "contact_email", label: "Contact Email" },
  { key: "contact_phone", label: "Contact Phone" },
  { key: "contact_whatsapp", label: "WhatsApp" },
  { key: "contact_address", label: "Address", multiline: true },
];

export function SiteContentClient({ settings }: SiteContentClientProps) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await saveSiteContent(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-rosa-dark mb-6">Site Content</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-rosa-error/10 border border-rosa-error/20 px-4 py-3 text-sm text-rosa-error">{error}</div>
      )}

      {saved && (
        <div className="mb-4 rounded-lg bg-rosa-success/10 border border-rosa-success/20 px-4 py-3 text-sm text-rosa-success">Saved successfully</div>
      )}

      <form action={handleSubmit} className="space-y-8">
        {FIELDS.map((field) => {
          const current = settings[field.key] || { value_en: "", value_ar: "" };
          return (
            <div key={field.key} className="rounded-lg border border-rosa-border bg-rosa-card p-6">
              <h3 className="font-heading text-lg font-semibold text-rosa-dark mb-4">{field.label}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-rosa-dark mb-1">English</label>
                  {field.multiline ? (
                    <textarea name={field.key + "_en"} defaultValue={current.value_en} rows={4} className="w-full rounded-lg border border-rosa-border bg-rosa-bg px-3 py-2 text-sm focus:border-rosa-accent focus:outline-none focus:ring-1 focus:ring-rosa-accent" />
                  ) : (
                    <input name={field.key + "_en"} defaultValue={current.value_en} className="w-full rounded-lg border border-rosa-border bg-rosa-bg px-3 py-2 text-sm focus:border-rosa-accent focus:outline-none focus:ring-1 focus:ring-rosa-accent" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-rosa-dark mb-1">Arabic</label>
                  {field.multiline ? (
                    <textarea name={field.key + "_ar"} defaultValue={current.value_ar} dir="rtl" rows={4} className="w-full rounded-lg border border-rosa-border bg-rosa-bg px-3 py-2 text-sm focus:border-rosa-accent focus:outline-none focus:ring-1 focus:ring-rosa-accent" />
                  ) : (
                    <input name={field.key + "_ar"} defaultValue={current.value_ar} dir="rtl" className="w-full rounded-lg border border-rosa-border bg-rosa-bg px-3 py-2 text-sm focus:border-rosa-accent focus:outline-none focus:ring-1 focus:ring-rosa-accent" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <button type="submit" disabled={isPending} className="rounded-lg bg-rosa-accent px-6 py-2.5 text-sm font-semibold text-rosa-dark hover:bg-rosa-accent-dark disabled:opacity-50 transition-colors">
          {isPending ? "Saving..." : "Save All Changes"}
        </button>
      </form>
    </div>
  );
}
