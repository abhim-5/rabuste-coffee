# ☕ Rabuste Coffee  
### Production-Ready Full-Stack Platform for a Real Café Business

Rabuste Coffee is a full-stack web platform built for a real operating café in Surat, Gujarat.

The goal was to create a direct-to-consumer digital ecosystem so the café could manage orders, workshops, art sales, loyalty rewards, and analytics — without relying entirely on aggregator platforms.

This was our first complete full-stack project with deployment, and it involved backend architecture, database design, authentication, payments, and production hosting.

---

## 🚀 Live Links

- **Live Project:** https://rabustecoffee.vercel.app
- **Technical Walkthrough + Full Demo Video:** https://drive.google.com/drive/folders/1d2K29VyAxStL4fIeEitAEzrANv9j-blg

---

## 👥 Team

Built by:

- Aryan (Leader) 
- Abhimanyu  
- Shrutika  
- Sneha  

This was our first end-to-end full-stack build together — from database schema to production deployment.

---

## 🏗️ System Overview

Rabuste Coffee is not just a website — it is a multi-module platform with:

- Online food ordering  
- Payment integration (Razorpay)  
- QR-based order verification  
- Workshop booking system  
- Art gallery commerce  
- Points & rewards engine  
- Coupon system  
- Role-based admin dashboard  
- AI-powered business analytics  

---

## 🧠 Architecture

### Frontend

- Next.js 16 (App Router)  
- React 19  
- TypeScript  
- Tailwind CSS  
- Framer Motion  
- Three.js (interactive gallery effects)  

### Backend

- Next.js API Routes  
- Supabase (PostgreSQL)  
- Prisma ORM  
- Supabase Auth (JWT-based)  

### Payments

- Razorpay integration  
- Server-side signature verification  
- Secure payment confirmation endpoint  

### Deployment

- Vercel (Frontend + API)  
- Supabase hosted database  

---

## 🗄️ Database Design

The system uses a relational PostgreSQL schema with 22+ tables, including:

- Users & profiles  
- Products & categories  
- Orders & order_items  
- Workshops & registrations  
- Art gallery & purchases  
- Points transactions  
- Coupons & usage tracking  
- Admin activity logs  

### Key Design Decisions

- UUID-based primary keys  
- JSONB fields for flexible product variations  
- Role-based access control  
- Indexed verification tokens for QR validation  
- Separate points transaction tracking to prevent double-spend  

---

## ✨ Core Features

### 1️⃣ Online Ordering

- Category-based menu browsing  
- Product variations (size/add-ons)  
- Cart drawer with live calculations  
- Razorpay payment integration  
- Server-side payment verification  
- QR code generation after order  

### 2️⃣ QR-Based Order Verification

- Unique verification token per order  
- QR generated post-payment  
- Staff scanner panel to validate orders  
- Expiry-based fraud prevention  

### 3️⃣ Points & Rewards System

- Earn points per order  
- Tier system (Gold → Platinum)  
- Redemption catalog  
- Transaction history  
- Admin-configurable rules  

### 4️⃣ Coupon Engine

- Cart-value coupons  
- Product-specific discounts  
- Next-order rewards  
- Stacking prevention logic  

### 5️⃣ Workshops Module

- Browse upcoming events  
- Register with booking ID  
- Capacity tracking  
- Review submission  

### 6️⃣ Art Gallery

- Masonry grid layout  
- Three.js hover distortion effects  
- Artist profiles  
- Purchase tracking  

### 7️⃣ Admin Dashboard

- Revenue charts  
- Order analytics  
- Top products  
- Customer management  
- Coupon management  
- AI analytics interface  

### 8️⃣ AI-Powered Business Analytics

- Natural language → SQL queries  
- Gemini API integration  
- SQL validation layer  
- PII-restricted fields  

---

## 🔐 Security & Access Control

- Supabase Auth (JWT-based)  
- Role-based middleware protection  
- Admin / Staff / Customer access levels  
- Google reCAPTCHA integration  
- Server-side payment signature validation  
- Restricted AI query fields (PII blocked)  

---

## 📂 Project Structure (Simplified)

src/
├── app/ # Pages + API routes
├── components/ # UI & feature modules
├── hooks/ # Custom hooks (useCart, useAuth)
├── lib/ # AI, search, utilities
├── data/ # Static & seed data
└── types/ # TypeScript definitions


---

## 📊 Project Metrics

- ~25,000+ lines of code  
- 200+ source files  
- 22+ database tables  
- 6–8 weeks development  
- Fully deployed production build  

---

## 📸 Demo Flow

Typical user flow:

1. Browse menu  
2. Add items to cart  
3. Apply coupon / redeem points  
4. Pay via Razorpay  
5. Receive QR code  
6. Staff scans QR in admin panel  

---

## 🛠️ Getting Started (Local Setup)

```bash
git clone https://github.com/abhim-5/rabuste-coffee
cd rabuste-coffee
npm install
npm run dev
```

## Environment Variables Required

- SUPABASE_URL
- SUPABASE_ANON_KEY
- RAZORPAY_KEY_ID
- RAZORPAY_SECRET
- GEMINI_API_KEY

## 📌 What We Learned

- Handling real payment gateways is very different from mock flows
- Schema design impacts everything
- Role-based middleware must be carefully structured
- Debugging production issues teaches more than tutorials
- Deployment configuration is as important as development
