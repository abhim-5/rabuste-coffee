-- Add Belgium Chocolate Cake to menu items
-- This item will be marked as Rabuste Special

INSERT INTO products (
    name, 
    description, 
    price, 
    category, 
    variations, 
    rating, 
    review_count, 
    sort_order, 
    image_url,
    is_rabuste_special,
    available
)
VALUES (
    'Belgium Chocolate Cake',
    'Rich and decadent Belgian chocolate cake with layers of chocolate ganache.',
    280,
    'food',
    '[]'::jsonb,
    4.8,
    85,
    12,
    'food/belgium-chocolate-cake.png',
    true,
    true
);

-- Verify the insertion
SELECT 
    id,
    name, 
    category, 
    price,
    is_rabuste_special
FROM products 
WHERE name = 'Belgium Chocolate Cake';
