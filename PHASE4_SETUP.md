# Phase 4 Setup Instructions

## RLS Policy Setup (Required)

To complete Phase 4, you need to run the SQL scripts in your Supabase dashboard:

### 1. Open Supabase Dashboard
- Go to your Supabase project dashboard
- Navigate to SQL Editor

### 2. Run SQL Scripts in Order
Run these scripts in the `/sql` folder in order:

```sql
-- 1. First run: 01-profiles-rls.sql
-- Sets up role-based access for profiles table

-- 2. Then run: 02-products-rls.sql  
-- Sets up product management permissions

-- 3. Then run: 03-orders-rls.sql
-- Sets up order management permissions

-- 4. Finally run: 04-workshops-rls.sql
-- Sets up workshop management permissions
```

### 3. Test Role Assignment (Development Only)

Once you have a user account:

1. **Login to your app**
2. **Make yourself admin** (development only):
   ```bash
   # In browser console or API client:
   fetch('/api/admin/roles', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' }
   })
   ```

3. **Access Dashboard**:
   - Visit `/dashboard` to see the staff interface
   - Dashboard will only appear if you have staff/admin/superadmin role

## Features Available After Setup

### Staff Dashboard (`/dashboard`)
- ✅ **Order Management** - View and update order status
- ✅ **Product Management** - Add/edit/disable products  
- ✅ **Workshop Management** - Create and manage workshops
- ✅ **Overview Stats** - Revenue, orders, products summary

### Role Permissions
- ✅ **Customer** - Can place orders, view own profile
- ✅ **Staff** - Can manage orders, create products/workshops
- ✅ **Admin** - All staff permissions + delete products/workshops
- ✅ **Superadmin** - All permissions + role management

### Security Features
- ✅ **RLS Policies** - Database-level security
- ✅ **Route Protection** - Middleware blocks unauthorized access
- ✅ **Role Checking** - Component-level permission checks

## Verification

After running the SQL scripts:

1. **Test Authentication** - Sign up/login works
2. **Test Role Assignment** - Use development endpoint to become admin
3. **Test Dashboard Access** - Visit `/dashboard` as admin
4. **Test Permissions** - Try different role-restricted actions

Your app now has complete role-based access control as specified in Phase 4 of the roadmap!