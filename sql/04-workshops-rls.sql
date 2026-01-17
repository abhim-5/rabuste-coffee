-- RLS Policies for Workshops Table

-- Create workshops table if it doesn't exist
CREATE TABLE IF NOT EXISTS workshops (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text DEFAULT '',
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  price numeric(10,2) NOT NULL DEFAULT 0,
  max_participants integer,
  enrolled_count integer DEFAULT 0,
  image_url text,
  instructor text DEFAULT '',
  location text DEFAULT '',
  available boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on workshops
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read workshops" ON workshops;
DROP POLICY IF EXISTS "Staff can manage workshops" ON workshops;

-- Public read access for workshops (everyone can view workshops)
CREATE POLICY "Public read access for workshops" ON workshops
  FOR SELECT
  USING (true);

-- Staff: Can create and update workshops
CREATE POLICY "Staff can create workshops" ON workshops
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );

CREATE POLICY "Staff can update workshops" ON workshops
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );

-- Admin: Can delete workshops
CREATE POLICY "Admin can delete workshops" ON workshops
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- WORKSHOP ENROLLMENTS TABLE (if it exists)
-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS workshop_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id uuid REFERENCES workshops(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  enrolled_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'cancelled', 'completed')),
  UNIQUE(workshop_id, user_id)
);

-- Enable RLS on workshop_enrollments
ALTER TABLE workshop_enrollments ENABLE ROW LEVEL SECURITY;

-- Users can read their own enrollments
CREATE POLICY "Users can read own enrollments" ON workshop_enrollments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own enrollments
CREATE POLICY "Users can create own enrollments" ON workshop_enrollments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can cancel their own enrollments
CREATE POLICY "Users can update own enrollments" ON workshop_enrollments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Staff can read all enrollments
CREATE POLICY "Staff can read all enrollments" ON workshop_enrollments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );

-- Staff can manage all enrollments
CREATE POLICY "Staff can manage enrollments" ON workshop_enrollments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );