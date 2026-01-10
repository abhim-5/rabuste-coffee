-- Check exact image paths in database and compare to Supabase Storage structure

-- Show all products with uploaded images
SELECT 
  id,
  name,
  image_url,
  'Expected URL: https://cxwudthziqkqazzpatlp.supabase.co/storage/v1/object/public/products/' || image_url as full_url
FROM products
WHERE image_url LIKE 'product-images/%'
ORDER BY name;

-- Expected storage structure:
-- Bucket: products
-- Path: product-images/{productId}-{random}.{ext}
-- Full URL: https://{supabase}/storage/v1/object/public/products/product-images/{filename}

SELECT 'Check if these URLs load in browser. If 404, file doesnt exist in Storage.' as instruction;
