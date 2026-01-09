-- Sample Data for Testing
-- Run this AFTER all table creation scripts to populate the database with test data

-- Sample Products (Coffee Items)
INSERT INTO products (name, description, price, category, image_url, available) VALUES
('Rabuste Signature Blend', 'Our signature dark roast coffee beans from the highlands', 450.00, 'coffee', '/main-menu/coffee-1.jpg', true),
('Cold Brew Special', 'Smooth cold brew coffee with a hint of chocolate', 380.00, 'cold-drinks', '/main-menu/cold-brew.jpg', true),
('Cappuccino Classic', 'Perfect balance of espresso and steamed milk with foam', 320.00, 'coffee', '/main-menu/cappuccino.jpg', true),
('Mocha Delight', 'Rich chocolate and coffee blend topped with whipped cream', 350.00, 'coffee', '/main-menu/mocha.jpg', true),
('Iced Latte', 'Refreshing iced coffee with milk', 340.00, 'cold-drinks', '/main-menu/iced-latte.jpg', true),
('Croissant', 'Buttery, flaky French pastry', 180.00, 'pastries', '/main-menu/croissant.jpg', true),
('Chocolate Muffin', 'Double chocolate muffin with chocolate chips', 150.00, 'pastries', '/main-menu/muffin.jpg', true),
('Espresso Macchiato', 'Bold espresso with a dollop of foamed milk', 280.00, 'coffee', '/main-menu/macchiato.jpg', true);

-- Sample Workshops
INSERT INTO workshops (title, description, start_date, end_date, price, max_participants, instructor, location, image_url, available) VALUES
('Coffee Brewing Masterclass', 'Learn the art of brewing the perfect cup of coffee using various methods', '2026-02-15 10:00:00+05:30', '2026-02-15 13:00:00+05:30', 1500.00, 20, 'Master Roaster Arjun', 'Rabuste Cafe - Workshop Hall', '/workshops/brewing.jpg', true),
('Latte Art Workshop', 'Master the techniques of creating beautiful latte art', '2026-02-22 14:00:00+05:30', '2026-02-22 17:00:00+05:30', 1200.00, 15, 'Barista Priya Sharma', 'Rabuste Cafe - Main Counter', '/workshops/latte-art.jpg', true),
('Coffee Tasting Session', 'Explore different coffee varieties from around the world', '2026-03-01 11:00:00+05:30', '2026-03-01 13:00:00+05:30', 800.00, 25, 'Coffee Sommelier Rajesh', 'Rabuste Cafe -  Tasting Room', '/workshops/tasting.jpg', true),
('Home Roasting Basics', 'Learn to roast coffee beans at home for fresh brew daily', '2026-03-10 15:00:00+05:30', '2026-03-10 18:00:00+05:30', 2000.00, 12, 'Roasting Expert Meena', 'Rabuste Cafe - Roasting Lab', '/workshops/roasting.jpg', true);

-- Sample Art Pieces
INSERT INTO art_pieces (title, artist_name, description, price, dimensions, medium, year_created, image_url, available) VALUES
('Coffee Dreams', 'Ananya Verma', 'Abstract representation of coffee culture in warm tones', 15000.00, '24x36 inches', 'Acrylic on Canvas', 2025, '/home-art/art-1.jpg', true),
('Morning Ritual', 'Vikram Patel', 'A serene depiction of the morning coffee routine', 12000.00, '20x30 inches', 'Oil on Canvas', 2024, '/home-art/art-2.jpg', true),
('Beans & Blossoms', 'Kavita Reddy', 'Coffee beans intertwined with floral patterns', 18000.00, '30x40 inches', 'Mixed Media', 2025, '/home-art/art-3.jpg', true),
('Aromatic Journey', 'Sanjay Kumar', 'A visual journey through coffee plantations', 20000.00, '36x48 inches', 'Watercolor', 2025, '/home-art/art-4.jpg', true),
('The Pour', 'Deepa Menon', 'Capturing the perfect coffee pour moment', 14000.00, '18x24 inches', 'Digital Print', 2025, '/home-art/art-5.jpg', true);

-- Note: You'll need to insert actual user data after users sign up
-- The following are example structures you can use:

-- Example: Award welcome bonus points (run after user signs up)
-- INSERT INTO points_transactions (user_id, points, type, source, description) VALUES
-- ('<user-id-here>', 100, 'earned', 'bonus', 'Welcome to Rabuste! Enjoy your bonus points');

-- Example: Award points for an order (run after order is created)
-- INSERT INTO points_transactions (user_id, points, type, source, description, order_id) VALUES
-- ('<user-id-here>', 50, 'earned', 'order', 'Points earned from order #1234', '<order-id-here>');

-- Example: Redeem points
-- INSERT INTO points_transactions (user_id, points, type, source, description) VALUES
-- ('<user-id-here>', 50, 'redeemed', 'redemption', 'Redeemed for free coffee');
