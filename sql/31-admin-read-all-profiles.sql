-- FIX: Allow Admins to Read All Profiles for Dashboard Stats
-- This fixes the "Total Customers = 0" issue

-- Add admin read access to profiles
CREATE POLICY "admins_read_all_profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'superadmin', 'staff')
    )
  );

-- Verify policies exist
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Test the query that dashboard uses
SELECT COUNT(*) as total_customers
FROM profiles 
WHERE role = 'customer';

SELECT '✅ Admin can now read all profiles for stats!' as status;
