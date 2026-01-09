-- Art Gallery Schema
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist (to avoid conflicts)
DROP TABLE IF EXISTS art_purchases CASCADE;
DROP TABLE IF EXISTS art_pieces CASCADE;

-- Step 1: Create art_pieces table
CREATE TABLE IF NOT EXISTS art_pieces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL, -- Corresponds to 'about' in frontend
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  artist text NOT NULL,
  artist_pov text,
  image_url text NOT NULL,
  available boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 2: Create art_purchases table
CREATE TABLE IF NOT EXISTS art_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  art_piece_id uuid REFERENCES art_pieces(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  purchase_price numeric(10,2) NOT NULL,
  purchase_date timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  UNIQUE(art_piece_id, user_id) -- Prevent double purchase of same item by same user (though availability should handle this)
);

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_art_pieces_available ON art_pieces(available) WHERE available = true;
CREATE INDEX IF NOT EXISTS idx_art_pieces_artist ON art_pieces(artist);
CREATE INDEX IF NOT EXISTS idx_art_purchases_user ON art_purchases(user_id);

-- Step 4: Create updated_at trigger for art_pieces
CREATE OR REPLACE FUNCTION update_art_pieces_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS art_pieces_updated_at ON art_pieces;
CREATE TRIGGER art_pieces_updated_at
  BEFORE UPDATE ON art_pieces
  FOR EACH ROW
  EXECUTE FUNCTION update_art_pieces_updated_at();

-- Step 5: RLS Policies

-- Enable RLS
ALTER TABLE art_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE art_purchases ENABLE ROW LEVEL SECURITY;

-- Public can view available art pieces
DROP POLICY IF EXISTS "public_view_available_art" ON art_pieces;
CREATE POLICY "public_view_available_art"
  ON art_pieces FOR SELECT
  USING (available = true);

-- Users can view their own purchases
DROP POLICY IF EXISTS "users_view_own_purchases" ON art_purchases;
CREATE POLICY "users_view_own_purchases"
  ON art_purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Admin policies (Future proofing)
DROP POLICY IF EXISTS "admin_manage_art" ON art_pieces;
CREATE POLICY "admin_manage_art"
  ON art_pieces FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "admin_view_all_purchases" ON art_purchases;
CREATE POLICY "admin_view_all_purchases"
  ON art_purchases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

SELECT 'Art Gallery schema created successfully! ✅' as status;
