-- =============================================
-- COUPON SYSTEM - Database Migration
-- Replaces the entire points loyalty system
-- =============================================

-- Step 1: Create new coupon tables
-- =============================================

-- Master coupon configuration (Cart & Menu coupons)
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('cart_value', 'menu_limited')),
  name TEXT NOT NULL,
  description TEXT,
  discount_amount NUMERIC NOT NULL CHECK (discount_amount > 0),
  
  -- Cart value specific
  min_cart_value NUMERIC,
  
  -- Menu limited specific
  applicable_categories TEXT[],
  applicable_items JSONB DEFAULT '[]',
  excluded_items JSONB DEFAULT '[]',
  
  -- Common
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  
  -- Constraints
  CHECK (
    (type = 'cart_value' AND min_cart_value IS NOT NULL) OR
    (type = 'menu_limited')
  )
);

-- User-specific next-order coupons
CREATE TABLE IF NOT EXISTS public.user_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  discount_amount NUMERIC NOT NULL CHECK (discount_amount > 0),
  min_order_value NUMERIC DEFAULT 0,
  earned_from_order_id UUID REFERENCES orders(id),
  is_used BOOLEAN DEFAULT false,
  used_on_order_id UUID REFERENCES orders(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  -- Only 1 active (unused) coupon per user
  CONSTRAINT unique_active_user_coupon UNIQUE NULLS NOT DISTINCT (user_id, is_used)
);

-- Coupon usage tracking
CREATE TABLE IF NOT EXISTS public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  coupon_id UUID REFERENCES coupons(id),
  user_coupon_id UUID REFERENCES user_coupons(id),
  discount_applied NUMERIC NOT NULL CHECK (discount_applied > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Exactly one type of coupon used
  CHECK (
    (coupon_id IS NOT NULL AND user_coupon_id IS NULL) OR
    (coupon_id IS NULL AND user_coupon_id IS NOT NULL)
  )
);

-- System configuration
CREATE TABLE IF NOT EXISTS public.coupon_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  system_enabled BOOLEAN DEFAULT true,
  min_payable_amount NUMERIC DEFAULT 50 CHECK (min_payable_amount > 0),
  
  -- Next-order coupon rules
  next_order_min_earn NUMERIC DEFAULT 200,
  next_order_discount NUMERIC DEFAULT 40,
  next_order_expiry_days INTEGER DEFAULT 30,
  
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- Insert default config
INSERT INTO public.coupon_config (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Step 2: Create indexes for performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_coupons_type_active ON public.coupons(type, is_active);
CREATE INDEX IF NOT EXISTS idx_user_coupons_user_id ON public.user_coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coupons_unused ON public.user_coupons(user_id, is_used) WHERE NOT is_used;
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order_id ON public.coupon_usage(order_id);

-- =============================================
-- Step 3: Add RLS policies
-- =============================================

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_config ENABLE ROW LEVEL SECURITY;

-- Coupons: Everyone can see active coupons
CREATE POLICY "Anyone can view active coupons"
  ON public.coupons
  FOR SELECT
  USING (is_active = true);

-- Coupons: Only admins can manage
CREATE POLICY "Admins can manage coupons"
  ON public.coupons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- User coupons: Users see their own
CREATE POLICY "Users can view their coupons"
  ON public.user_coupons
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- User coupons: System can create
CREATE POLICY "System can create user coupons"
  ON public.user_coupons
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- User coupons: Users can mark as used (via API)
CREATE POLICY "Users can update their coupons"
  ON public.user_coupons
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Coupon usage: Users see their own
CREATE POLICY "Users can view their usage"
  ON public.coupon_usage
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = coupon_usage.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Coupon usage: System can insert
CREATE POLICY "System can create usage records"
  ON public.coupon_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Config: Everyone can read
CREATE POLICY "Anyone can read config"
  ON public.coupon_config
  FOR SELECT
  USING (true);

-- Config: Only admins can update
CREATE POLICY "Admins can update config"
  ON public.coupon_config
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- =============================================
-- Step 4: Grant permissions
-- =============================================

GRANT SELECT ON public.coupons TO authenticated, anon;
GRANT ALL ON public.coupons TO authenticated;

GRANT SELECT, INSERT, UPDATE ON public.user_coupons TO authenticated;
GRANT SELECT ON public.user_coupons TO anon;

GRANT SELECT, INSERT ON public.coupon_usage TO authenticated;
GRANT SELECT ON public.coupon_usage TO anon;

GRANT SELECT ON public.coupon_config TO authenticated, anon;
GRANT UPDATE ON public.coupon_config TO authenticated;

-- =============================================
-- Step 5: Add comments
-- =============================================

COMMENT ON TABLE public.coupons IS 'Master coupon configuration for cart-value and menu-limited coupons';
COMMENT ON TABLE public.user_coupons IS 'User-specific next-order reward coupons (max 1 active per user)';
COMMENT ON TABLE public.coupon_usage IS 'Tracks which coupons were used on which orders';
COMMENT ON TABLE public.coupon_config IS 'System-wide coupon configuration';

-- =============================================
-- Step 6: Update orders table
-- =============================================

-- Add coupon fields to orders (replacing points fields)
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id),
  ADD COLUMN IF NOT EXISTS user_coupon_id UUID REFERENCES user_coupons(id),
  ADD COLUMN IF NOT EXISTS coupon_discount NUMERIC DEFAULT 0.00;

-- Add constraint: only one coupon type per order
ALTER TABLE public.orders
  ADD CONSTRAINT check_single_coupon CHECK (
    (coupon_id IS NULL AND user_coupon_id IS NULL) OR
    (coupon_id IS NOT NULL AND user_coupon_id IS NULL) OR
    (coupon_id IS NULL AND user_coupon_id IS NOT NULL)
  );

COMMENT ON COLUMN public.orders.coupon_id IS 'Cart or menu coupon applied';
COMMENT ON COLUMN public.orders.user_coupon_id IS 'User next-order coupon applied';
COMMENT ON COLUMN public.orders.coupon_discount IS 'Discount amount from coupon';

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Coupon system tables created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Run migration script to archive points data';
  RAISE NOTICE '2. Deploy backend API endpoints';
  RAISE NOTICE '3. Update frontend to use coupons';
END $$;
