-- =========================================================
-- QUICK FIX: Allow Public Form Submissions
-- =========================================================
-- This fixes the RLS policies to allow anonymous users
-- to submit franchise inquiries and newsletter subscriptions
-- =========================================================

-- Fix franchise_inquiries INSERT policy
DROP POLICY IF EXISTS "Anyone insert inquiries" ON franchise_inquiries;
CREATE POLICY "Anyone insert inquiries"
ON franchise_inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Fix newsletter_subscriptions INSERT policy
DROP POLICY IF EXISTS "Anyone subscribe" ON newsletter_subscriptions;
CREATE POLICY "Anyone subscribe"
ON newsletter_subscriptions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename IN ('franchise_inquiries', 'newsletter_subscriptions')
ORDER BY tablename, policyname;
