import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const spamKeywords = ["viagra", "v1agra", "cialis", "c1alis", "casino", "crypto", "bitcoin", "pharma", "lottery", "xxx", "loan"];

function checkSpam(text) {
  const lower = text.toLowerCase();
  const clean = lower.replace(/[^a-z0-9]/g, "");
  for (const kw of spamKeywords) {
    if (lower.includes(kw) || clean.includes(kw)) return true;
  }
  return false;
}

// --- COSINE SIMILARITY FUNCTIONS ---
function getTokens(text) {
  return text.toLowerCase().match(/\b\w+\b/g) || [];
}
function vectorize(tokens) {
  const freq = {};
  tokens.forEach(t => freq[t] = (freq[t] || 0) + 1);
  return freq;
}
function cosineSim(vecA, vecB) {
  let dot = 0, magA = 0, magB = 0;
  for (let key in vecA) {
    if (vecB[key]) dot += vecA[key] * vecB[key];
    magA += vecA[key] ** 2;
  }
  for (let key in vecB) magB += vecB[key] ** 2;
  return (magA && magB) ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    if (body.company_name) return NextResponse.json({ success: true });

    let p = (body.phone || "").split(" ").join("").split("-").join("");
    if (p.indexOf("+") !== 0) p = "+" + p;
    if (p.length < 8) return NextResponse.json({ error: "Invalid phone." }, { status: 400 });

    if (body.name === "" || body.email === "" || body.message === "") {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    let isSpam = checkSpam(body.message || "");

    // --- COSINE SIMILARITY CHECK ---
    if (!isSpam) {
      const newVec = vectorize(getTokens(body.message));
      const { data: oldMessages } = await supabase.from("seen_messages").select("message").limit(50);
      
      if (oldMessages && oldMessages.length > 0) {
        for (const old of oldMessages) {
          const oldVec = vectorize(getTokens(old.message));
          const similarity = cosineSim(newVec, oldVec);
          if (similarity > 0.75) { // 75% similar
            isSpam = true;
            console.log("Cosine Similarity matched:", similarity);
            break;
          }
        }
      }
    }

    if (!isSpam) {
      const msg = body.message || "";
      let url = null;
      if (msg.indexOf("http") !== -1) {
        const words = msg.split(" ");
        for (const word of words) {
          if (word.indexOf("http") === 0) { url = word; break; }
        }
      }

      if (url) {
        const twentyFourHoursAgo = new Date(Date.now() - 86400000).toISOString();
        const { data: cached } = await supabase
          .from("crawled_urls")
          .select("is_spam")
          .eq("url", url)
          .gt("crawled_at", twentyFourHoursAgo)
          .maybeSingle();

        if (cached) {
          isSpam = cached.is_spam;
        } else {
          try {
            const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
            if (res.ok) {
              const html = await res.text();
              let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ");
              text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ");
              text = text.replace(/<[^>]+>/g, " ");
              if (checkSpam(text)) isSpam = true;
            }
          } catch (e) {}

          await supabase.from("crawled_urls").upsert({
            url: url,
            is_spam: isSpam,
            crawled_at: new Date().toISOString()
          });
        }
      }
    }

    const { data } = await supabase.auth.getUser();
    const userId = data.user ? data.user.id : null;
    const { error } = await supabase.from("contact_messages").insert({
      user_id: userId, name: body.name, email: body.email, phone: p, message: body.message, is_spam: isSpam
    });

    if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
