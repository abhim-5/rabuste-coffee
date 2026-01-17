-- 1. Create the 'workshops' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('workshops', 'workshops', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Note: RLS is enabled by default on storage.objects

-- 3. Policy: Public Read Access
-- Allow anyone (even unauthenticated users) to view images in the workshops bucket
DROP POLICY IF EXISTS "Public Select Workshops" ON storage.objects;
CREATE POLICY "Public Select Workshops"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'workshops' );

-- 4. Policy: Authenticated Upload (Insert)
-- Allow logged-in users to upload to the workshops bucket
DROP POLICY IF EXISTS "Authenticated Insert Workshops" ON storage.objects;
CREATE POLICY "Authenticated Insert Workshops"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'workshops' );

-- 5. Policy: Authenticated Update
-- Allow logged-in users to update files in the workshops bucket
DROP POLICY IF EXISTS "Authenticated Update Workshops" ON storage.objects;
CREATE POLICY "Authenticated Update Workshops"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING ( bucket_id = 'workshops' );

-- 6. Policy: Authenticated Delete
-- Allow logged-in users to delete files from the workshops bucket
DROP POLICY IF EXISTS "Authenticated Delete Workshops" ON storage.objects;
CREATE POLICY "Authenticated Delete Workshops"
  ON storage.objects FOR DELETE
  TO authenticated
  USING ( bucket_id = 'workshops' );
