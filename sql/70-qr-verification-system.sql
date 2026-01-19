-- QR Order Verification System - Database Migration
-- Run this in Supabase SQL Editor

-- Add pickup verification columns to orders table
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS pickup_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS pickup_verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS pickup_verified_by UUID REFERENCES profiles(id);

-- Create indexes for quick lookup
CREATE INDEX IF NOT EXISTS idx_orders_pickup_verified ON orders(pickup_verified);
CREATE INDEX IF NOT EXISTS idx_orders_order_number_pickup ON orders(order_number, pickup_verified);

-- Add comments for documentation
COMMENT ON COLUMN orders.pickup_verified IS 'True when order has been picked up by customer (QR verified)';
COMMENT ON COLUMN orders.pickup_verified_at IS 'Timestamp when pickup was verified';
COMMENT ON COLUMN orders.pickup_verified_by IS 'Staff member (admin) who verified the pickup';

-- Verify columns added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name IN ('pickup_verified', 'pickup_verified_at', 'pickup_verified_by')
ORDER BY column_name;
