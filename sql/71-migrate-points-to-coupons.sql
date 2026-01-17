-- =============================================
-- POINTS TO COUPONS MIGRATION
-- Archives points data and converts to coupons
-- =============================================

-- Step 1: Create archive tables
-- =============================================

CREATE TABLE IF NOT EXISTS public.points_archive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_table TEXT NOT NULL,
  data JSONB NOT NULL,
  archived_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Archive existing points data
-- =============================================

-- Archive user points
INSERT INTO public.points_archive (original_table, data)
SELECT 'user_points', jsonb_build_object(
  'user_id', user_id,
  'total_points', total_points,
  'total_earned', total_earned,
  'total_redeemed', total_redeemed,
  'updated_at', updated_at
)
FROM public.user_points;

-- Archive points transactions
INSERT INTO public.points_archive (original_table, data)
SELECT 'points_transactions', jsonb_build_object(
  'id', id,
  'user_id', user_id,
  'points', points,
  'transaction_type', transaction_type,
  'source', source,
  'description', description,
  'order_id', order_id,
  'workshop_id', workshop_id,
  'status', status,
  'created_at', created_at
)
FROM public.points_transactions;

-- Archive points config
INSERT INTO public.points_archive (original_table, data)
SELECT 'points_config', row_to_json(points_config.*)::jsonb
FROM public.points_config;

-- Step 3: Convert existing points to next-order coupons
-- =============================================
-- Rule: 100 points = ₹10 coupon

INSERT INTO public.user_coupons (user_id, discount_amount, min_order_value, earned_at, expires_at)
SELECT 
  user_id,
  FLOOR(total_points / 10)::NUMERIC AS discount_amount, -- ₹1 per 10 points
  100 AS min_order_value, -- Minimum ₹100 order to use
  NOW() AS earned_at,
  NOW() + INTERVAL '90 days' AS expires_at -- 90 days to use
FROM public.user_points
WHERE total_points >= 50 -- Only convert if they have at least ₹5 worth
AND NOT EXISTS (
  SELECT 1 FROM public.user_coupons uc
  WHERE uc.user_id = user_points.user_id
  AND uc.is_used = false
);

-- Step 4: Drop old points tables (commented out for safety)
-- =============================================
-- UNCOMMENT THESE AFTER VERIFYING MIGRATION

-- DROP TABLE IF EXISTS public.points_admin_actions CASCADE;
-- DROP TABLE IF EXISTS public.points_transactions CASCADE;
-- DROP TABLE IF EXISTS public.points_earning_rules CASCADE;
-- DROP TABLE IF EXISTS public.points_redemption_rules CASCADE;
-- DROP TABLE IF EXISTS public.user_points CASCADE;
-- DROP TABLE IF EXISTS public.points_config CASCADE;

-- Step 5: Remove points columns from orders (after backup)
-- =============================================
-- UNCOMMENT AFTER VERIFYING

-- ALTER TABLE public.orders 
--   DROP COLUMN IF EXISTS points_applied,
--   DROP COLUMN IF EXISTS points_discount,
--   DROP COLUMN IF EXISTS original_total;

-- =============================================
-- Verification queries
-- =============================================

-- Check conversion results
SELECT 
  'Total users with points' as metric,
  COUNT(*) as count
FROM public.user_points
WHERE total_points > 0

UNION ALL

SELECT 
  'Users converted to coupons' as metric,
  COUNT(*) as count
FROM public.user_coupons
WHERE earned_at >= CURRENT_DATE

UNION ALL

SELECT 
  'Total archived records' as metric,
  COUNT(*) as count
FROM public.points_archive;

-- Sample of converted coupons
SELECT 
  user_id,
  discount_amount,
  expires_at,
  'Converted from ' || (discount_amount * 10) || ' points' as note
FROM public.user_coupons
WHERE earned_at >= CURRENT_DATE
LIMIT 10;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Points data archived successfully!';
  RAISE NOTICE '✅ Active points converted to coupons!';
  RAISE NOTICE '⚠️  Review conversion results before dropping tables';
  RAISE NOTICE '⚠️  Uncomment DROP statements when ready';
END $$;
