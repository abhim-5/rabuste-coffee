-- REAL MENU DATA FOR RABUSTE CAFE
-- This is the actual menu used in the cafe
-- Run this AFTER table creation scripts

-- Clear existing sample products
DELETE FROM products;

-- ROBUSTA SPECIALTY COFFEE (COLD) - Non-Milk
INSERT INTO products (name, description, price, category, available) VALUES
('Robusta Iced Americano', 'Cold specialty Robusta coffee with water', 160.00, 'cold-drinks', true),
('Robusta Iced Espresso', 'Pure cold Robusta espresso shot', 130.00, 'cold-drinks', true),
('Iced Espresso with Tonic', 'Robusta espresso with tonic water', 250.00, 'cold-drinks', true),
('Iced Espresso with Ginger Ale', 'Robusta espresso with ginger ale', 250.00, 'cold-drinks', true),
('Iced Espresso with Orange', 'Robusta espresso with orange', 250.00, 'cold-drinks', true),
('Iced Espresso with Red Bull', 'Robusta espresso with Red Bull energy drink', 290.00, 'cold-drinks', true),
('Cranberry Tonic (Robusta)', 'Robusta espresso with cranberry and tonic', 270.00, 'cold-drinks', true);

-- ROBUSTA SPECIALTY COFFEE (COLD) - Milk Based
INSERT INTO products (name, description, price, category, available) VALUES
('Robusta Iced Latte', 'Smooth iced latte with Robusta coffee', 220.00, 'cold-drinks', true),
('Robusta Affogato', 'Vanilla ice cream drowned in hot Robusta espresso', 250.00, 'cold-drinks', true),
('Robusta Classic Frappe', 'Blended iced coffee with milk and ice', 250.00, 'cold-drinks', true),
('Robusta Hazelnut', 'Iced coffee with hazelnut flavor', 260.00, 'cold-drinks', true),
('Robusta Caramel', 'Iced coffee with caramel sauce', 260.00, 'cold-drinks', true),
('Robusta Mocha', 'Chocolate and coffee blend on ice', 270.00, 'cold-drinks', true),
('Robusta Biscoff', 'Coffee with Biscoff cookie butter flavor', 270.00, 'cold-drinks', true),
('Robusta Vietnamese', 'Traditional Vietnamese style iced coffee', 240.00, 'cold-drinks', true),
('Robusta Café Suda', 'Special Robusta coffee preparation', 250.00, 'cold-drinks', true),
('Robusta Robco', 'Signature Robusta specialty drink', 290.00, 'cold-drinks', true);

-- ROBUSTA SPECIALTY COFFEE (HOT) - Non-Milk
INSERT INTO products (name, description, price, category, available) VALUES
('Robusta Hot Americano', 'Hot specialty Robusta coffee with water', 150.00, 'hot-drinks', true),
('Robusta Hot Espresso', 'Pure hot Robusta espresso shot', 130.00, 'hot-drinks', true);

-- ROBUSTA SPECIALTY COFFEE (HOT) - Milk Based
INSERT INTO products (name, description, price, category, available) VALUES
('Robusta Hot Latte', 'Classic hot latte with Robusta coffee', 190.00, 'hot-drinks', true),
('Robusta Hot Flat White', 'Velvety microfoam with Robusta espresso', 180.00, 'hot-drinks', true),
('Robusta Hot Cappuccino', 'Traditional cappuccino with Robusta', 180.00, 'hot-drinks', true),
('Robusta Hot Mocha', 'Hot chocolate and coffee blend', 230.00, 'hot-drinks', true);

-- BLEND COFFEE (COLD) - Non-Milk
INSERT INTO products (name, description, price, category, available) VALUES
('Iced Americano', 'Cold blend coffee with water', 150.00, 'cold-drinks', true),
('Iced Espresso', 'Pure cold blend espresso shot', 120.00, 'cold-drinks', true),
('Iced Espresso with Tonic (Blend)', 'Blend espresso with tonic water', 230.00, 'cold-drinks', true),
('Iced Espresso with Ginger Ale (Blend)', 'Blend espresso with ginger ale', 230.00, 'cold-drinks', true),
('Iced Espresso with Orange (Blend)', 'Blend espresso with orange', 230.00, 'cold-drinks', true),
('Iced Espresso with Red Bull (Blend)', 'Blend espresso with Red Bull', 270.00, 'cold-drinks', true),
('Cranberry Tonic (Blend)', 'Blend espresso with cranberry and tonic', 250.00, 'cold-drinks', true);

-- BLEND COFFEE (COLD) - Milk Based
INSERT INTO products (name, description, price, category, available) VALUES
('Iced Latte', 'Smooth iced latte with blend coffee', 210.00, 'cold-drinks', true),
('Affogato', 'Vanilla ice cream with hot blend espresso', 240.00, 'cold-drinks', true),
('Classic Frappe', 'Blended iced coffee with milk', 240.00, 'cold-drinks', true),
('Hazelnut', 'Iced coffee with hazelnut flavor', 250.00, 'cold-drinks', true),
('Caramel', 'Iced coffee with caramel sauce', 250.00, 'cold-drinks', true),
('Mocha', 'Chocolate and coffee blend on ice', 260.00, 'cold-drinks', true),
('Biscoff', 'Coffee with Biscoff cookie butter', 260.00, 'cold-drinks', true);

-- BLEND COFFEE (HOT) - Non-Milk
INSERT INTO products (name, description, price, category, available) VALUES
('Hot Americano', 'Hot blend coffee with water', 140.00, 'hot-drinks', true),
('Hot Espresso', 'Pure hot blend espresso shot', 120.00, 'hot-drinks', true);

-- BLEND COFFEE (HOT) - Milk Based
INSERT INTO products (name, description, price, category, available) VALUES
('Hot Latte', 'Classic hot latte with blend coffee', 180.00, 'hot-drinks', true),
('Hot Flat White', 'Velvety microfoam with blend espresso', 170.00, 'hot-drinks', true),
('Hot Cappuccino', 'Traditional cappuccino', 170.00, 'hot-drinks', true),
('Hot Mocha', 'Hot chocolate and coffee blend', 220.00, 'hot-drinks', true);

-- MANUAL BREW - Robusta Peaberry Special
INSERT INTO products (name, description, price, category, available) VALUES
('Classic Cold Brew (Small)', 'Smooth cold brew coffee - small', 220.00, 'cold-drinks', true),
('Classic Cold Brew (Large)', 'Smooth cold brew coffee - large', 230.00, 'cold-drinks', true),
('Cold Brew with Tonic', 'Cold brew with tonic water', 270.00, 'cold-drinks', true),
('Cold Brew with Ginger Ale', 'Cold brew with ginger ale', 270.00, 'cold-drinks', true),
('Cold Brew with Orange', 'Cold brew with orange', 270.00, 'cold-drinks', true),
('Cold Brew with Red Bull', 'Cold brew with Red Bull', 290.00, 'cold-drinks', true),
('V60 Pour Over (Hot)', 'Artisan pour over coffee - hot', 220.00, 'hot-drinks', true),
('V60 Pour Over (Cold Small)', 'Artisan pour over coffee - cold small', 230.00, 'cold-drinks', true),
('V60 Pour Over (Cold Large)', 'Artisan pour over coffee - cold large', 240.00, 'cold-drinks', true),
('Cranberry Cold Brew Tonic', 'Cold brew with cranberry and tonic', 280.00, 'cold-drinks', true);

-- SHAKES
INSERT INTO products (name, description, price, category, available) VALUES
('Chocolate Shake', 'Rich chocolate milkshake', 220.00, 'shakes', true),
('Biscoff Shake', 'Biscoff cookie butter milkshake', 250.00, 'shakes', true),
('Nutella Shake', 'Creamy Nutella milkshake', 260.00, 'shakes', true);

-- ICED TEA
INSERT INTO products (name, description, price, category, available) VALUES
('Lemon Iced Tea', 'Refreshing lemon iced tea', 210.00, 'cold-drinks', true),
('Peach Iced Tea', 'Sweet peach iced tea', 210.00, 'cold-drinks', true),
('Ginger Fizz', 'Spicy ginger fizz drink', 250.00, 'cold-drinks', true),
('Classic Orange Mint', 'Orange and mint refresher', 250.00, 'cold-drinks', true);

-- FOOD MENU
INSERT INTO products (name, description, price, category, available) VALUES
('Fries', 'Crispy golden french fries', 150.00, 'food', true),
('Potato Wedges', 'Seasoned potato wedges', 170.00, 'food', true),
('Veg Nuggets', 'Crispy vegetable nuggets', 190.00, 'food', true),
('Pizza', 'Freshly baked pizza', 300.00, 'food', true),
('Bagel', 'Plain toasted bagel', 100.00, 'food', true),
('Cream Cheese Bagel', 'Bagel with cream cheese', 150.00, 'food', true),
('Jalapeno Cheese Bagel', 'Spicy jalapeno cheese bagel', 200.00, 'food', true),
('Pesto Bagel', 'Bagel with pesto sauce', 230.00, 'food', true),
('Butter Croissant', 'Flaky butter croissant', 150.00, 'food', true),
('Nutella Croissant', 'Croissant filled with Nutella', 200.00, 'food', true),
('Cream Cheese Croissant', 'Croissant with cream cheese filling', 240.00, 'food', true);

-- Note: Product images should be uploaded to Supabase Storage and URLs updated
-- Categories used: 'hot-drinks', 'cold-drinks', 'shakes', 'food'
