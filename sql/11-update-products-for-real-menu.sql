-- Update Products Table Structure for Real Menu Data
-- Run this in Supabase SQL Editor after uploading images to Storage

-- 1. Add category column if it doesn't exist or update enum
-- First, check if we need to update the category type
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Update category column to accept new categories
ALTER TABLE products ALTER COLUMN category TYPE text;

-- Add constraint for new categories
ALTER TABLE products ADD CONSTRAINT products_category_check 
  CHECK (category IN (
    'robusta-cold',
    'robusta-hot', 
    'blend-cold',
    'blend-hot',
    'manual-brew',
    'shakes-tea',
    'food'
  ));

-- 2. Update image_url column to accept Storage URLs
-- The column should already exist, but let's ensure it's properly set
CREATE OR REPLACE FUNCTION update_image_url_to_storage()
RETURNS void AS $$
BEGIN
  -- This function helps migrate old image URLs to new Storage URLs
  -- Format: https://[project].supabase.co/storage/v1/object/public/products/[category]/[slug].png
  
  -- Example update (run manually for specific items if needed)
  -- UPDATE products 
  -- SET image_url = 'https://cxwudthziqkqazzpatlp.supabase.co/storage/v1/object/public/products/' || category || '/' || 
  --                 lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) || '.png'
  -- WHERE image_url IS NULL OR image_url = '';
  
  RAISE NOTICE 'Image URL update function created. Update URLs manually based on your Storage structure.';
END;
$$ LANGUAGE plpgsql;

-- 3. Optional: Add variations column if it doesn't exist
-- Variations store different options like sizes, mixers, etc.
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variations JSONB DEFAULT '[]'::jsonb;

-- 4. Sample INSERT for reference (DO NOT RUN - just for reference)
/*
INSERT INTO products (name, description, price, category, image_url, variations, available)
VALUES 
(
  'Robusta Iced Americano',
  'Bold and refreshing robusta espresso over ice and water.',
  160,
  'robusta-cold',
  'https://cxwudthziqkqazzpatlp.supabase.co/storage/v1/object/public/products/robusta-cold/robusta-iced-americano.png',
  '[]'::jsonb,
  true
),
(
  'Iced Espresso Special',
  'Our signature espresso served with a refreshing twist.',
  250,
  'robusta-cold',
  'https://cxwudthziqkqazzpatlp.supabase.co/storage/v1/object/public/products/robusta-cold/iced-espresso-special.png',
  '[
    {"name": "Tonic", "price": 250},
    {"name": "Ginger Ale", "price": 250},
    {"name": "Orange", "price": 250},
    {"name": "Red Bull", "price": 290}
  ]'::jsonb,
  true
);
*/

-- 5. Verify the structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

COMMENT ON TABLE products IS 'Menu items organized by real categories matching menu.json structure';
