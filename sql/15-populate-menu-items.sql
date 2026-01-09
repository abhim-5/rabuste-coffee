-- Populate Menu Items from realMenuData.ts
-- Run this AFTER running 14-enhance-products-schema.sql
-- This inserts all 59 menu items into the products table

-- Clear existing data (optional - remove if you want to keep existing data)
-- TRUNCATE products CASCADE;

-- Insert all menu items
-- Category: Robusta Specialty Cold (14 items)
INSERT INTO products (name, description, price, category, variations, rating, review_count, sort_order, is_featured, image_url)
VALUES
('Robusta Iced Americano', 'Bold and refreshing robusta espresso over ice and water.', 160, 'robusta-cold', '[]'::jsonb, 4.5, 45, 1, true, 'robusta-cold/robusta-iced-americano.png'),
('Robusta Iced Espresso', 'A concentrated kick of chilled robusta coffee.', 130, 'robusta-cold', '[]'::jsonb, 4.6, 38, 2, false, 'robusta-cold/robusta-iced-espresso.png'),
('Iced Espresso Special', 'Our signature espresso served with a refreshing twist.', 250, 'robusta-cold', '[{"name":"Tonic","price":250},{"name":"Ginger Ale","price":250},{"name":"Orange","price":250},{"name":"Red Bull","price":290}]'::jsonb, 4.7, 89, 3, true, 'robusta-cold/iced-espresso-special.png'),
('Cranberry Tonic', 'A tart and sweet coffee mocktail with cranberry notes.', 270, 'robusta-cold', '[]'::jsonb, 4.4, 52, 4, false, 'robusta-cold/cranberry-tonic.png'),
('Robusta Iced Latte', 'Smooth chilled milk meets bold robusta espresso.', 220, 'robusta-cold', '[]'::jsonb, 4.5, 67, 5, false, 'robusta-cold/robusta-iced-latte.png'),
('Robusta Affogato', 'Hot espresso poured over a scoop of vanilla ice cream.', 250, 'robusta-cold', '[]'::jsonb, 4.8, 71, 6, false, 'robusta-cold/robusta-affogato.png'),
('Robusta Classic Frappe', 'Creamy, blended coffee treat perfect for hot days.', 250, 'robusta-cold', '[]'::jsonb, 4.5, 55, 7, false, 'robusta-cold/robusta-classic-frappe.png'),
('Robusta Hazelnut', 'Iced coffee infused with rich nutty hazelnut flavor.', 260, 'robusta-cold', '[]'::jsonb, 4.6, 48, 8, false, 'robusta-cold/robusta-hazelnut.png'),
('Robusta Caramel', 'Sweet and buttery caramel blended with cold coffee.', 260, 'robusta-cold', '[]'::jsonb, 4.7, 62, 9, false, 'robusta-cold/robusta-caramel.png'),
('Robusta Mocha', 'Decadent chocolate sauce mixed with espresso and milk.', 270, 'robusta-cold', '[]'::jsonb, 4.6, 58, 10, false, 'robusta-cold/robusta-mocha.png'),
('Robusta Biscoff', 'Indulgent coffee blended with caramelized cookie spread.', 270, 'robusta-cold', '[]'::jsonb, 4.8, 74, 11, false, 'robusta-cold/robusta-biscoff.png'),
('Robusta Vietnamese', 'Traditional strong coffee with sweetened condensed milk.', 240, 'robusta-cold', '[]'::jsonb, 4.7, 66, 12, false, 'robusta-cold/robusta-vietnamese.png'),
('Robusta Café Suda', 'A distinct Vietnamese-style iced milk coffee.', 250, 'robusta-cold', '[]'::jsonb, 4.5, 41, 13, false, 'robusta-cold/robusta-café-suda.png'),
('Robusta Robco', 'Our house special cold coffee creation.', 290, 'robusta-cold', '[]'::jsonb, 4.9, 95, 14, true, 'robusta-cold/robusta-robco.png');

-- Category: Robusta Specialty Hot (6 items)
INSERT INTO products (name, description, price, category, variations, rating, review_count, sort_order, image_url)
VALUES
('Robusta Hot Americano', 'Classic hot water and rich robusta espresso.', 150, 'robusta-hot', '[]'::jsonb, 4.4, 42, 1, 'robusta-hot/robusta-hot-americano.png'),
('Robusta Hot Espresso', 'Pure, intense shot of hot robusta coffee.', 130, 'robusta-hot', '[]'::jsonb, 4.5, 36, 2, 'robusta-hot/robusta-hot-espresso.png'),
('Robusta Hot Latte', 'Steamed milk poured over bold espresso.', 190, 'robusta-hot', '[]'::jsonb, 4.6, 59, 3, 'robusta-hot/robusta-hot-latte.png'),
('Robusta Hot Flat White', 'Microfoam milk poured over espresso for a velvety texture.', 180, 'robusta-hot', '[]'::jsonb, 4.7, 51, 4, 'robusta-hot/robusta-hot-flat-white.png'),
('Robusta Hot Cappuccino', 'Equal parts espresso, steamed milk, and foam.', 180, 'robusta-hot', '[]'::jsonb, 4.5, 64, 5, 'robusta-hot/robusta-hot-cappuccino.png'),
('Robusta Mocha', 'Hot espresso with rich chocolate and steamed milk.', 230, 'robusta-hot', '[]'::jsonb, 4.8, 73, 6, 'robusta-hot/robusta-mocha.png');

-- Category: Blend Cold (11 items)
INSERT INTO products (name, description, price, category, variations, rating, review_count, sort_order, image_url)
VALUES
('Iced Americano', 'Smooth blend espresso served over ice.', 150, 'blend-cold', '[]'::jsonb, 4.4, 47, 1, 'blend-cold/iced-americano.png'),
('Iced Espresso', 'Chilled shot of our signature house blend.', 120, 'blend-cold', '[]'::jsonb, 4.5, 33, 2, 'blend-cold/iced-espresso.png'),
('Iced Espresso Special', 'House blend espresso with a refreshing mixer.', 230, 'blend-cold', '[{"name":"Tonic","price":230},{"name":"Ginger Ale","price":230},{"name":"Orange","price":230},{"name":"Red Bull","price":270}]'::jsonb, 4.7, 81, 3, 'blend-cold/iced-espresso-special.png'),
('Cranberry Tonic', 'Refreshing coffee tonic with cranberry infusion.', 250, 'blend-cold', '[]'::jsonb, 4.5, 49, 4, 'blend-cold/cranberry-tonic.png'),
('Iced Latte', 'Creamy milk and blend espresso over ice.', 210, 'blend-cold', '[]'::jsonb, 4.6, 68, 5, 'blend-cold/iced-latte.png'),
('Affogato', 'Dessert coffee with ice cream and espresso.', 240, 'blend-cold', '[]'::jsonb, 4.8, 77, 6, 'blend-cold/affogato.png'),
('Classic Frappe', 'Blended ice coffee drink, smooth and creamy.', 240, 'blend-cold', '[]'::jsonb, 4.5, 54, 7, 'blend-cold/classic-frappe.png'),
('Hazelnut', 'Nutty hazelnut flavor in a cold coffee blend.', 250, 'blend-cold', '[]'::jsonb, 4.6, 56, 8, 'blend-cold/hazelnut.png'),
('Caramel', 'Sweet caramel syrup in a refreshing cold latte.', 250, 'blend-cold', '[]'::jsonb, 4.7, 61, 9, 'blend-cold/caramel.png'),
('Mocha', 'Chocolate and coffee blend served ice cold.', 260, 'blend-cold', '[]'::jsonb, 4.6, 59, 10, 'blend-cold/mocha.png'),
('Biscoff', 'Rich cookie butter flavor in a cold coffee.', 260, 'blend-cold', '[]'::jsonb, 4.8, 72, 11, 'blend-cold/biscoff.png');

-- Category: Blend Hot (6 items)
INSERT INTO products (name, description, price, category, variations, rating, review_count, sort_order, image_url)
VALUES
('Hot Americano', 'A classic warming cup of black coffee.', 140, 'blend-hot', '[]'::jsonb, 4.4, 40, 1, 'blend-hot/hot-americano.png'),
('Hot Espresso', 'A single shot of our smooth house blend.', 120, 'blend-hot', '[]'::jsonb, 4.5, 35, 2, 'blend-hot/hot-espresso.png'),
('Hot Latte', 'Creamy steamed milk meets smooth espresso.', 180, 'blend-hot', '[]'::jsonb, 4.6, 63, 3, 'blend-hot/hot-latte.png'),
('Hot Flat White', 'Silky milk integrated with espresso.', 170, 'blend-hot', '[]'::jsonb, 4.7, 52, 4, 'blend-hot/hot-flat-white.png'),
('Hot Cappuccino', 'Frothy and comforting traditional cappuccino.', 170, 'blend-hot', '[]'::jsonb, 4.5, 65, 5, 'blend-hot/hot-cappuccino.png'),
('Mocha', 'The perfect mix of hot chocolate and coffee.', 220, 'blend-hot', '[]'::jsonb, 4.8, 76, 6, 'blend-hot/mocha.png');

-- Category: Manual Brew (3 items)
INSERT INTO products (name, description, price, category, variations, rating, review_count, sort_order, image_url)
VALUES
('Classic Cold Brew', 'Slow-steeped coffee for a smooth, low-acid taste.', 220, 'manual-brew', '[{"name":"Regular","price":220},{"name":"Large","price":230},{"name":"Tonic","price":270},{"name":"Ginger Ale","price":270},{"name":"Orange","price":270},{"name":"Red Bull","price":290}]'::jsonb, 4.7, 88, 1, 'manual-brew/classic-cold-brew.png'),
('V60 Pour Over', 'Hand-poured coffee highlighting distinct flavor notes.', 220, 'manual-brew', '[{"name":"Hot","price":220},{"name":"Cold","price":230},{"name":"Cold Special","price":240}]'::jsonb, 4.8, 92, 2, 'manual-brew/v60-pour-over.png'),
('Cranberry Cold Brew Tonic', 'Cold brew mixed with tonic and cranberry.', 280, 'manual-brew', '[]'::jsonb, 4.6, 57, 3, 'manual-brew/cranberry-cold-brew-tonic.png');

-- Category: Shakes & Tea (7 items)
INSERT INTO products (name, description, price, category, variations, rating, review_count, sort_order, image_url)
VALUES
('Chocolate Shake', 'Thick and creamy rich chocolate milkshake.', 220, 'shakes-tea', '[]'::jsonb, 4.6, 69, 1, 'shakes-tea/chocolate-shake.png'),
('Biscoff Shake', 'A shake made with delicious caramelized cookies.', 250, 'shakes-tea', '[]'::jsonb, 4.8, 84, 2, 'shakes-tea/biscoff-shake.png'),
('Nutella Shake', 'Hazelnut cocoa spread blended into a shake.', 260, 'shakes-tea', '[]'::jsonb, 4.9, 97, 3, 'shakes-tea/nutella-shake.png'),
('Lemon Ice Tea', 'Zesty and refreshing chilled tea.', 210, 'shakes-tea', '[]'::jsonb, 4.4, 44, 4, 'shakes-tea/lemon-ice-tea.png'),
('Peach Ice Tea', 'Sweet and fruity peach infused iced tea.', 210, 'shakes-tea', '[]'::jsonb, 4.5, 46, 5, 'shakes-tea/peach-ice-tea.png'),
('Ginger Fizz', 'Spicy ginger ale with a refreshing kick.', 250, 'shakes-tea', '[]'::jsonb, 4.3, 37, 6, 'shakes-tea/ginger-fizz.png'),
('Classic Orange Mint', 'Citrusy orange paired with cooling mint.', 250, 'shakes-tea', '[]'::jsonb, 4.5, 50, 7, 'shakes-tea/classic-orange-mint.png');

-- Category: Food (11 items)
INSERT INTO products (name, description, price, category, variations, rating, review_count, sort_order, image_url)
VALUES
('Fries', 'Crispy golden potato fries.', 150, 'food', '[]'::jsonb, 4.4, 78, 1, 'food/fries.png'),
('Potato Wedges', 'Seasoned thick-cut potato wedges.', 170, 'food', '[]'::jsonb, 4.5, 65, 2, 'food/potato-wedges.png'),
('Veg Nuggets', 'Crispy bites of mixed vegetables.', 190, 'food', '[]'::jsonb, 4.6, 58, 3, 'food/veg-nuggets.png'),
('Pizza', 'Freshly baked pizza with delicious toppings.', 300, 'food', '[]'::jsonb, 4.7, 91, 4, 'food/pizza.png'),
('Bagel', 'Classic chewy bagel, toasted to perfection.', 100, 'food', '[]'::jsonb, 4.3, 32, 5, 'food/bagel.png'),
('Cream Cheese Bagel', 'Toasted bagel spread with smooth cream cheese.', 150, 'food', '[]'::jsonb, 4.5, 47, 6, 'food/cream-cheese-bagel.png'),
('Jalapeno Cheese Bagel', 'Spicy jalapeno cream cheese on a bagel.', 200, 'food', '[]'::jsonb, 4.6, 54, 7, 'food/jalapeno-cheese-bagel.png'),
('Pesto Bagel', 'Bagel topped with aromatic basil pesto.', 230, 'food', '[]'::jsonb, 4.7, 61, 8, 'food/pesto-bagel.png'),
('Butter Croissant', 'Flaky and buttery French pastry.', 150, 'food', '[]'::jsonb, 4.8, 83, 9, 'food/butter-croissant.png'),
('Nutella Croissant', 'Croissant filled with rich Nutella.', 200, 'food', '[]'::jsonb, 4.9, 102, 10, 'food/nutella-croissant.png'),
('Cream Cheese Croissant', 'Croissant served with cream cheese.', 240, 'food', '[]'::jsonb, 4.7, 75, 11, 'food/cream-cheese-croissant.png');

-- Verify data
SELECT 
  category,
  COUNT(*) as item_count,
  AVG(price)::numeric(10,2) as avg_price,
  COUNT(*) FILTER (WHERE variations != '[]'::jsonb) as items_with_variations
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
  'Menu items populated successfully! ✅' as status,
  COUNT(*) as total_items,
  COUNT(*) FILTER (WHERE is_featured = true) as featured_items,
  COUNT(*) FILTER (WHERE variations != '[]'::jsonb) as items_with_variations
FROM products;
