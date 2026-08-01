import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import process from "process";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: unreadMessages } = await supabase
      .from("unread_after_20")
      .select("name, email, message")
      .order("created_at", { ascending: false })
      .limit(5);

    if (unreadMessages && unreadMessages.length > 0) {
      const emailBody = unreadMessages.map(m => 
        `From: ${m.name} (${m.email})\nMessage: ${m.message}\n\n`
      ).join("");

      await resend.emails.send({
        from: "RosaMedical Alerts <onboarding@resend.dev>",
        to: ["ahmadaliofficial1155@gmail.com"],
        subject: "Unread Messages Archived - Action Required",
        text: `You have ${unreadMessages.length} unread messages that were archived. They will be deleted in 10 days.\n\n${emailBody}`
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
