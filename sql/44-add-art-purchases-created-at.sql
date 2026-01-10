-- Fix art_purchases table: Add created_at column
-- The table currently has 'purchase_date' but code expects 'created_at'

-- Add created_at column if it doesn't exist
ALTER TABLE art_purchases ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Copy existing purchase_date data to created_at if needed
UPDATE art_purchases 
SET created_at = purchase_date 
WHERE created_at IS NULL AND purchase_date IS NOT NULL;

-- Set created_at to now() for any remaining NULL values
UPDATE art_purchases 
SET created_at = now() 
WHERE created_at IS NULL;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'art_purchases' 
ORDER BY ordinal_position;
