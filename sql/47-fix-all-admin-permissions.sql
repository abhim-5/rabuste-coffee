-- =========================================================
-- SQL FILE 47: FIX ALL ADMIN PERMISSIONS (FINAL)
-- =========================================================
-- This script explicitly grants comprehensive permissions
-- to Admin, Superadmin, and Staff roles for Art Gallery management.
-- It covers both 'art_pieces' and 'artists' tables.
-- =========================================================

-- 1. ART ITEMS TABLE: Enable RLS & Reset Policies
ALTER TABLE art_pieces ENABLE ROW LEVEL SECURITY;

-- Drop all potentially conflicting policies
DROP POLICY IF EXISTS "Public available art" ON art_pieces;
DROP POLICY IF EXISTS "Auth available art" ON art_pieces;
DROP POLICY IF EXISTS "Admins full access art" ON art_pieces;
DROP POLICY IF EXISTS "Public can view available art" ON art_pieces;
DROP POLICY IF EXISTS "Admins can manage art" ON art_pieces;
DROP POLICY IF EXISTS "Staff can manage art" ON art_pieces;

-- POLICY: Public Read (Only Available items)
CREATE POLICY "Public read available art"
ON art_pieces FOR SELECT
TO public
USING (available = true);

-- POLICY: Authenticated Read (Only Available items - simplified)
-- Note: Admins need to see unavailable items too, so we handle that below.
-- This is for normal logged-in users.
CREATE POLICY "Auth read available art"
ON art_pieces FOR SELECT
TO authenticated
USING (
  available = true 
  OR 
  (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  ))
);

-- POLICY: Admin Full Access (Insert)
CREATE POLICY "Admin insert art"
ON art_pieces FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- POLICY: Admin Full Access (Update)
CREATE POLICY "Admin update art"
ON art_pieces FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- POLICY: Admin Full Access (Delete)
CREATE POLICY "Admin delete art"
ON art_pieces FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);


-- 2. ARTISTS TABLE: Enable RLS & Reset Policies
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read artists" ON artists;
DROP POLICY IF EXISTS "Admins manage artists" ON artists;

-- POLICY: Public Read (Everyone can read artists)
CREATE POLICY "Public read artists"
ON artists FOR SELECT
TO public
USING (true);

-- POLICY: Admin Full Access (Insert)
CREATE POLICY "Admin insert artists"
ON artists FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- POLICY: Admin Full Access (Update)
CREATE POLICY "Admin update artists"
ON artists FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- POLICY: Admin Full Access (Delete)
CREATE POLICY "Admin delete artists"
ON artists FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);


-- 3. VERIFICATION
SELECT '✅ valid policies created for art_pieces and artists' as status;

-- Check policies
SELECT tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename IN ('art_pieces', 'artists')
ORDER BY tablename, policyname;
