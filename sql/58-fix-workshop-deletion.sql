-- 1. Drop existing foreign key constraint if it exists
ALTER TABLE workshop_registrations
DROP CONSTRAINT IF EXISTS workshop_registrations_workshop_id_fkey;

-- 2. Add foreign key constraint with ON DELETE CASCADE
-- This ensures that when a workshop is deleted, all its registrations are also deleted automatically
ALTER TABLE workshop_registrations
ADD CONSTRAINT workshop_registrations_workshop_id_fkey
FOREIGN KEY (workshop_id)
REFERENCES workshops(id)
ON DELETE CASCADE;

-- 3. Update Admin Policies for workshop_registrations
-- Drop the read-only policy
DROP POLICY IF EXISTS "admin_view_all_registrations" ON workshop_registrations;

-- Create a full management policy for admins (allows SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "admin_manage_registrations"
  ON workshop_registrations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

SELECT 'Workshop deletion fixed! 🗑️✅' as status;
