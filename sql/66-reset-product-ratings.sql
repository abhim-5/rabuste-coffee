-- Reset static ratings in the products table to 0.
-- This removes the dummy data (e.g. 4.5 stars, 45 reviews) seeded previously.
-- The application now uses 'products_with_ratings_view' to calculate real ratings dynamically from 'product_ratings'.

UPDATE products 
SET 
  rating = 0, 
  review_count = 0;

-- Optional: If you want to delete any existing test reviews in 'product_ratings' to start fresh:
-- TRUNCATE TABLE product_ratings;
