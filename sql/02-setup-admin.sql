-- Admin Setup Script
-- Run this AFTER creating your user account to make yourself an admin

-- Update your role to admin (replace 'your-email@example.com' with your actual email)
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb), 
  '{role}', 
  '"admin"'::jsonb
)
WHERE email = 'moriaryan2024@gmail.com';

-- Also update the profiles table (create or update the profile)
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', email),
  'admin',
  now(),
  now()
FROM auth.users 
WHERE email = 'moriaryan2024@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = now();

-- Insert some sample data for testing

-- Sample Products
INSERT INTO products (name, description, price, category, available) VALUES
('Espresso', 'Rich and bold espresso shot', 3.50, 'coffee', true),
('Cappuccino', 'Perfect blend of espresso and steamed milk', 4.50, 'coffee', true),
('Croissant', 'Fresh baked buttery croissant', 2.75, 'pastry', true),
('Blueberry Muffin', 'Homemade muffin with fresh blueberries', 3.25, 'pastry', true)
ON CONFLICT DO NOTHING;

-- Sample Workshops
INSERT INTO workshops (title, description, start_date, end_date, price, max_participants, instructor, location) VALUES
('Coffee Brewing Basics', 'Learn the fundamentals of brewing the perfect cup of coffee', 
 now() + interval '1 week', now() + interval '1 week' + interval '2 hours', 
 25.00, 10, 'Master Brewer John', 'Main Workshop Room'),
('Latte Art Workshop', 'Master the art of creating beautiful designs in your lattes', 
 now() + interval '2 weeks', now() + interval '2 weeks' + interval '3 hours', 
 35.00, 8, 'Barista Maria', 'Coffee Lab')
ON CONFLICT DO NOTHING;