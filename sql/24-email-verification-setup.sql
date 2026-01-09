-- Email Verification Configuration for Supabase
-- Run this in Supabase Dashboard → SQL Editor

-- Enable email confirmation (this will require users to verify their email before signing in)
-- NOTE: This is actually configured in the Supabase Dashboard UI, not via SQL
-- Go to: Authentication → Settings → Email

/*
MANUAL STEPS REQUIRED IN SUPABASE DASHBOARD:

1. Go to Authentication → Providers → Email
2. Ensure "Confirm email" is ENABLED
3. Set "Site URL" to your production URL (e.g., https://your-domain.com)
4. Set "Redirect URLs" to include:
   - http://localhost:3000/auth/callback (for development)
   - https://your-domain.com/auth/callback (for production)

5. Go to Authentication → Email Templates → "Confirm signup"
6. Verify the template looks good (optional: customize it)
7. The default template should work fine

8. Save all changes
*/

-- Verify current auth settings
SELECT 
  'Email confirmation should be enabled in Dashboard UI' as note,
  'Check Authentication → Providers → Email' as location;

-- Note: After enabling email confirmation:
-- - New signups will receive a verification email
-- - Users must click the link before they can sign in
-- - Existing unverified users will need to verify their email
-- - Google OAuth users are automatically verified (no email required)
