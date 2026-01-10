-- Quick diagnostic: Check what image_url values are in the database

SELECT 
  name,
  image_url,
  CASE 
    WHEN image_url IS NULL THEN 'NULL - will use fallback'
    WHEN image_url LIKE 'product-images/%' THEN 'Supabase Storage upload'
    ELSE 'Invalid local path'
  END as status
FROM products
ORDER BY 
  CASE 
    WHEN image_url IS NULL THEN 1
    WHEN image_url LIKE 'product-images/%' THEN 2
    ELSE 3
  END,
  name
LIMIT 20;

-- Count by type
SELECT 
  CASE 
    WHEN image_url IS NULL THEN 'NULL'
    WHEN image_url LIKE 'product-images/%' THEN 'Uploaded'
    ELSE 'Legacy'
  END as type,
  COUNT(*) as count
FROM products
GROUP BY type;
