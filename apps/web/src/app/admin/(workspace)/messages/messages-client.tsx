"use client";

import { useState, useTransition } from "react";
import { approveQuote, declineQuote } from "./action";
import type { ContactMessage, QuoteRequest } from "@/lib/supabase/types";

interface MessagesClientProps {
  initialMessages: ContactMessage[];
  initialQuotes: QuoteRequest[];
}

export function MessagesClient({ initialMessages, initialQuotes }: MessagesClientProps) {
  const [activeTab, setActiveTab] = useState<'messages' | 'appointments'>('messages');
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string, formData: FormData) => {
    startTransition(async () => {
      const result = await approveQuote(id, formData);
      if (result?.error) alert(result.error);
    });
  };

  const handleDecline = (id: string) => {
    if (!window.confirm("Are you sure you want to decline this appointment request?")) return;
    startTransition(async () => {
      const result = await declineQuote(id);
      if (result?.error) alert(result.error);
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Messages & Appointments</h1>
      
      <div className="flex gap-4 border-b border-rosa-border">
        <button onClick={() => setActiveTab('messages')} className={`pb-2 text-sm font-medium ${activeTab === 'messages' ? 'border-b-2 border-rosa-accent text-rosa-accent' : 'text-rosa-muted'}`}>
          Contact Messages ({initialMessages.length})
        </button>
        <button onClick={() => setActiveTab('appointments')} className={`pb-2 text-sm font-medium ${activeTab === 'appointments' ? 'border-b-2 border-rosa-accent text-rosa-accent' : 'text-rosa-muted'}`}>
          Appointment Requests ({initialQuotes.length})
        </button>
      </div>

      {activeTab === 'messages' && (
        <div className="space-y-4">
          {initialMessages.length === 0 ? (
            <p className="text-rosa-muted text-center py-8">No messages found.</p>
          ) : (
            initialMessages.map((msg) => (
              <div key={msg.id} className="rounded-lg border border-rosa-border bg-rosa-card p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-white">{msg.name}</h3>
                    <p className="text-sm text-rosa-muted">{msg.email} | {msg.phone}</p>
                  </div>
                  {!msg.read && <span className="bg-rosa-accent text-rosa-dark text-xs px-2 py-1 rounded-full">New</span>}
                </div>
                <p className="text-rosa-cream/80 mt-2 whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {initialQuotes.length === 0 ? (
            <p className="text-rosa-muted text-center py-8">No appointment requests found.</p>
          ) : (
            initialQuotes.map((quote) => (
              <div key={quote.id} className="rounded-lg border border-rosa-border bg-rosa-card p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-white">{quote.name}</h3>
                    <p className="text-sm text-rosa-muted">{quote.email} | {quote.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full uppercase ${quote.status === 'approved' ? 'bg-green-500/20 text-green-400' : quote.status === 'declined' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {quote.status || 'pending'}
                    </span>
                  </div>
                </div>
                <p className="text-rosa-cream/80 mt-2 whitespace-pre-wrap">{quote.message}</p>
                
                {quote.appointment_date && (
                  <p className="text-sm text-rosa-accent mt-2">📅 Scheduled for: {new Date(quote.appointment_date).toLocaleDateString()}</p>
                )}

                {quote.status !== 'approved' && quote.status !== 'declined' && (
                  <div className="mt-4 pt-4 border-t border-rosa-border flex flex-col sm:flex-row gap-4 items-center">
                    <form action={(formData) => handleApprove(quote.id, formData)} className="flex items-center gap-2 w-full sm:w-auto">
                      <input type="date" name="appointment_date" required className="rounded-md border border-rosa-border bg-rosa-dark px-3 py-2 text-white text-sm" />
                      <button type="submit" disabled={isPending} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                        Approve
                      </button>
                    </form>
                    <button onClick={() => handleDecline(quote.id)} disabled={isPending} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 sm:ml-auto">
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
