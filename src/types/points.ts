// Points System TypeScript Types
// Complete type definitions for admin-controlled points & loyalty system

// ============================================
// CONFIGURATION TYPES
// ============================================

export interface PointsConfig {
  id: number;
  system_enabled: boolean;
  earning_enabled: boolean;
  redemption_enabled: boolean;
  points_to_rupee_ratio: number;  // 10 points = ₹1
  max_discount_percent: number;
  min_payable_amount: number;
  order_confirmation_delay_minutes: number;
  max_points_per_order: number;
  daily_earning_limit: number;
  updated_by?: string;
  updated_at: string;
}

export interface UpdatePointsConfig {
  system_enabled?: boolean;
  earning_enabled?: boolean;
  redemption_enabled?: boolean;
  points_to_rupee_ratio?: number;
  max_discount_percent?: number;
  min_payable_amount?: number;
  order_confirmation_delay_minutes?: number;
  max_points_per_order?: number;
  daily_earning_limit?: number;
}

// ============================================
// EARNING RULES TYPES
// ============================================

export type ItemType = 'menu_item' | 'workshop' | 'art_piece' | 'global';

export interface PointsEarningRule {
  id: string;
  rule_name: string;
  item_type: ItemType;
  item_id: string | null;  // NULL for global rules
  points_awarded: number;
  earn_per_rupee: boolean;  // Award X points per ₹
  enabled: boolean;
  valid_from: string | null;
  valid_until: string | null;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEarningRule {
  rule_name: string;
  item_type: ItemType;
  item_id?: string | null;
  points_awarded: number;
  earn_per_rupee?: boolean;
  enabled?: boolean;
  valid_from?: string;
  valid_until?: string;
}

export interface UpdateEarningRule {
  rule_name?: string;
  points_awarded?: number;
  earn_per_rupee?: boolean;
  enabled?: boolean;
  valid_from?: string;
  valid_until?: string;
}

// ============================================
// REDEMPTION RULES TYPES
// ============================================

export interface PointsRedemptionRule {
  id: string;
  rule_name: string;
  item_type: ItemType;
  item_id: string | null;
  redemption_allowed: boolean;
  max_discount_amount: number | null;  // Max ₹ discount
  max_discount_percent: number | null;  // Max % of price
  enabled: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRedemptionRule {
  rule_name: string;
  item_type: ItemType;
  item_id?: string | null;
  redemption_allowed: boolean;
  max_discount_amount?: number | null;
  max_discount_percent?: number | null;
  enabled?: boolean;
}

export interface UpdateRedemptionRule {
  rule_name?: string;
  redemption_allowed?: boolean;
  max_discount_amount?: number | null;
  max_discount_percent?: number | null;
  enabled?: boolean;
}

// ============================================
// TRANSACTION TYPES
// ============================================

export type TransactionType = 'earned' | 'redeemed';
export type TransactionStatus = 'pending' | 'confirmed' | 'reversed' | 'locked';
export type TransactionSource = 
  | 'order' 
  | 'workshop' 
  | 'art_purchase' 
  | 'referral' 
  | 'bonus' 
  | 'redemption' 
  | 'admin_grant' 
  | 'admin_deduct' 
  | 'reversal';

export interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  transaction_type: TransactionType;
  source: TransactionSource;
  description: string;
  order_id?: string | null;
  workshop_id?: string | null;
  status: TransactionStatus;
  locked: boolean;
  admin_id?: string | null;
  reversal_reason?: string | null;
  reversed_transaction_id?: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface UserPoints {
  user_id: string;
  total_points: number;
  total_earned: number;
  total_redeemed: number;
  updated_at: string;
}

// ============================================
// ADMIN ACTION TYPES
// ============================================

export type AdminActionType =
  | 'config_change'
  | 'earning_rule_create'
  | 'earning_rule_update'
  | 'earning_rule_delete'
  | 'redemption_rule_create'
  | 'redemption_rule_update'
  | 'redemption_rule_delete'
  | 'manual_grant'
  | 'manual_deduct'
  | 'freeze_user'
  | 'unfreeze_user'
  | 'reverse_transaction';

export interface PointsAdminAction {
  id: string;
  admin_id: string;
  action_type: AdminActionType;
  target_user_id?: string | null;
  details: Record<string, any>;
  created_at: string;
}

// ============================================
// DISCOUNT CALCULATION TYPES
// ============================================

export interface CartItem {
  id: string;
  name: string;
  type: ItemType;
  price: number;
  quantity: number;
}

export interface DiscountCalculation {
  applicable_points: number;  // Points that can be used
  discount_amount: number;  // ₹ discount
  final_total: number;  // Order total after discount
  original_total: number;
  warnings: string[];  // Any caps or limitations
  items_breakdown: {
    item_id: string;
    item_name: string;
    points_used: number;
    discount: number;
    reason?: string;  // Why points weren't fully applied
  }[];
}

export interface ApplyPointsRequest {
  items: CartItem[];
  apply_points: boolean;  // Binary toggle
}

export interface ApplyPointsResponse {
  success: boolean;
  points_applied: number;
  discount: number;
  new_total: number;
  remaining_balance: number;
  message: string;
}

// ============================================
// USER-FACING TYPES
// ============================================

export interface UserPointsBalance {
  total_points: number;
  total_earned: number;
  total_redeemed: number;
  locked_points: number;  // Points in pending/locked transactions
  available_points: number;  // total - locked
  conversion_rate: number;  // Points to rupee ratio
  discount_value: number;  // ₹ value of available points
}

export interface PointsHistory {
  transactions: PointsTransaction[];
  total_count: number;
  has_more: boolean;
}

// ============================================
// ADMIN ANALYTICS TYPES
// ============================================

export interface PointsAnalytics {
  total_points_in_circulation: number;
  total_points_earned_alltime: number;
  total_points_redeemed_alltime: number;
  total_discount_given_rupees: number;  // ₹ given as discounts
  revenue_impact_percent: number;  // % of revenue lost to points
  active_users_with_points: number;
  average_points_per_user: number;
  redemption_rate: number;  // % of earned points redeemed
  top_earners: {
    user_id: string;
    email: string;
    full_name: string | null;
    total_earned: number;
  }[];
  top_redeemers: {
    user_id: string;
    email: string;
    full_name: string | null;
    total_redeemed: number;
    discount_value: number;
  }[];
  revenue_leaking_items: {
    item_id: string;
    item_name: string;
    item_type: ItemType;
    total_discount_given: number;
    redemption_count: number;
  }[];
  time_series: {
    date: string;
    points_earned: number;
    points_redeemed: number;
    discount_given: number;
  }[];
}

// ============================================
// MANUAL ADJUSTMENT TYPES
// ============================================

export interface ManualAdjustmentRequest {
  user_id: string;
  points: number;  // Positive for grant, negative for deduct
  reason: string;
  source: 'admin_grant' | 'admin_deduct';
}

export interface FreezeUserRequest {
  user_id: string;
  freeze: boolean;  // true = freeze, false = unfreeze
  reason: string;
}

// ============================================
// VALIDATION HELPERS
// ============================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SystemStatus {
  system_enabled: boolean;
  earning_enabled: boolean;
  redemption_enabled: boolean;
  message?: string;
}
