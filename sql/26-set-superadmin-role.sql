-- SET YOUR ROLE TO SUPERADMIN
-- Run this in Supabase SQL Editor to grant yourself admin access

-- IMPORTANT: Replace 'your-email@example.com' with YOUR actual email address

UPDATE profiles 
SET role = 'superadmin'
WHERE email = 'your-email@example.com';

-- Verify it worked
SELECT id, email, full_name, role 
FROM profiles 
WHERE email = 'your-email@example.com';

-- Alternative: If you don't know your email, find all users
SELECT id, email, full_name, role, created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- Then update using the ID
-- UPDATE profiles SET role = 'superadmin' WHERE id = 'your-user-id-here';
