-- Fix Art Gallery RLS Policies
-- Run this to allow users to create art purchases

-- Drop existing policy that only allows viewing
DROP POLICY IF EXISTS "users_view_own_purchases" ON art_purchases;

-- Allow users to view their own purchases
CREATE POLICY "users_view_own_purchases"
  ON art_purchases FOR SELECT
  USING (auth.uid() = user_id);

-- NEW: Allow authenticated users to create purchases
DROP POLICY IF EXISTS "users_create_purchases" ON art_purchases;
CREATE POLICY "users_create_purchases"
  ON art_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

SELECT 'Art purchase RLS policies fixed! ✅' as status;
