import { requireAdmin } from "@/lib/supabase/auth-guard";
import { createClient } from "@/lib/supabase/server";
import { MessagesClient } from "./messages-client";

export default async function MessagesPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [{ data: contactMessages }, { data: quoteRequests }] = await Promise.all([
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
  ]);
  return <MessagesClient contactMessages={contactMessages || []} quoteRequests={quoteRequests || []} />;
}
