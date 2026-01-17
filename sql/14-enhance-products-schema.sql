-- Enhanced Products Schema for Complete Menu System
-- Run this in Supabase SQL Editor

-- Step 1: Add missing columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0 CHECK (review_count >= 0),
ADD COLUMN IF NOT EXISTS original_price numeric(10,2) CHECK (original_price >= 0),
ADD COLUMN IF NOT EXISTS variations jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- Step 2: Update category constraint with all valid categories
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

-- Step 3: Create performance indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available) WHERE available = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_sort ON products(category, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);

-- Step 4: Create/update trigger for updated_at
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Step 5: Add helpful comments
COMMENT ON COLUMN products.rating IS 'Average rating from 0.0 to 5.0';
COMMENT ON COLUMN products.review_count IS 'Total number of reviews';
COMMENT ON COLUMN products.original_price IS 'Original price before discount (NULL if no discount)';
COMMENT ON COLUMN products.variations IS 'JSONB array of variations: [{"name": "Tonic", "price": 250}]';
COMMENT ON COLUMN products.is_featured IS 'Show in Deal of the Day section';
COMMENT ON COLUMN products.sort_order IS 'Display order within category (lower = first)';

-- Step 6: Create admin-ready RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can view available products
DROP POLICY IF EXISTS "public_read_available_products" ON products;
CREATE POLICY "public_read_available_products"
  ON products FOR SELECT
  USING (available = true);

-- Admin can do everything (future)
DROP POLICY IF EXISTS "admin_manage_products" ON products;
CREATE POLICY "admin_manage_products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Verify schema
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Success message
SELECT 'Products schema enhanced successfully! ✅' as status;
