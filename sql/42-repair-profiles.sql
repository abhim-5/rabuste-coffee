-- ============================================
-- SQL FILE 42: REPAIR PROFILES & FORCE ADMIN
-- ============================================

-- 1. Ensure every auth user has a profile
-- This handles cases where a user signed up but the trigger failed
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'User') as full_name,
    'admin' as role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- 2. Force ALL profiles to be admin (for development)
UPDATE public.profiles
SET role = 'admin';

-- 3. Verify
SELECT id, email, role FROM public.profiles;

SELECT '✅ All profiles repaired and set to ADMIN.' as status;
