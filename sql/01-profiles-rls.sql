-- RLS Policies for Phase 4: Roles & Permissions

-- First, ensure roles are properly set in profiles table
-- Update existing profiles table to have proper role constraints
ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('customer', 'staff', 'admin', 'superadmin'));

-- PROFILES TABLE POLICIES
-- Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Staff can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;

-- Customer: Can read/update their own profile
CREATE POLICY "Customers can read own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Customers can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Staff: Can read all customer profiles (for order management)
CREATE POLICY "Staff can read customer profiles" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );

-- Admin: Can manage all profiles except superadmin
CREATE POLICY "Admin can manage profiles" ON profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
    AND role != 'superadmin'
  );

-- Superadmin: Can manage all profiles including other admins
CREATE POLICY "Superadmin can manage all profiles" ON profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'superadmin'
    )
  );