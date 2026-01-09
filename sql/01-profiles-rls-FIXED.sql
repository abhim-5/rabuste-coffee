-- FIXED RLS Policies for Profiles (No Recursion)
-- This file fixes the infinite recursion error

-- First, drop ALL existing profiles policies
DROP POLICY IF EXISTS "Customers can read own profile" ON profiles;
DROP POLICY IF EXISTS "Customers can update own profile" ON profiles;
DROP POLICY IF EXISTS "Staff can read customer profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can manage profiles" ON profiles;
DROP POLICY IF EXISTS "Superadmin can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Customer: Can read/update their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow inserting new profiles (needed for signup)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Service role can do everything (for backend operations)
-- This bypasses RLS when using service role key
CREATE POLICY "Service role full access" ON profiles
  FOR ALL
  USING (auth.role() = 'service_role');
