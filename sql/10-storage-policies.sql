-- Storage bucket policies for Rabuste Coffee
-- Run these in Supabase SQL Editor after creating storage buckets

-- =====================================================
-- STORAGE BUCKETS TO CREATE IN SUPABASE DASHBOARD:
-- =====================================================
-- 1. products (for product images)
-- 2. gallery (for art pieces)
-- 3. workshops (for workshop images)
-- 4. profiles (for user avatars)
-- 
-- Settings for each bucket:
-- - Public: true (so images can be accessed without auth)
-- - File size limit: 5MB
-- - Allowed MIME types: image/jpeg, image/png, image/webp, image/jpg
-- =====================================================

-- Enable storage if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PRODUCTS BUCKET POLICIES
-- Anyone can view product images (public bucket)
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- Only staff/admin/superadmin can upload product images
CREATE POLICY "Staff can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('staff', 'admin', 'superadmin')
);

-- Only staff/admin/superadmin can update product images
CREATE POLICY "Staff can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'products' 
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('staff', 'admin', 'superadmin')
);

-- Only admin/superadmin can delete product images
CREATE POLICY "Admin can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products' 
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('admin', 'superadmin')
);

-- =====================================================
-- GALLERY (ART) BUCKET POLICIES
-- =====================================================

-- Anyone can view art images (public bucket)
CREATE POLICY "Art images are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery' );

-- Only staff/admin/superadmin can upload art images
CREATE POLICY "Staff can upload art images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery' 
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('staff', 'admin', 'superadmin')
);

-- Only staff/admin/superadmin can update art images
CREATE POLICY "Staff can update art images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gallery' 
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('staff', 'admin', 'superadmin')
);

-- Only admin/superadmin can delete art images
CREATE POLICY "Admin can delete art images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery' 
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('admin', 'superadmin')
);

-- =====================================================
-- WORKSHOPS BUCKET POLICIES
-- =====================================================

-- Anyone can view workshop images (public bucket)
CREATE POLICY "Workshop images are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'workshops' );

-- Only staff/admin/superadmin can upload workshop images
CREATE POLICY "Staff can upload workshop images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'workshops' 
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('staff', 'admin', 'superadmin')
);

-- Only staff/admin/superadmin can update workshop images
CREATE POLICY "Staff can update workshop images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'workshops' 
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('staff', 'admin', 'superadmin')
);

-- Only admin/superadmin can delete workshop images
CREATE POLICY "Admin can delete workshop images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'workshops' 
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('admin', 'superadmin')
);

-- =====================================================
-- PROFILES BUCKET POLICIES (User Avatars)
-- =====================================================

-- Anyone can view profile avatars (public bucket)
CREATE POLICY "Profile avatars are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profiles' );

-- Users can upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
