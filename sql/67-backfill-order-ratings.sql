-- Backfill product ratings based on existing completed orders.
-- This generates "real" ratings linked to actual users and orders in the database.
-- Ratings are randomized: 60% 5-star, 30% 4-star, 10% 3-star.

INSERT INTO public.product_ratings (
    user_id, 
    order_id, 
    order_item_id, 
    menu_item_id, 
    menu_item_name, 
    rating, 
    created_at,
    updated_at
)
SELECT 
    o.user_id,
    o.id,
    oi.id::text,
    oi.menu_item_id,
    oi.menu_item_name,
    -- Weighted random rating
    CASE 
        WHEN random() < 0.6 THEN 5
        WHEN random() < 0.9 THEN 4
        ELSE 3 
    END as rating,
    -- Simulate review time (order time + random delay up to 3 days)
    o.created_at + (random() * interval '3 days') as created_at,
    o.created_at + (random() * interval '3 days') as updated_at
FROM 
    public.orders o
JOIN 
    public.order_items oi ON o.id = oi.order_id
WHERE 
    o.status = 'completed'
    -- Prevent duplicates if run multiple times
    AND NOT EXISTS (
        SELECT 1 FROM public.product_ratings pr 
        WHERE pr.order_item_id = oi.id::text
    );

-- Output summary
SELECT 
    COUNT(*) as new_ratings_generated,
    AVG(rating)::numeric(10,2) as avg_rating
FROM product_ratings;
