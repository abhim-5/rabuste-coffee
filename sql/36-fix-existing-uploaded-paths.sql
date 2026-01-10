-- SQL FILE 36: Fix Existing Uploaded Image Paths
-- Adds 'product-images/' prefix to uploaded images that are missing it

-- Find images that look like Supabase uploads but missing prefix
-- (UUID-like filenames without the product-images/ prefix)
UPDATE products 
SET image_url = 'product-images/' || image_url
WHERE image_url IS NOT NULL 
  AND image_url NOT LIKE 'product-images/%'
  AND image_url NOT LIKE '%/%'  -- Doesn't contain any slash (means it's an uploaded file)
  AND LENGTH(image_url) > 20;  -- UUID filenames are long

-- Verification
SELECT 
  id,
  name,
  image_url,
  CASE 
    WHEN image_url LIKE 'product-images/%' THEN 'Supabase Storage'
    WHEN image_url IS NULL THEN 'Uses Fallback'
    ELSE 'Unknown'
  END as image_source
FROM products
WHERE image_url IS NOT NULL
ORDER BY image_source, name;

SELECT '✅ Fixed uploaded image paths to include product-images/ prefix' as status;
