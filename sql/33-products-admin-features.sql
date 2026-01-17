-- SQL FILE 33: Products Admin Features
-- Adds columns and policies for admin menu management

-- ==========================================
-- STEP 1: Add new columns to products table
-- ==========================================

-- Add discount pricing columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS discount_price numeric(10,2),
ADD COLUMN IF NOT EXISTS crossed_price numeric(10,2);

-- Add deal of day columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_deal_of_day boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS deal_expiry timestamp with time zone;

-- Add display order for admin sorting
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- ==========================================
-- STEP 2: Create indexes for performance
-- ==========================================

-- Index for active deals (simplified - NOW() can't be in index predicate)
CREATE INDEX IF NOT EXISTS idx_products_active_deals 
  ON products(is_deal_of_day, deal_expiry) 
  WHERE is_deal_of_day = true;

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category 
  ON products(category) 
  WHERE available = true;

-- Index for display ordering
CREATE INDEX IF NOT EXISTS idx_products_display_order 
  ON products(display_order, created_at);

-- ==========================================
-- STEP 3: RLS Policies for Admin Access
-- ==========================================

-- Drop existing admin policies if any
DROP POLICY IF EXISTS "admins_update_products" ON products;
DROP POLICY IF EXISTS "admins_create_products" ON products;
DROP POLICY IF EXISTS "admins_delete_products" ON products;

-- Allow admins to update products
CREATE POLICY "admins_update_products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Allow admins to create products
CREATE POLICY "admins_create_products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Allow admins to delete products
CREATE POLICY "admins_delete_products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- ==========================================
-- STEP 4: Helper Function for Deal Status
-- ==========================================

-- Function to check if a deal is currently active
CREATE OR REPLACE FUNCTION is_deal_active(product_row products)
RETURNS boolean AS $$
BEGIN
  RETURN product_row.is_deal_of_day = true AND 
         (product_row.deal_expiry IS NULL OR product_row.deal_expiry > NOW());
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ==========================================
-- STEP 5: Auto-expire deals trigger
-- ==========================================

-- Function to auto-disable expired deals
CREATE OR REPLACE FUNCTION auto_expire_deals()
RETURNS void AS $$
BEGIN
  UPDATE products
  SET is_deal_of_day = false
  WHERE is_deal_of_day = true 
    AND deal_expiry IS NOT NULL 
    AND deal_expiry < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job (requires pg_cron extension)
-- Note: Uncomment if pg_cron is available
-- SELECT cron.schedule('expire-deals', '0 * * * *', 'SELECT auto_expire_deals()');

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Check new columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN ('discount_price', 'crossed_price', 'is_deal_of_day', 'deal_expiry', 'display_order')
ORDER BY column_name;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'products' 
  AND indexname LIKE 'idx_products_%'
ORDER BY indexname;

-- Check RLS policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'products' 
  AND policyname LIKE 'admins_%'
ORDER BY policyname;

-- Test pricing logic
SELECT 
    name,
    price as base_price,
    discount_price,
    crossed_price,
    COALESCE(discount_price, price) as display_price,
    is_deal_of_day,
    deal_expiry
FROM products
LIMIT 5;

SELECT '✅ Products table enhanced for admin management!' as status;
