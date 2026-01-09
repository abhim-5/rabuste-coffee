-- Additional tables for Art Gallery and Points System
-- Run this AFTER 00-create-tables.sql

-- 7. ART PIECES TABLE
CREATE TABLE IF NOT EXISTS art_pieces (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  artist_name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text,
  dimensions text DEFAULT '',
  medium text DEFAULT '',
  year_created integer,
  available boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 8. ART PURCHASES TABLE
CREATE TABLE IF NOT EXISTS art_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  art_piece_id uuid REFERENCES art_pieces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  purchased_at timestamp with time zone DEFAULT now(),
  purchase_price numeric(10,2) NOT NULL,
  UNIQUE(art_piece_id, user_id)
);

-- 9. POINTS TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS points_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points integer NOT NULL,
  type text NOT NULL CHECK (type IN ('earned', 'redeemed')),
  source text NOT NULL CHECK (source IN ('order', 'workshop', 'referral', 'bonus', 'redemption')),
  description text DEFAULT '',
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  workshop_id uuid REFERENCES workshops(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 10. USER POINTS SUMMARY (for quick lookups)
CREATE TABLE IF NOT EXISTS user_points (
  user_id uuid REFERENCES auth.users(id) PRIMARY KEY,
  total_points integer DEFAULT 0,
  total_earned integer DEFAULT 0,
  total_redeemed integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_art_pieces_available ON art_pieces(available);
CREATE INDEX IF NOT EXISTS idx_art_pieces_artist ON art_pieces(artist_name);
CREATE INDEX IF NOT EXISTS idx_art_purchases_user_id ON art_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_art_purchases_art_piece_id ON art_purchases(art_piece_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_type ON points_transactions(type);
CREATE INDEX IF NOT EXISTS idx_points_transactions_source ON points_transactions(source);
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_art_pieces_updated_at BEFORE UPDATE ON art_pieces 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON user_points 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user points summary
CREATE OR REPLACE FUNCTION update_user_points_summary()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_points (user_id, total_points, total_earned, total_redeemed)
  VALUES (
    NEW.user_id,
    CASE WHEN NEW.type = 'earned' THEN NEW.points ELSE -NEW.points END,
    CASE WHEN NEW.type = 'earned' THEN NEW.points ELSE 0 END,
    CASE WHEN NEW.type = 'redeemed' THEN NEW.points ELSE 0 END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = user_points.total_points + CASE WHEN NEW.type = 'earned' THEN NEW.points ELSE -NEW.points END,
    total_earned = user_points.total_earned + CASE WHEN NEW.type = 'earned' THEN NEW.points ELSE 0 END,
    total_redeemed = user_points.total_redeemed + CASE WHEN NEW.type = 'redeemed' THEN NEW.points ELSE 0 END,
    updated_at = CURRENT_TIMESTAMP;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update user points summary
CREATE TRIGGER update_points_summary_trigger
  AFTER INSERT ON points_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points_summary();
