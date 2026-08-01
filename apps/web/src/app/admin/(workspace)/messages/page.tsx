import { createClient } from "@/lib/supabase/server";
import { MessagesClient } from "./messages-client";
import type { ContactMessage, QuoteRequest } from "@/lib/supabase/types";

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const [messagesRes, quotesRes] = await Promise.all([
    supabase.from("contact_messages").select("*").eq("is_spam", false).order("created_at", { ascending: false }),
    supabase.from("quote_requests").select("*").order("created_at", { ascending: false })
  ]);

  return (
    <MessagesClient 
      initialMessages={messagesRes.data as ContactMessage[] || []} 
      initialQuotes={quotesRes.data as QuoteRequest[] || []} 
    />
  );
}
