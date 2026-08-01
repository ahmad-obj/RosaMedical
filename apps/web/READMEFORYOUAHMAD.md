# RosaMedical — Complete Backend Architecture & Merge Guide

> **⚠️ READ THIS BEFORE MERGING**
> This document contains the complete backend architecture built from scratch.
> When merging the new frontend UI into this branch, ensure all API routes, Server Actions, and database schemas remain untouched.

---

## 1. Database Architecture & Strict Consistency

The database uses PostgreSQL (Supabase) with strict relational integrity to prevent orphaned data.

### Core Tables
1. `categories`: id, slug, name_en, name_ar, parent_id, image_path, is_active, sort_order, created_at
2. `products`: id, category_id, item_code, name_en, name_ar, description_en, description_ar, price
3. `product_variants`: id, product_id, sku, size, variant_type, price_override, created_at.
4. `product_images`: id, product_id, image_path, sort_order.
5. `site_settings`: key, value_en, value_ar, updated_at.
6. `contact_messages`: id, name, email, phone, message, read, created_at, **user_id**, **is_spam**
7. `quote_requests` (Appointments): id, product_id, name, email, phone, message, created_at, **us[er_id, cart_hash, status, appointment_date]**

### Archive & Cache Tables
1. `seen_messages`: Archives old read messages. Auto-deletes after 20 days.
2. `unread_after_20`: Archives old unread messages. Auto-deletes after 10 days.
3. `crawled_urls`: Caches web page spam checks for 24 hours (DDoS protection).

### Required SQL Constraints & Indexes

```sql
-- Cascading Deletes (No orphans)
ALTER TABLE products ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id);
ALTER TABLE product_images ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE product_variants ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE quote_requests ADD CONSTRAINT quote_requests_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);

-- Unique Constraints
ALTER TABLE categories ADD CONSTRAINT categories_slug_key UNIQUE (slug);
ALTER TABLE products ADD CONSTRAINT products_slug_key UNIQUE (slug);
ALTER TABLE product_variants ADD CONSTRAINT product_variants_sku_key UNIQUE (sku);

-- Indexes for Performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_quote_requests_product_id ON quote_requests(product_id);
```

---

## 2. Authentication & Security (RLS)

The platform uses `@supabase/ssr` for session management. All admin routes are protected.

### Row Level Security (RLS) Policies

> **Note:** These lines are horizontally cut off at the right edge in the original screenshots (long line, scrollbar not scrolled). Transcribed exactly as visible, including the mid-word cutoffs — nothing completed or guessed.

```sql
-- PUBLIC (anon): Can read active categories and products.
CREATE POLICY "public read categories" ON public.categories FOR SELECT TO anon, authenticated USIN
CREATE POLICY "public read products" ON public.products FOR SELECT TO anon, authenticated USING (t

-- PUBLIC (anon): Can submit contact forms.
CREATE POLICY "public submit contact" ON public.contact_messages FOR INSERT TO anon, authenticated

-- AUTHENTICATED (Admin): Can manage categories and products.
CREATE POLICY "admin insert categories" ON public.categories FOR INSERT TO authenticated WITH CHEC
CREATE POLICY "admin update categories" ON public.categories FOR UPDATE TO authenticated USING (tr
CREATE POLICY "admin delete categories" ON public.categories FOR DELETE TO authenticated U
-- (Repeat insert/update/delete for products, site settings, etc.)

-- AUTHENTICATED (Admin): Can read/delete messages.
CREATE POLICY "admin read contact" ON public.contact_messages FOR SELECT TO authenticated USING (t
CREATE POLICY "admin delete contact" ON public.contact_messages FOR DELETE TO authenticated USING

-- AUTHENTICATED (Users): Can place orders (quotes).
CREATE POLICY "authenticated insert quotes" ON public.quote_requests FOR INSERT TO authenticated W
```

### The `requireAdmin()` Auth Guard

All Admin Server Actions start with this function to verify the user is logged in and has an admin profile.

```typescript
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/admin/login");
}
```

---

## 3. Cart, Checkout & The "Order Once" Rule

### The Auth Wall

Users *must* be signed in to place an order. The `/checkout` page is a Server Component that checks `supabase.auth.getUser()`. If no session, it redirects to `/login?redirect=/checkout`.

### The "Order Once" Rule (Preventing Spam)

When a user places an order, the backend hashes the cart contents using SHA-256. Before saving, it checks if that user has already submitted that exact hash.

```typescript
import crypto from "crypto";

// Inside /api/checkout/route.ts
const cartHash = crypto.createHash('sha256').update(body.message).digest('hex');

const { data: existing } = await supabase
  .from("quote_requests")
  .select("id")
  .eq("user_id", user.id)
  .eq("cart_hash", cartHash)
  .maybeSingle();

if (existing) {
  return NextResponse.json({ error: "You have already placed this exact order." }, { status: 400 })
}
```

---

## 4. Appointment Workflow

Orders are treated as "Appointments" that require admin approval.

1. **User Checkout:** Inserts into `quote_requests` with `status = 'pending'`.
2. **Admin Dashboard:** Displays pending requests in `/admin/messages` under the "Appointment Requests" tab.
3. **Admin Action:** Admin selects a date and clicks "Approve".
4. **Server Action:** Updates the row with `status = 'approved'` and `appointment_date = [selected_date]`.

---

## 5. Automated Mailbox & Email Alerts (Cron Jobs)

Supabase Cron Jobs (`pg_cron` extension) run daily to maintain the mailbox.

### Database Functions & Schedules

```sql
-- Function to move old messages if inbox > 20
CREATE OR REPLACE FUNCTION public.cleanup_mailbox()
RETURNS void AS $$ DECLARE msg_count integer;
BEGIN
  SELECT count(*) INTO msg_count FROM public.contact_messages;
  IF msg_count > 20 THEN
    -- Move old READ messages to seen_messages
    INSERT INTO public.seen_messages (original_id, name, email, phone, message, created_at)
    SELECT id, name, email, phone, message, created_at FROM public.contact_messages
    WHERE read = true ORDER BY created_at ASC LIMIT (msg_count - 20);
    DELETE FROM public.contact_messages WHERE id IN (SELECT original_id FROM public.seen_messages)

    -- Move old UNREAD messages to unread_after_20
    INSERT INTO public.unread_after_20 (original_id, name, email, phone, message, created_at)
    SELECT id, name, email, phone, message, created_at FROM public.contact_messages
    WHERE read = false ORDER BY created_at ASC LIMIT (msg_count - 20);
    DELETE FROM public.contact_messages WHERE id IN (SELECT original_id FROM public.unread_after_20)
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedules
SELECT cron.schedule('daily-mailbox-cleanup', '0 2 * * *', $$SELECT public.cleanup_mailbox();$$);
SELECT cron.schedule('delete-old-seen-messages', '0 3 * * *', $$DELETE FROM public.seen_messages WHERE ...$$);
SELECT cron.schedule('delete-old-unread-messages', '0 3 * * *', $$DELETE FROM public.unread_after_20 WHERE ...$$);
```

### Resend Email API (`/api/alert-unread/route.ts`)

If the cron job moves unread messages, it triggers this API route to email the admin.

```typescript
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

// Fetches from unread_after_20 table and sends email to admin
await resend.emails.send({
  from: "RosaMedical Alerts <alerts@rosamedical.com>",
  to: ["admin@email.com"],
  subject: "Unread Messages Archived - Action Required",
  text: `You have unread messages that will be deleted in 10 days...`
});
```

---

## 6. AI Spam Filter & Cybersecurity (The Research Paper)

Based on the CEAS 2011 paper *"Spam Detection Using Web Page Content"*. The `/api/contact/route.ts` implements a 5-layer defense.

### Layer 1: Honeypot

A hidden input `company_name`. If filled (by a bot), the server pretends success but drops the data.

### Layer 2: Hard Phone Validation

Enforces E.164 format. Strips spaces/dashes. Blocks identical digits (`+11111111`).

```typescript
let p = (body.phone || "").split(" ").join("").split("-").join("");
if (p.indexOf("+") !== 0) p = "+" + p;
if (p.length < 8) return NextResponse.json({ error: "Invalid phone." }, { status: 400 });
```

### Layer 3: Obfuscation Detection

> **⚠️ Gap in source:** The screenshot cuts off right at this heading (page scrolled to bottom of that screen), and the next screenshot picks up at "Layer 4." The body content of Layer 3 was never captured in any of the 9 images — it isn't missing from this file, it's missing from the screenshots. If you have it elsewhere, send it and I'll slot it in.

### Layer 4: AI Web Crawler & HTML Stripping

If the message contains a URL, the server fetches the web page.

```typescript
// Fetch URL with 3-second timeout
const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
const html = await res.text();

// Strip Scripts, CSS, and HTML tags to scan ONLY visible text
let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ");
text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ");
text = text.replace(/<[^>]+>/g, " ");

if (checkSpam(text)) isSpam = true;
```

### Layer 5: DDoS Protection (URL Caching)

Before fetching a URL, it checks the `crawled_urls` table. If it was crawled in the last 24 hours, it uses the cached result. This prevents attackers from using our server to DDoS small websites.

### Layer 6: Cosine Similarity (Message Matching)

Uses TF-IDF vectorization to compare new messages against the `seen_messages` archive. If a message is >75% similar to an old one, it is flagged as spam.

```typescript
function cosineSim(vecA, vecB) {
  let dot = 0, magA = 0, magB = 0;
  for (let key in vecA) { if (vecB[key]) dot += vecA[key] * vecB[key]; magA += vecA[key] ** 2; }
  for (let key in vecB) magB += vecB[key] ** 2;
  return (magA && magB) ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}
```

---

## 7. Data Flow & API Routes ("What is sent")

### `/api/contact` (POST)

- **Receives:** `{ name, email, phone, message, company_name }`
- **Logic:** Honeypot → Phone Validation → Spam Check (Message) → URL Extraction → URL Cache Check → Web Crawl → Cosine Similarity → DB Insert (with `is_spam` flag).
- **Returns:** `{ success: true }` or `{ error: "..." }`

### `/api/checkout` (POST)

- **Receives:** `{ name, email, phone, message }` (Cart details are stringified into `message` by the frontend).
- **Logic:** Auth Check → Phone Validation → Hash Cart → Check "Order Once" Rule → DB Insert `quote_requests` (with `user_id`, `cart_hash`, `status: 'pending'`).
- **Returns:** `{ success: true }` or `{ error: "You have already placed this exact order." }`

### `/api/alert-unread` (POST)

- **Triggered by:** Supabase Cron Job.
- **Logic:** Fetches from `unread_after_20` → Sends Email via Resend API.

### Admin Server Actions (`/app/admin/(workspace)/.../action.ts`)

- **Categories:** `createCategory`, `updateCategory`, `deleteCategory` (Soft delete: sets `deleted_at`), `restoreCategory`, `permanentlyDeleteCategory`.
- **Products:** `createProduct`, `updateProduct`, `deleteProduct`.
- **Messages:** `approveQuote` (sets status & date), `declineQuote`.

---

## 8. Merge Guide (For the AI / Developer)

When merging the new frontend UI into this backend:

1. **Preserve API Routes:** Do NOT delete `/api/contact`, `/api/checkout`, or `/api/alert-unread`. The frontend must send `fetch` requests to these exact endpoints with the exact payload shapes listed above.
2. **Preserve Server Actions:** The admin dashboard buttons must continue to trigger the Server Actions in `action.ts` files.
3. **Preserve Auth Guards:** Ensure `requireAdmin()` remains at the top of all admin server actions. Ensure `/checkout` still calls `supabase.auth.getUser()`.
4. **Environment Variables:** Ensure `.env.local` and Vercel environment variables include:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
5. **Cart Context:** The frontend relies on `CartProvider` in `src/lib/cart/cart-context.tsx`. Ensure the new UI wraps the layout in this provider.

