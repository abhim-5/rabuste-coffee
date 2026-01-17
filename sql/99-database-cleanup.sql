-- =============================================
-- DATABASE CLEANUP SCRIPT
-- Removes all user transaction data
-- Keeps: profiles, menu items, workshops, art pieces
-- =============================================

-- Step 1: Delete all transaction data
-- =============================================

-- Orders and related
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;

-- Coupons
TRUNCATE TABLE public.user_coupons CASCADE;
TRUNCATE TABLE public.coupon_usage CASCADE;

-- Workshop interactions
TRUNCATE TABLE public.workshop_enrollments CASCADE;
TRUNCATE TABLE public.workshop_registrations CASCADE;
TRUNCATE TABLE public.workshop_requests CASCADE;
TRUNCATE TABLE public.workshop_reviews CASCADE;

-- Art gallery purchases
TRUNCATE TABLE public.art_purchases CASCADE;

-- Reviews and ratings
TRUNCATE TABLE public.product_ratings CASCADE;
TRUNCATE TABLE public.cafe_reviews CASCADE;

-- Notifications
TRUNCATE TABLE public.notifications CASCADE;

-- AI Analytics history
TRUNCATE TABLE public.ai_analytics_history CASCADE;

-- Step 2: Drop ALL deprecated points system tables
-- =============================================

DROP TABLE IF EXISTS public.points_admin_actions CASCADE;
DROP TABLE IF EXISTS public.points_earning_rules CASCADE;
DROP TABLE IF EXISTS public.points_redemption_rules CASCADE;
DROP TABLE IF EXISTS public.points_transactions CASCADE;
DROP TABLE IF EXISTS public.points_redemptions CASCADE;
DROP TABLE IF EXISTS public.points_earnings CASCADE;
DROP TABLE IF EXISTS public.points_config CASCADE;
DROP TABLE IF EXISTS public.points_archive CASCADE;
DROP TABLE IF EXISTS public.points_admin_transactions CASCADE;
DROP TABLE IF EXISTS public.user_points CASCADE;

-- Step 3: Drop deprecated views if any
-- =============================================

DROP VIEW IF EXISTS public.products_with_ratings CASCADE;

-- Step 4: Clean unused columns from orders table
-- =============================================

ALTER TABLE public.orders 
  DROP COLUMN IF EXISTS points_applied,
  DROP COLUMN IF EXISTS points_discount,
  DROP COLUMN IF EXISTS original_total;

-- Step 5: Verify what's left
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database cleanup complete!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 KEPT DATA:';
  RAISE NOTICE '  - User profiles (profiles table)';
  RAISE NOTICE '  - Menu items (products table)';
  RAISE NOTICE '  - Workshops (workshops table)';
  RAISE NOTICE '  - Art pieces (art_pieces table)';
  RAISE NOTICE '  - Categories (categories table)';
  RAISE NOTICE '  - Artists (artists table)';
  RAISE NOTICE '  - Newsletter subscriptions';
  RAISE NOTICE '  - Franchise inquiries';
  RAISE NOTICE '  - Admin activity logs';
  RAISE NOTICE '  - Coupon config';
  RAISE NOTICE '';
  RAISE NOTICE '🗑️  REMOVED DATA:';
  RAISE NOTICE '  - All orders and order items';
  RAISE NOTICE '  - All coupons earned/used';
  RAISE NOTICE '  - All workshop bookings/requests';
  RAISE NOTICE '  - All art gallery purchases';
  RAISE NOTICE '  - All reviews and ratings';
  RAISE NOTICE '  - All notifications';
  RAISE NOTICE '  - All AI analytics queries';
  RAISE NOTICE '  - Dropped ALL points system tables';
  RAISE NOTICE '  - Removed points columns from orders';
END $$;
