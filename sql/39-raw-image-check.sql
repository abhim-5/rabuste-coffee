-- Show ALL image_url values (not filtered)
SELECT 
  id,
  name,
  image_url
FROM products
WHERE image_url IS NOT NULL
ORDER BY id
LIMIT 10;

-- If this returns nothing, ALL products have NULL image_url
