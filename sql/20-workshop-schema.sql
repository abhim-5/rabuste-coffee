-- Workshop System Schema
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist
DROP TABLE IF EXISTS workshop_registrations CASCADE;
DROP TABLE IF EXISTS workshops CASCADE;

-- Step 1: Create workshops table
CREATE TABLE IF NOT EXISTS workshops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  full_description text,
  start_date date NOT NULL,
  start_time text NOT NULL, -- e.g., "2:00 PM - 5:00 PM"
  duration text, -- e.g., "3 hours"
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  max_spots integer DEFAULT 20,
  available_spots integer DEFAULT 20,
  image_url text,
  instructor text,
  level text, -- e.g., "Beginner to Intermediate"
  includes jsonb DEFAULT '[]'::jsonb, -- Array of what's included
  available boolean DEFAULT true,
  is_upcoming boolean DEFAULT true, -- true for upcoming, false for previous
  reviews jsonb DEFAULT '[]'::jsonb, -- For previous workshops
  attendees integer DEFAULT 0, -- For previous workshops
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 2: Create workshop_registrations table
CREATE TABLE IF NOT EXISTS workshop_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id uuid REFERENCES workshops(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  booking_number text NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(workshop_id, user_id) -- Prevent duplicate registrations
);

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_workshops_upcoming ON workshops(is_upcoming, start_date);
CREATE INDEX IF NOT EXISTS idx_workshops_available ON workshops(available) WHERE available = true; CREATE INDEX IF NOT EXISTS idx_workshop_registrations_user ON workshop_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_workshop ON workshop_registrations(workshop_id);

-- Step 4: Create updated_at trigger for workshops
CREATE OR REPLACE FUNCTION update_workshops_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS workshops_updated_at ON workshops;
CREATE TRIGGER workshops_updated_at
  BEFORE UPDATE ON workshops
  FOR EACH ROW
  EXECUTE FUNCTION update_workshops_updated_at();

-- Step 5: RLS Policies

-- Enable RLS
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;

-- Public can view available workshops
DROP POLICY IF EXISTS "public_view_available_workshops" ON workshops;
CREATE POLICY "public_view_available_workshops"
  ON workshops FOR SELECT
  USING (available = true);

-- Users can view their own registrations
DROP POLICY IF EXISTS "users_view_own_registrations" ON workshop_registrations;
CREATE POLICY "users_view_own_registrations"
  ON workshop_registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create registrations
DROP POLICY IF EXISTS "users_create_registrations" ON workshop_registrations;
CREATE POLICY "users_create_registrations"
  ON workshop_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin policies
DROP POLICY IF EXISTS "admin_manage_workshops" ON workshops;
CREATE POLICY "admin_manage_workshops"
  ON workshops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "admin_view_all_registrations" ON workshop_registrations;
CREATE POLICY "admin_view_all_registrations"
  ON workshop_registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

SELECT 'Workshop schema created successfully! ✅' as status;
