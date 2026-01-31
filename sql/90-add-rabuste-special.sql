-- Migration: Add Rabuste Special flag to products
-- This allows items to appear in both their original category and a special "Rabuste Special" section

-- Step 1: Add is_rabuste_special column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_rabuste_special BOOLEAN DEFAULT false;

-- Step 2: Mark the 6 specific items as Rabuste Special
-- These items will appear in both their original categories and the Rabuste Special section

-- 1. Robusta Iced Americano (robusta-cold)
UPDATE products 
SET is_rabuste_special = true 
WHERE name = 'Robusta Iced Americano';

-- 2. Robusta Hot Cappuccino (robusta-hot)
UPDATE products 
SET is_rabuste_special = true 
WHERE name = 'Robusta Hot Cappuccino';

-- 3. Robusta Classic Frappe (robusta-cold)
UPDATE products 
SET is_rabuste_special = true 
WHERE name = 'Robusta Classic Frappe';

-- 4. Chips (food) - Note: Using 'Chips' as mentioned by user
-- If 'Chips' doesn't exist, this will create 0 updates and we'll need to check
UPDATE products 
SET is_rabuste_special = true 
WHERE name = 'Chips';

-- Fallback: If Chips doesn't exist, try Fries
UPDATE products 
SET is_rabuste_special = true 
WHERE name = 'Fries' AND NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Chips'
);

-- 5. Pizza (food)
UPDATE products 
SET is_rabuste_special = true 
WHERE name = 'Pizza';

-- 6. Veg Nuggets (food)
UPDATE products 
SET is_rabuste_special = true 
WHERE name = 'Veg Nuggets';

-- Verify the changes
SELECT 
    name, 
    category, 
    is_rabuste_special,
    price
FROM products 
WHERE is_rabuste_special = true
ORDER BY category, name;

-- Summary
SELECT 
    'Rabuste Special items marked successfully! ✅' as status,
    COUNT(*) as total_special_items
FROM products 
WHERE is_rabuste_special = true;
