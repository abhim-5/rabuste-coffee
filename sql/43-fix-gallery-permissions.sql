-- Fix RLS policies for Art Gallery Management

-- 1. Enable RLS on art_pieces
ALTER TABLE art_pieces ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to be clean
DROP POLICY IF EXISTS "Public can view available art" ON art_pieces;
DROP POLICY IF EXISTS "Admins can manage art" ON art_pieces;
DROP POLICY IF EXISTS "Staff can manage art" ON art_pieces;
DROP POLICY IF EXISTS "Public select available" ON art_pieces;
DROP POLICY IF EXISTS "admin_manage_art" ON art_pieces;
DROP POLICY IF EXISTS "public_view_available_art" ON art_pieces;
DROP POLICY IF EXISTS "Public available art" ON art_pieces;
DROP POLICY IF EXISTS "Auth available art" ON art_pieces;
DROP POLICY IF EXISTS "Admins full access art" ON art_pieces;

-- 3. Create comprehensive policies

-- Public Read: Only available art (unless admin flag handles it differently, but RLS should restrict public)
-- Actually, for simplicity and to match API logic:
-- Public can read ALL art pieces? Or just available?
-- The User Gallery filters by `available=true` in memory or query.
-- But the Admin API `GET /items?admin=true` needs to read ALL items.
-- So we need separate policies for "anon" vs "authenticated admin".

-- Policy: Public/Anon can see available art
CREATE POLICY "Public available art"
ON art_pieces FOR SELECT
TO public
USING (available = true);

-- Policy: Authenticated users (logged in) can see available art (if we need specific one for auth)
-- Supabase explicit "public" role includes anon and authenticated usually, but let's be safe.
CREATE POLICY "Auth available art"
ON art_pieces FOR SELECT
TO authenticated
USING (available = true);

-- Policy: Admins/Staff can do EVERYTHING (Select All, Insert, Update, Delete)
-- We check profiles.role via a join or helper function if exists, or simpler subquery.
-- Assuming 'profiles' table exists and links to auth.users.

CREATE POLICY "Admins full access art"
ON art_pieces
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.role = 'staff')
  )
);

-- 4. Fix Art Purchases RLS as well (Admin needs to see/update)
ALTER TABLE art_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own purchases" ON art_purchases;
DROP POLICY IF EXISTS "Admins can view all purchases" ON art_purchases;
DROP POLICY IF EXISTS "Users own purchases" ON art_purchases;
DROP POLICY IF EXISTS "Users insert purchases" ON art_purchases;
DROP POLICY IF EXISTS "Admins view all purchases" ON art_purchases;
DROP POLICY IF EXISTS "Admins update purchases" ON art_purchases;

-- Policy: Users see own purchases
CREATE POLICY "Users own purchases"
ON art_purchases
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can insert own purchase (Booking)
CREATE POLICY "Users insert purchases"
ON art_purchases
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can View All Purchases
CREATE POLICY "Admins view all purchases"
ON art_purchases
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.role = 'staff')
  )
);

-- Policy: Admins can Update Purchases (Status)
CREATE POLICY "Admins update purchases"
ON art_purchases
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.role = 'staff')
  )
);

-- 5. Force refresh schema cache if needed (comment only)

-- Verify policies created
SELECT * FROM pg_policies WHERE tablename = 'art_pieces';
