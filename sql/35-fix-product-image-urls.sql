-- SQL FILE 35: Fix Product Image URLs
-- Sets all image_url to NULL so products use default fallback images
-- Only uploaded images should have 'product-images/' paths from Supabase Storage

-- Update all products to have NULL image_url
-- This makes them use the getMenuItemImageUrl() fallback
UPDATE products 
SET image_url = NULL
WHERE image_url IS NOT NULL 
  AND NOT image_url LIKE 'product-images/%';

-- Verification
SELECT 
  COUNT(*) as total_products,
  COUNT(*) FILTER (WHERE image_url IS NOT NULL) as products_with_images,
  COUNT(*) FILTER (WHERE image_url LIKE 'product-images/%') as uploaded_images
FROM products;

-- Show products with uploaded images
SELECT id, name, image_url 
FROM products 
WHERE image_url LIKE 'product-images/%';

SELECT '✅ All legacy image paths removed. Products will use fallback images.' as status;
