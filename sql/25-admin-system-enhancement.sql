-- Admin System Enhancement
-- Adds activity logging and helper functions for admin operations

-- 1. Admin Activity Log Table
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL, -- 'menu_item', 'order', 'user', 'workshop', 'art', etc.
  resource_id VARCHAR(255),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient querying
CREATE INDEX idx_admin_activity_admin_id ON admin_activity_log(admin_id);
CREATE INDEX idx_admin_activity_created_at ON admin_activity_log(created_at DESC);
CREATE INDEX idx_admin_activity_resource ON admin_activity_log(resource_type, resource_id);

-- 2. Enable RLS on admin activity log
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Admins can view all activity logs
CREATE POLICY "Admins can view activity logs"
  ON admin_activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- System can insert activity logs
CREATE POLICY "System can insert activity logs"
  ON admin_activity_log FOR INSERT
  WITH CHECK (true);

-- 3. Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Helper function to check if user is superadmin
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_action VARCHAR,
  p_resource_type VARCHAR,
  p_resource_id VARCHAR DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  -- Only log if user is admin
  IF is_admin() THEN
    INSERT INTO admin_activity_log (
      admin_id,
      action,
      resource_type,
      resource_id,
      details
    ) VALUES (
      auth.uid(),
      p_action,
      p_resource_type,
      p_resource_id,
      p_details
    ) RETURNING id INTO activity_id;
    
    RETURN activity_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Add credits column to profiles if not exists (for rewards system)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'credits'
  ) THEN
    ALTER TABLE profiles ADD COLUMN credits DECIMAL(10,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone VARCHAR(20);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_banned'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_banned BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'banned_reason'
  ) THEN
    ALTER TABLE profiles ADD COLUMN banned_reason TEXT;
  END IF;
END $$;

-- 7. Create view for admin dashboard stats
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM profiles WHERE role = 'customer') AS total_customers,
  (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '7 days') AS new_users_7d,
  (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '30 days') AS new_users_30d,
  (SELECT COUNT(*) FROM orders) AS total_orders,
  (SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '1 day') AS orders_today,
  (SELECT COALESCE(SUM(total), 0) FROM orders WHERE created_at > NOW() - INTERVAL '1 day') AS revenue_today,
  (SELECT COALESCE(SUM(total), 0) FROM orders WHERE created_at > NOW() - INTERVAL '7 days') AS revenue_week,
  (SELECT COALESCE(SUM(total), 0) FROM orders WHERE created_at > NOW() - INTERVAL '30 days') AS revenue_month,
  (SELECT COALESCE(SUM(total), 0) FROM orders) AS revenue_total,
  (SELECT COUNT(*) FROM workshop_registrations) AS total_workshop_registrations,
  (SELECT COUNT(*) FROM art_purchases) AS total_art_purchases;

-- Grant admin access to the view
GRANT SELECT ON admin_dashboard_stats TO authenticated;

-- Verify installation
SELECT 
  'Admin system enhancement complete!' AS status,
  'Created: admin_activity_log table' AS feature_1,
  'Created: is_admin(), is_superadmin() functions' AS feature_2,
  'Created: log_admin_activity() function' AS feature_3,
  'Created: admin_dashboard_stats view' AS feature_4;
