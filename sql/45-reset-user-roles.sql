-- =======================================================
-- SQL FILE 45: RESET USER ROLES (FIX ADMIN ESCALATION)
-- =======================================================
-- 
-- PROBLEM: SQL files 41 and 42 previously set ALL users to 'admin' 
-- for dev purposes. This needs to be reversed so only actual admins
-- have elevated permissions.
--
-- INSTRUCTIONS:
-- 1. Replace 'your-admin-email@example.com' with your ACTUAL admin email
-- 2. Run this script in Supabase SQL Editor
-- 3. Verify the results at the bottom
-- =======================================================

-- STEP 1: Reset ALL users to 'customer' role (default)
UPDATE public.profiles
SET role = 'customer'
WHERE role IN ('admin', 'superadmin', 'staff');

-- STEP 2: Set YOUR admin account to 'superadmin'
UPDATE public.profiles
SET role = 'superadmin'
WHERE email = 'u24cs053@coed.svnit.ac.in';

-- If you have multiple admins, add more UPDATE statements:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'another-admin@example.com';
-- UPDATE public.profiles SET role = 'staff' WHERE email = 'staff-member@example.com';

-- STEP 3: Verify changes
SELECT 
    email, 
    role,
    created_at
FROM public.profiles
ORDER BY 
    CASE role
        WHEN 'superadmin' THEN 1
        WHEN 'admin' THEN 2
        WHEN 'staff' THEN 3
        WHEN 'user' THEN 4
        ELSE 5
    END,
    created_at DESC;

-- Count users by role
SELECT 
    role,
    COUNT(*) as count
FROM public.profiles
GROUP BY role
ORDER BY count DESC;

SELECT '✅ User roles have been reset! Only specified admins have elevated access.' as status;
