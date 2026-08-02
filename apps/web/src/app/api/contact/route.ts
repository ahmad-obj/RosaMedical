import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const spamKeywords = ["viagra", "v1agra", "cialis", "c1alis", "casino", "crypto", "bitcoin", "pharma", "lottery", "xxx", "loan"];

interface ContactRequestBody {
  company_name?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  subject?: string;
  message?: string;
}

function checkSpam(text: string) {
  const lower = text.toLowerCase();
  const clean = lower.replace(/[^a-z0-9]/g, "");
  for (const keyword of spamKeywords) {
    if (lower.includes(keyword) || clean.includes(keyword)) return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ContactRequestBody;
    const supabase = await createClient();

    if (body.company_name) return NextResponse.json({ success: true });

    let phone = (body.phone || "").split(" ").join("").split("-").join("");
    if (phone.indexOf("+") !== 0) phone = "+" + phone;
    if (phone.length < 8) return NextResponse.json({ error: "Invalid phone." }, { status: 400 });

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    let isSpam = checkSpam(body.message);

    if (!isSpam) {
      let url: string | null = null;
      if (body.message.indexOf("http") !== -1) {
        for (const word of body.message.split(" ")) {
          if (word.indexOf("http") === 0) {
            url = word;
            break;
          }
        }
      }
      if (url) {
        const twentyFourHoursAgo = new Date(Date.now() - 86400000).toISOString();
        const { data: cached } = await supabase.from("crawled_urls").select("is_spam").eq("url", url).gt("crawled_at", twentyFourHoursAgo).maybeSingle();
        if (cached) {
          isSpam = cached.is_spam;
        } else {
          try {
            const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
            if (response.ok) {
              const html = await response.text();
              let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ");
              text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ");
              text = text.replace(/<[^>]+>/g, " ");
              if (checkSpam(text)) isSpam = true;
            }
          } catch {
            // The existing contact flow continues when an external URL cannot be inspected.
          }
          await supabase.from("crawled_urls").upsert({ url, is_spam: isSpam, crawled_at: new Date().toISOString() });
        }
      }
    }

    const { data } = await supabase.auth.getUser();
    const userId = data.user ? data.user.id : null;

    const { error } = await supabase.from("contact_messages").insert({
      user_id: userId,
      name: body.name,
      email: body.email,
      phone,
      message: body.message,
      is_spam: isSpam,
      company: body.company || null,
      country: body.country || null,
      subject: body.subject || null
    });

    if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
