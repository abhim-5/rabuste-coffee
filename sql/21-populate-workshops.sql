-- Populate Workshop Data
-- Run this AFTER running 20-workshop-schema.sql

-- Clear existing data (optional)
-- TRUNCATE workshops CASCADE;

-- Insert upcoming workshops
INSERT INTO workshops (title, description, full_description, start_date, start_time, duration, price, max_spots, available_spots, image_url, instructor, level, includes, is_upcoming)
VALUES
(
  'Latte Art Mastery',
  'Transform your coffee into canvas. Learn professional barista techniques from award-winning instructors.',
  'Master the art of creating stunning latte art patterns including hearts, rosettas, and tulips. Our expert baristas will guide you through milk texturing, pouring techniques, and advanced pattern creation.',
  '2025-12-28',
  '2:00 PM - 5:00 PM',
  '3 hours',
  2499,
  20,
  8,
  '1.jpg',
  'Priya Malhotra',
  'Beginner to Intermediate',
  '["All materials & coffee beans", "Certificate of completion", "Recipe booklet", "Complimentary refreshments"]'::jsonb,
  true
),
(
  'Coffee Tasting Journey',
  'Explore the world of specialty coffee. Discover flavor profiles from different regions and roasting styles.',
  'An immersive sensory experience where you''ll taste and compare single-origin coffees from around the world. Learn professional cupping techniques and develop your palate.',
  '2026-01-05',
  '3:00 PM - 6:00 PM',
  '3 hours',
  1999,
  20,
  12,
  '2.jpg',
  'Rahul Verma',
  'All levels welcome',
  '["10+ coffee tastings", "Tasting journal", "Certificate", "Coffee bean samples to take home"]'::jsonb,
  true
);

-- Insert previous workshops with reviews
INSERT INTO workshops (title, description, start_date, start_time, duration, price, image_url, is_upcoming, attendees, reviews)
VALUES
(
  'Coffee & Pottery',
  'Create your own ceramic coffee mug while learning about coffee origins. A hands-on workshop combining artisan crafts with coffee culture.',
  '2025-12-01',
  '2:00 PM - 5:00 PM',
  '3 hours',
  2299,
  '1.jpg',
  false,
  28,
  '[
    {"name": "Meera Kapoor", "rating": 5, "date": "Dec 28, 2025 • 2:15 PM", "comment": "The perfect blend of creativity and coffee! Made my own mug and learned so much about coffee origins. The instructors were patient and knowledgeable. Highly recommend!", "avatar": "M"},
    {"name": "Raj Patel", "rating": 5, "date": "Dec 29, 2025 • 10:45 AM", "comment": "Loved every minute! The pottery instructor was amazing and the coffee knowledge I gained was invaluable.", "avatar": "R"}
  ]'::jsonb
),
(
  'Espresso Fundamentals',
  'Deep dive into the science of espresso extraction. Learn about grind size, tamping pressure, and timing to create the perfect shot.',
  '2025-11-15',
  '9:00 AM - 12:00 PM',
  '3 hours',
  1999,
  '2.jpg',
  false,
  24,
  '[
    {"name": "Arjun Reddy", "rating": 5, "date": "Nov 15, 2025 • 9:30 AM", "comment": "As a home barista, this workshop elevated my game completely. Understanding extraction, grind size, and timing changed everything. Now my espresso rivals the cafe!", "avatar": "A"},
    {"name": "Priya Singh", "rating": 5, "date": "Nov 16, 2025 • 5:20 PM", "comment": "Professional instruction and hands-on practice. Best investment for any coffee lover!", "avatar": "P"}
  ]'::jsonb
),
(
  'Coffee & Canvas',
  'Paint your masterpiece while sipping on premium coffee. Art meets caffeine in this unique creative workshop.',
  '2025-10-20',
  '11:00 AM - 2:00 PM',
  '3 hours',
  2199,
  '3.jpg',
  false,
  30,
  '[
    {"name": "Sudhir Gupta", "rating": 5, "date": "Oct 20, 2025 • 11:00 AM", "comment": "Such a unique concept! Painting while sipping premium coffee in that gorgeous cafe. The art instructor and baristas work together seamlessly. Left with a masterpiece and caffeine buzz!", "avatar": "S"},
    {"name": "Karan Mehta", "rating": 5, "date": "Oct 21, 2025 • 3:45 PM", "comment": "Never thought I could paint! The relaxed atmosphere and great coffee made it so enjoyable.", "avatar": "K"}
  ]'::jsonb
),
(
  'Brewing Science',
  'Explore the chemistry behind perfect coffee. Learn about water temperature, extraction ratios, and brewing methods.',
  '2025-09-10',
  '1:00 PM - 4:00 PM',
  '3 hours',
  1899,
  '4.jpg',
  false,
  22,
  '[
    {"name": "Rahul Menon", "rating": 5, "date": "Sep 10, 2025 • 1:30 PM", "comment": "Finally understand why my home brew never tasted right. The chemistry behind extraction, water temperature, ratios - it''s all science! Rabuste explains it beautifully.", "avatar": "R"},
    {"name": "Divya Sharma", "rating": 5, "date": "Sep 12, 2025 • 6:15 PM", "comment": "Mind-blowing! I learned so much about the science behind every cup of coffee.", "avatar": "D"}
  ]'::jsonb
),
(
  'Pastry Pairing',
  'Discover the art of pairing coffee with pastries. Learn which flavors complement each other for the ultimate experience.',
  '2025-08-05',
  '4:00 PM - 7:00 PM',
  '3 hours',
  2399,
  '5.jpg',
  false,
  26,
  '[
    {"name": "Aisha Khan", "rating": 5, "date": "Aug 05, 2025 • 4:00 PM", "comment": "A delicious journey through flavors! Understanding how different pastries pair with coffee types was eye-opening.", "avatar": "A"},
    {"name": "Vikram Joshi", "rating": 5, "date": "Aug 06, 2025 • 10:30 AM", "comment": "The tastings were incredible. Now I can impress my guests with perfect pairings!", "avatar": "V"}
  ]'::jsonb
),
(
  'Live Acoustic Night',
  'An evening of live music, great coffee, and wonderful company. Experience the cafe''s cultural side.',
  '2025-07-22',
  '7:00 PM - 10:00 PM',
  '3 hours',
  999,
  '6.jpg',
  false,
  35,
  '[
    {"name": "Nisha Reddy", "rating": 5, "date": "Jul 22, 2025 • 8:00 PM", "comment": "The atmosphere was magical! Live music + amazing coffee = perfect evening. Can''t wait for the next one!", "avatar": "N"},
    {"name": "Amit Desai", "rating": 5, "date": "Jul 23, 2025 • 7:30 PM", "comment": "Fantastic acoustic performances and the best coffee in town. Rabuste really knows how to create an experience.", "avatar": "A"}
  ]'::jsonb
);

SELECT 'Workshop data populated successfully! ✅' as status;

-- Verify data
SELECT 
  CASE WHEN is_upcoming THEN 'Upcoming' ELSE 'Previous' END as type,
  COUNT(*) as workshop_count,
  AVG(price)::numeric(10,2) as avg_price
FROM workshops
GROUP BY is_upcoming
ORDER BY is_upcoming DESC;
