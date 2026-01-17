-- Complete RLS (Row Level Security) Setup for Rabuste Coffee
-- Run this AFTER running 00-create-tables.sql

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_enrollments ENABLE ROW LEVEL SECURITY;

-- DROP existing policies to avoid conflicts
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;

DROP POLICY IF EXISTS "products_select_policy" ON products;
DROP POLICY IF EXISTS "products_admin_policy" ON products;

DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;
DROP POLICY IF EXISTS "orders_staff_policy" ON orders;

DROP POLICY IF EXISTS "order_items_select_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_insert_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_staff_policy" ON order_items;

DROP POLICY IF EXISTS "workshops_select_policy" ON workshops;
DROP POLICY IF EXISTS "workshops_admin_policy" ON workshops;

DROP POLICY IF EXISTS "workshop_enrollments_select_policy" ON workshop_enrollments;
DROP POLICY IF EXISTS "workshop_enrollments_insert_policy" ON workshop_enrollments;
DROP POLICY IF EXISTS "workshop_enrollments_staff_policy" ON workshop_enrollments;

-- PROFILES POLICIES
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (auth.uid() = id OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'superadmin'));

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = id OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'superadmin'));

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- PRODUCTS POLICIES
CREATE POLICY "products_select_policy" ON products
  FOR SELECT USING (true); -- Public read access

CREATE POLICY "products_admin_policy" ON products
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'superadmin')
  );

-- ORDERS POLICIES
CREATE POLICY "orders_select_policy" ON orders
  FOR SELECT USING (user_id = auth.uid() OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'superadmin'));

CREATE POLICY "orders_insert_policy" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "orders_update_policy" ON orders
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "orders_staff_policy" ON orders
  FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'superadmin')
  );

-- ORDER ITEMS POLICIES
CREATE POLICY "order_items_select_policy" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'superadmin')
  );

CREATE POLICY "order_items_insert_policy" ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

CREATE POLICY "order_items_staff_policy" ON order_items
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'superadmin')
  );

-- WORKSHOPS POLICIES
CREATE POLICY "workshops_select_policy" ON workshops
  FOR SELECT USING (true); -- Public read access

CREATE POLICY "workshops_admin_policy" ON workshops
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'superadmin')
  );

-- WORKSHOP ENROLLMENTS POLICIES
CREATE POLICY "workshop_enrollments_select_policy" ON workshop_enrollments
  FOR SELECT USING (user_id = auth.uid() OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'superadmin'));

CREATE POLICY "workshop_enrollments_insert_policy" ON workshop_enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "workshop_enrollments_staff_policy" ON workshop_enrollments
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'superadmin')
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;