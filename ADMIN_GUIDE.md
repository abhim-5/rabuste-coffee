# Admin Dashboard Access Guide

## 🚀 Quick Start

### 1. Run the SQL Setup
Execute this SQL in your Supabase SQL Editor:
```sql
-- Run sql/25-admin-system-enhancement.sql
```

This creates:
- Admin activity logging table
- Helper functions (is_admin, is_superadmin)
- Dashboard stats view
- Profile enhancements (credits, banned status)

### 2. Set Your Role to Superadmin

In Supabase Dashboard:
1. Go to **Table Editor** → **profiles**
2. Find your user row
3. Change `role` column to: `superadmin`
4. Save

### 3. Access the Admin Dashboard

Visit: `http://localhost:3000/admin`

You'll see:
- ✅ Collapsible sidebar with all admin pages
- ✅ Dashboard with revenue & user stats
- ✅ Menu management
- ✅ Customer analytics
- ✅ Workshop management
- ✅ Art gallery analytics

## 📊 Available Pages

| Route | Description |
|-------|-------------|
| `/admin` | Main dashboard with stats |
| `/admin/menu` | Menu management (toggle availability, deal of day) |
| `/admin/customers` | Customer analytics (CLV, tiers, points) |
| `/admin/workshops` | Workshop management (booking rate, attendance) |
| `/admin/gallery` | Art gallery (revenue by artist) |

## 🔐 Roles

- **superadmin** - Full access to all admin features
- **admin** - Access to admin dashboard (future: limited permissions)
- **staff** - No admin access (customer-facing only)
- **customer** - Regular user

## 🎨 Design

- **Color Scheme:** Navy (#1a202c) + Gold (#D4AF37)
- **Distinct from user site:** Professional, data-dense
- **Real-time data:** All from Supabase, no mocks

## ⚠️ Important Notes

1. **Middleware protection** - `/admin/*` routes are protected server-side
2. **Activity logging** - All admin actions are logged in `admin_activity_log`
3. **Auth required** - Must be signed in with superadmin role
4. **Dev server** - Run `npm run dev` to test locally

## 🐛 Troubleshooting

**Can't access /admin?**
- Check your role is set to `superadmin` in Supabase
- Make sure you're signed in
- Clear browser cache and refresh

**Old dashboard showing?**
- The old `/dashboard` has been deleted
- Only `/admin` exists now

**Not seeing data?**
- Run the SQL setup script
- Check Supabase connection
- Verify RLS policies allow admin access
