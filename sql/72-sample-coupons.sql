-- Quick Setup: Test Coupons for Development
-- Run after deploying 70-coupon-system.sql

-- Insert sample cart value coupons (max 2)
INSERT INTO public.coupons (type, name, description, discount_amount, min_cart_value, is_active)
VALUES
  ('cart_value', '₹30 OFF on ₹300+', 'Get ₹30 discount on orders above ₹300', 30, 300, true),
  ('cart_value', '₹50 OFF on ₹500+', 'Get ₹50 discount on orders above ₹500', 50, 500, true)
ON CONFLICT DO NOTHING;

-- Insert sample menu-limited coupons (max 2)
INSERT INTO public.coupons (type, name, description, discount_amount, applicable_categories, is_active)
VALUES
  ('menu_limited', '₹25 OFF Cold Coffee', 'Special discount on cold beverages', 25, ARRAY['robusta-cold', 'blend-cold'], true),
  ('menu_limited', '₹20 OFF Food Items', 'Discount on food menu', 20, ARRAY['food'], true)
ON CONFLICT DO NOTHING;

-- Verify
SELECT 
  type,
  name,
  discount_amount,
  CASE 
    WHEN type = 'cart_value' THEN 'Min cart: ₹' || min_cart_value
    WHEN type = 'menu_limited' THEN 'Categories: ' || array_to_string(applicable_categories, ', ')
  END as details,
  is_active
FROM public.coupons
ORDER BY type, created_at;

SELECT '✅ Sample coupons created!' as status;
