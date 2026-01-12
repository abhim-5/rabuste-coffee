-- RABUSTE COFFEE - POINTS SYSTEM ENHANCEMENT
-- Production-Grade Admin-Controlled Points & Loyalty System
-- Run this AFTER existing schema is in place

-- ============================================
-- 1. GLOBAL CONFIGURATION TABLE
-- ============================================
-- Central control panel for entire points system

CREATE TABLE IF NOT EXISTS points_config (
    id int PRIMARY KEY DEFAULT 1,
    
    -- System Controls
    system_enabled boolean DEFAULT true,
    earning_enabled boolean DEFAULT true,
    redemption_enabled boolean DEFAULT true,
    
    -- Conversion & Caps
    points_to_rupee_ratio int DEFAULT 10,  -- 10 points = ₹1
    max_discount_percent int DEFAULT 50,   -- Max 50% of order total
    min_payable_amount numeric(10,2) DEFAULT 10.00,  -- Min ₹10 must be paid
    
    -- Safety & Abuse Prevention
    order_confirmation_delay_minutes int DEFAULT 15,  -- Award points after 15min
    max_points_per_order int DEFAULT 1000,  -- Prevent single huge transactions
    daily_earning_limit int DEFAULT 500,  -- Max points per user per day
    
    -- Audit
    updated_by uuid REFERENCES profiles(id),
    updated_at timestamptz DEFAULT now(),
    
    -- Ensure only one config row exists
    CONSTRAINT single_config_row CHECK (id = 1)
);

-- Insert default configuration
INSERT INTO points_config (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. EARNING RULES TABLE
-- ============================================
-- Define which items/actions earn points and how much

CREATE TABLE IF NOT EXISTS points_earning_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Rule Scope
    rule_name text NOT NULL,
    item_type text NOT NULL CHECK (item_type IN ('menu_item', 'workshop', 'art_piece', 'global')),
    item_id uuid,  -- NULL for global rules, specific ID for item rules
    
    -- Earning Logic
    points_awarded int NOT NULL CHECK (points_awarded >= 0),
    earn_per_rupee boolean DEFAULT false,  -- If true, award X points per ₹ spent
    
    -- Status & Validity
    enabled boolean DEFAULT true,
    valid_from timestamptz DEFAULT now(),
    valid_until timestamptz,  -- NULL = no expiration
    
    -- Audit
    created_by uuid REFERENCES profiles(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Prevent duplicate rules for same item
    CONSTRAINT unique_earning_rule UNIQUE (item_type, item_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_earning_rules_item_type ON points_earning_rules(item_type);
CREATE INDEX IF NOT EXISTS idx_earning_rules_enabled ON points_earning_rules(enabled);
CREATE INDEX IF NOT EXISTS idx_earning_rules_item_id ON points_earning_rules(item_id);

-- ============================================
-- 3. REDEMPTION RULES TABLE
-- ============================================
-- Define which items accept points and caps

CREATE TABLE IF NOT EXISTS points_redemption_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Rule Scope
    rule_name text NOT NULL,
    item_type text NOT NULL CHECK (item_type IN ('menu_item', 'workshop', 'art_piece', 'global')),
    item_id uuid,  -- NULL for global rules
    
    -- Redemption Logic
    redemption_allowed boolean DEFAULT false,
    max_discount_amount numeric(10,2),  -- Max ₹ discount for this specific item (NULL = no limit)
    max_discount_percent int CHECK (max_discount_percent >= 0 AND max_discount_percent <= 100),  -- Max % of item price
    
    -- Status
    enabled boolean DEFAULT true,
    
    -- Audit
    created_by uuid REFERENCES profiles(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Prevent duplicate rules
    CONSTRAINT unique_redemption_rule UNIQUE (item_type, item_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_redemption_rules_item_type ON points_redemption_rules(item_type);
CREATE INDEX IF NOT EXISTS idx_redemption_rules_enabled ON points_redemption_rules(enabled);
CREATE INDEX IF NOT EXISTS idx_redemption_rules_item_id ON points_redemption_rules(item_id);

-- ============================================
-- 4. ENHANCE EXISTING POINTS_TRANSACTIONS TABLE
-- ============================================

-- Add new columns to existing points_transactions table
ALTER TABLE points_transactions 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'reversed', 'locked')),
ADD COLUMN IF NOT EXISTS locked boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_id uuid REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS reversal_reason text,
ADD COLUMN IF NOT EXISTS reversed_transaction_id uuid REFERENCES points_transactions(id),
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Expand source CHECK constraint to include new sources
ALTER TABLE points_transactions DROP CONSTRAINT IF EXISTS points_transactions_source_check;
ALTER TABLE points_transactions 
ADD CONSTRAINT points_transactions_source_check 
CHECK (source IN ('order', 'workshop', 'art_purchase', 'referral', 'bonus', 'redemption', 'admin_grant', 'admin_deduct', 'reversal'));

-- Update transaction_type to be more specific
ALTER TABLE points_transactions 
RENAME COLUMN type TO transaction_type;

-- Create additional indexes
CREATE INDEX IF NOT EXISTS idx_points_transactions_status ON points_transactions(status);
CREATE INDEX IF NOT EXISTS idx_points_transactions_locked ON points_transactions(locked);
CREATE INDEX IF NOT EXISTS idx_points_transactions_admin_id ON points_transactions(admin_id);

-- ============================================
-- 5. ENHANCE ORDERS TABLE
-- ============================================

-- Add points-related columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS points_applied int DEFAULT 0,
ADD COLUMN IF NOT EXISTS points_discount numeric(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS original_total numeric(10,2);

-- Update existing orders to set original_total = total where not set
UPDATE orders SET original_total = total WHERE original_total IS NULL;

-- ============================================
-- 6. ADMIN ACTIONS AUDIT LOG
-- ============================================

CREATE TABLE IF NOT EXISTS points_admin_actions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id uuid REFERENCES profiles(id) NOT NULL,
    action_type text NOT NULL CHECK (action_type IN (
        'config_change',
        'earning_rule_create',
        'earning_rule_update',
        'earning_rule_delete',
        'redemption_rule_create',
        'redemption_rule_update',
        'redemption_rule_delete',
        'manual_grant',
        'manual_deduct',
        'freeze_user',
        'unfreeze_user',
        'reverse_transaction'
    )),
    target_user_id uuid REFERENCES profiles(id),
    details jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_points_admin_actions_admin ON points_admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_points_admin_actions_type ON points_admin_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_points_admin_actions_created ON points_admin_actions(created_at);

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to get current points config
CREATE OR REPLACE FUNCTION get_points_config()
RETURNS TABLE (
    system_enabled boolean,
    earning_enabled boolean,
    redemption_enabled boolean,
    points_to_rupee_ratio int,
    max_discount_percent int,
    min_payable_amount numeric
) AS $$
BEGIN
    RETURN QUERY SELECT 
        pc.system_enabled,
        pc.earning_enabled,
        pc.redemption_enabled,
        pc.points_to_rupee_ratio,
        pc.max_discount_percent,
        pc.min_payable_amount
    FROM points_config pc WHERE pc.id = 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate discount from points
CREATE OR REPLACE FUNCTION calculate_points_discount(
    p_points int,
    p_config_id int DEFAULT 1
)
RETURNS numeric AS $$
DECLARE
    v_ratio int;
    v_discount numeric;
BEGIN
    SELECT points_to_rupee_ratio INTO v_ratio 
    FROM points_config WHERE id = p_config_id;
    
    v_discount := (p_points::numeric / v_ratio);
    RETURN ROUND(v_discount, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can earn points today
CREATE OR REPLACE FUNCTION can_user_earn_points_today(
    p_user_id uuid
)
RETURNS boolean AS $$
DECLARE
    v_daily_limit int;
    v_earned_today int;
BEGIN
    -- Get daily limit from config
    SELECT daily_earning_limit INTO v_daily_limit
    FROM points_config WHERE id = 1;
    
    -- Get points earned today
    SELECT COALESCE(SUM(points), 0) INTO v_earned_today
    FROM points_transactions
    WHERE user_id = p_user_id
    AND transaction_type = 'earned'
    AND status = 'confirmed'
    AND DATE(created_at) = CURRENT_DATE;
    
    RETURN (v_earned_today < v_daily_limit);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get earning rule for item
CREATE OR REPLACE FUNCTION get_earning_rule(
    p_item_type text,
    p_item_id uuid
)
RETURNS TABLE (
    points_awarded int,
    earn_per_rupee boolean
) AS $$
BEGIN
    -- First try to find item-specific rule
    RETURN QUERY 
    SELECT per.points_awarded, per.earn_per_rupee
    FROM points_earning_rules per
    WHERE per.item_type = p_item_type
    AND per.item_id = p_item_id
    AND per.enabled = true
    AND (per.valid_from IS NULL OR per.valid_from <= NOW())
    AND (per.valid_until IS NULL OR per.valid_until >= NOW())
    LIMIT 1;
    
    -- If no specific rule, try global rule
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT per.points_awarded, per.earn_per_rupee
        FROM points_earning_rules per
        WHERE per.item_type = p_item_type
        AND per.item_id IS NULL
        AND per.enabled = true
        AND (per.valid_from IS NULL OR per.valid_from <= NOW())
        AND (per.valid_until IS NULL OR per.valid_until >= NOW())
        LIMIT 1;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get redemption rule for item
CREATE OR REPLACE FUNCTION get_redemption_rule(
    p_item_type text,
    p_item_id uuid
)
RETURNS TABLE (
    redemption_allowed boolean,
    max_discount_amount numeric,
    max_discount_percent int
) AS $$
BEGIN
    -- First try item-specific rule
    RETURN QUERY
    SELECT prr.redemption_allowed, prr.max_discount_amount, prr.max_discount_percent
    FROM points_redemption_rules prr
    WHERE prr.item_type = p_item_type
    AND prr.item_id = p_item_id
    AND prr.enabled = true
    LIMIT 1;
    
    -- If no specific rule, try global
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT prr.redemption_allowed, prr.max_discount_amount, prr.max_discount_percent
        FROM points_redemption_rules prr
        WHERE prr.item_type = p_item_type
        AND prr.item_id IS NULL
        AND prr.enabled = true
        LIMIT 1;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE TRIGGER update_points_config_updated_at 
BEFORE UPDATE ON points_config
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_earning_rules_updated_at
BEFORE UPDATE ON points_earning_rules
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_redemption_rules_updated_at
BEFORE UPDATE ON points_redemption_rules
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. DEFAULT RULES (OPTIONAL - FOR DEMO)
-- ============================================

-- Global earning rule: 1 point per ₹10 spent
INSERT INTO points_earning_rules (
    rule_name,
    item_type,
    item_id,
    points_awarded,
    earn_per_rupee,
    enabled
) VALUES (
    'Global Earning Rule',
    'global',
    NULL,
    1,
    true,  -- 1 point per rupee
    false  -- Disabled by default - admin must enable
) ON CONFLICT (item_type, item_id) DO NOTHING;

-- Global redemption rule: Allow points on all items
INSERT INTO points_redemption_rules (
    rule_name,
    item_type,
    item_id,
    redemption_allowed,
    max_discount_amount,
    max_discount_percent,
    enabled
) VALUES (
    'Global Redemption Rule',
    'global',
    NULL,
    true,
    NULL,  -- No item-specific cap
    50,    -- Max 50% of item price
    false  -- Disabled by default - admin must configure
) ON CONFLICT (item_type, item_id) DO NOTHING;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- The points system is now ready for admin configuration
-- Next steps:
-- 1. Admin must configure points_config settings
-- 2. Admin must create/enable earning rules
-- 3. Admin must create/enable redemption rules
-- 4. System will be functional once enabled
