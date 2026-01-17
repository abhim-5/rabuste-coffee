-- COMPLETE FIX FOR PROFILE RLS - NO CIRCULAR DEPENDENCIES
-- This fixes the infinite loop issue with admin profile checks

-- ==========================================
-- STEP 1: Drop ALL existing policies
-- ==========================================
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "admins_read_all_profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Public read profiles" ON profiles;

-- ==========================================
-- STEP 2: Create SIMPLE, NON-RECURSIVE policies
-- ==========================================

-- Policy 1: Users can ALWAYS read their own profile (no subquery!)
CREATE POLICY "profile_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "profile_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile (signup)
CREATE POLICY "profile_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 4: Service role can do everything (for backend/admin operations)
-- This bypasses RLS when using service_role key
CREATE POLICY "profile_service_role_all"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ==========================================
-- STEP 3: Ensure RLS is enabled
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- VERIFICATION
-- ==========================================

-- Check policies
SELECT 
    policyname,
    cmd,
    CASE 
        WHEN cmd = 'SELECT' THEN 'Read'
        WHEN cmd = 'UPDATE' THEN 'Update'
        WHEN cmd = 'INSERT' THEN 'Insert'
        WHEN cmd = 'ALL' THEN 'All Operations'
        ELSE cmd
    END as operation
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Test reading own profile
SELECT id, email, role FROM profiles WHERE id = auth.uid();

-- Test reading multiple profiles (this will only return your own)
SELECT COUNT(*) as profiles_i_can_see FROM profiles;

SELECT '✅ Profile RLS fixed - no more circular dependencies!' as status;
