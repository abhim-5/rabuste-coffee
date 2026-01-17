# 🧱 THE CORRECT IMPLEMENTATION ROADMAP (NO MISTAKES)

Below is the only order that scales.

## 🟢 PHASE 0 — CLEAN BASELINE (YOU ARE HERE)
**Status: ✅ DONE**
- Frontend stable
- Repo clean
- No half-backed backend
- No Prisma schema pushed blindly

### DO NOT TOUCH:
- Copilot
- Prisma
- Supabase tables (yet)

---

## 🟢 PHASE 1 — SUPABASE PROJECT SETUP (DASHBOARD ONLY)
**You do this MANUALLY (no Copilot)**

### Create Supabase project

### Enable:
- Email/password auth
- Google OAuth

### Create Storage buckets:
- products
- gallery
- workshops

### Create basic tables (NO relations yet):
- profiles
- products
- orders
- order_items

📌 **No Prisma**  
📌 **No API**  
📌 **No frontend integration**  

This step defines truth, not code.

---

## 🟢 PHASE 2 — AUTH + PROFILES (SUPABASE FIRST)

### Dashboard work
**profiles table:**
- id (uuid, references auth.users)
- role (text)
- name
- created_at

### Enable RLS
- Policy: user can read their own profile

### Code work (minimal, hand-written)
- Supabase client setup
- Sign in / sign up
- Auto-create profile on signup

📌 **Copilot allowed ONLY for boilerplate**  
📌 **You review every line**

---

## 🟢 PHASE 3 — BACKEND APIs (NO PRISMA YET)

### You implement:
- `/api/orders`
- `/api/products`
- `/api/workshops`

### Rules:
- All logic runs on server
- Supabase client uses anon key
- Permissions enforced by RLS

📌 **You now have a real backend**

**At this point:** Your site is a legitimate full-stack product.

---

## 🟢 PHASE 4 — ROLES & PERMISSIONS (CRITICAL)

### Dashboard:
**Add RLS policies:**
- staff → update order status
- admin → manage content
- superadmin → price & analytics

### Code:
- Role-based route protection
- Staff dashboard UI

📌 **No Prisma**  
📌 **No AI**  
📌 **No payments**

---

## 🟢 PHASE 5 — PRISMA (ONLY NOW)

### When to introduce Prisma:
- ✔️ DB schema is stable
- ✔️ You understand tables
- ✔️ You want type-safe queries

### How:
- Prisma reads existing DB
- `prisma db pull`
- Use Prisma ONLY in server routes

📌 **Prisma does NOT replace Supabase**  
📌 **Supabase still handles auth & RLS**

---

## 🟢 PHASE 6 — STORAGE + MEDIA PIPELINES
- Upload images to Supabase Storage
- Signed URLs
- Admin-only uploads

---

## 🟢 PHASE 7 — FUTURE (NOT NOW)
- AI assistant
- Analytics
- Payments
- Multi-branch cafes

**Your foundation will already support this.**