-- =========================================================
-- SQL FILE 59: SIMPLIFY ORDER STATUS & ADD RATING SYSTEM (UPDATED)
-- =========================================================
-- RUN THIS AFTER CLEARING/BACKING UP EXISTING DATA
-- =========================================================

-- PART 1: UPDATE ORDER STATUS CONSTRAINT
-- Migrate existing orders and simplify to 4 states

-- Migrate 'preparing' → 'ready'
UPDATE orders 
SET status = 'ready', 
    updated_at = NOW()
WHERE status = 'preparing';

-- Migrate 'cancelled' → 'completed' (with note)
UPDATE orders 
SET status = 'completed', 
    updated_at = NOW(),
    notes = CASE 
      WHEN notes IS NULL OR notes = '' THEN 'Order was cancelled'
      ELSE notes || ' (Order was cancelled)'
    END
WHERE status = 'cancelled';

-- Drop old constraint and add new one (4 states)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'ready', 'completed'));

-- PART 2: CREATE PRODUCT RATINGS TABLE (SIMPLIFIED)
-- No foreign key on order_item_id since we generate synthetic IDs

DROP TABLE IF EXISTS product_ratings CASCADE;

CREATE TABLE product_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User and Order references
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  
  -- Order item ID (text, not FK since we generate synthetic IDs)
  order_item_id TEXT NOT NULL,
  
  -- Menu item reference (for analytics)
  menu_item_id TEXT NOT NULL,
  menu_item_name TEXT NOT NULL,
  
  -- Rating (1-5 stars)
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one rating per order item
  UNIQUE(order_id, order_item_id)
);

-- PART 3: CREATE INDEXES
CREATE INDEX idx_product_ratings_user_id ON product_ratings(user_id);
CREATE INDEX idx_product_ratings_order_id ON product_ratings(order_id);
CREATE INDEX idx_product_ratings_menu_item_id ON product_ratings(menu_item_id);
CREATE INDEX idx_product_ratings_rating ON product_ratings(rating);
CREATE INDEX idx_product_ratings_created_at ON product_ratings(created_at DESC);

-- PART 4: ENABLE RLS
ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;

-- PART 5: RLS POLICIES

-- Users view own ratings
DROP POLICY IF EXISTS "Users can view own ratings" ON product_ratings;
CREATE POLICY "Users can view own ratings"
  ON product_ratings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users create ratings for own completed orders
DROP POLICY IF EXISTS "Users can create own ratings" ON product_ratings;
CREATE POLICY "Users can create own ratings"
  ON product_ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = product_ratings.order_id
      AND orders.user_id = auth.uid()
      AND orders.status = 'completed'
    )
  );

-- Users update own ratings
DROP POLICY IF EXISTS "Users can update own ratings" ON product_ratings;
CREATE POLICY "Users can update own ratings"
  ON product_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users delete own ratings
DROP POLICY IF EXISTS "Users can delete own ratings" ON product_ratings;
CREATE POLICY "Users can delete own ratings"
  ON product_ratings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins view all ratings
DROP POLICY IF EXISTS "Admins can view all ratings" ON product_ratings;
CREATE POLICY "Admins can view all ratings"
  ON product_ratings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- PART 6: AUTO-UPDATE TRIGGER
CREATE OR REPLACE FUNCTION update_product_ratings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_product_ratings_updated_at_trigger ON product_ratings;
CREATE TRIGGER update_product_ratings_updated_at_trigger
  BEFORE UPDATE ON product_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_product_ratings_updated_at();

-- PART 7: HELPER FUNCTIONS

CREATE OR REPLACE FUNCTION get_product_average_rating(product_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
  avg_rating DECIMAL;
BEGIN
  SELECT AVG(rating)::DECIMAL(3,2)
  INTO avg_rating
  FROM product_ratings
  WHERE menu_item_id = product_id;
  
  RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_product_rating_count(product_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  rating_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO rating_count
  FROM product_ratings
  WHERE menu_item_id = product_id;
  
  RETURN COALESCE(rating_count, 0);
END;
$$ LANGUAGE plpgsql;

-- PART 8: ANALYTICS VIEW
CREATE OR REPLACE VIEW product_rating_stats AS
SELECT 
  menu_item_id,
  menu_item_name,
  COUNT(*) as total_ratings,
  AVG(rating)::DECIMAL(3,2) as average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star_count,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_count,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_count,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_count,
  MAX(created_at) as last_rated_at
FROM product_ratings
GROUP BY menu_item_id, menu_item_name;

-- VERIFICATION
SELECT '✅ Order status simplified to 4 states!' as status;

SELECT 'Current order status distribution:' as info;
SELECT status, COUNT(*) as count
FROM orders
GROUP BY status
ORDER BY status;

SELECT '✅ Product ratings table created!' as status;

SELECT 'Product ratings table structure:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'product_ratings'
ORDER BY ordinal_position;

SELECT '🎉 Migration complete!' as final_status;
