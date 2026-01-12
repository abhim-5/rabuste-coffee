-- Add payment tracking fields to workshop_registrations table
-- This enables Razorpay payment integration for workshop registrations

-- Add payment-related columns
ALTER TABLE workshop_registrations
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
ADD COLUMN IF NOT EXISTS payment_id text,
ADD COLUMN IF NOT EXISTS razorpay_order_id text,
ADD COLUMN IF NOT EXISTS amount_paid numeric;

-- Add index for payment queries
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_payment_status 
ON workshop_registrations(payment_status);

-- Add comment
COMMENT ON COLUMN workshop_registrations.payment_status IS 'Payment status: pending, paid, or failed';
COMMENT ON COLUMN workshop_registrations.payment_id IS 'Razorpay payment ID after successful payment';
COMMENT ON COLUMN workshop_registrations.razorpay_order_id IS 'Razorpay order ID created during registration';
COMMENT ON COLUMN workshop_registrations.amount_paid IS 'Amount paid for workshop registration';

-- Verify changes
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'workshop_registrations'
AND column_name IN ('payment_status', 'payment_id', 'razorpay_order_id', 'amount_paid');
