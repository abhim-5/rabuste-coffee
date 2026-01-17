-- Fix workshop registration status notification trigger
-- The trigger was referencing a 'metadata' column that doesn't exist in notifications table

-- First, drop the existing trigger
DROP TRIGGER IF EXISTS workshop_registration_status_notification ON workshop_registrations;

-- Drop the old function
DROP FUNCTION IF EXISTS notify_workshop_registration_status();

-- Create updated function without metadata column and with SECURITY DEFINER
CREATE OR REPLACE FUNCTION notify_workshop_registration_status()
RETURNS TRIGGER 
SECURITY DEFINER  -- This allows the function to bypass RLS policies
SET search_path = public
AS $$
BEGIN
  -- Only notify on status changes
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO notifications (user_id, type, title, message, created_at)
    VALUES (
      NEW.user_id,
      'workshop_request',  -- Using valid notification type from allowed enum
      CASE 
        WHEN NEW.status = 'confirmed' THEN 'Workshop Registration Confirmed'
        WHEN NEW.status = 'cancelled' THEN 'Workshop Registration Cancelled'
        ELSE 'Workshop Registration Updated'
      END,
      CASE 
        WHEN NEW.status = 'confirmed' THEN 'Your workshop registration has been confirmed!'
        WHEN NEW.status = 'cancelled' THEN 'Your workshop registration has been cancelled.'
        ELSE 'Your workshop registration status has been updated to: ' || NEW.status
      END,
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER workshop_registration_status_notification
  AFTER UPDATE OF status ON workshop_registrations
  FOR EACH ROW
  EXECUTE FUNCTION notify_workshop_registration_status();
