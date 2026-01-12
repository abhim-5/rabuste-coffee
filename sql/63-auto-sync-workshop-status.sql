-- Update workshop registration status to be derived from payment status
-- Remove the manual status field and make it auto-computed

-- Create a computed column or update trigger to sync status with payment_status
CREATE OR REPLACE FUNCTION sync_workshop_registration_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically set status based on payment_status
  IF NEW.payment_status = 'paid' THEN
    NEW.status := 'confirmed';
  ELSIF NEW.payment_status = 'failed' THEN
    NEW.status := 'cancelled';
  ELSE
    NEW.status := 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS sync_workshop_status_trigger ON workshop_registrations;

-- Create trigger to auto-sync status
CREATE TRIGGER sync_workshop_status_trigger
  BEFORE INSERT OR UPDATE OF payment_status ON workshop_registrations
  FOR EACH ROW
  EXECUTE FUNCTION sync_workshop_registration_status();

-- Update existing records to match payment status
UPDATE workshop_registrations
SET status = CASE
  WHEN payment_status = 'paid' THEN 'confirmed'
  WHEN payment_status = 'failed' THEN 'cancelled'
  ELSE 'pending'
END;

-- Verify changes
SELECT id, booking_number, status, payment_status 
FROM workshop_registrations 
ORDER BY created_at DESC 
LIMIT 10;
