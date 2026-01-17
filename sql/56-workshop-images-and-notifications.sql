-- =========================================================
-- WORKSHOP IMAGE UPLOAD & STATUS NOTIFICATIONS
-- =========================================================
-- This SQL file:
-- 1. Adds image_url column to workshops (if not exists)
-- 2. Creates trigger to notify users when registration status changes
-- 3. Creates notifications table columns for workshop updates
-- =========================================================

-- ========================================
-- 1. ENSURE WORKSHOPS HAS IMAGE_URL COLUMN
-- ========================================

-- Check if image_url exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'workshops' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE workshops ADD COLUMN image_url text;
    RAISE NOTICE '✅ Added image_url column to workshops table';
  ELSE
    RAISE NOTICE '✅ image_url column already exists in workshops table';
  END IF;
END $$;

-- ========================================
-- 2. CREATE WORKSHOP STATUS NOTIFICATION TRIGGER
-- ========================================

-- Function to notify user when their workshop registration status changes
CREATE OR REPLACE FUNCTION notify_user_registration_status()
RETURNS TRIGGER AS $$
DECLARE
  v_workshop_title text;
  v_user_name text;
  v_user_email text;
BEGIN
  -- Only send notification on status update
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    
    -- Get workshop details
    SELECT title INTO v_workshop_title
    FROM workshops
    WHERE id = NEW.workshop_id;
    
    -- Get user details
    v_user_name := NEW.name;
    v_user_email := NEW.email;
    
    -- Insert notification for the user
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      metadata,
      created_at
    )
    VALUES (
      NEW.user_id,
      'workshop_status_update',
      CASE 
        WHEN NEW.status = 'confirmed' THEN 'Workshop Registration Confirmed! 🎉'
        WHEN NEW.status = 'pending' THEN 'Workshop Registration Pending'
        WHEN NEW.status = 'cancelled' THEN 'Workshop Registration Cancelled'
        WHEN NEW.status = 'attended' THEN 'Workshop Marked as Attended ✅'
        ELSE 'Workshop Status Updated'
      END,
      CASE 
        WHEN NEW.status = 'confirmed' THEN 
          'Great news! Your registration for "' || v_workshop_title || '" has been confirmed by our team. See you at the workshop!'
        WHEN NEW.status = 'pending' THEN 
          'Your registration for "' || v_workshop_title || '" is pending admin confirmation. We''ll notify you once it''s approved.'
        WHEN NEW.status = 'cancelled' THEN 
          'Your registration for "' || v_workshop_title || '" has been cancelled.'
        WHEN NEW.status = 'attended' THEN 
          'Thank you for attending "' || v_workshop_title || '"! We hope you enjoyed the experience.'
        ELSE 
          'Your workshop registration status has been updated.'
      END,
      jsonb_build_object(
        'workshop_id', NEW.workshop_id,
        'workshop_title', v_workshop_title,
        'registration_id', NEW.id,
        'booking_number', NEW.booking_number,
        'status', NEW.status,
        'previous_status', OLD.status
      ),
      NOW()
    );
    
    RAISE NOTICE '✅ Notification sent to user % for workshop registration status change: % → %', 
      NEW.user_id, OLD.status, NEW.status;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS workshop_registration_status_notification ON workshop_registrations;

-- Create trigger
CREATE TRIGGER workshop_registration_status_notification
  AFTER UPDATE OF status ON workshop_registrations
  FOR EACH ROW
  EXECUTE FUNCTION notify_user_registration_status();

COMMENT ON TRIGGER workshop_registration_status_notification ON workshop_registrations IS 
  'Sends notification to user when their workshop registration status changes';

-- ========================================
-- 3. STORAGE BUCKET FOR WORKSHOP IMAGES
-- ========================================

-- Note: Storage buckets must be created in Supabase Dashboard Storage section
-- This is a reference/reminder to create the bucket manually:

/*
MANUAL STEP IN SUPABASE DASHBOARD:
1. Go to Storage > Create new bucket
2. Bucket name: "workshop-images"
3. Public bucket: YES (so images can be displayed)
4. File size limit: 5MB
5. Allowed MIME types: image/jpeg, image/png, image/webp

Then create this policy in the bucket:
- Policy name: "Anyone can view workshop images"
- Operation: SELECT
- Target roles: public
- Policy: true

- Policy name: "Admins can upload workshop images"  
- Operation: INSERT
- Target roles: authenticated
- Policy: Check if user is admin
*/

-- ========================================
-- 4. VERIFICATION
-- ========================================

-- Verify notifications table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'notifications'
  ) THEN
    RAISE NOTICE '✅ Notifications table exists';
  ELSE
    RAISE WARNING '⚠️  Notifications table does NOT exist - run 49-setup-user-notifications.sql first!';
  END IF;
END $$;

-- Show success message
SELECT '✅ Workshop images and notifications setup complete!' as status;

-- Verify trigger was created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'workshop_registration_status_notification';
