// Database Schema Context for Gemini AI

export const DATABASE_SCHEMA = `
# RABUSTE COFFEE DATABASE SCHEMA

## Core Tables

### orders
- id (uuid, primary key)
- user_id (uuid, foreign key to profiles)
- order_number (text, unique)
- order_type (text: 'dine-in', 'takeaway-now', 'takeaway-scheduled')
- scheduled_time (timestamp)
- subtotal (numeric)
- tax (numeric)
- total (numeric)
- status (text: 'pending', 'confirmed', 'completed', 'cancelled')
- payment_status (text: 'pending', 'paid', 'failed')
- customer_name (text)
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)

### order_items
- id (uuid, primary key)
- order_id (uuid, foreign key to orders)
- menu_item_id (text)
- menu_item_name (text)
- menu_item_image (text)
- variation_name (text)
- unit_price (numeric)
- quantity (integer)
- subtotal (numeric)
- created_at (timestamp)

### menu_items (products table)
- id (uuid, primary key)
- name (text)
- description (text)
- price (numeric)
- category (text)
- image (text)
- available (boolean)
- featured (boolean)
- created_at (timestamp)
- updated_at (timestamp)

### profiles
- id (uuid, primary key)
- full_name (text)
- role (text: 'user', 'staff', 'admin', 'superadmin')
- created_at (timestamp)
- updated_at (timestamp)
**NOTE: DO NOT query email, phone, or dob columns - PII restricted**

### points_transactions
- id (uuid, primary key)
- user_id (uuid, foreign key to profiles)
- points (integer)
- transaction_type (text: 'earned', 'redeemed')
- source (text: 'order', 'workshop', 'art_purchase', 'bonus', 'admin_grant')
- description (text)
- order_id (uuid, nullable)
- status (text: 'pending', 'confirmed', 'reversed', 'locked')
- metadata (jsonb)
- created_at (timestamp)

### user_points
- user_id (uuid, primary key, foreign key to profiles)
- total_points (integer)
- total_earned (integer)
- total_redeemed (integer)
- updated_at (timestamp)

### workshop_registrations
- id (uuid, primary key)
- user_id (uuid, foreign key to profiles)
- workshop_id (uuid)
- workshop_title (text)
- workshop_date (timestamp)
- status (text: 'confirmed', 'cancelled', 'completed')
- created_at (timestamp)

### art_purchases
- id (uuid, primary key)
- user_id (uuid, foreign key to profiles)
- art_piece_id (uuid)
- art_piece_name (text)
- artist (text)
- price (numeric)
- status (text: 'pending', 'completed', 'cancelled')
- created_at (timestamp)

## Key Relationships
- orders.user_id → profiles.id
- order_items.order_id → orders.id
- points_transactions.user_id → profiles.id
- points_transactions.order_id → orders.id (nullable)
- user_points.user_id → profiles.id

## Business Rules
- Points: 10 points = ₹1 discount
- Order types: dine-in, takeaway-now, takeaway-scheduled
- Payment methods: Razorpay (UPI, Cards, Wallets)
- Operating hours: 8 AM - 10 PM daily

## Notes
- All monetary values in ₹ (Indian Rupees)
- Timestamps in UTC
- Use aggregation for customer insights (no individual PII)
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
