-- SET SUPERADMIN ROLE
-- For email: u24cs053@coed.svnit.ac.in

-- Step 1: Check if auth.users record exists
SELECT id, email, created_at, email_confirmed_at
FROM auth.users
WHERE email = 'u24cs053@coed.svnit.ac.in';

-- Step 2: Check if profile exists
SELECT id, email, role
FROM profiles
WHERE email = 'u24cs053@coed.svnit.ac.in';

-- ============================================
-- METHOD 1: Update existing profile
-- ============================================
-- If profile already exists, just update the role:

UPDATE profiles 
SET role = 'superadmin'
WHERE email = 'u24cs053@coed.svnit.ac.in';

-- ============================================
-- METHOD 2: Create profile if missing
-- ============================================
-- If profile doesn't exist, create it:

-- First get the user ID from auth.users
DO $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Get the auth user ID
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = 'u24cs053@coed.svnit.ac.in';
  
  -- Check if we found a user
  IF user_uuid IS NOT NULL THEN
    -- Insert or update profile
    INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
      user_uuid,
      'u24cs053@coed.svnit.ac.in',
      'Admin User',
      'superadmin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) 
    DO UPDATE SET 
      role = 'superadmin',
      updated_at = NOW();
    
    RAISE NOTICE 'Profile created/updated successfully for user ID: %', user_uuid;
  ELSE
    RAISE NOTICE 'No auth.users record found for u24cs053@coed.svnit.ac.in - Please sign up first!';
  END IF;
END $$;

-- Step 3: Verify it worked
SELECT id, email, full_name, role, created_at
FROM profiles
WHERE email = 'u24cs053@coed.svnit.ac.in';

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If you get "null value in column id" error:
-- It means the auth.users record doesn't exist yet.
-- Solution: Sign up with u24cs053@coed.svnit.ac.in first, then run this SQL

-- If auth.users exists but no profile:
-- The trigger in sql/23-profile-creation-trigger.sql should auto-create it
-- If it didn't, use METHOD 2 above

-- After running this successfully:
-- 1. Sign out completely from the app
-- 2. Sign in with u24cs053@coed.svnit.ac.in
-- 3. Visit /admin
-- 4. You should see the full admin dashboard!
