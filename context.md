# Rabuste Coffee - Complete Context Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Business Model & Vision](#business-model--vision)
3. [Technical Architecture](#technical-architecture)
4. [Database Schema](#database-schema)
5. [Feature Documentation](#feature-documentation)
6. [API Routes](#api-routes)
7. [Development Workflow](#development-workflow)
8. [Deployment & Production](#deployment--production)

---

## Project Overview

**Rabuste Coffee** is a full-stack, production-ready web application for a premium coffee brand and cultural hub. It combines e-commerce, content management, community engagement, and administrative capabilities into a single cohesive platform.

### Core Purpose
- **E-commerce Platform**: Online coffee ordering with real-time inventory, cart management, and integrated payment processing
- **Cultural Hub**: Art gallery marketplace and workshop/event management system
- **Customer Engagement**: Gamified coupon system, user profiles, order history, and franchise inquiries
- **Administrative Control**: Complete admin dashboard for managing menu, orders, workshops, gallery, customers, and analytics

### Tech Stack Summary
- **Framework**: Next.js 16.1.0 (App Router, React 19.2.3, TypeScript 5.9.3)
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password, Google OAuth ready
- **Payments**: Razorpay integration for orders and workshops
- **Styling**: Tailwind CSS 4.0 with custom design system
- **Animations**: Framer Motion + GSAP for rich interactions
- **3D Effects**: Three.js + React Three Fiber for visual effects
- **AI**: Google Gemini API for admin analytics and chatbot assistance
- **PDF Generation**: jsPDF for receipts and invoices
- **Deployment**: Vercel-ready with environment configuration

---

## Business Model & Vision

### What Rabuste Coffee Is
**Rabuste Coffee** is a **premium Robusta coffee brand** that positions itself as more than just a cafe - it's a cultural destination combining:
1. **Specialty Coffee** - Focus on premium Robusta beans (not Arabica)
2. **Art Gallery** - Curated local art for sale and display
3. **Educational Workshops** - Coffee brewing, latte art, art classes
4. **Franchise Opportunities** - Expansion model for investors
5. **Community Building** - Events, reviews, notifications, reward system

### Revenue Streams
1. **Coffee Sales** (primary) - Menu items with variations (sizes, customizations)
2. **Art Sales** (secondary) - Commission-based art marketplace  
3. **Workshop Fees** - Paid events and classes
4. **Franchise Fees** - Investment inquiries and licensing

### Customer Journey
1. **Discovery** → Lands on homepage, learns about Robusta coffee
2. **Browse** → Explores menu, gallery, workshops
3. **Account Creation** → Signs up for ordering/booking
4. **Purchase** → Orders coffee, books workshop, or buys art
5. **Engagement** → Earns coupons, receives notifications, leaves reviews
6. **Retention** → Progressive coupons, membership tiers, personalized offers

### Competitive Differentiation
- **Robusta Focus**: Unlike most cafes that focus on Arabica, Rabuste champions Robusta beans
- **Multi-Experience**: Coffee + Art + Events under one brand
- **Technology-First**: Modern web experience with AI-powered analytics
- **Gamification**: Coupon progression system encourages larger orders

---

## Technical Architecture

### Framework: Next.js 16.1.0 (App Router)

#### Directory Structure
```
src/
├── app/                          # Next.js App Router pages
│   ├── (pages)/
│   │   ├── page.tsx              # Homepage
│   │   ├── menu/page.tsx         # Coffee menu & cart
│   │   ├── gallery/page.tsx      # Art gallery
│   │   ├── workshops/page.tsx    # Workshop listings
│   │   ├── profile/page.tsx      # User profile dashboard
│   │   └── about-us/page.tsx     # Brand story
│   │
│   ├── admin/                    # Admin panel (role-protected)
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── menu/page.tsx         # Menu management
│   │   ├── orders/page.tsx       # Orders management
│   │   ├── workshops/page.tsx    # Workshop management
│   │   ├── gallery/page.tsx      # Art management
│   │   ├── customers/page.tsx    # Customer management
│   │   ├── coupons/page.tsx      # Coupon system config
│   │   ├── reviews/page.tsx      # Review moderation
│   │   ├── notifications/page.tsx # Notification broadcast
│   │   └── ai-analytics/page.tsx # AI-powered query system
│   │
│   └── api/                      # Backend API routes
│       ├── auth/                 # Authentication endpoints
│       ├── menu/                 # Menu CRUD operations
│       ├── create-order/         # Order creation + Razorpay
│       ├── verify-payment/       # Payment verification
│       ├── coupons/              # Coupon logic & validation
│       ├── workshops/            # Workshop booking & payments
│       ├── gallery/              # Art purchases
│       ├── profile/              # User data management
│       ├── reviews/              # Review submission
│       ├── ratings/              # Product ratings
│       ├── admin/                # Admin operations
│       └── ai/                   # Gemini AI integration
│
├── components/                   # React components
│   ├── navbar/                   # Navigation (desktop/mobile)
│   ├── hero/                     # Homepage hero section
│   ├── sections/                 # Page sections (About, Reviews, etc.)
│   ├── menu/                     # Menu components (card, detail, deals)
│   ├── cart/                     # Shopping cart drawer
│   ├── profile/                  # Profile dashboard components
│   ├── auth/                     # Login/signup modals
│   ├── admin/                    # Admin panel components
│   ├── animations/               # Custom animations (3D, scroll)
│   └── ui/                       # Reusable UI primitives
│
├── hooks/                        # Custom React hooks
│   ├── useCart.tsx               # Cart state management
│   ├── useAuth.tsx               # Authentication state
│   ├── useMenu.tsx               # Menu data fetching
│   ├── useRole.tsx               # Role-based access control
│   └── useNotifications.tsx      # Notification state
│
├── lib/                          # Utilities & configuration
│   ├── supabase/                 # Supabase client setup
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server-side client
│   │   └── middleware.ts         # Auth middleware
│   ├── ai/                       # AI integration
│   │   ├── gemini.ts             # Gemini API client
│   │   └── schema-context.ts    # Database schema for AI
│   └── utils.ts                  # Helper functions
│
└── types/                        # TypeScript type definitions
    ├── menu.ts                   # Menu, cart, order types
    ├── coupons.ts                # Coupon system types
    ├── orders.ts                 # Order processing types
    ├── workshops.ts              # Workshop types
    └── admin.ts                  # Admin panel types
```

### Design System

#### Typography
- **Display Font**: Playfair Display (serif, headings)
- **Body Font**: Cormorant Garamond (serif, content)
- **UI Font**: Inter (sans-serif, buttons, labels)

#### Color Palette
```css
/* Primary Browns */
--brown-primary: #8B6F47;
--brown-dark: #6d5638;
--brown-darker: #5d4e37;

/* Neutrals */
--cream: #D8CBB8;
--stone-light: #F9F5F1;
--stone: #78716c;
--black: #262626;

/* Accents */
--green: #22c55e (success, coupons)
--orange: #f97316 (coupon progress)
--red: #ef4444 (errors)
--purple: #a855f7 (next-order coupons)
```

#### Visual Effects
- **Glass Morphism**: Navbar, modals (`backdrop-blur-sm`)
- **Grain Texture**: Overlay on images using CSS pseudo-elements
- **Hover Distortion**: Three.js liquid effect on gallery images
- **Scroll Animations**: Framer Motion `whileInView` animations
- **Progress Bars**: Animated SVG/CSS for coupon milestones

---

## Database Schema

### Core Tables (Supabase PostgreSQL)

#### 1. **profiles** (User Data)
```sql
id: uuid (references auth.users)
full_name: text
email: text
avatar_url: text
phone: text
created_at: timestamp
role: text (user, admin, superadmin)
member_tier: text (bronze, silver, gold, platinum)
```
- **RLS**: Users can read/update own profile; admins read all
- **Triggers**: Auto-created on user signup via `auth.users` trigger

#### 2. **menu_items** (Coffee Products)
```sql
id: uuid
name: text
description: text
image: text (Supabase storage URL)
category: text (Hot Beverage, Cold Beverage, Pastries, etc.)
base_price: numeric
variations: jsonb (sizes, prices, customizations)
ratings_count: integer
average_rating: numeric
is_available: boolean
is_featured: boolean
created_at: timestamp
```
- **RLS**: Public read; admin write
- **Variations Example**: `[{"name":"Small","price":120},{"name":"Large","price":180}]`

#### 3. **orders** (Order Management)
```sql
id: uuid
user_id: uuid (fk to profiles)
order_number: text (auto-generated, e.g. ORD-20260117-0001)
order_type: text (dine-in, takeaway-now, takeaway-scheduled)
scheduled_time: text
subtotal: numeric
tax: numeric
total: numeric
customer_name: text
customer_email: text
notes: text
status: text (pending, confirmed, preparing, ready, completed, cancelled)
payment_status: text (pending, paid, failed)
razorpay_order_id: text
created_at: timestamp
```
- **Functions**: `generate_order_number()` creates sequential IDs
- **RLS**: Users see own orders; admins see all

#### 4. **order_items** (Line Items)
```sql
id: uuid
order_id: uuid (fk to orders)
menu_item_id: text
menu_item_name: text
menu_item_image: text
variation_name: text
unit_price: numeric
quantity: integer
subtotal: numeric
rating: integer (1-5, nullable)
created_at: timestamp
```
- **Purpose**: Tracks individual items in each order with rating capability

#### 5. **coupons** (Admin-Defined Coupons)
```sql
id: uuid
name: text
description: text
type: text (cart_value, menu_limited, next_order)
discount_amount: numeric
min_cart_value: numeric
applicable_categories: jsonb
applicable_items: jsonb
excluded_items: jsonb
is_active: boolean
created_at: timestamp
```
- **Types**:
  - `cart_value`: Unlocks at cart thresholds (₹100, ₹300, ₹500)
  - `menu_limited`: Category/item-specific discounts
  - `next_order`: Earned after completing an order

#### 6. **user_coupons** (User-Earned Coupons)
```sql
id: uuid
user_id: uuid
discount_amount: numeric
min_order_value: numeric
is_used: boolean
earned_from_order_id: uuid
used_in_order_id: uuid
expires_at: timestamp
created_at: timestamp
```
- **Purpose**: Tracks next-order coupons earned by users

#### 7. **coupon_config** (System Configuration)
```sql
id: uuid (single row)
system_enabled: boolean
next_order_discount: numeric (default ₹40)
next_order_min_earn: numeric (min order value to earn, e.g. ₹300)
next_order_expiry_days: integer (default 30)
min_payable_amount: numeric (minimum after discount, e.g. ₹50)
```

#### 8. **workshops** (Events & Classes)
```sql
id: uuid
title: text
subtitle: text
description: text
date: timestamp
time: text
duration: text
host: text
location: text
max_participants: integer
enrolled_count: integer
price: numeric
requirements: text
what_you_learn: text
images: text[] (array of Supabase storage URLs)
status: text (upcoming, ongoing, completed, cancelled)
created_at: timestamp
```

#### 9. **workshop_registrations** (Bookings)
```sql
id: uuid
workshop_id: uuid
user_id: uuid
booking_number: text
customer_name: text
customer_email: text
payment_status: text (pending, paid, failed)
razorpay_order_id: text
razorpay_payment_id: text
created_at: timestamp
```

#### 10. **artists** (Gallery Artists)
```sql
id: uuid
name: text
bio: text
specialty: text
profile_image: text
created_at: timestamp
```

#### 11. **art_pieces** (Gallery Items)
```sql
id: uuid
artist_id: uuid
title: text
description: text
image_url: text
price: numeric
dimensions: text
medium: text
year: text
is_sold: boolean
is_visible: boolean
created_at: timestamp
```

#### 12. **art_purchases** (Gallery Sales)
```sql
id: uuid
booking_number: text (auto-generated)
user_id: uuid
art_piece_id: uuid
purchased_at: timestamp
```

#### 13. **notifications** (User Notifications)
```sql
id: uuid
user_id: uuid
title: text
message: text
type: text (order, workshop, system, promotion)
is_read: boolean
created_at: timestamp
```
- **Triggers**: Auto-created on order placement, workshop booking

#### 14. **admin_activity_log** (Audit Trail)
```sql
id: uuid
admin_id: uuid
action: text
target_table: text
target_id: uuid
details: jsonb
created_at: timestamp
```

---

## Feature Documentation

### 1. Menu & Cart System

#### Menu Display
- **Data Source**: `menu_items` table fetched via `/api/menu`
- **Categories**: Dynamic filtering (Hot Beverage, Cold Beverage, Pastries, Specials)
- **Product Cards**: Image (3:4 ratio), name, rating stars, price, quick add button
- **Featured Items**: "Deal of the Day" section with countdown timer

#### Product Detail Modal
- Modal overlay with full product info
- Variation selector (sizes with different prices)
- Quantity controls
- "Add to Cart" with selected variation
- Related products carousel

#### Shopping Cart (`useCart` hook)
- **LocalStorage Persistence**: Cart survives page reloads
- **State Management**: Items array with menu item + variation + quantity
- **Operations**:
  - `addItem(item, quantity, variation)` - Add/update cart
  - `updateQuantity(index, newQty)` - Modify quantities
  - `removeItem(index)` - Delete item
  - `clearCart()` - Empty cart after order
- **Calculations**: Real-time subtotal, tax, total
- **Cart UI**: Right-side sliding drawer with item list, totals, and checkout button

#### Order Flow
1. User clicks "Pay Now" in cart
2. Frontend calculates discount from available coupons
3. POST to `/api/create-order` with items, totals, order type
4. Backend creates order in database + Razorpay order
5. Razorpay SDK modal opens for payment
6. On success: Verify payment via `/api/verify-payment`
7. Generate PDF receipt, show success screen, clear cart
8. Award next-order coupon if eligible

### 2. Coupon System

#### Three Coupon Types

**A. Cart Value Coupons** (Progressive Milestones)
- Unlocked automatically at cart value thresholds
- Example: ₹20 off at ₹100, ₹50 off at ₹300, ₹100 off at ₹500
- Display logic: Show **best unlocked** + **next milestone** simultaneously
- UI: Green card for unlocked (checkmark), orange card for next (progress bar)

**B. Menu-Limited Coupons** (Admin-Targeted)
- Applied to specific categories or items
- Example: "₹30 off all pastries"
- Checked against cart items via `applicable_categories` / `applicable_items`

**C. Next-Order Coupons** (Rewards)
- Earned after completing an order above threshold (e.g. ₹300+)
- Stored in `user_coupons` table with expiry date
- Single-use, applied automatically on next order
- Notification popup after payment with animated gift icon

#### Coupon Application Logic
1. Fetch available coupons via `/api/coupons/available`
2. Filter for applicable coupons (cart value, items, next-order)
3. Select **best discount** (highest value)
4. Apply to order total before Razorpay creation
5. Store coupon usage in database on payment success

#### Admin Coupon Management (`/admin/coupons`)
- Create/edit/delete coupons
- Configure thresholds, discount amounts, categories
- Enable/disable coupon system globally
- Set next-order coupon parameters (amount, min spend, expiry)

### 3. Workshop System

#### Workshop Lifecycle
1. **Admin Creation**: `/admin/workshops` - Add workshop with details, images, capacity
2. **Public Discovery**: `/workshops` - Browse upcoming workshops
3. **Registration**: User clicks "Register", modal with payment
4. **Payment**: Razorpay integration similar to orders
5. **Confirmation**: Notification sent, spots decremented
6. **Attendance**: Admin marks participants, enables reviews
7. **Reviews**: Users leave ratings/feedback post-workshop

#### Workshop Payments
- **Flow**: Register → POST `/api/workshops/[id]/register` → Razorpay order → Payment → Verify
- **Database**: `workshop_registrations` table with `razorpay_order_id`, `payment_status`
- **Spot Management**: Auto-decrement `enrolled_count` on successful payment
- **Status Sync**: Workshop auto-marked "completed" when date passes

#### Workshop Images
- Uploaded to Supabase Storage (`workshop-images` bucket)
- Multiple images per workshop (array field)
- Admin can upload/delete via interface

### 4. Art Gallery

#### Gallery Display
- Masonry grid layout with Three.js hover distortion effect
- Each piece shows: Image, title, artist, price
- "Sold" overlay for purchased pieces

#### Art Purchase Flow
1. User adds art to cart (gallery items mixed with menu in cart)
2. Cart filters by type: `gallery` vs `menu`
3. Checkout: POST `/api/gallery/purchase` with `artPieceIds` array
4. Backend creates `art_purchases` records
5. Sets `is_sold = true` on art pieces
6. Sends booking confirmation notification

#### Artist Management
- Admin can add/edit artists via `/admin/gallery`
- Artists linked to art pieces via `artist_id`
- Artist pages show bio, profile image, all artworks

### 5. User Profile

#### Profile Dashboard (Desktop)
- **Two-Column Layout**: Fixed sidebar + scrolling content
- **Sidebar**:
  - Profile card (avatar, name, member tier)
  - Navigation menu (Orders, Workshops, Art, Stats)
  - Tier progress indicator (Gold → Platinum)
  - Edit Profile button
- **Content Tabs**:
  - **Orders**: Expandable order history with reorder, download bill, rate items
  - **Workshops**: Attended workshops with review option
  - **Art**: Purchased art pieces gallery
  - **Stats**: Charts and analytics (future)

#### Profile Editing
- Modal popup with:
  - Avatar upload (Supabase Storage)
  - Display name edit
  - Password change (optional)
  - Email (readonly)
- Updates `profiles` table via `/api/profile/update`

#### Order History
- First 2 orders visible by default, gradient fade on second
- "View all X orders" button expands
- Each order card shows:
  - Order number, date, status
  - Item list with quantities, prices
  - Total amount
  - Actions: Download PDF bill, Reorder (copies to cart)
- Item ratings: Click stars to rate, saves to `order_items.rating`

### 6. Authentication & Authorization

#### Supabase Auth Flow
1. **Signup**: Email + password → `auth.users` → Trigger creates `profiles` row
2. **Login**: Supabase session cookie set, client-side auth state
3. **Session Management**: Middleware checks auth on server requests
4. **Logout**: Clear session, redirect to homepage

#### Role-Based Access Control (RBAC)
- **Roles**: `user`, `admin`, `superadmin`
- **Middleware**: `/admin/*` routes check `profiles.role`
- **RLS Policies**: Database-level security enforcing user/admin separation
- **Admin Panel**: Locked behind role check + custom layout

#### Admin Capabilities
- **Superadmin**: Full access, can manage admins
- **Admin**: Manage menu, orders, workshops, gallery, customers
- **User**: Browse, order, book, purchase

### 7. Notification System

#### Notification Types
- **Order**: "Order #ORD-123 placed successfully"
- **Workshop**: "Registration confirmed for [Workshop Title]"
- **System**: "Welcome to Rabuste Coffee!"
- **Promotion**: Admin broadcasts (e.g. "New menu items added!")

#### Delivery Mechanisms
- **In-App**: Bell icon in navbar with unread count badge
- **Dropdown**: List of notifications with timestamps
- **Actions**: Mark as read, mark all read
- **Triggers**: Auto-created via database triggers on orders, workshops

#### Admin Broadcast
- `/admin/notifications` - Compose message, select recipients (all/tier-based/individual)
- Bulk inserts into `notifications` table

### 8. AI Analytics (Admin)

#### Gemini Integration
- **Purpose**: Natural language database queries
- **Endpoint**: `/api/ai/analytics`
- **Flow**:
  1. Admin types question: "Show top 5 selling products this month"
  2. Backend sends question + database schema to Gemini
  3. Gemini generates SQL query
  4. Query executed (read-only) against database
  5. Results formatted and returned
- **Safety**: Validates queries, prevents writes/drops
- **Schema Context**: `lib/ai/schema-context.ts` provides table definitions

#### AI Chatbot (Customer)
- **Endpoint**: `/api/ai/chat`
- **Purpose**: Answer product questions, recommend items
- **Context**: Menu data, brand info fed to Gemini
- **UI**: Chat widget in corner (future feature)

### 9. Payment Processing (Razorpay)

#### Order Payment Flow
```typescript
1. Frontend: Create order via /api/create-order
   - Input: items, totals, orderType, scheduledTime
   - Output: razorpayOrderId, amount, currency, dbOrderId

2. Frontend: Open Razorpay modal
   - Load Razorpay SDK
   - Configure: key, amount, order_id, handler

3. User: Complete payment in Razorpay modal

4. Frontend: On success, verify via /api/verify-payment
   - Input: razorpay_order_id, razorpay_payment_id, razorpay_signature
   - Backend: HMAC signature verification
   - Update: orders.payment_status = 'paid', order_items saved

5. Frontend: Show success, generate PDF receipt, clear cart
```

#### Razorpay Configuration
- **Keys**: `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- **Amount**: Sent in paise (multiply by 100)
- **Receipt ID**: Database order UUID
- **Signature Verification**: `crypto.createHmac('sha256', secret)`

#### Workshop Payment
- Similar flow but via `/api/workshops/[id]/register`
- Registration record created first, payment attached after

### 10. Admin Dashboard

#### Dashboard Overview (`/admin`)
- **Stats Cards**: Total orders, revenue, customers, workshops
- **Recent Activity**: Latest orders, registrations, purchases
- **Quick Actions**: Add product, create workshop, send notification

#### Menu Management (`/admin/menu`)
- **CRUD Operations**: Create, read, update, delete menu items
- **Image Upload**: Supabase Storage integration
- **Variations**: JSON editor for sizes/prices
- **Availability Toggle**: Mark items in/out of stock

#### Order Management (`/admin/orders`)
- **Order List**: Searchable, sortable, filterable (status, date)
- **Order Detail**: Expand to see items, customer, payment info
- **Status Updates**: Dropdown to change status (confirmed → preparing → ready → completed)
- **Activity Log**: Track status changes

#### Customer Management (`/admin/customers`)
- **User List**: All profiles with stats (orders, spend, join date)
- **User Detail**: Full order history, workshops, art purchases
- **Role Assignment**: Promote to admin
- **Manual Coupon Award**: Give user next-order coupon

---

## API Routes

### Public Endpoints

| Route | Method | Purpose | Input | Output |
|-------|--------|---------|-------|--------|
| `/api/menu` | GET | Fetch all menu items | - | Array of menu items |
| `/api/menu/[id]` | GET | Get single item | id | Menu item object |
| `/api/coupons/available` | POST | Get applicable coupons | cart_total, items | cart_coupons, menu_coupons, my_coupon |
| `/api/create-order` | POST | Create order + Razorpay | orderType, items, total | razorpayOrderId, orderNumber |
| `/api/verify-payment` | POST | Verify Razorpay payment | razorpay_* signatures | success: true/false |
| `/api/workshops` | GET | List workshops | - | Array of workshops |
| `/api/workshops/[id]/register` | POST | Register for workshop | workshopId, userInfo | razorpayOrderId, bookingNumber |
| `/api/gallery` | GET | List art pieces | - | Array of art pieces with artists |
| `/api/gallery/purchase` | POST | Purchase art | artPieceIds | bookingNumber, purchases |
| `/api/reviews` | POST | Submit review | workshopId, rating, comment | success |
| `/api/ratings` | POST | Rate product | orderItemId, rating | success |
| `/api/auth/signup` | POST | Create account | email, password, name | user |
| `/api/auth/login` | POST | Login | email, password | session |
| `/api/ai/chat` | POST | Ask chatbot | question | answer |

### Protected Endpoints (Require Auth)

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/profile` | GET | Get user profile | User |
| `/api/profile/update` | PATCH | Update profile | User |
| `/api/profile/orders` | GET | Get user orders | User |
| `/api/profile/workshops` | GET | Get user workshops | User |
| `/api/profile/art` | GET | Get user art purchases | User |

### Admin Endpoints (Require Admin Role)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/menu` | POST/PUT/DELETE | Manage menu items |
| `/api/admin/orders` | GET/PATCH | View/update orders |
| `/api/admin/workshops` | POST/PUT/DELETE | Manage workshops |
| `/api/admin/gallery` | POST/PUT/DELETE | Manage art & artists |
| `/api/admin/customers` | GET/PATCH | Manage users |
| `/api/admin/coupons` | GET/POST/PUT/DELETE | Manage coupons |
| `/api/admin/notifications` | POST | Send notifications |
| `/api/admin/ai-analytics` | POST | Execute AI queries |

---

## Development Workflow

### Environment Setup

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd rabuste-coffee
   npm install
   ```

2. **Environment Variables** (`.env.local`)
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Razorpay
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
   RAZORPAY_KEY_SECRET=your-secret

   # Google Gemini
   GEMINI_API_KEY=your-gemini-key

   # Google reCAPTCHA
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
   RECAPTCHA_SECRET_KEY=your-secret-key
   ```

3. **Database Setup**
   ```bash
   # Run SQL migrations in order
   sql/00-create-tables.sql
   sql/01-setup-rls.sql
   sql/02-setup-admin.sql
   ...
   sql/70-coupon-system.sql
   ```

4. **Run Dev Server**
   ```bash
   npm run dev
   # Opens at http://localhost:3000
   ```

### Development Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm start            # Run production build
npm run lint         # ESLint
npm run type-check   # TypeScript validation
```

### Database Migrations

- **Location**: `sql/` directory (88 migration files)
- **Naming**: Sequential `00-`, `01-`, etc.
- **Execution**: Manual via Supabase SQL editor (order matters!)
- **Key Migrations**:
  - `00-create-tables.sql`: Core schema
  - `01-setup-rls.sql`: Row-level security
  - `15-populate-menu-items.sql`: Seed menu data
  - `70-coupon-system.sql`: Coupon tables & logic

### Adding a New Feature

1. **Define Types** in `src/types/`
2. **Create API Route** in `src/app/api/`
3. **Build Component** in `src/components/`
4. **Add Page** in `src/app/`
5. **Update Database** if needed (new SQL migration)
6. **Test End-to-End** with real data

---

## Deployment & Production

### Vercel Deployment

1. **Connect GitHub Repo** to Vercel
2. **Set Environment Variables** in Vercel dashboard
3. **Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Deploy**: Auto-deploy on push to `main`

### Production Checklist

- [ ] Environment variables set (Supabase, Razorpay, Gemini)
- [ ] Database migrations run
- [ ] Admin accounts created
- [ ] RLS policies active
- [ ] Storage buckets configured (public access)
- [ ] Domain configured (custom domain)
- [ ] SSL certificate active
- [ ] Error tracking enabled (Sentry/LogRocket)
- [ ] Analytics configured (Google Analytics)

### Supabase Production Setup

1. **Create Project**: dashboard.supabase.com
2. **Run all SQL migrations** in SQL editor
3. **Configure Storage**:
   - Bucket: `menu-images` (public)
   - Bucket: `workshop-images` (public)
   - Bucket: `art-images` (public)
   - Bucket: `profile-avatars` (public)
4. **Set RLS Policies**: Already in migrations
5. **Create Admin User**: Run `sql/26-set-superadmin-role.sql`
6. **Enable Email Auth**: Settings → Authentication

### Performance Optimizations

- **Image Optimization**: Next.js Image component with blur placeholders
- **Code Splitting**: Dynamic imports for heavy components (Three.js)
- **Caching**: Supabase queries cached via React Query (future)
- **Lazy Loading**: Components load on scroll (`framer-motion` `whileInView`)
- **Asset Compression**: WebP images, optimized videos

---

## Key Technical Decisions

### Why Supabase?
- **Pros**: PostgreSQL, real-time, auth, storage, RLS in one platform
- **Cons**: Vendor lock-in (mitigated by standard PostgreSQL)
- **Alternative**: Firebase (rejected for NoSQL limitations), self-hosted (rejected for complexity)

### Why Next.js App Router?
- **Pros**: Server components, streaming, built-in API routes
- **Migration**: Migrated from Pages Router for better performance
- **Learning Curve**: Handled complexity with proper separation of concerns

### Why Razorpay?
- **India-first**: Designed for Indian market (INR, UPI, cards)
- **Integration**: Well-documented SDK, strong TypeScript support
- **Alternatives**: Stripe (US-focused), PayU (less modern API)

### Why Tailwind CSS?
- **Speed**: Rapid prototyping with utility classes
- **Design System**: Easy to enforce consistency
- **Bundle Size**: PurgeCSS removes unused styles

### Why Framer Motion?
- **Declarative**: Animations as props, easy to maintain
- **Performance**: GPU-accelerated, optimized for React
- **Flexibility**: Spring physics, gestures, layout animations

### Why Gemini API?
- **Cost**: More affordable than GPT-4
- **Multimodal**: Future image analysis potential
- **Context Window**: Large enough for database schema

---

## Common Development Patterns

### 1. Protected Route Pattern
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient(request);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user && request.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

### 2. API Route Pattern
```typescript
// app/api/example/route.ts
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    // ... business logic
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 3. Data Fetching Pattern (Server Component)
```typescript
// app/menu/page.tsx
export default async function MenuPage() {
  const supabase = await createClient();
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true);
  
  return <MenuSection items={menuItems} />;
}
```

### 4. Client State Pattern (Hook)
```typescript
// hooks/useCart.tsx
export function useCart() {
  const [cart, setCart] = useState<CartState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : { items: [], total: 0 };
    }
    return { items: [], total: 0 };
  });
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  return { cart, addItem, removeItem, updateQuantity };
}
```

---

## Vision & Future Roadmap

### Short-Term Goals (Next 3 Months)
- [ ] Mobile app (React Native)
- [ ] Real-time order tracking
- [ ] Loyalty tier benefits (free coffee at milestones)
- [ ] Push notifications
- [ ] Email notifications (SendGrid)

### Mid-Term Goals (3-6 Months)
- [ ] Live chat support
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Multi-location support
- [ ] Franchise portal

### Long-Term Vision (6-12 Months)
- [ ] Subscription model (monthly coffee plan)
- [ ] White-label platform for other cafes
- [ ] Community features (forums, user-generated content)
- [ ] AR try-before-you-buy for art
- [ ] Blockchain-based art provenance

---

## Business Metrics to Track

### E-commerce KPIs
- **Conversion Rate**: Visitors → Orders
- **Average Order Value (AOV)**: Total revenue / Orders
- **Cart Abandonment Rate**: Abandoned carts / Total carts
- **Repeat Purchase Rate**: Customers with >1 order

### Engagement KPIs
- **Workshop Attendance Rate**: Registered / Capacity
- **Coupon Redemption Rate**: Used coupons / Earned coupons
- **Review Submission Rate**: Reviews / Completed orders
- **Notification Open Rate**: Read / Sent

### Growth KPIs
- **Monthly Active Users (MAU)**: Unique logged-in users
- **Customer Acquisition Cost (CAC)**: Marketing spend / New customers
- **Customer Lifetime Value (CLV)**: Avg revenue per customer
- **Churn Rate**: Inactive users / Total users

---

## Conclusion

Rabuste Coffee is a **production-ready, full-stack web application** that seamlessly blends e-commerce, content, community, and culture. Built with modern technologies (Next.js, Supabase, TypeScript), it offers a **premium user experience** with advanced features like AI analytics, gamified coupons, and integrated payments.

The codebase is **well-architected** with clear separation of concerns, type safety, and scalability in mind. The **comprehensive admin panel** enables non-technical staff to manage the entire platform, while the **customer-facing experience** is optimized for conversions and retention.

This documentation provides **complete context** for any developer or LLM to understand, maintain, and extend the platform confidently.

---

**Last Updated**: January 17, 2026  
**Version**: 1.0.0  
**Maintainer**: Rabuste Development Team
