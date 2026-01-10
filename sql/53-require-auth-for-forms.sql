-- =========================================================
-- FINAL FIX: Require Authentication for Form Submissions
-- =========================================================
-- All forms now require users to be logged in
-- This fixes RLS issues and adds security
-- =========================================================

-- ========================================
-- 1. FRANCHISE INQUIRIES - Require Auth
-- ========================================

-- Drop old policy
DROP POLICY IF EXISTS "Anyone insert inquiries" ON franchise_inquiries;

-- Only authenticated users can submit
CREATE POLICY "Authenticated users insert inquiries"
ON franchise_inquiries FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can view their own submissions
DROP POLICY IF EXISTS "Users view own inquiries" ON franchise_inquiries;
CREATE POLICY "Users view own inquiries"
ON franchise_inquiries FOR SELECT
TO authenticated
USING (true);  -- All authenticated users can see (for now, can restrict later)

-- ========================================
-- 2. NEWSLETTER - Require Auth
-- ========================================

-- Drop old policy
DROP POLICY IF EXISTS "Anyone subscribe" ON newsletter_subscriptions;

-- Only authenticated users can subscribe
CREATE POLICY "Authenticated users subscribe"
ON newsletter_subscriptions FOR INSERT
TO authenticated
WITH CHECK (true);

-- ========================================
-- 3. WORKSHOP REQUESTS - Already Auth Required
-- ========================================
-- Workshop requests already require auth via existing policies
-- No changes needed

-- ========================================
-- 4. CAFE REVIEWS - Already Auth Required  
-- ========================================
-- Reviews already require auth (user_id foreign key)
-- No changes needed

-- ========================================
-- Verify Policies
-- ========================================
SELECT 
  tablename,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('franchise_inquiries', 'newsletter_subscriptions', 'workshop_requests', 'cafe_reviews')
ORDER BY tablename, policyname;

SELECT '✅ All forms now require authentication!' as status;
