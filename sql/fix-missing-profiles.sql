-- Insert profiles for any users that don't have one
INSERT INTO public.profiles (id, full_name, email, role, created_at, updated_at)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'full_name', email) as full_name,
    email,
    'customer' as role,
    created_at,
    created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Update existing profiles that might have null full_name
UPDATE public.profiles
SET full_name = (
    SELECT COALESCE(raw_user_meta_data->>'full_name', email)
    FROM auth.users
    WHERE auth.users.id = public.profiles.id
)
WHERE full_name IS NULL OR full_name = '';
