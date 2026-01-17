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
    c.relname = 'workshop_reviews';
