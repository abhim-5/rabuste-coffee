-- Workshop Requests Table
-- Run this in Supabase SQL Editor

-- Create workshop_requests table
CREATE TABLE IF NOT EXISTS workshop_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  workshop_theme text NOT NULL,
  additional_details text,
  instagram_handle text, -- NEW: Track Instagram for popularity
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_workshop_requests_user ON workshop_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_requests_status ON workshop_requests(status);

-- Enable RLS
ALTER TABLE workshop_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
DROP POLICY IF EXISTS "users_view_own_requests" ON workshop_requests;
CREATE POLICY "users_view_own_requests"
  ON workshop_requests FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Anyone can create a request (even non-authenticated)
DROP POLICY IF EXISTS "anyone_create_request" ON workshop_requests;
CREATE POLICY "anyone_create_request"
  ON workshop_requests FOR INSERT
  WITH CHECK (true);

-- Admin can view all requests
DROP POLICY IF EXISTS "admin_view_all_requests" ON workshop_requests;
CREATE POLICY "admin_view_all_requests"
  ON workshop_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Admin can update requests
DROP POLICY IF EXISTS "admin_update_requests" ON workshop_requests;
CREATE POLICY "admin_update_requests"
  ON workshop_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

SELECT 'Workshop requests table created! ✅' as status;
