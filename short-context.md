# Rabuste Coffee - Quick Context

**Premium Robusta coffee brand** with integrated e-commerce, art gallery, and workshop management system.

---

## Tech Stack

- **Framework**: Next.js 16.1.0 (App Router, React 19, TypeScript 5.9.3)
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Auth**: Supabase Auth (email/password, OAuth ready)
- **Payments**: Razorpay (orders, workshops)
- **Styling**: Tailwind CSS 4.0 + Framer Motion animations
- **3D**: Three.js for visual effects
- **AI**: Google Gemini (admin analytics, chatbot)
- **PDF**: jsPDF for receipts

---

## Key Features

### E-Commerce
- Menu browsing with categories (Hot/Cold Beverage, Pastries, Specials)
- Shopping cart with real-time totals
- Product variations (sizes, customizations)
- Progressive coupon system (₹20 @ ₹100, ₹50 @ ₹300, ₹100 @ ₹500)
- Next-order reward coupons
- Razorpay payment integration
- PDF receipt generation

### Workshop System
- Workshop listings with booking
- Razorpay payment for registrations
- Spot management (auto-decrement on payment)
- Post-workshop reviews
- Image galleries per workshop

### Art Gallery
- Artist profiles with bio/portfolio
- Art piece listings with Three.js hover effects
- Purchase flow with booking confirmation
- Mark pieces as sold

### User Features
- Profile dashboard (orders, workshops, art collection)
- Order history with reorder and PDF download
- Item ratings (1-5 stars)
- Notification system (order, workshop, promotions)
- Member tiers (Bronze → Silver → Gold → Platinum)

### Admin Panel
- Dashboard overview with stats
- Menu management (CRUD, image upload, variations)
- Order management (status updates, tracking)
- Workshop management (create, edit, image upload)
- Gallery management (artists, art pieces)
- Customer management (view profiles, assign roles)
- Coupon configuration (thresholds, discounts)
- Notification broadcast
- AI analytics (natural language SQL queries)

---

## Database Schema (25+ Tables)

**Core Tables**:
- `profiles` - User accounts (id, name, email, role, tier)
- `menu_items` - Products (name, price, category, variations)
- `orders` - Order records (user_id, total, status, payment_status)
- `order_items` - Line items with ratings
- `coupons` - Admin-defined coupons (cart_value, menu_limited, next_order)
- `user_coupons` - User-earned next-order coupons
- `workshops` - Events (title, date, price, spots)
- `workshop_registrations` - Bookings with payment info
- `artists` - Gallery artists
- `art_pieces` - Gallery items
- `art_purchases` - Sales records
- `notifications` - User notifications
- `admin_activity_log` - Audit trail

**Coupon Tables**:
- `coupon_config` - System configuration (next-order settings, min payable)

**Other**: `categories`, `product_ratings`, `cafe_reviews`, `newsletter_subscriptions`, `franchise_inquiries`, `workshop_requests`

---

## Directory Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── menu/                 # Coffee menu
│   ├── gallery/              # Art gallery
│   ├── workshops/            # Workshop listings
│   ├── profile/              # User dashboard
│   ├── about-us/             # Brand story
│   ├── admin/                # Admin panel
│   │   ├── menu/
│   │   ├── orders/
│   │   ├── workshops/
│   │   ├── gallery/
│   │   ├── customers/
│   │   ├── coupons/
│   │   └── ai-analytics/
│   └── api/                  # Backend routes
│       ├── menu/
│       ├── create-order/
│       ├── verify-payment/
│       ├── coupons/
│       ├── workshops/
│       ├── gallery/
│       ├── admin/
│       └── ai/
├── components/
│   ├── navbar/
│   ├── cart/
│   ├── menu/
│   ├── profile/
│   ├── admin/
│   └── ui/
├── hooks/
│   ├── useCart.tsx
│   ├── useAuth.tsx
│   └── useMenu.tsx
├── lib/
│   ├── supabase/
│   └── ai/
└── types/
```

---

## API Routes

**Public**:
- `GET /api/menu` - Fetch menu items
- `POST /api/coupons/available` - Get applicable coupons
- `POST /api/create-order` - Create order + Razorpay
- `POST /api/verify-payment` - Verify Razorpay signature
- `GET /api/workshops` - List workshops
- `POST /api/workshops/[id]/register` - Book workshop
- `GET /api/gallery` - List art pieces
- `POST /api/gallery/purchase` - Purchase art

**Protected** (Auth Required):
- `GET /api/profile` - User profile
- `GET /api/profile/orders` - Order history
- `POST /api/ratings` - Rate product

**Admin Only**:
- `/api/admin/menu` - Menu CRUD
- `/api/admin/orders` - Order management
- `/api/admin/workshops` - Workshop CRUD
- `/api/admin/coupons` - Coupon config
- `/api/admin/ai-analytics` - AI queries

---

## Development Setup

```bash
# Clone & Install
git clone <repo>
cd rabuste-coffee
npm install

# Environment (.env.local)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
GEMINI_API_KEY=...

# Run migrations (sql/*.sql in order)

# Start dev server
npm run dev  # http://localhost:3000
```

---

## Coupon System Logic

1. **Cart Value Coupons**: Auto-unlock at thresholds (₹100/₹300/₹500)
   - Display: Best unlocked (green) + Next milestone (orange with progress bar)
   
2. **Next-Order Coupons**: Earned after orders ≥ threshold (e.g. ₹300)
   - Single-use, expires in 30 days
   - Auto-applied on next order
   - Popup notification after payment

3. **Application**: Best discount selected, applied before Razorpay order creation

---

## Payment Flow

1. User clicks "Pay Now" → Calculate discount
2. POST `/api/create-order` → Create DB order + Razorpay order
3. Razorpay modal opens → User pays
4. On success → POST `/api/verify-payment` (HMAC signature check)
5. Update `payment_status = 'paid'`, generate PDF, clear cart
6. Award next-order coupon if eligible

---

## Key Business Metrics

- **Conversion Rate**: Visitors → Orders
- **Average Order Value (AOV)**: Revenue / Orders
- **Coupon Redemption Rate**: Used / Earned
- **Workshop Attendance**: Registered / Capacity
- **Repeat Purchase Rate**: Multi-order customers

---

## Production Deployment

**Vercel**:
1. Connect GitHub repo
2. Set environment variables
3. Auto-deploy on `main` branch push

**Supabase**:
1. Run all SQL migrations
2. Configure storage buckets (public)
3. Create admin user
4. Enable email auth

---

**Vision**: Premium Robusta coffee brand positioned as a cultural destination combining specialty coffee, curated art, educational workshops, and community engagement with technology-first approach (AI analytics, gamified coupons, modern web experience).

---

*Full details in `context.md` (600+ lines)*
