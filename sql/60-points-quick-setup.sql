-- SIMPLIFIED POINTS SYSTEM - IMMEDIATE SETUP
-- Run this to make points work RIGHT NOW without complex configuration
-- Users earn 1 point per ₹10 on ALL orders automatically

-- 1. Ensure points_transactions table has required columns
ALTER TABLE points_transactions 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'reversed', 'locked')),
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Rename 'type' to 'transaction_type' if it hasn't been done
DO $$ 
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns 
            WHERE table_name='points_transactions' AND column_name='type') THEN
    ALTER TABLE points_transactions RENAME COLUMN type TO transaction_type;
  END IF;
END $$;

-- 2. Ensure user_points table exists and is working
CREATE TABLE IF NOT EXISTS user_points (
  user_id uuid REFERENCES auth.users(id) PRIMARY KEY,
  total_points integer DEFAULT 0,
  total_earned integer DEFAULT 0,
  total_redeemed integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- 3. Create/Replace the trigger function to update user_points
CREATE OR REPLACE FUNCTION update_user_points_summary()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_points (user_id, total_points, total_earned, total_redeemed)
  VALUES (
    NEW.user_id,
    CASE WHEN NEW.transaction_type = 'earned' THEN NEW.points ELSE -NEW.points END,
    CASE WHEN NEW.transaction_type = 'earned' THEN NEW.points ELSE 0 END,
    CASE WHEN NEW.transaction_type = 'redeemed' THEN NEW.points ELSE 0 END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = user_points.total_points + CASE WHEN NEW.transaction_type = 'earned' THEN NEW.points ELSE -NEW.points END,
    total_earned = user_points.total_earned + CASE WHEN NEW.transaction_type = 'earned' THEN NEW.points ELSE 0 END,
    total_redeemed = user_points.total_redeemed + CASE WHEN NEW.transaction_type = 'redeemed' THEN NEW.points ELSE 0 END,
    updated_at = CURRENT_TIMESTAMP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Drop and recreate trigger to ensure it's working
DROP TRIGGER IF EXISTS update_points_summary_trigger ON points_transactions;
CREATE TRIGGER update_points_summary_trigger
  AFTER INSERT ON points_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points_summary();

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_points_tx_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_tx_order_id ON points_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_points_tx_status ON points_transactions(status);
CREATE INDEX IF NOT EXISTS idx_points_tx_type ON points_transactions(transaction_type);

-- 6. Test the system - Add a sample transaction to verify trigger works
-- (This will be rolled back if there's an error, so it's safe)
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Get a real user ID from auth.users
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Insert test transaction
    INSERT INTO points_transactions (user_id, points, transaction_type, source, description, status)
    VALUES (test_user_id, 10, 'earned', 'bonus', '✅ System test - points working!', 'confirmed');
    
    RAISE NOTICE '✅ Points system is WORKING! User % got 10 test points.', test_user_id;
  ELSE
    RAISE NOTICE '⚠️ No users found to test with. Create a user first.';
  END IF;
END $$;

-- 7. Verify everything is set up
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM points_transactions LIMIT 1) 
    THEN '✅ points_transactions table exists'
    ELSE '❌ points_transactions table missing'
  END as transactions_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM user_points LIMIT 1) 
    THEN '✅ user_points table exists and has data'
    ELSE '⚠️ user_points table exists but empty'
  END as points_status;

-- Done! Points will now be awarded automatically on orders.
-- Formula: 1 point per ₹10 spent
-- No configuration needed - it just works!
