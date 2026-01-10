-- ============================================
-- SQL FILE 41: FIX PRODUCT PERMISSIONS & ADMIN ROLE
-- ============================================

-- 1. FORCE ADMIN ROLE FOR ALL USERS (Dev Environment Fix)
-- This ensures you have permission to add/edit products
UPDATE profiles 
SET role = 'admin' 
WHERE role NOT IN ('admin', 'superadmin');

-- 2. RESET PRODUCT RLS POLICIES
-- Ensure the products table has the correct permissions
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for products" ON products;
DROP POLICY IF EXISTS "Staff can create products" ON products;
DROP POLICY IF EXISTS "Staff can update products" ON products;
DROP POLICY IF EXISTS "Admin can delete products" ON products;
DROP POLICY IF EXISTS "Admin full access" ON products;

-- Public can view
CREATE POLICY "Public read access for products" ON products
  FOR SELECT
  USING (true);

-- Admin/Staff can INSERT
CREATE POLICY "Admin/Staff can insert products" ON products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );

-- Admin/Staff can UPDATE
CREATE POLICY "Admin/Staff can update products" ON products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );

-- Admin/Staff can DELETE
CREATE POLICY "Admin/Staff can delete products" ON products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );

-- 3. VERIFICATION
SELECT id, email, role FROM profiles;
SELECT 'Permissions updated! Try adding a product now.' as status;
