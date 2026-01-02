# 🚀 Quick Deploy Guide

## Pre-Deployment (5 minutes)

### 1. Run Pre-Deploy Check
```bash
npm run pre-deploy
```
This checks for missing files, console.logs, and other issues.

### 2. Test Build
```bash
npm run build
```
Should complete without errors.

### 3. Test Production Locally
```bash
npm run start
```
Open http://localhost:3000 and verify everything works.

---

## Deploy to Vercel (5 minutes)

### First Time Setup

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repo

3. **Configure (auto-detected)**
   - Framework: Next.js ✅
   - Build: `npm run build` ✅
   - Output: `.next` ✅

4. **Add Environment Variables** (if any)
   - Click "Environment Variables"
   - Add your `.env.local` variables
   - Don't commit secrets to GitHub!

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! 🎉

### Subsequent Deploys

Just push to GitHub:
```bash
git add .
git commit -m "Update"
git push
```
Vercel auto-deploys! ⚡

---

## Verify Deployment

### 1. Check Performance
Visit: https://pagespeed.web.dev/
- Paste your Vercel URL
- Target: 90+ score

### 2. Test Features
- ✅ Video loads and plays
- ✅ 3D model displays
- ✅ Images load fast
- ✅ No console errors
- ✅ Mobile responsive

### 3. Monitor
- Vercel Dashboard → Your Project → Analytics
- Check for errors and performance

---

## Common Issues

### Build Failed?
```bash
# Test locally first
npm run build

# Fix TypeScript errors
npm run type-check
```

### Images Not Loading?
- Check file paths (case-sensitive!)
- Verify files in `/public` folder

### 3D Model Not Loading?
- Verify `/public/about us/coffee.glb` exists
- Check browser console for errors

### Environment Variables Not Working?
- Add in Vercel Dashboard
- Settings → Environment Variables
- Redeploy after adding

---

## Performance Tips

### What to Monitor:
- **First Contentful Paint**: < 1.8s ✅
- **Time to Interactive**: < 3.8s ✅
- **Largest Contentful Paint**: < 2.5s ✅

### If Slow:
1. Check image sizes (should use WebP)
2. Enable Vercel Analytics
3. Check bundle size with build output
4. Lazy load more components

---

## Important Commands

```bash
# Development
npm run dev              # Start dev server

# Production Testing
npm run build            # Build for production
npm run start            # Run production build
npm run pre-deploy       # Check before deploying

# Code Quality
npm run lint             # Check for errors
npm run type-check       # TypeScript check
```

---

## File Checklist

Before deploying, ensure these exist:

**Configuration:**
- ✅ `next.config.ts`
- ✅ `package.json`
- ✅ `.gitignore`
- ✅ `tsconfig.json`

**Public Assets:**
- ✅ `public/Rabuste logo.png`
- ✅ `public/video.mp4`
- ✅ `public/about us/coffee.glb`
- ✅ `public/manifest.json`
- ✅ `public/robots.txt`

**Documentation:**
- ✅ `PRODUCTION_CHECKLIST.md`
- ✅ `3D_MODEL_OPTIMIZATION.md`
- ✅ `OPTIMIZATION_SUMMARY.md`

---

## After Deployment

### 1. Set Custom Domain (Optional)
- Vercel Dashboard → Settings → Domains
- Add your domain
- Update DNS records

### 2. Enable Analytics
- Vercel Dashboard → Analytics
- Enable for free
- Monitor Core Web Vitals

### 3. SEO Setup
- Google Search Console
- Submit sitemap: `your-domain.com/sitemap.xml`
- Monitor indexing

---

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

---

## 🎯 Expected Results

After deployment:
- ✅ **Lighthouse Score**: 90-95
- ✅ **Load Time**: 1-2 seconds
- ✅ **Mobile Performance**: Excellent
- ✅ **SEO Ready**: Yes
- ✅ **PWA Installable**: Yes

---

## Need Help?

1. Check `PRODUCTION_CHECKLIST.md` for detailed guide
2. Check `3D_MODEL_OPTIMIZATION.md` for 3D issues
3. Check Vercel deployment logs
4. Check browser console for errors

---

## 🎉 You're Ready!

Your site is optimized and ready to deploy.

**Next step**: Push to GitHub and deploy to Vercel!

```bash
git add .
git commit -m "Production optimizations complete"
git push origin main
```

Then go to Vercel and import your repo. That's it! 🚀
