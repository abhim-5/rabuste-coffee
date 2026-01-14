// Database Schema Context for Gemini AI

export const DATABASE_SCHEMA = `
# RABUSTE COFFEE DATABASE SCHEMA

## Core Tables

### orders
- id (uuid, primary key)
- user_id (uuid, foreign key to profiles)
- order_number (text, unique)
- order_type (text: 'dine-in', 'takeaway-now', 'takeaway-scheduled')
- scheduled_time (varchar)
- subtotal (numeric)
- tax (numeric)
- total (numeric)
- status (text: 'pending', 'confirmed', 'ready', 'completed')
- payment_status (text: 'pending', 'paid', 'failed')
- customer_name (varchar)
- customer_email (varchar)
- notes (text)
- points_applied (integer)
- points_discount (numeric)
- original_total (numeric)
- created_at (timestamp)
- updated_at (timestamp)

### order_items
- id (uuid, primary key)
- order_id (uuid, foreign key to orders)
- menu_item_id (varchar)
- menu_item_name (varchar)
- menu_item_image (text)
- variation_name (varchar)
- unit_price (numeric)
- quantity (integer)
- subtotal (numeric)
- created_at (timestamp)

### products (menu items)
- id (uuid, primary key)
- name (text)
- description (text)
- price (numeric)
- category (text: 'robusta-cold', 'robusta-hot', 'blend-cold', 'blend-hot', 'manual-brew', 'shakes-tea', 'food')
- image_url (text)
- available (boolean)
- variations (jsonb)
- rating (numeric, 0-5)
- review_count (integer)
- original_price (numeric)
- is_featured (boolean)
- is_deal_of_day (boolean)
- deal_expiry (timestamp)
- sort_order (integer)
- created_at (timestamp)
- updated_at (timestamp)

### profiles
- id (uuid, primary key, foreign key to auth.users)
- full_name (text)
- role (text: 'customer', 'staff', 'admin', 'superadmin')
- age (integer)
- credits (numeric)
- is_banned (boolean)
- created_at (timestamp)
- updated_at (timestamp)
**NOTE: DO NOT query email, phone - PII restricted**

## Coupon & Rewards System

### coupons
- id (uuid, primary key)
- type (text: 'cart_value', 'menu_limited')
- name (text)
- description (text)
- discount_amount (numeric)
- min_cart_value (numeric, for cart_value type)
- applicable_categories (text array, for menu_limited)
- applicable_items (jsonb, for menu_limited)
- is_active (boolean)
- created_at (timestamp)

### user_coupons
- id (uuid, primary key)
- user_id (uuid, foreign key to profiles)
- discount_amount (numeric)
- min_order_value (numeric)
- earned_from_order_id (uuid, nullable)
- is_used (boolean)
- used_on_order_id (uuid, nullable)
- earned_at (timestamp)
- expires_at (timestamp)

### coupon_usage
- id (uuid, primary key)
- order_id (uuid, foreign key to orders)
- coupon_id (uuid, nullable, foreign key to coupons)
- user_coupon_id (uuid, nullable, foreign key to user_coupons)
- discount_applied (numeric)
- created_at (timestamp)

### coupon_config
- system_enabled (boolean)
- min_payable_amount (numeric)
- next_order_min_earn (numeric)
- next_order_discount (numeric)
- next_order_expiry_days (integer)

## Workshops

### workshops
- id (uuid, primary key)
- title (text)
- description (text)
- start_date (date)
- start_time (text)
- duration (text)
- price (numeric)
- max_spots (integer)
- available_spots (integer)
- instructor (text)
- level (text)
- available (boolean)
- is_upcoming (boolean)
- attendees (integer)
- created_at (timestamp)

### workshop_registrations
- id (uuid, primary key)
- workshop_id (uuid, foreign key)
- user_id (uuid, foreign key)
- booking_number (text, unique)
- name (text)
- status (text: 'pending', 'confirmed', 'cancelled', 'attended')
- payment_status (text: 'pending', 'paid', 'failed')
- amount_paid (numeric)
- created_at (timestamp)

### workshop_requests
- id (uuid, primary key)
- user_id (uuid)
- name (text)
- workshop_theme (text)
- additional_details (text)
- status (text: 'pending', 'approved', 'rejected', 'completed')
- created_at (timestamp)

### workshop_reviews
- id (uuid, primary key)
- workshop_id (uuid, foreign key)
- user_id (uuid, foreign key)
- rating (integer, 1-5)
- review_text (text)
- created_at (timestamp)

## Art Gallery

### art_pieces
- id (uuid, primary key)
- name (text)
- description (text)
- price (numeric)
- artist (text)
- artist_id (uuid, foreign key to artists)
- artist_pov (text)
- image_url (text)
- available (boolean)
- is_featured (boolean)
- sort_order (integer)
- created_at (timestamp)

### art_purchases
- id (uuid, primary key)
- art_piece_id (uuid, foreign key)
- user_id (uuid, foreign key)
- purchase_price (numeric)
- purchase_date (timestamp)
- status (text: 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
- created_at (timestamp)

### artists
- id (uuid, primary key)
- name (text, unique)
- description (text)
- created_at (timestamp)

## Reviews & Ratings

### cafe_reviews
- id (uuid, primary key)
- user_id (uuid, foreign key)
- rating (integer, 1-5)
- review_text (text)
- status (text: 'pending', 'approved', 'rejected', 'featured')
- admin_response (text)
- created_at (timestamp)

### product_ratings
- id (uuid, primary key)
- user_id (uuid, foreign key)
- order_id (uuid, foreign key)
- menu_item_id (text)
- menu_item_name (text)
- rating (integer, 1-5)
- created_at (timestamp)

## Business Operations

### franchise_inquiries
- id (uuid, primary key)
- name (text)
- location (text)
- message (text)
- status (text: 'pending', 'contacted', 'rejected', 'closed')
- admin_notes (text)
- created_at (timestamp)

### newsletter_subscriptions
- id (uuid, primary key)
- status (text: 'active', 'unsubscribed')
- subscribed_at (timestamp)
**NOTE: DO NOT query email - PII restricted**

### admin_activity_log
- id (uuid, primary key)
- admin_id (uuid, foreign key)
- action (varchar)
- resource_type (varchar)
- resource_id (varchar)
- details (jsonb)
- created_at (timestamp)

## Key Relationships
- orders.user_id → profiles.id
- order_items.order_id → orders.id
- user_coupons.user_id → profiles.id
- coupon_usage.order_id → orders.id
- workshop_registrations.user_id → profiles.id
- workshop_registrations.workshop_id → workshops.id
- art_purchases.user_id → profiles.id
- art_purchases.art_piece_id → art_pieces.id
- art_pieces.artist_id → artists.id

## Business Rules
- Coupons: Only 1 coupon per order, no stacking
- Next-order coupon: Earned on orders ≥ ₹200, expires in 30 days
- Cart coupons: Max 2 active, triggered by cart value
- Menu coupons: Max 2 active, apply to specific categories/items
- Order types: dine-in, takeaway-now, takeaway-scheduled
- Payment methods: Razorpay (UPI, Cards, Wallets)
- Operating hours: 8 AM - 10 PM daily

## Notes
- All monetary values in ₹ (Indian Rupees)
- Timestamps in UTC
- Use aggregation for customer insights (no individual PII)
- user_id is safe to use for counting unique customers (not PII)
`;

export const BUSINESS_CONTEXT = `
# RABUSTE COFFEE - BUSINESS CONTEXT

**Location**: Surat, Gujarat, India
**Type**: Premium café with coffee, workshops, and art gallery
**Opened**: 2024
**Known for**: Dark Roast Robusta, quality coffee, community space

**Menu Categories**:
- Espresso drinks (Cappuccino, Latte, Americano, Macchiato)
- Cold beverages (Cold Brew, Iced Coffee, Frappés)
- Specialty coffee (Single Origin, Pour Over)
- Pastries (Croissants, Muffins, Cookies)
- Snacks (Sandwiches, Toast)

**Price Range**: ₹50 - ₹500

**Revenue Streams**:
1. Food & Beverage (primary)
2. Workshops (coffee classes, latte art)
3. Art Gallery (local artist works)
4. Points redemption

**Customer Base**:
- Coffee enthusiasts
- Students and professionals
- Art lovers
- Workshop participants

**Operational Model**:
- Dine-in service
- Takeaway (immediate and scheduled)
- Online ordering through website
- Points loyalty program
`;
