// Coupon System Types

export interface Coupon {
  id: string;
  type: 'cart_value' | 'menu_limited';
  name: string;
  description: string | null;
  discount_amount: number;
  min_cart_value?: number;
  applicable_categories?: string[];
  applicable_items?: string[];
  excluded_items?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCoupon {
  id: string;
  user_id: string;
  discount_amount: number;
  min_order_value: number;
  earned_from_order_id?: string;
  is_used: boolean;
  used_on_order_id?: string;
  earned_at: string;
  expires_at: string;
}

export interface CouponUsage {
  id: string;
  order_id: string;
  coupon_id?: string;
  user_coupon_id?: string;
  discount_applied: number;
  created_at: string;
}

export interface CouponConfig {
  id: number;
  system_enabled: boolean;
  min_payable_amount: number;
  next_order_min_earn: number;
  next_order_discount: number;
  next_order_expiry_days: number;
  updated_at: string;
  updated_by?: string;
}

// API Response Types

export interface AvailableCouponsResponse {
  success: boolean;
  cart_coupons: {
    id: string;
    type: 'cart_value';
    name: string;
    description: string | null;
    discount: number;
    min_cart: number;
    can_apply: boolean;
    progress: number;
    message: string;
  }[];
  menu_coupons: {
    id: string;
    type: 'menu_limited';
    name: string;
    description: string | null;
    discount: number;
    applicable_to: string[];
    can_apply: boolean;
    message: string;
  }[];
  my_coupon: {
    id: string;
    type: 'next_order';
    discount: number;
    min_order: number;
    can_apply: boolean;
    expires_at: string;
    message: string;
  } | null;
  config: {
    min_payable: number;
    next_order_discount?: number;
    next_order_min_earn?: number;
    next_order_expiry_days?: number;
  };
}

export interface ApplyCouponResponse {
  success: boolean;
  discount_applied?: number;
  new_total?: number;
  original_total?: number;
  coupon_data?: {
    coupon_id?: string;
    user_coupon_id?: string;
  };
  message?: string;
  error?: string;
}

export interface MyCouponsResponse {
  success: boolean;
  active_coupon: {
    id: string;
    discount: number;
    min_order: number;
    earned_on: string;
    expires_on: string;
    days_left: number;
  } | null;
  history: {
    discount: number;
    used_on: string;
    order_number: string;
    earned_on: string;
  }[];
}
