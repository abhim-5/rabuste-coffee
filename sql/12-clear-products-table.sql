-- STEP 1: Clear existing products data
-- Run this FIRST to avoid constraint conflicts

-- Delete all existing products
DELETE FROM products;

-- Reset the ID sequence ONLY if it exists (for tables using serial IDs)
-- Skip this for UUID-based IDs
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'products_id_seq') THEN
        ALTER SEQUENCE products_id_seq RESTART WITH 1;
    END IF;
END $$;

-- STEP 2: Update category constraint
-- Now safe to update since table is empty
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

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

-- STEP 3: Ensure variations column exists
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variations JSONB DEFAULT '[]'::jsonb;

-- Verify structure
SELECT 'Products table cleared and ready for new data!' as status;
