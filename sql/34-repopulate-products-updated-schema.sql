-- SQL FILE 34: Repopulate Products with Updated Schema
-- Run this AFTER running SQL file #33 (products-admin-features)
-- This clears and repopulates all 59 menu items with new pricing/deal columns

-- ==========================================
-- STEP 1: Clear existing products
-- ==========================================
TRUNCATE products CASCADE;

-- ==========================================
-- STEP 2: Insert products with updated schema
-- ALL products include: discount_price, crossed_price, is_deal_of_day, deal_expiry, display_order
-- ==========================================

-- Robusta Specialty Cold (14 items) - 3 deals set
INSERT INTO products (name, description, price, discount_price, crossed_price, is_deal_of_day, deal_expiry, category, variations, rating, review_count, display_order, is_featured, image_url, available)
VALUES
('Robusta Iced Americano', 'Bold and refreshing robusta espresso over ice and water.', 160, NULL, NULL, false, NULL, 'robusta-cold', '[]'::jsonb, 4.5, 45, 1, true, 'robusta-cold/robusta-iced-americano.png', true),
('Robusta Iced Espresso', 'A concentrated kick of chilled robusta coffee.', 130, 99, 130, true, NOW() + INTERVAL '7 days', 'robusta-cold', '[]'::jsonb, 4.6, 38, 2, false, 'robusta-cold/robusta-iced-espresso.png', true),
('Iced Espresso Special', 'Our signature espresso served with a refreshing twist.', 250, NULL, NULL, false, NULL, 'robusta-cold', '[{"name":"Tonic","price":250},{"name":"Ginger Ale","price":250},{"name":"Orange","price":250},{"name":"Red Bull","price":290}]'::jsonb, 4.7, 89, 3, true, 'robusta-cold/iced-espresso-special.png', true),
('Cranberry Tonic', 'A tart and sweet coffee mocktail with cranberry notes.', 270, NULL, NULL, false, NULL, 'robusta-cold', '[]'::jsonb, 4.4, 52, 4, false, 'robusta-cold/cranberry-tonic.png', true),
('Robusta Iced Latte', 'Smooth chilled milk meets bold robusta espresso.', 220, NULL, NULL, false, NULL, 'robusta-cold', '[]'::jsonb, 4.5, 67, 5, false, 'robusta-cold/robusta-iced-latte.png', true),
('Robusta Affogato', 'Hot espresso poured over a scoop of vanilla ice cream.', 250, 199, 250, true, NOW() + INTERVAL '14 days', 'robusta-cold', '[]'::jsonb, 4.8, 71, 6, false, 'robusta-cold/robusta-affogato.png', true),
('Robusta Classic Frappe', 'Creamy, blended coffee treat perfect for hot days.', 250, NULL, NULL, false, NULL, 'robusta-cold', '[]'::jsonb, 4.5, 55, 7, false, 'robusta-cold/robusta-classic-frappe.png', true),
('Robusta Hazelnut', 'Iced coffee infused with rich nutty hazelnut flavor.', 260, NULL, NULL, false, NULL, 'robusta-cold', '[]'::jsonb, 4.6, 48, 8, false, 'robusta-cold/robusta-hazelnut.png', true),
('Robusta Caramel', 'Sweet and buttery caramel blended with cold coffee.', 260, NULL, NULL, false, NULL, 'robusta-cold', '[]'::jsonb, 4.7, 62, 9, false, 'robusta-cold/robusta-caramel.png', true),
('Robusta Mocha', 'Decadent chocolate sauce mixed with espresso and milk.', 270, NULL, NULL, false, NULL, 'robusta-cold', '[]'::jsonb, 4.6, 58, 10, false, 'robusta-cold/robusta-mocha.png', true),
('Robusta Biscoff', 'Indulgent coffee blended with caramelized cookie spread.', 270, 229, 299, true, NOW() + INTERVAL '5 days', 'robusta-cold', '[]'::jsonb, 4.8, 74, 11, false, 'robusta-cold/robusta-biscoff.png', true),
('Robusta Vietnamese', 'Traditional strong coffee with sweetened condensed milk.', 240, NULL, NULL, false, NULL, 'robusta-cold', '[]'::jsonb, 4.7, 66, 12, false, 'robusta-cold/robusta-vietnamese.png', true),
('Robusta Café Suda', 'A distinct Vietnamese-style iced milk coffee.', 250, NULL, NULL, false, NULL, 'robusta-cold', '[]'::jsonb, 4.5, 41, 13, false, 'robusta-cold/robusta-café-suda.png', true),
('Robusta Robco', 'Our house special cold coffee creation.', 290, NULL, NULL, false, NULL, 'robusta-cold', '[]'::jsonb, 4.9, 95, 14, true, 'robusta-cold/robusta-robco.png', true);

-- Robusta Specialty Hot (6 items) - 1 deal
INSERT INTO products (name, description, price, discount_price, crossed_price, is_deal_of_day, deal_expiry, category, variations, rating, review_count, display_order, image_url, available)
VALUES
('Robusta Hot Americano', 'Classic hot water and rich robusta espresso.', 150, NULL, NULL, false, NULL, 'robusta-hot', '[]'::jsonb, 4.4, 42, 1, 'robusta-hot/robusta-hot-americano.png', true),
('Robusta Hot Espresso', 'Pure, intense shot of hot robusta coffee.', 130, NULL, NULL, false, NULL, 'robusta-hot', '[]'::jsonb, 4.5, 36, 2, 'robusta-hot/robusta-hot-espresso.png', true),
('Robusta Hot Latte', 'Steamed milk poured over bold espresso.', 190, 149, 190, true, NOW() + INTERVAL '10 days', 'robusta-hot', '[]'::jsonb, 4.6, 59, 3, 'robusta-hot/robusta-hot-latte.png', true),
('Robusta Hot Flat White', 'Microfoam milk poured over espresso for a velvety texture.', 180, NULL, NULL, false, NULL, 'robusta-hot', '[]'::jsonb, 4.7, 51, 4, 'robusta-hot/robusta-hot-flat-white.png', true),
('Robusta Hot Cappuccino', 'Equal parts espresso, steamed milk, and foam.', 180, NULL, NULL, false, NULL, 'robusta-hot', '[]'::jsonb, 4.5, 64, 5, 'robusta-hot/robusta-hot-cappuccino.png', true),
('Robusta Mocha', 'Hot espresso with rich chocolate and steamed milk.', 230, NULL, NULL, false, NULL, 'robusta-hot', '[]'::jsonb, 4.8, 73, 6, 'robusta-hot/robusta-mocha.png', true);

-- Blend Cold (11 items) - 2 deals
INSERT INTO products (name, description, price, discount_price, crossed_price, is_deal_of_day, deal_expiry, category, variations, rating, review_count, display_order, image_url, available)
VALUES
('Iced Americano', 'Smooth blend espresso served over ice.', 150, NULL, NULL, false, NULL, 'blend-cold', '[]'::jsonb, 4.4, 47, 1, 'blend-cold/iced-americano.png', true),
('Iced Espresso', 'Chilled shot of our signature house blend.', 120, NULL, NULL, false, NULL, 'blend-cold', '[]'::jsonb, 4.5, 33, 2, 'blend-cold/iced-espresso.png', true),
('Iced Espresso Special', 'House blend espresso with a refreshing mixer.', 230, NULL, NULL, false, NULL, 'blend-cold', '[{"name":"Tonic","price":230},{"name":"Ginger Ale","price":230},{"name":"Orange","price":230},{"name":"Red Bull","price":270}]'::jsonb, 4.7, 81, 3, 'blend-cold/iced-espresso-special.png', true),
('Cranberry Tonic', 'Refreshing coffee tonic with cranberry infusion.', 250, NULL, NULL, false, NULL, 'blend-cold', '[]'::jsonb, 4.5, 49, 4, 'blend-cold/cranberry-tonic.png', true),
('Iced Latte', 'Creamy milk and blend espresso over ice.', 210, NULL, NULL, false, NULL, 'blend-cold', '[]'::jsonb, 4.6, 68, 5, 'blend-cold/iced-latte.png', true),
('Affogato', 'Dessert coffee with ice cream and espresso.', 240, 189, 240, true, NOW() + INTERVAL '7 days', 'blend-cold', '[]'::jsonb, 4.8, 77, 6, 'blend-cold/affogato.png', true),
('Classic Frappe', 'Blended ice coffee drink, smooth and creamy.', 240, NULL, NULL, false, NULL, 'blend-cold', '[]'::jsonb, 4.5, 54, 7, 'blend-cold/classic-frappe.png', true),
('Hazelnut', 'Nutty hazelnut flavor in a cold coffee blend.', 250, NULL, NULL, false, NULL, 'blend-cold', '[]'::jsonb, 4.6, 56, 8, 'blend-cold/hazelnut.png', true),
('Caramel', 'Sweet caramel syrup in a refreshing cold latte.', 250, NULL, NULL, false, NULL, 'blend-cold', '[]'::jsonb, 4.7, 61, 9, 'blend-cold/caramel.png', true),
('Mocha', 'Chocolate and coffee blend served ice cold.', 260, NULL, NULL, false, NULL, 'blend-cold', '[]'::jsonb, 4.6, 59, 10, 'blend-cold/mocha.png', true),
('Biscoff', 'Rich cookie butter flavor in a cold coffee.', 260, 219, 260, true, NOW() + INTERVAL '5 days', 'blend-cold', '[]'::jsonb, 4.8, 72, 11, 'blend-cold/biscoff.png', true);

-- Blend Hot (6 items) - No deals
INSERT INTO products (name, description, price, discount_price, crossed_price, is_deal_of_day, deal_expiry, category, variations, rating, review_count, display_order, image_url, available)
VALUES
('Hot Americano', 'A classic warming cup of black coffee.', 140, NULL, NULL, false, NULL, 'blend-hot', '[]'::jsonb, 4.4, 40, 1, 'blend-hot/hot-americano.png', true),
('Hot Espresso', 'A single shot of our smooth house blend.', 120, NULL, NULL, false, NULL, 'blend-hot', '[]'::jsonb, 4.5, 35, 2, 'blend-hot/hot-espresso.png', true),
('Hot Latte', 'Creamy steamed milk meets smooth espresso.', 180, NULL, NULL, false, NULL, 'blend-hot', '[]'::jsonb, 4.6, 63, 3, 'blend-hot/hot-latte.png', true),
('Hot Flat White', 'Silky milk integrated with espresso.', 170, NULL, NULL, false, NULL, 'blend-hot', '[]'::jsonb, 4.7, 52, 4, 'blend-hot/hot-flat-white.png', true),
('Hot Cappuccino', 'Frothy and comforting traditional cappuccino.', 170, NULL, NULL, false, NULL, 'blend-hot', '[]'::jsonb, 4.5, 65, 5, 'blend-hot/hot-cappuccino.png', true),
('Mocha', 'The perfect mix of hot chocolate and coffee.', 220, NULL, NULL, false, NULL, 'blend-hot', '[]'::jsonb, 4.8, 76, 6, 'blend-hot/mocha.png', true);

-- Manual Brew (3 items) - 1 deal
INSERT INTO products (name, description, price, discount_price, crossed_price, is_deal_of_day, deal_expiry, category, variations, rating, review_count, display_order, image_url, available)
VALUES
('Classic Cold Brew', 'Slow-steeped coffee for a smooth, low-acid taste.', 220, NULL, NULL, false, NULL, 'manual-brew', '[{"name":"Regular","price":220},{"name":"Large","price":230},{"name":"Tonic","price":270},{"name":"Ginger Ale","price":270},{"name":"Orange","price":270},{"name":"Red Bull","price":290}]'::jsonb, 4.7, 88, 1, 'manual-brew/classic-cold-brew.png', true),
('V60 Pour Over', 'Hand-poured coffee highlighting distinct flavor notes.', 220, 179, 220, true, NOW() + INTERVAL '3 days', 'manual-brew', '[{"name":"Hot","price":220},{"name":"Cold","price":230},{"name":"Cold Special","price":240}]'::jsonb, 4.8, 92, 2, 'manual-brew/v60-pour-over.png', true),
('Cranberry Cold Brew Tonic', 'Cold brew mixed with tonic and cranberry.', 280, NULL, NULL, false, NULL, 'manual-brew', '[]'::jsonb, 4.6, 57, 3, 'manual-brew/cranberry-cold-brew-tonic.png', true);

-- Shakes & Tea (7 items) - 2 deals
INSERT INTO products (name, description, price, discount_price, crossed_price, is_deal_of_day, deal_expiry, category, variations, rating, review_count, display_order, image_url, available)
VALUES
('Chocolate Shake', 'Thick and creamy rich chocolate milkshake.', 220, NULL, NULL, false, NULL, 'shakes-tea', '[]'::jsonb, 4.6, 69, 1, 'shakes-tea/chocolate-shake.png', true),
('Biscoff Shake', 'A shake made with delicious caramelized cookies.', 250, 199, 250, true, NOW() + INTERVAL '7 days', 'shakes-tea', '[]'::jsonb, 4.8, 84, 2, 'shakes-tea/biscoff-shake.png', true),
('Nutella Shake', 'Hazelnut cocoa spread blended into a shake.', 260, NULL, NULL, false, NULL, 'shakes-tea', '[]'::jsonb, 4.9, 97, 3, 'shakes-tea/nutella-shake.png', true),
('Lemon Ice Tea', 'Zesty and refreshing chilled tea.', 210, NULL, NULL, false, NULL, 'shakes-tea', '[]'::jsonb, 4.4, 44, 4, 'shakes-tea/lemon-ice-tea.png', true),
('Peach Ice Tea', 'Sweet and fruity peach infused iced tea.', 210, NULL, NULL, false, NULL, 'shakes-tea', '[]'::jsonb, 4.5, 46, 5, 'shakes-tea/peach-ice-tea.png', true),
('Ginger Fizz', 'Spicy ginger ale with a refreshing kick.', 250, 199, 250, true, NOW() + INTERVAL '5 days', 'shakes-tea', '[]'::jsonb, 4.3, 37, 6, 'shakes-tea/ginger-fizz.png', true),
('Classic Orange Mint', 'Citrusy orange paired with cooling mint.', 250, NULL, NULL, false, NULL, 'shakes-tea', '[]'::jsonb, 4.5, 50, 7, 'shakes-tea/classic-orange-mint.png', true);

-- Food (11 items) - 2 deals
INSERT INTO products (name, description, price, discount_price, crossed_price, is_deal_of_day, deal_expiry, category, variations, rating, review_count, display_order, image_url, available)
VALUES
('Fries', 'Crispy golden potato fries.', 150, NULL, NULL, false, NULL, 'food', '[]'::jsonb, 4.4, 78, 1, 'food/fries.png', true),
('Potato Wedges', 'Seasoned thick-cut potato wedges.', 170, NULL, NULL, false, NULL, 'food', '[]'::jsonb, 4.5, 65, 2, 'food/potato-wedges.png', true),
('Veg Nuggets', 'Crispy bites of mixed vegetables.', 190, NULL, NULL, false, NULL, 'food', '[]'::jsonb, 4.6, 58, 3, 'food/veg-nuggets.png', true),
('Pizza', 'Freshly baked pizza with delicious toppings.', 300, 249, 300, true, NOW() + INTERVAL '7 days', 'food', '[]'::jsonb, 4.7, 91, 4, 'food/pizza.png', true),
('Bagel', 'Classic chewy bagel, toasted to perfection.', 100, NULL, NULL, false, NULL, 'food', '[]'::jsonb, 4.3, 32, 5, 'food/bagel.png', true),
('Cream Cheese Bagel', 'Toasted bagel spread with smooth cream cheese.', 150, NULL, NULL, false, NULL, 'food', '[]'::jsonb, 4.5, 47, 6, 'food/cream-cheese-bagel.png', true),
('Jalapeno Cheese Bagel', 'Spicy jalapeno cream cheese on a bagel.', 200, NULL, NULL, false, NULL, 'food', '[]'::jsonb, 4.6, 54, 7, 'food/jalapeno-cheese-bagel.png', true),
('Pesto Bagel', 'Bagel topped with aromatic basil pesto.', 230, NULL, NULL, false, NULL, 'food', '[]'::jsonb, 4.7, 61, 8, 'food/pesto-bagel.png', true),
('Butter Croissant', 'Flaky and buttery French pastry.', 150, NULL, NULL, false, NULL, 'food', '[]'::jsonb, 4.8, 83, 9, 'food/butter-croissant.png', true),
('Nutella Croissant', 'Croissant filled with rich Nutella.', 200, 169, 200, true, NOW() + INTERVAL '10 days', 'food', '[]'::jsonb, 4.9, 102, 10, 'food/nutella-croissant.png', true),
('Cream Cheese Croissant', 'Croissant served with cream cheese.', 240, NULL, NULL, false, NULL, 'food', '[]'::jsonb, 4.7, 75, 11, 'food/cream-cheese-croissant.png', true);

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Count by category
SELECT 
  category,
  COUNT(*) as total_items,
  COUNT(*) FILTER (WHERE is_deal_of_day = true) as active_deals,
  COUNT(*) FILTER (WHERE discount_price IS NOT NULL) as items_with_discounts,
  AVG(price)::numeric(10,2) as avg_base_price,
  AVG(COALESCE(discount_price, price))::numeric(10,2) as avg_display_price
FROM products
GROUP BY category
ORDER BY 
  CASE category
    WHEN 'robusta-cold' THEN 1
    WHEN 'robusta-hot' THEN 2
    WHEN 'blend-cold' THEN 3
    WHEN 'blend-hot' THEN 4
    WHEN 'manual-brew' THEN 5
    WHEN 'shakes-tea' THEN 6
    WHEN 'food' THEN 7
  END;

-- Summary
SELECT 
  COUNT(*) as total_products,
  COUNT(*) FILTER (WHERE is_deal_of_day = true) as total_active_deals,
  COUNT(*) FILTER (WHERE discount_price IS NOT NULL) as products_with_discounts,
  COUNT(*) FILTER (WHERE crossed_price IS NOT NULL) as products_with_crossed_prices,
  COUNT(*) FILTER (WHERE available = true) as available_products
FROM products;

-- Show all active deals
SELECT 
  name,
  category,
  price as base_price,
  discount_price,
  crossed_price,
  deal_expiry
FROM products
WHERE is_deal_of_day = true
ORDER BY category, display_order;

SELECT '✅ All 59 products inserted with updated schema!' as status;
SELECT '✅ Total Active Deals: ' || COUNT(*) FROM products WHERE is_deal_of_day = true;
