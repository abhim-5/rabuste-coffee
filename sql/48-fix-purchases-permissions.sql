-- =========================================================
-- SQL FILE 48: FIX ART PURCHASES PERMISSIONS
-- =========================================================
-- Fixes RLS policies for 'art_purchases' to ensure
-- Admins, Superadmins, and Staff can VIEW and UPDATE bookings.
-- Also ensures Customers can INSERT and VIEW their own bookings.
-- =========================================================

ALTER TABLE art_purchases ENABLE ROW LEVEL SECURITY;

-- 1. DROP EXISTING POLICIES (Cleanup)
DROP POLICY IF EXISTS "Users can view own purchases" ON art_purchases;
DROP POLICY IF EXISTS "Admins can view all purchases" ON art_purchases;
DROP POLICY IF EXISTS "Users own purchases" ON art_purchases;
DROP POLICY IF EXISTS "Users insert purchases" ON art_purchases;
DROP POLICY IF EXISTS "Admins view all purchases" ON art_purchases;
DROP POLICY IF EXISTS "Admins update purchases" ON art_purchases;
DROP POLICY IF EXISTS "Staff view all purchases" ON art_purchases;

-- 2. CREATE NEW POLICIES

-- Policy: Users see their own purchases
CREATE POLICY "Users view own purchases"
ON art_purchases
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can CREATE their own purchase (booking)
CREATE POLICY "Users insert purchases"
ON art_purchases
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins/Staff/Superadmins can VIEW ALL purchases
CREATE POLICY "Admins view all purchases"
ON art_purchases
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- Policy: Admins/Staff/Superadmins can UPDATE purchases (e.g., Status)
CREATE POLICY "Admins update purchases"
ON art_purchases
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- Policy: Admins/Staff/Superadmins can DELETE purchases (if needed)
CREATE POLICY "Admins delete purchases"
ON art_purchases
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- 3. VERIFICATION
SELECT '✅ Fixed art_purchases permissions for Admin/Superadmin/Staff' as status;

-- Check policies
SELECT policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'art_purchases'
ORDER BY policyname;
