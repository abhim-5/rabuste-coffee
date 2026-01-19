# 🚀 Rabuste Coffee - Production Deployment Guide

Complete guide for deploying Rabuste Coffee to production with full authentication support.

---

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] GitHub repository with latest code
- [ ] Supabase project created (or existing project)
- [ ] Google Cloud Console project with OAuth 2.0 credentials
- [ ] Razorpay account with API keys (live keys for production)
- [ ] Gemini API key (for AI features)
- [ ] All SQL migrations tested locally
- [ ] Production domain/URL decided

---

## 🔧 Part 1: Database Setup (Supabase)

### 1.1 Create/Access Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in and create a new project OR select existing project
3. Note down:
   - Project URL: `https://[your-project-id].supabase.co`
   - API Keys: `anon/public` and `service_role`

### 1.2 Run Database Migrations

**IMPORTANT:** Run SQL migrations in numerical order (00, 01, 02, etc.)

1. In Supabase Dashboard → **SQL Editor**
2. Run migrations from `sql/` folder in order:

```bash
# Core Schema
00-create-tables.sql         # Creates all tables
01-setup-rls.sql            # Row Level Security policies
02-setup-admin.sql          # Admin user configuration

# Features
05-art-and-points-tables.sql
06-seed-data.sql
07-real-menu-data.sql
08-workshops-art-data.sql
...
# Continue with all numbered migrations up to latest
```

3. Verify tables created: **Table Editor** → Check for:
   - `profiles`
   - `menu_items`
   - `orders`
   - `order_items`
   - `coupons`
   - `workshops`
   - `art_pieces`
   - etc.

### 1.3 Configure Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create public buckets:
   - `products` (for menu items)
   - `workshops` (for workshop images)
   - `gallery` (for art pieces)
   - `avatars` (for user profile photos)

3. Set policies to **public read** for all buckets:
   ```sql
   -- Example policy for products bucket
   CREATE POLICY "Public Access" ON storage.objects
   FOR SELECT USING (bucket_id = 'products');
   ```

### 1.4 Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add User** → Create with email/password
3. Note the user's `id` (UUID)
4. In **SQL Editor**, run:
   ```sql
   -- Replace 'your-user-id' with actual UUID
   UPDATE profiles 
   SET role = 'superadmin' 
   WHERE id = 'your-user-id';
   ```

---

## 🔐 Part 2: Authentication Configuration

### 2.1 Configure Supabase Authentication

#### A. Email Authentication Setup

1. Navigate to: **Authentication** → **Providers** → **Email**
2. Enable: ✅ **Enable Email provider**
3. Enable: ✅ **Confirm email** (recommended for production)
4. Configure rate limits as needed

#### B. Google OAuth Setup

1. Still in **Authentication** → **Providers**, select **Google**
2. Enable: ✅ **Enable Google provider**
3. You'll need **Client ID** and **Client Secret** from Google Cloud Console (see Part 3)
4. Authorized Client IDs: Leave empty for now (will configure after Google setup)
5. Skip Actions: Leave unchecked

#### C. URL Configuration (CRITICAL)

> [!IMPORTANT]
> **This is the most critical step for fixing authentication redirects!**

1. Navigate to: **Authentication** → **URL Configuration**

2. **Site URL**: Set to your production domain
   ```
   https://your-production-domain.com
   ```
   OR if using Vercel:
   ```
   https://rabuste-coffee.vercel.app
   ```

3. **Redirect URLs**: Add BOTH development and production URLs (comma-separated):
   ```
   http://localhost:3000/auth/callback,
   https://your-production-domain.com/auth/callback
   ```

4. Click **Save**

#### D. Email Templates (Optional but Recommended)

Customize email templates: **Authentication** → **Email Templates**

Templates to customize:
- **Confirm signup**: Welcome message + verification link
- **Magic Link**: Passwordless login email
- **Change Email Address**: Email change confirmation
- **Reset Password**: Password reset email

**Tips:**
- Use your brand name "Rabuste Coffee"
- Ensure all links use `{{ .SiteURL }}`
- Add branded footer
- Test with real email address

---

## 🌐 Part 3: Google OAuth Configuration

### 3.1 Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project OR create new project
3. Navigate to: **APIs & Services** → **Credentials**

### 3.2 Create OAuth 2.0 Client ID (if not exists)

1. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. If prompted, configure OAuth consent screen first:
   - User Type: **External**
   - App name: **Rabuste Coffee**
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `email`, `profile`, `openid`
   - Test users: Add your email (for testing)

3. Choose Application type: **Web application**
4. Name: `Rabuste Coffee Web App`

### 3.3 Configure Authorized Origins & Redirect URIs

> [!WARNING]
> **URLs must match EXACTLY** - no trailing slashes, case-sensitive

**Authorized JavaScript origins:**
```
http://localhost:3000
https://your-production-domain.com
https://[your-project-id].supabase.co
```

**Authorized redirect URIs:**
```
http://localhost:3000/auth/callback
https://your-production-domain.com/auth/callback
https://[your-project-id].supabase.co/auth/v1/callback
```

> [!NOTE]
> The Supabase callback URL (`https://[project].supabase.co/auth/v1/callback`) is required because OAuth flow goes through Supabase's auth service first.

5. Click **CREATE**
6. Copy **Client ID** and **Client secret** (you'll need these for Supabase)

### 3.4 Link Google OAuth to Supabase

1. Return to Supabase Dashboard
2. **Authentication** → **Providers** → **Google**
3. Paste:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
4. Click **Save**

---

## ☁️ Part 4: Vercel Deployment

### 4.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your GitHub repository: `rabuste-coffee`
4. Framework Preset: **Next.js** (auto-detected)
5. Root Directory: `./` (project root)

### 4.2 Configure Environment Variables

> [!CAUTION]
> **Use Production API Keys** - Do NOT use test keys in production!

In Vercel Dashboard → **Settings** → **Environment Variables**, add:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay (LIVE KEYS for production)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key

# Google Gemini AI
GEMINI_API_KEY=AIzaSy...

# Google reCAPTCHA (Optional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
RECAPTCHA_SECRET_KEY=6Lc...
```

**Environment:** Select **Production**, **Preview**, and **Development** for all variables

### 4.3 Build & Deploy

1. Click **Deploy**
2. Wait for build to complete (~2-5 minutes)
3. Visit deployment URL: `https://rabuste-coffee.vercel.app` (or your custom domain)
4. Verify homepage loads correctly

### 4.4 Configure Custom Domain (Optional)

1. In Vercel Dashboard → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain: `rabuste-coffee.com`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~5-60 minutes)

> [!NOTE]
> If using custom domain, update Supabase Site URL and Google OAuth origins to use the custom domain instead of `.vercel.app`

---

## ✅ Part 5: Post-Deployment Verification

### 5.1 Test Authentication Flows

> [!IMPORTANT]
> **Use Incognito/Private Browsing Mode** to test authentication without cached sessions

#### Test 1: Google OAuth Login

1. Open production URL in **incognito window**
2. Click user icon → **Login**
3. Select **Continue with Google**
4. Choose Google account
5. **Verify redirect URL in address bar:**
   - Should see: `https://your-production-domain.com/auth/callback?code=...`
   - Then redirect to: `https://your-production-domain.com/`
6. Check that you're logged in (name appears in navbar)
7. Go to `/profile` → Verify profile data loaded

**❌ If you see `localhost:3000`:**
- Go back to Supabase → Authentication → URL Configuration
- Verify Site URL is production domain
- Verify Redirect URLs includes production domain
- Clear browser cache and try again

#### Test 2: Email/Password Signup

1. Click user icon → **Sign Up**
2. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!@#
3. Submit registration
4. **Check email inbox** for verification email
5. Click verification link in email
6. **Verify redirect:** Should go to production URL, not localhost
7. Complete login

#### Test 3: Password Reset

1. Click **Forgot Password**
2. Enter email address
3. Check email for reset link
4. Click link → Verify redirects to production URL
5. Enter new password
6. Verify login works

### 5.2 Test E-Commerce Features

#### Test Order Flow

1. Browse to `/menu`
2. Add items to cart
3. Click **Pay Now**
4. Verify Razorpay modal opens
5. **Use Razorpay test cards** (if still in test mode):
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
6. Complete payment
7. Verify:
   - Payment success screen appears
   - PDF receipt downloads
   - Order appears in profile
   - Email confirmation sent (if configured)

#### Test Workshop Booking

1. Go to `/workshops`
2. Click **Register** on a workshop
3. Enter details and complete payment
4. Verify booking confirmation

#### Test Art Gallery Purchase

1. Go to `/gallery`
2. Click on art piece
3. Add to cart and purchase
4. Verify purchase appears in profile

### 5.3 Test Admin Panel

1. Login with admin account
2. Navigate to `/admin`
3. Verify access (non-admins should be redirected)
4. Test:
   - Menu management (add/edit product)
   - Order management (view orders, update status)
   - Workshop management
   - Customer management
   - AI Analytics (ask a query)

### 5.4 Database Verification

Check Supabase Dashboard:

1. **Authentication** → **Users**
   - New users should appear after signup
   - Google OAuth users should have provider metadata

2. **Table Editor** → **profiles**
   - Profile rows should be created automatically
   - Role should be `customer` by default
   - Google users should have `avatar_url` populated

3. **Table Editor** → **orders**
   - Completed orders should appear
   - `payment_status` should be `paid`
   - `razorpay_order_id` should be populated

---

## 🐛 Troubleshooting

### Issue: Authentication redirects to localhost

**Root Cause:** Supabase Site URL not configured correctly

**Solution:**
1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to production domain
3. Add production domain to **Redirect URLs**
4. Clear browser cache and cookies
5. Try again in incognito mode

### Issue: "Redirect URI mismatch" error (Google OAuth)

**Root Cause:** Google OAuth redirect URIs don't match

**Solution:**
1. Google Cloud Console → **Credentials** → Your OAuth Client
2. Check **Authorized redirect URIs**
3. Ensure these are included:
   ```
   https://your-domain.com/auth/callback
   https://[project].supabase.co/auth/v1/callback
   ```
4. URLs must match EXACTLY (no trailing slash)
5. Wait 5 minutes for Google to propagate changes

### Issue: "Invalid session" or "Session expired"

**Root Cause:** Cookie domain mismatch or HTTPS issues

**Solution:**
1. Ensure production site is served over **HTTPS** (Vercel does this automatically)
2. Check browser console for cookie errors
3. Verify Supabase → **Authentication** → **Settings** → Cookie options
4. Try clearing all cookies and logging in again

### Issue: Email verification link broken

**Root Cause:** Email template uses wrong base URL

**Solution:**
1. Supabase → **Authentication** → **Email Templates**
2. Verify templates use `{{ .SiteURL }}` for links
3. Check Site URL is set correctly
4. Test with new signup

### Issue: Razorpay payment not working

**Root Cause:** Using test keys in production or incorrect key configuration

**Solution:**
1. Verify environment variables in Vercel:
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` should be `rzp_live_...`
   - `RAZORPAY_KEY_SECRET` should be live secret
2. Check Razorpay Dashboard for payment logs
3. Verify webhook configuration (if using webhooks)
4. Check browser console for errors

### Issue: Images not loading

**Root Cause:** Supabase storage buckets not configured or wrong URLs

**Solution:**
1. Supabase → **Storage**
2. Verify buckets exist: `products`, `workshops`, `gallery`, `avatars`
3. Check bucket policies allow public read
4. Verify image URLs in database are correct format:
   ```
   https://[project].supabase.co/storage/v1/object/public/products/image.jpg
   ```

### Issue: Admin panel not accessible

**Root Cause:** User role not set correctly

**Solution:**
1. Supabase → **Table Editor** → `profiles`
2. Find your user's row
3. Set `role` column to `admin` or `superadmin`
4. Logout and login again

### Issue: Build fails on Vercel

**Root Cause:** TypeScript errors or missing dependencies

**Solution:**
1. Check Vercel build logs
2. Run locally:
   ```bash
   npm run build
   ```
3. Fix any TypeScript errors
4. Verify all dependencies in `package.json`
5. Commit and push fixes
6. Redeploy on Vercel

---

## 📊 Performance Optimization

After successful deployment, optimize performance:

### 1. Enable Vercel Analytics

1. Vercel Dashboard → **Analytics**
2. Enable Web Analytics
3. Monitor Core Web Vitals

### 2. Configure Caching

In `next.config.ts`:
```typescript
images: {
  minimumCacheTTL: 60,
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
}
```

### 3. Database Indexing

Add indexes for frequently queried columns:
```sql
-- In Supabase SQL Editor
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_menu_items_category ON menu_items(category);
```

### 4. Monitor with Lighthouse

1. Open production site in Chrome
2. Open DevTools → **Lighthouse** tab
3. Run audit for:
   - Performance (target: 90+)
   - Accessibility (target: 90+)
   - SEO (target: 90+)
   - Best Practices (target: 90+)

---

## 🔒 Security Checklist

- [ ] All environment variables set in Vercel (not in code)
- [ ] `.env.local` added to `.gitignore`
- [ ] Razorpay live keys used (not test keys)
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Supabase RLS policies enabled on all tables
- [ ] Admin role checking enforced in middleware
- [ ] API routes validate user authentication
- [ ] No sensitive data in client-side code
- [ ] CORS configured if needed
- [ ] Rate limiting enabled on Supabase Auth

---

## 📈 Monitoring & Maintenance

### Set Up Monitoring

1. **Vercel Logs**
   - Dashboard → **Logs**
   - Monitor real-time requests and errors

2. **Supabase Logs**
   - Dashboard → **Logs Explorer**
   - Track database queries and auth events

3. **Error Tracking** (Optional)
   - Integrate Sentry for frontend errors
   - Configure Supabase webhooks for database events

### Regular Maintenance

- **Weekly:** Check error logs, monitor payment success rate
- **Monthly:** Review analytics, optimize slow queries
- **Quarterly:** Update dependencies, review security settings
- **As needed:** Add new features, update content

---

## 🎉 Launch Checklist

Before announcing to users:

- [ ] All authentication flows tested (Google, email, password reset)
- [ ] Payment flow tested with real transaction
- [ ] Workshop booking tested
- [ ] Gallery purchase tested
- [ ] Admin panel accessible and functional
- [ ] Email notifications working
- [ ] Mobile responsiveness verified
- [ ] Performance score 90+ on Lighthouse
- [ ] All images loading correctly
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (HTTPS working)
- [ ] Legal pages added (Privacy Policy, Terms of Service)
- [ ] Contact information updated
- [ ] Social media links working
- [ ] Google Analytics configured (if desired)

---

## 📞 Support Resources

- **Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Docs:** [https://vercel.com/docs](https://vercel.com/docs)
- **Razorpay Docs:** [https://razorpay.com/docs](https://razorpay.com/docs)
- **Google OAuth:** [https://developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)

---

**Congratulations!** 🎉 Your Rabuste Coffee website is now live in production!
