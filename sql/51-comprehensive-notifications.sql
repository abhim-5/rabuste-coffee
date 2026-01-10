-- =========================================================
-- SQL FILE 51: COMPREHENSIVE ADMIN NOTIFICATIONS
-- =========================================================
-- Creates tables for cafe reviews, franchise inquiries, and newsletter
-- Sets up RLS policies and admin permissions
-- Completes the unified notification system
-- =========================================================

-- ========================================
-- 1. CAFE REVIEWS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS cafe_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'featured')),
  admin_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for cafe_reviews
CREATE INDEX IF NOT EXISTS idx_cafe_reviews_user_id ON cafe_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_cafe_reviews_status ON cafe_reviews(status);
CREATE INDEX IF NOT EXISTS idx_cafe_reviews_created_at ON cafe_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cafe_reviews_rating ON cafe_reviews(rating DESC);

-- RLS for cafe_reviews
ALTER TABLE cafe_reviews ENABLE ROW LEVEL SECURITY;

-- Users can view their own reviews
DROP POLICY IF EXISTS "Users view own reviews" ON cafe_reviews;
CREATE POLICY "Users view own reviews"
ON cafe_reviews FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own reviews
DROP POLICY IF EXISTS "Users insert reviews" ON cafe_reviews;
CREATE POLICY "Users insert reviews"
ON cafe_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins can view all reviews
DROP POLICY IF EXISTS "Admins view all reviews" ON cafe_reviews;
CREATE POLICY "Admins view all reviews"
ON cafe_reviews FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- Admins can update reviews (approve/reject/feature/respond)
DROP POLICY IF EXISTS "Admins update reviews" ON cafe_reviews;
CREATE POLICY "Admins update reviews"
ON cafe_reviews FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- Admins can delete reviews
DROP POLICY IF EXISTS "Admins delete reviews" ON cafe_reviews;
CREATE POLICY "Admins delete reviews"
ON cafe_reviews FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- ========================================
-- 2. FRANCHISE INQUIRIES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS franchise_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'rejected', 'closed')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for franchise_inquiries
CREATE INDEX IF NOT EXISTS idx_franchise_inquiries_status ON franchise_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_franchise_inquiries_created_at ON franchise_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_franchise_inquiries_email ON franchise_inquiries(email);

-- RLS for franchise_inquiries
ALTER TABLE franchise_inquiries ENABLE ROW LEVEL SECURITY;

-- Only admins can view franchise inquiries
DROP POLICY IF EXISTS "Admins view all inquiries" ON franchise_inquiries;
CREATE POLICY "Admins view all inquiries"
ON franchise_inquiries FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- Anyone can insert (public form submission)
DROP POLICY IF EXISTS "Anyone insert inquiries" ON franchise_inquiries;
CREATE POLICY "Anyone insert inquiries"
ON franchise_inquiries FOR INSERT
WITH CHECK (true);

-- Admins can update inquiries
DROP POLICY IF EXISTS "Admins update inquiries" ON franchise_inquiries;
CREATE POLICY "Admins update inquiries"
ON franchise_inquiries FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- Admins can delete inquiries
DROP POLICY IF EXISTS "Admins delete inquiries" ON franchise_inquiries;
CREATE POLICY "Admins delete inquiries"
ON franchise_inquiries FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- ========================================
-- 3. NEWSLETTER SUBSCRIPTIONS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  unsubscribed_at timestamptz
);

-- Indexes for newsletter_subscriptions
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter_subscriptions(subscribed_at DESC);

-- RLS for newsletter_subscriptions
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Only admins can view subscriptions
DROP POLICY IF EXISTS "Admins view subscriptions" ON newsletter_subscriptions;
CREATE POLICY "Admins view subscriptions"
ON newsletter_subscriptions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- Anyone can insert (public form submission)
DROP POLICY IF EXISTS "Anyone subscribe" ON newsletter_subscriptions;
CREATE POLICY "Anyone subscribe"
ON newsletter_subscriptions FOR INSERT
WITH CHECK (true);

-- Admins can update subscriptions
DROP POLICY IF EXISTS "Admins update subscriptions" ON newsletter_subscriptions;
CREATE POLICY "Admins update subscriptions"
ON newsletter_subscriptions FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'staff')
  )
);

-- ========================================
-- 4. UPDATE TRIGGERS
-- ========================================

-- Trigger to update updated_at on cafe_reviews
CREATE OR REPLACE FUNCTION update_cafe_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_cafe_reviews_updated_at_trigger ON cafe_reviews;
CREATE TRIGGER update_cafe_reviews_updated_at_trigger
BEFORE UPDATE ON cafe_reviews
FOR EACH ROW
EXECUTE FUNCTION update_cafe_reviews_updated_at();

-- Trigger to update updated_at on franchise_inquiries
CREATE OR REPLACE FUNCTION update_franchise_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_franchise_inquiries_updated_at_trigger ON franchise_inquiries;
CREATE TRIGGER update_franchise_inquiries_updated_at_trigger
BEFORE UPDATE ON franchise_inquiries
FOR EACH ROW
EXECUTE FUNCTION update_franchise_inquiries_updated_at();

-- ========================================
-- VERIFICATION
-- ========================================

SELECT '✅ Comprehensive notifications system set up successfully!' as status;

-- Verify tables exist
SELECT 
  'cafe_reviews' as table_name, 
  COUNT(*) as row_count 
FROM cafe_reviews
UNION ALL
SELECT 
  'franchise_inquiries' as table_name, 
  COUNT(*) as row_count 
FROM franchise_inquiries
UNION ALL
SELECT 
  'newsletter_subscriptions' as table_name, 
  COUNT(*) as row_count 
FROM newsletter_subscriptions;
