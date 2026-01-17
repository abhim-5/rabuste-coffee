-- =========================================================
-- SQL FILE 49: SETUP USER NOTIFICATIONS
-- =========================================================
-- Creates a 'notifications' table to store user alerts.
-- Sets up triggers to auto-generate notifications on status changes.
-- =========================================================

-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('order', 'art_purchase', 'workshop_request', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  link text, -- URL to redirect to
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users view own notifications" ON notifications;
CREATE POLICY "Users view own notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications"
ON notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id); -- Allow marking as read

-- 2. Create Trigger Function
CREATE OR REPLACE FUNCTION handle_status_change_notification()
RETURNS TRIGGER AS $$
DECLARE
  notif_title text;
  notif_message text;
  notif_link text;
  notif_type text;
  target_user_id uuid;
BEGIN
  -- Only notify if status actually changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Determine context based on table name
  IF TG_TABLE_NAME = 'orders' THEN
    notif_type := 'order';
    target_user_id := NEW.user_id;
    notif_title := 'Order Status Update';
    notif_message := 'Your order ' || (NEW.order_number::text) || ' is now ' || NEW.status;
    notif_link := '/profile?tab=orders'; -- Or specific order page if available
    
  ELSIF TG_TABLE_NAME = 'art_purchases' THEN
    notif_type := 'art_purchase';
    target_user_id := NEW.user_id;
    notif_title := 'Art Purchase Update';
    -- Status might be 'confirmed', map to friendly text if needed, but DB status is fine
    notif_message := 'Your art purchase is now ' || NEW.status;
    notif_link := '/profile?tab=gallery';

  ELSIF TG_TABLE_NAME = 'workshop_requests' THEN
    notif_type := 'workshop_request';
    target_user_id := NEW.user_id;
    notif_title := 'Workshop Request Update';
    notif_message := 'Your workshop request for ' || NEW.workshop_theme || ' has been ' || NEW.status;
    notif_link := '/workshops';
  END IF;

  -- Insert Notification
  IF target_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (target_user_id, notif_type, notif_title, notif_message, notif_link);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
-- SECURITY DEFINER allows trigger to write to notifications even if the user updating (Admin) doesn't own the notification row (though Admin should have access usually, this is safer)

-- 3. Attach Triggers

-- Trigger for Orders
DROP TRIGGER IF EXISTS notify_order_status_change ON orders;
CREATE TRIGGER notify_order_status_change
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_status_change_notification();

-- Trigger for Art Purchases
DROP TRIGGER IF EXISTS notify_art_status_change ON art_purchases;
CREATE TRIGGER notify_art_status_change
  AFTER UPDATE OF status ON art_purchases
  FOR EACH ROW
  EXECUTE FUNCTION handle_status_change_notification();

-- Trigger for Workshop Requests
DROP TRIGGER IF EXISTS notify_workshop_status_change ON workshop_requests;
CREATE TRIGGER notify_workshop_status_change
  AFTER UPDATE OF status ON workshop_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_status_change_notification();

SELECT 'Notifications system set up successfully! 🔔' as status;
