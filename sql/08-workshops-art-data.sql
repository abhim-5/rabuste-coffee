-- COMPLETE SEED DATA: Workshops and Art Gallery
-- Based on frontend mockup data and available images
-- Run this AFTER 07-real-menu-data.sql

-- Clear existing sample data
DELETE FROM workshop_enrollments;
DELETE FROM workshops;
DELETE FROM art_purchases;
DELETE FROM art_pieces;

-- WORKSHOPS (from frontend mockup data + available images)
INSERT INTO workshops (title, description, start_date, end_date, price, max_participants, instructor, location, image_url, available) VALUES
('Coffee Brewing Masterclass', 'Learn professional brewing techniques including pour-over, French press, and espresso methods. Perfect for coffee enthusiasts wanting to elevate their home brewing game.', '2026-02-15 10:00:00+05:30', '2026-02-15 13:00:00+05:30', 1500.00, 20, 'Rohan Sharma', 'Rabuste Cafe - Workshop Hall', '/workshops/1.jpg', true),

('Latte Art Workshop', 'Master the art of creating beautiful patterns on your latte. Learn basic to advanced techniques for creating hearts, rosettas, and tulips.', '2026-02-22 14:00:00+05:30', '2026-02-22 17:00:00+05:30', 1200.00, 15, 'Priya Desai', 'Rabuste Cafe - Main Counter', '/workshops/2.jpg', true),

('Coffee Tasting Session', 'Explore different coffee varieties from around the world. Learn to identify flavor notes and understand coffee origins.', '2026-03-01 11:00:00+05:30', '2026-03-01 13:00:00+05:30', 800.00, 25, 'Amit Kumar', 'Rabuste Cafe - Tasting Room', '/workshops/3.jpg', true),

('Home Roasting Basics', 'Learn the fundamentals of roasting coffee beans at home. Understand roast levels and how to bring out the best flavors.', '2026-03-10 15:00:00+05:30', '2026-03-10 18:00:00+05:30', 2000.00, 12, 'Meena Krishnan', 'Rabuste Cafe - Roasting Lab', '/workshops/4.jpg', true),

('Espresso Machine Mastery', 'Get hands-on with professional espresso machines. Learn grinding, tamping, extraction, and milk steaming.', '2026-03-20 10:00:00+05:30', '2026-03-20 13:00:00+05:30', 1800.00, 10, 'Vikram Singh', 'Rabuste Cafe  - Barista Station', '/workshops/5.jpg', true),

('Cold Brew Techniques', 'Master the art of cold brewing. Learn different methods, ratios, and flavor profiles for perfect cold brew.', '2026-04-05 14:00:00+05:30', '2026-04-05 16:30:00+05:30', 1000.00, 18, 'Anjali Patel', 'Rabuste Cafe - Cold Brew Lab', '/workshops/6.jpg', true);

-- ART GALLERY (from frontend mockup data + home-art images)
INSERT INTO art_pieces (title, artist_name, description, price, dimensions, medium, year_created, image_url, available) VALUES
('Morning Brew', 'Kavya Iyer', 'A serene depiction of the morning coffee ritual, capturing the peaceful moments of dawn with warm, inviting tones.', 3500.00, '24x18 inches', 'Acrylic on Canvas', 2024, '/home-art/51.jpg', true),

('Coffee Dreams', 'Rahul Verma', 'Abstract representation of the coffee experience through swirling patterns and rich brown hues.', 4200.00, '30x24 inches', 'Oil on Canvas', 2024, '/home-art/52.jpg', true),

('Espresso Abstract', 'Neha Kapoor', 'Bold and modern interpretation of espresso culture with geometric shapes and deep coffee tones.', 2800.00, '20x20 inches', 'Mixed Media', 2024, '/home-art/53.jpg', true),

('Bean Symphony', 'Arjun Nair', 'A celebration of coffee beans in their natural beauty, arranged in artistic patterns.', 3200.00, '28x22 inches', 'Photography Print', 2025, '/home-art/54.jpg', true),

('Cafe Moments', 'Priya Malhotra', 'Capturing the essence of cafe culture through impressionistic brushstrokes and warm lighting.', 4500.00, '32x24 inches', 'Oil on Canvas', 2024, '/home-art/55.jpg', true),

('Aromatic Journey', 'Sanjay Kumar', 'A visual journey through coffee plantations and the process from bean to cup.', 3800.00, '36x24 inches', 'Watercolor', 2025, '/home-art/56.jpg', true),

('The Pour', 'Deepa Menon', 'Minimalist capture of the perfect pour-over moment in black and white.', 2500.00, '18x24 inches', 'Digital Print', 2025, '/home-art/57.jpg', true),

('Robusta Heritage', 'Kabir Desai', 'Honoring the heritage of Robusta coffee with traditional artistic elements.', 5000.00, '40x30 inches', 'Acrylic on Canvas', 2024, '/home-art/58.jpg', true),

('Coffee & Canvas', 'Meera Shah', 'An artistic fusion of coffee culture and creative expression.', 3000.00, '24x24 inches', 'Mixed Media', 2025, '/home-art/59.jpg', true),

('Brew Stories', 'Rohan Gupta', 'A narrative piece telling stories through coffee imagery and symbolism.', 4000.00, '30x40 inches', 'Oil on Canvas', 2024, '/home-art/60.jpg', true),

('Cup of Serenity', 'Ananya Reddy', 'Peaceful and calming representation of a perfect cup of coffee.', 2700.00, '20x16 inches', 'Watercolor', 2025, '/home-art/61.jpg', true);

-- Summary
-- Total Workshops: 6
-- Total Art Pieces: 11
-- All images referenced exist in public folders
