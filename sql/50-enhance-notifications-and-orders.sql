-- =========================================================
-- SQL FILE 50: ENHANCE NOTIFICATIONS & ORDERS PERMISSIONS
-- =========================================================
-- 1. Grants Admins update access to 'orders' table (Critical for status updates).
-- 2. Grants Users DELETE access to 'notifications' table.
-- 3. Updates trigger logic for better deep-linking (Profile tabs).
-- =========================================================

-- PART 1: FIX ORDERS PERMISSIONS
-- Admins need to update order status for triggers to fire correctly.

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders"
ON orders FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- PART 2: ENABLE NOTIFICATION DELETION
-- Allow users to clear their notifications.

DROP POLICY IF EXISTS "Users delete own notifications" ON notifications;
CREATE POLICY "Users delete own notifications"
ON notifications FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- PART 3: UPDATE TRIGGER LINKS
-- Point to specific Profile Tabs instead of generic pages.

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
    notif_link := '/profile?tab=orders'; -- Points to Order History tab
    
  ELSIF TG_TABLE_NAME = 'art_purchases' THEN
    notif_type := 'art_purchase';
    target_user_id := NEW.user_id;
    notif_title := 'Art Purchase Update';
    notif_message := 'Your art purchase is now ' || NEW.status;
    notif_link := '/profile?tab=art'; -- Points to Art Collection tab
    -- Note: Profile page uses 'art' as tab ID

  ELSIF TG_TABLE_NAME = 'workshop_requests' THEN
    notif_type := 'workshop_request';
    target_user_id := NEW.user_id;
    notif_title := 'Workshop Request Update';
    notif_message := 'Your workshop request for ' || NEW.workshop_theme || ' has been ' || NEW.status;
    notif_link := '/profile?tab=workshops'; -- Points to My Workshops tab
  END IF;

  -- Insert Notification
  IF target_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (target_user_id, notif_type, notif_title, notif_message, notif_link);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT 'Enhanced permissions and notification links! 🚀' as status;
