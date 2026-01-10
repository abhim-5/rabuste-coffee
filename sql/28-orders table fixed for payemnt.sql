-- Run this SQL in Supabase SQL Editor to ensure your orders table has all required fields
-- First, check if the columns exist and add them if they don't
DO $$ 
BEGIN
    -- Add order_number if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='orders' AND column_name='order_number') THEN
        ALTER TABLE orders ADD COLUMN order_number TEXT;
    END IF;
    -- Add order_type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='orders' AND column_name='order_type') THEN
        ALTER TABLE orders ADD COLUMN order_type TEXT DEFAULT 'takeaway-now';
    END IF;
    -- Add scheduled_time if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='orders' AND column_name='scheduled_time') THEN
        ALTER TABLE orders ADD COLUMN scheduled_time TEXT;
    END IF;
    -- Add customer_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='orders' AND column_name='customer_name') THEN
        ALTER TABLE orders ADD COLUMN customer_name TEXT;
    END IF;
    -- Add customer_email if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='orders' AND column_name='customer_email') THEN
        ALTER TABLE orders ADD COLUMN customer_email TEXT;
    END IF;
    -- Add subtotal if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='orders' AND column_name='subtotal') THEN
        ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0;
    END IF;
    -- Add tax if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='orders' AND column_name='tax') THEN
        ALTER TABLE orders ADD COLUMN tax DECIMAL(10,2) DEFAULT 0;
    END IF;
END $$;
-- Update order_items table to ensure all fields exist
DO $$ 
BEGIN
    -- Add menu_item_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='order_items' AND column_name='menu_item_id') THEN
        ALTER TABLE order_items ADD COLUMN menu_item_id TEXT;
    END IF;
    -- Add menu_item_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='order_items' AND column_name='menu_item_name') THEN
        ALTER TABLE order_items ADD COLUMN menu_item_name TEXT;
    END IF;
    -- Add menu_item_image if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='order_items' AND column_name='menu_item_image') THEN
        ALTER TABLE order_items ADD COLUMN menu_item_image TEXT;
    END IF;
    -- Add variation_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='order_items' AND column_name='variation_name') THEN
        ALTER TABLE order_items ADD COLUMN variation_name TEXT;
    END IF;
    -- Add unit_price if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='order_items' AND column_name='unit_price') THEN
        ALTER TABLE order_items ADD COLUMN unit_price DECIMAL(10,2);
    END IF;
    -- Add subtotal if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='order_items' AND column_name='subtotal') THEN
        ALTER TABLE order_items ADD COLUMN subtotal DECIMAL(10,2);
    END IF;
END $$;
-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;