"use client";

import { useState, useTransition } from "react";
import { markMessageRead, deleteContactMessage, deleteQuoteRequest } from "./action";
import type { ContactMessage, QuoteRequest } from "@/lib/supabase/types";

export function MessagesClient({ contactMessages, quoteRequests }: { contactMessages: ContactMessage[]; quoteRequests: QuoteRequest[] }) {
  const [tab, setTab] = useState<"contact" | "quotes">("contact");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleMarkRead(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await markMessageRead(id);
      if (result?.error) setError(result.error);
    });
  }

  function handleDeleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteContactMessage(id);
      if (result?.error) setError(result.error);
    });
  }

  function handleDeleteQuote(id: string) {
    if (!confirm("Delete this quote request?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteQuoteRequest(id);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-rosa-dark mb-6">Messages</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-rosa-error/10 border border-rosa-error/20 px-4 py-3 text-sm text-rosa-error">{error}</div>
      )}

      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab("contact")} className={"rounded-lg px-4 py-2 text-sm font-medium transition-colors " + (tab === "contact" ? "bg-rosa-accent text-rosa-dark" : "bg-rosa-cream text-rosa-muted hover:text-rosa-dark")}>
          Contact Messages ({contactMessages.length})
        </button>
        <button onClick={() => setTab("quotes")} className={"rounded-lg px-4 py-2 text-sm font-medium transition-colors " + (tab === "quotes" ? "bg-rosa-accent text-rosa-dark" : "bg-rosa-cream text-rosa-muted hover:text-rosa-dark")}>
          Quote Requests ({quoteRequests.length})
        </button>
      </div>

      {tab === "contact" && (
        <div className="space-y-4">
          {contactMessages.length === 0 && <p className="text-center text-sm text-rosa-muted py-12">No contact messages yet</p>}
          {contactMessages.map((msg) => (
            <div key={msg.id} className={"rounded-lg border bg-rosa-card p-6 " + (msg.read ? "border-rosa-border" : "border-rosa-accent/50")}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-rosa-dark">{msg.name}</h3>
                    {!msg.read && <span className="rounded-full bg-rosa-accent/10 px-2 py-0.5 text-xs font-medium text-rosa-accent">New</span>}
                  </div>
                  <p className="text-xs text-rosa-muted">{msg.email}{msg.phone ? " \u2022 " + msg.phone : ""}</p>
                  <p className="mt-2 text-sm text-rosa-dark">{msg.message}</p>
                  <p className="mt-2 text-xs text-rosa-muted">{new Date(msg.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  {!msg.read && <button onClick={() => handleMarkRead(msg.id)} disabled={isPending} className="text-xs text-rosa-accent hover:text-rosa-accent-dark disabled:opacity-50">Mark read</button>}
                  <button onClick={() => handleDeleteMessage(msg.id)} disabled={isPending} className="text-xs text-rosa-error hover:underline disabled:opacity-50">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "quotes" && (
        <div className="space-y-4">
          {quoteRequests.length === 0 && <p className="text-center text-sm text-rosa-muted py-12">No quote requests yet</p>}
          {quoteRequests.map((req) => (
            <div key={req.id} className="rounded-lg border border-rosa-border bg-rosa-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-rosa-dark">{req.name}</h3>
                  <p className="text-xs text-rosa-muted">{req.email}{req.phone ? " \u2022 " + req.phone : ""}</p>
                  <p className="text-xs text-rosa-muted mt-1">Product: {req.product_id}</p>
                  {req.message && <p className="mt-2 text-sm text-rosa-dark">{req.message}</p>}
                  <p className="mt-2 text-xs text-rosa-muted">{new Date(req.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDeleteQuote(req.id)} disabled={isPending} className="text-xs text-rosa-error hover:underline disabled:opacity-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
