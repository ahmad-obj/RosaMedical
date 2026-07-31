# RosaMedical — Premium Medical Supplies Platform

> **Project:** github.com/manbtd0-cloud/RosaMedical
> **Supabase:** hzwabrbrgcxodkqilgdi.supabase.co
> **Admin:** ahmadaliofficial1155@gmail.com (role: admin)
> **Stack:** Next.js 16 (App Router), React 19, Supabase (PostgreSQL, Auth, RLS), Tailwind CSS 4

---

## 📋 Project Overview
RosaMedical is a bilingual (English/Arabic) e-commerce and inquiry platform for premium surgical instruments. It features a public-facing storefront with product browsing and quote requests, alongside a secure admin dashboard for managing catalogues, content, and messages.

---

## 🏗️ Phase 3: Foundation & Pages (Completed)
- **Supabase Integration:** Configured Server/Client clients, middleware, and TypeScript types for 7 tables.
- **Public Pages Built:** Homepage, About, Products (with category filter), Contact (with server actions).
- **Admin Pages Built:** Login, Recovery, Dashboard, Categories (CRUD), Products (CRUD), Site Content, Messages.
- **Auth System:** Sign in, Sign out, and Password Reset flow fully implemented.

---

## 🛠️ Phase 4: Polish & Security (What We Did Today)

### 1. Backend & Database (Strict Consistency)
- **Cascading Deletes:** Added `ON DELETE CASCADE` to all foreign keys. Deleting a category now automatically deletes its products, images, and variants. No orphaned data.
- **Unique Constraints:** Added `UNIQUE` constraints on `slug` and `sku` columns to prevent routing and inventory conflicts.
- **Indexes:** Added database indexes on foreign keys for optimized query performance.
- **Categories Updated:** Replaced dummy categories with `Knives`, `Scissors`, `Punches`, `Chisels`, `Cutters` (EN/AR).

### 2. Security & Auth (Critical)
- **Admin CRUD Auth:** Replaced anon key writes with authenticated admin sessions. All server actions now call `requireAdmin()` before executing.
- **RLS Policies Configured:** 
  - Public (`anon`): Can `SELECT` data and `INSERT` contact messages.
  - Admin (`authenticated`): Has full CRUD access to manage the catalogue and read/delete messages.
- **Spam Protection:** Added a "Honeypot" field (`company_name`) to the contact form to silently reject bot submissions.

### 3. UI/UX & Visual Polish
- **Bilingual Support (i18n):** Built a custom language toggle (`EN` / `ع`). Flips the entire site layout to RTL (Right-to-Left) and swaps all UI text and database content (`name_ar`, `value_ar`).
- **Responsive Design:** Built a working mobile hamburger menu for the public site and responsive admin tables.
- **Loading States:** Added `loading.tsx` spinners for all data-fetching pages.
- **UX Polish:** Added `window.confirm()` dialogs for all admin deletion actions.
- **Visual Polish:** Redesigned Homepage, Products, About, and Contact pages with premium card layouts and hover effects.

### 4. Bug Fixes
- Fixed the contact form failing because the database was missing the `read` column (added via SQL).
- Fixed Next.js build errors (module not found, missing exports).
- Fixed admin pages crashing when `categories` returned `undefined`.

---

## 🗓️ Tomorrow's Plan & Next Steps

### 🔴 Strict Validations (Forms & Auth)
- Implement strict Zod schema validation on all frontend forms (Contact, Admin Products/Categories).
- Enforce strict password policies (minimum length, special characters) during Sign Up and Password Reset.
- Sanitize all user inputs on the server before sending to Supabase to prevent XSS/SQL injection.

### 🟡 Boss Work (Content & Infrastructure)
- **Fill Site Settings:** Replace placeholder text with real company info (About Us, Phone, Email, Address).
- **Product Images:** Configure Supabase Storage bucket for product images and build the image uploader in the Admin Panel.
- **Email Configuration:** Configure Custom SMTP (e.g., Resend) for reliable transactional email delivery.

### 🟢 Deployment
- Push final code to GitHub.
- Deploy to Vercel.
- Update Supabase Authentication URL Configuration to the live Vercel domain.

---
*Developed by the RosaMedical Engineering Team.*

---

## Git Workflow & Merge Instructions

This code currently lives on the phase-4-backend branch to ensure main remains stable until testing is fully complete. 

To review and merge this into main:
1. Go to the GitHub repository: https://github.com/manbtd0-cloud/RosaMedical
2. Click on the Compare and pull request button for the phase-4-backend branch.
3. Review the changes, then click Merge pull request.

Or, to merge locally via terminal:
git checkout main
git pull origin main
git merge phase-4-backend
git push origin main
