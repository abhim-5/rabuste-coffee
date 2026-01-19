# 🚀 Production Deployment Checklist

This checklist ensures your Rabuste Coffee website is optimized for production deployment on Vercel.

## ✅ Completed Optimizations

### 1. **Console Logs Removed** ✓
- All `console.log`, `console.warn`, and `console.error` statements removed from production code
- Next.js config set to automatically remove console logs in production builds
- Only critical error logs are preserved

### 2. **Next.js Configuration Optimized** ✓
Located in: `next.config.ts`
- ✅ React Strict Mode enabled
- ✅ Image optimization (WebP/AVIF formats)
- ✅ Automatic console removal in production
- ✅ Powered-by header disabled for security
- ✅ Compression enabled
- ✅ Package imports optimized (lucide-react, framer-motion)

### 3. **3D Model Optimization** ✓
Located in: `src/components/3d/CoffeeModel3D.tsx`
- ✅ Model preloading enabled with `useGLTF(path, true)`
- ✅ Proper error boundaries and fallbacks
- ✅ WebGL context loss handling
- ✅ Lazy loading with Suspense
- ✅ Optimized camera settings for mobile/desktop
- ✅ Performance settings: `powerPreference: "high-performance"`
- ✅ Canvas optimizations: `preserveDrawingBuffer: false`

### 4. **Code Splitting & Lazy Loading** ✓
- ✅ Heavy components lazy loaded with `dynamic()`:
  - ArtGallery
  - FestsAndWorkshops
  - CustomerReviews
  - OwnerWords (client-side only)
- ✅ Loading states for all lazy components

### 5. **SEO & Metadata Enhanced** ✓
Located in: `src/app/layout.tsx`
- ✅ Comprehensive meta tags
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card metadata
- ✅ Robots meta for search engines
- ✅ Keywords and descriptions optimized
- ✅ Structured data ready

### 6. **Image Optimization** ✓
- ✅ Next.js Image component used throughout
- ✅ Modern formats (WebP, AVIF) configured
- ✅ Responsive image sizes defined
- ✅ Lazy loading enabled by default
- ✅ Video poster frame added for hero section

### 7. **Font Optimization** ✓
Located in: `src/app/layout.tsx`
- ✅ Google Fonts with `display: swap`
- ✅ Font preconnect for faster loading
- ✅ Font subsetting enabled

### 8. **Git Configuration** ✓
Located in: `.gitignore`
- ✅ `.next/` folder ignored
- ✅ `node_modules/` ignored
- ✅ `.env*` files ignored
- ✅ Build artifacts ignored
- ✅ TypeScript build info ignored

## 📋 Pre-Deployment Steps

### Before Pushing to GitHub:

1. **Test Build Locally**
   ```bash
   npm run build
   npm run start
   ```
   - Verify all pages load correctly
   - Check console for any warnings
   - Test on mobile viewport

2. **Environment Variables**
   - Create `.env.local` (not committed to git)
   - Add all required API keys and secrets
   - In Vercel dashboard, add same variables

3. **Verify All Assets Exist**
   - ✅ `/video.mp4` (hero video)
   - ✅ `/video-poster.jpg` (hero video poster - create if missing)
   - ✅ `/Rabuste logo.png` (favicon)
   - ✅ `/about us/coffee.glb` (3D model)
   - ✅ All gallery images
   - ✅ All public assets

4. **Test Performance**
   ```bash
   npm run build
   ```
   - Check build output for warnings
   - Note bundle sizes
   - Verify no critical errors

## 🔐 Authentication & Deployment Configuration

### 1. Supabase Authentication Setup

**Before deploying to production:**

1. **Configure Redirect URLs** (CRITICAL)
   - Navigate to: Supabase Dashboard → Authentication → URL Configuration
   - Set **Site URL** to production domain:
     ```
     https://your-production-domain.com
     ```
   - Add to **Redirect URLs** (comma-separated):
     ```
     http://localhost:3000/auth/callback,
     https://your-production-domain.com/auth/callback
     ```
   - ✅ SAVE changes

2. **Enable Email Provider**
   - Authentication → Providers → Email
   - ✅ Enable Email provider
   - ✅ Enable "Confirm email" (recommended)
   - Configure rate limits as needed

3. **Configure Google OAuth**
   - Authentication → Providers → Google
   - ✅ Enable Google provider
   - Add Client ID (from Google Cloud Console)
   - Add Client Secret (from Google Cloud Console)
   - ✅ SAVE

4. **Customize Email Templates** (Optional)
   - Authentication → Email Templates
   - Update "Confirm signup" template
   - Update "Reset Password" template
   - Ensure templates use `{{ .SiteURL }}` for links
   - Use brand name "Rabuste Coffee"

### 2. Google OAuth Configuration

**In Google Cloud Console:**

1. **Access Credentials**
   - Go to [console.cloud.google.com](https://console.cloud.google.com/)
   - Select your project
   - APIs & Services → Credentials

2. **Configure OAuth Client**
   - Select your OAuth 2.0 Client ID
   - Under **Authorized JavaScript origins**, add:
     ```
     http://localhost:3000
     https://your-production-domain.com
     https://[your-supabase-project].supabase.co
     ```
   - Under **Authorized redirect URIs**, add:
     ```
     http://localhost:3000/auth/callback
     https://your-production-domain.com/auth/callback
     https://[your-supabase-project].supabase.co/auth/v1/callback
     ```
   - ✅ SAVE (wait 5 minutes for propagation)

### 3. Environment Variables Verification

**Required variables for production:**

- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- ✅ `NEXT_PUBLIC_RAZORPAY_KEY_ID` - **LIVE** key (rzp_live_xxx)
- ✅ `RAZORPAY_KEY_SECRET` - **LIVE** secret key
- ✅ `GEMINI_API_KEY` - Google Gemini API key
- ✅ `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA site key (optional)
- ✅ `RECAPTCHA_SECRET_KEY` - reCAPTCHA secret key (optional)

**Set in Vercel Dashboard:**
- Settings → Environment Variables
- Add all variables
- Select: Production, Preview, Development


## 🚀 Vercel Deployment Steps

### 1. Connect GitHub Repository
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository

### 2. Configure Project
```
Framework Preset: Next.js
Build Command: npm run build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: npm install (auto-detected)
```

### 3. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
- Add all variables from your `.env.local`
- Set appropriate environment (Production/Preview/Development)

### 4. Deploy
- Click "Deploy"
- Wait for build to complete
- Test deployment URL

## 🔧 Performance Best Practices Applied

### Loading Strategy
1. **Above-the-fold**: Loads immediately
   - Hero video with poster
   - Navbar
   - Initial content

2. **Below-the-fold**: Lazy loaded
   - Art gallery
   - Customer reviews
   - Workshops section
   - Footer

3. **Heavy Components**: Dynamic imports
   - 3D Coffee Model (about page)
   - OwnerWords (external scripts)
   - Gallery kinetic effects

### Caching Strategy
- **Images**: Automatic Next.js optimization (60s min cache)
- **Static Assets**: Served from CDN
- **API Routes**: Configure based on data freshness needs

## 📊 Performance Monitoring

After deployment, test with:

1. **Google PageSpeed Insights**
   - Target: 90+ score
   - Check Core Web Vitals

2. **Lighthouse (Chrome DevTools)**
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

3. **WebPageTest**
   - First Contentful Paint < 1.8s
   - Time to Interactive < 3.8s
   - Total Blocking Time < 200ms

## 🐛 Common Issues & Solutions

### Issue: Build fails on Vercel
**Solution**: 
- Check Node.js version (use 18.x or 20.x)
- Verify all dependencies in package.json
- Check for TypeScript errors locally first

### Issue: Images not loading
**Solution**:
- Verify all images exist in `/public` folder
- Check file paths (case-sensitive)
- Add image domains to `next.config.ts` if using external images

### Issue: 3D model not loading
**Solution**:
- Verify `/public/about us/coffee.glb` exists
- Check browser console for WebGL errors
- Ensure proper URL encoding (%20 for spaces)

### Issue: Hydration errors
**Solution**:
- Already handled with `suppressHydrationWarning` on html tag
- OwnerWords component set to `ssr: false`

## 🔐 Security Checklist

- ✅ No API keys in frontend code
- ✅ Environment variables properly configured
- ✅ Powered-by header removed
- ✅ No sensitive data in git repository
- ✅ CORS properly configured (if using API routes)

## 📱 Mobile Optimization

- ✅ Responsive design implemented
- ✅ Touch events handled
- ✅ Mobile-specific 3D model settings
- ✅ Video `playsInline` for iOS
- ✅ Viewport meta tag configured

## 🎯 Post-Deployment Tasks

1. **Set up Domain** (if custom domain)
   - Configure DNS in domain registrar
   - Add domain in Vercel dashboard
   - Enable HTTPS (automatic with Vercel)

2. **Analytics** (optional)
   - Add Vercel Analytics
   - Or integrate Google Analytics
   - Set up error monitoring (Sentry, etc.)

3. **Monitoring**
   - Set up uptime monitoring
   - Configure Vercel alerts
   - Monitor Core Web Vitals

4. **SEO**
   - Submit sitemap to Google Search Console
   - Verify site ownership
   - Monitor indexing status

## ✨ Additional Recommendations

### Consider Adding:
1. **PWA Support** - Make app installable
2. **Service Worker** - Offline support
3. **Sitemap Generation** - Automatic sitemap.xml
4. **RSS Feed** - For blog/updates if applicable
5. **Structured Data** - Schema.org markup for rich results

### Performance Tips:
- Use Vercel Edge Functions for API routes (faster)
- Enable Vercel Image Optimization (already configured)
- Consider Edge Middleware for geolocation
- Monitor bundle sizes with `@next/bundle-analyzer`

---

## 🎉 You're Ready to Deploy!

Your application is now production-ready with:
- ✅ No console logs
- ✅ Optimized images and assets
- ✅ Code splitting and lazy loading
- ✅ 3D model optimization
- ✅ SEO best practices
- ✅ Performance optimizations
- ✅ Proper error handling

**Next Step**: Push to GitHub and deploy to Vercel! 🚀
