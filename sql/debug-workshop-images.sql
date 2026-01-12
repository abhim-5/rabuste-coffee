-- Check workshop image URLs in database
SELECT id, title, image_url 
FROM workshops 
WHERE image_url IS NOT NULL;
