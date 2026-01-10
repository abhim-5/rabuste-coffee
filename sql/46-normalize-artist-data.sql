-- =========================================================
-- SQL FILE 46: NORMALIZE ARTIST DATA
-- =========================================================
-- Creates a separate artists table and migrates artist data
-- from art_pieces to eliminate redundancy and enable
-- centralized artist management.
-- =========================================================

-- STEP 1: Create artists table
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text, -- Artist's POV/bio
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- STEP 2: Create updated_at trigger for artists
DROP TRIGGER IF EXISTS artists_updated_at ON artists;
CREATE TRIGGER artists_updated_at
  BEFORE UPDATE ON artists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- STEP 3: Populate artists table with existing unique artists
-- This handles duplicates by using DISTINCT
INSERT INTO artists (name, description)
SELECT DISTINCT 
  artist as name, 
  artist_pov as description
FROM art_pieces 
WHERE artist IS NOT NULL
ON CONFLICT (name) DO NOTHING; -- In case script is run multiple times

-- STEP 4: Add artist_id column to art_pieces (don't drop old columns yet)
ALTER TABLE art_pieces 
ADD COLUMN IF NOT EXISTS artist_id uuid REFERENCES artists(id) ON DELETE SET NULL;

-- STEP 5: Populate artist_id based on existing artist names
UPDATE art_pieces ap
SET artist_id = (
  SELECT a.id 
  FROM artists a 
  WHERE a.name = ap.artist
  LIMIT 1
)
WHERE ap.artist IS NOT NULL;

-- STEP 6: Create index for performance
CREATE INDEX IF NOT EXISTS idx_art_pieces_artist_id ON art_pieces(artist_id);
CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);

-- STEP 7: Set up RLS policies for artists table
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read artists" ON artists;
DROP POLICY IF EXISTS "Admins manage artists" ON artists;

-- Public can read all artists
CREATE POLICY "Public read artists" 
ON artists FOR SELECT 
TO public 
USING (true);

-- Admins can INSERT, UPDATE, DELETE artists
CREATE POLICY "Admins manage artists" 
ON artists FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.role = 'superadmin')
  )
);

-- STEP 8: Verification queries
SELECT 'Artists table created and populated!' as status;

SELECT 
  'Total unique artists:' as metric,
  COUNT(*) as count
FROM artists;

SELECT 
  'Art pieces with artist_id assigned:' as metric,
  COUNT(*) as count
FROM art_pieces
WHERE artist_id IS NOT NULL;

SELECT 
  'Art pieces without artist_id:' as metric,
  COUNT(*) as count
FROM art_pieces
WHERE artist_id IS NULL;

-- Display artists and their artwork count
SELECT 
  a.name,
  a.description,
  COUNT(ap.id) as artwork_count
FROM artists a
LEFT JOIN art_pieces ap ON ap.artist_id = a.id
GROUP BY a.id, a.name, a.description
ORDER BY artwork_count DESC, a.name;

-- =========================================================
-- OPTIONAL CLEANUP (Run after verifying everything works)
-- =========================================================
-- Uncomment these lines ONLY after verifying the migration
-- worked correctly and all art pieces have artist_id assigned.
-- 
-- ALTER TABLE art_pieces DROP COLUMN IF EXISTS artist;
-- ALTER TABLE art_pieces DROP COLUMN IF EXISTS artist_pov;
-- 
-- SELECT '⚠️ Old columns dropped! Migration complete.' as status;
-- =========================================================

SELECT '✅ Artist normalization complete! Old columns retained for safety.' as status;
