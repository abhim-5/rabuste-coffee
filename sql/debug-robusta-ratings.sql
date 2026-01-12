-- Check products and their ratings
SELECT id, name, rating, review_count FROM products WHERE name ILIKE '%Robusta%';

-- Check actual ratings in product_ratings table
SELECT menu_item_id, count(*) as count, avg(rating) as avg_rating 
FROM product_ratings 
WHERE menu_item_id IN (SELECT id::text FROM products WHERE name ILIKE '%Robusta%')
GROUP BY menu_item_id;

-- Check the View output
SELECT id, name, weighted_rating, real_vote_count, raw_rating_avg 
FROM products_with_ratings_view 
WHERE name ILIKE '%Robusta%';
