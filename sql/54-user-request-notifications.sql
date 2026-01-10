-- =========================================================
-- USER REQUEST STATUS NOTIFICATIONS
-- =========================================================
-- Triggers to notify users when admin updates their requests
-- Creates notifications for franchise and workshop status changes
-- =========================================================

-- ========================================
-- 1. FRANCHISE INQUIRY STATUS NOTIFICATIONS
-- ========================================

CREATE OR REPLACE FUNCTION notify_franchise_status_change()
RETURNS TRIGGER AS $$
DECLARE
    user_profile_id uuid;
BEGIN
    -- Only notify if status changed AND moved from pending
    IF (NEW.status != OLD.status) AND (OLD.status = 'pending') THEN
        -- Find user by email in profiles table
        SELECT id INTO user_profile_id 
        FROM profiles 
        WHERE email = NEW.email 
        LIMIT 1;

        -- Only insert if user found
        IF user_profile_id IS NOT NULL THEN
            INSERT INTO notifications (user_id, type, title, message, link, created_at)
            VALUES (
                user_profile_id,
                'franchise_update',
                CASE 
                    WHEN NEW.status = 'contacted' THEN 'Franchise Inquiry Under Review'
                    WHEN NEW.status = 'rejected' THEN 'Franchise Inquiry Update'
                    WHEN NEW.status = 'closed' THEN 'Franchise Inquiry Closed'
                    ELSE 'Franchise Inquiry Updated'
                END,
                'Your franchise inquiry for ' || NEW.location || ' has been ' || 
                CASE 
                    WHEN NEW.status = 'contacted' THEN 'reviewed by our team. We will contact you soon!'
                    WHEN NEW.status = 'rejected' THEN 'reviewed. Thank you for your interest.'
                    WHEN NEW.status = 'closed' THEN 'closed.'
                    ELSE 'updated to: ' || NEW.status
                END,
                '/profile?tab=franchise-requests',
                NOW()
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS franchise_status_notification ON franchise_inquiries;
CREATE TRIGGER franchise_status_notification
    AFTER UPDATE OF status ON franchise_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION notify_franchise_status_change();

-- ========================================
-- 2. WORKSHOP REQUEST STATUS NOTIFICATIONS
-- ========================================

CREATE OR REPLACE FUNCTION notify_workshop_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify if status changed AND moved from pending
    IF (NEW.status != OLD.status) AND (OLD.status = 'pending') THEN
        -- user_id already exists in workshop_requests table
        IF NEW.user_id IS NOT NULL THEN
            INSERT INTO notifications (user_id, type, title, message, link, created_at)
            VALUES (
                NEW.user_id,
                'workshop_update',
                CASE 
                    WHEN NEW.status = 'approved' THEN 'Workshop Request Approved!'
                    WHEN NEW.status = 'rejected' THEN 'Workshop Request Update'
                    ELSE 'Workshop Request Updated'
                END,
                'Your workshop request for "' || NEW.workshop_theme || '" has been ' || 
                CASE 
                    WHEN NEW.status = 'approved' THEN 'approved! We will contact you with details.'
                    WHEN NEW.status = 'rejected' THEN 'reviewed. Thank you for your interest.'
                    ELSE 'updated to: ' || NEW.status
                END,
                '/profile?tab=workshop-requests',
                NOW()
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS workshop_status_notification ON workshop_requests;
CREATE TRIGGER workshop_status_notification
    AFTER UPDATE OF status ON workshop_requests
    FOR EACH ROW
    EXECUTE FUNCTION notify_workshop_status_change();

-- ========================================
-- VERIFICATION
-- ========================================

SELECT '✅ User request notification triggers created!' as status;

-- List all triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name IN ('franchise_status_notification', 'workshop_status_notification');
