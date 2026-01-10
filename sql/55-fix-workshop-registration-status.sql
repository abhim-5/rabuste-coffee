-- Fix Workshop Registrations Status Flow - COMPLETE FIX
-- This migration properly fixes the status column and toggle functionality

-- STEP 1: Drop the old CHECK constraint
ALTER TABLE workshop_registrations 
  DROP CONSTRAINT IF EXISTS workshop_registrations_status_check;

-- STEP 2: Add new CHECK constraint with 'pending' option
ALTER TABLE workshop_registrations 
  ADD CONSTRAINT workshop_registrations_status_check 
  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended'));

-- STEP 3: Change default to 'pending'
ALTER TABLE workshop_registrations 
  ALTER COLUMN status SET DEFAULT 'pending';

-- STEP 4: Update existing confirmed to pending (OPTIONAL - comment out if you want to keep existing)
-- UPDATE workshop_registrations SET status = 'pending' WHERE status = 'confirmed';

-- STEP 5: Create trigger function for automatic seat management
CREATE OR REPLACE FUNCTION manage_workshop_seats()
RETURNS TRIGGER AS $$
BEGIN
  -- When status changes TO 'confirmed' (and wasn't confirmed before)
  IF NEW.status = 'confirmed' AND (TG_OP = 'INSERT' OR OLD.status != 'confirmed') THEN
    UPDATE workshops
    SET available_spots = GREATEST(available_spots - 1, 0)
    WHERE id = NEW.workshop_id;
    
    RAISE NOTICE 'Decreased seats for workshop %', NEW.workshop_id;
  END IF;
  
  -- When status changes FROM 'confirmed' to something else
  IF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
    UPDATE workshops
    SET available_spots = available_spots + 1
    WHERE id = NEW.workshop_id;
    
    RAISE NOTICE 'Increased seats for workshop %', NEW.workshop_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 6: Drop old trigger if exists
DROP TRIGGER IF EXISTS workshop_seats_management ON workshop_registrations;
DROP TRIGGER IF EXISTS manage_workshop_seats_trigger ON workshop_registrations;

-- STEP 7: Create new trigger
CREATE TRIGGER manage_workshop_seats_trigger
  AFTER INSERT OR UPDATE OF status ON workshop_registrations
  FOR EACH ROW
  EXECUTE FUNCTION manage_workshop_seats();

-- STEP 8: Ensure admin can update registrations
DROP POLICY IF EXISTS "Admins can update registrations" ON workshop_registrations;

CREATE POLICY "Admins can update registrations"
  ON workshop_registrations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- STEP 9: Verify the setup
DO $$
BEGIN
  RAISE NOTICE '✅ Workshop registration status fix completed!';
  RAISE NOTICE '✅ Default status is now: pending';
  RAISE NOTICE '✅ Trigger created: manage_workshop_seats_trigger';
  RAISE NOTICE '✅ Admin update policy enabled';
END $$;
