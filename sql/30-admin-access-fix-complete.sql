-- ============================================
-- SQL FILE 30: COMPLETE ADMIN ACCESS FIX
-- Fixes RLS policies to allow admin/superadmin full access
-- ============================================

-- PART 1: IDENTIFY SUPERADMINS
-- ============================================
-- List all superadmins (for verification)
SELECT id, email, full_name, role, created_at 
FROM profiles 
WHERE role = 'superadmin'
ORDER BY created_at;

-- PART 2: FIX PROFILES RLS (Allow admins to see all profiles)
-- ============================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role full access" ON profiles;
DROP POLICY IF EXISTS "Staff can read customer profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Superadmin can manage all profiles" ON profiles;

-- Recreate policies with proper admin access
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- CRITICAL: Admin/Superadmin can read ALL profiles
CREATE POLICY "Admin can read all profiles" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'superadmin')
    )
  );

-- Admin/Superadmin can update any profile
CREATE POLICY "Admin can update all profiles" ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'superadmin')
    )
  );

-- PART 3: FIX ORDERS RLS (Critical for admin panel)
-- ============================================

-- Drop all existing order policies
DROP POLICY IF EXISTS "Customers can read own orders" ON orders;
DROP POLICY IF EXISTS "Customers can create own orders" ON orders;
DROP POLICY IF EXISTS "Staff can read all orders" ON orders;
DROP POLICY IF EXISTS "Staff can update order status" ON orders;
DROP POLICY IF EXISTS "Admin can delete orders" ON orders;
DROP POLICY IF EXISTS "Service can bypass RLS" ON orders;

-- Ensure RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Customers: Read/Create own orders
CREATE POLICY "Customers can read own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Customers can create own orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Customers can update their own pending orders
CREATE POLICY "Customers can update own pending orders" ON orders
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

-- CRITICAL: Admin/Staff can read ALL orders
CREATE POLICY "Admin can read all orders" ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin', 'superadmin')
    )
  );

-- Admin/Staff can update any order
CREATE POLICY "Admin can update all orders" ON orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin', 'superadmin')
    )
  );

-- Admin can insert orders (for manual entry)
CREATE POLICY "Admin can insert orders" ON orders
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Admin can delete orders
CREATE POLICY "Admin can delete orders" ON orders
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- PART 4: FIX ORDER ITEMS RLS
-- ============================================

-- Drop all existing order_items policies
DROP POLICY IF EXISTS "Customers can read own order items" ON order_items;
DROP POLICY IF EXISTS "Customers can create own order items" ON order_items;
DROP POLICY IF EXISTS "Staff can read all order items" ON order_items;
DROP POLICY IF EXISTS "Staff can update order items" ON order_items;

-- Ensure RLS is enabled
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Customers: Read/Create items for their orders
CREATE POLICY "Customers can read own order items" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create own order items" ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- CRITICAL: Admin/Staff can read ALL order items
CREATE POLICY "Admin can read all order items" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin', 'superadmin')
    )
  );

-- Admin/Staff can update any order items
CREATE POLICY "Admin can update all order items" ON order_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin', 'superadmin')
    )
  );

-- Admin can insert order items (for manual entry)
CREATE POLICY "Admin can insert order items" ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- PART 5: FIX WORKSHOPS & ART PURCHASES RLS
-- ============================================

-- Workshop Registrations
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can read all workshop registrations" ON workshop_registrations;

CREATE POLICY "Admin can read all workshop registrations" ON workshop_registrations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Art Purchases
ALTER TABLE art_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can read all art purchases" ON art_purchases;

CREATE POLICY "Admin can read all art purchases" ON art_purchases
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- PART 6: VERIFICATION QUERIES
-- ============================================

-- Check your role
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM profiles
WHERE id = auth.uid();

-- Test orders access (should show all orders for admin)
SELECT COUNT(*) as total_orders FROM orders;

-- Test order items access
SELECT COUNT(*) as total_order_items FROM order_items;

-- List all policies on orders table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;

-- List all policies on order_items table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'order_items'
ORDER BY policyname;

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. Run this script as a SUPERADMIN or using service_role key
-- 2. After running, log out and log back in to refresh session
-- 3. Check that your email in profiles has role='superadmin' or 'admin'
-- 4. The admin panel should now display all orders
-- ============================================

SELECT '✅ Admin RLS policies updated successfully!' as status;
