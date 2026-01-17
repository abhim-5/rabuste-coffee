-- Check if the join works manually
SELECT 
    wr.id,
    wr.review_text,
    wr.user_id,
    p.full_name as profile_name,
    p.email as profile_email
FROM public.workshop_reviews wr
LEFT JOIN public.profiles p ON wr.user_id = p.id;

-- Check RLS on profiles
SELECT
    c.relname,
    c.relrowsecurity AS rls_enabled,
    pol.polname,
    pol.polcmd,
    pol.polroles
FROM
    pg_class c
LEFT JOIN
    pg_policy pol ON pol.polrelid = c.oid
WHERE
    c.relname = 'profiles';
