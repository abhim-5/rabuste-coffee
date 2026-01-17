// Admin-specific TypeScript types

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: 'customer' | 'staff' | 'admin' | 'superadmin';
  avatar_url: string | null;
  created_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface DashboardStats {
  total_customers: number;
  new_users_7d: number;
  new_users_30d: number;
  total_orders: number;
  orders_today: number;
  revenue_today: number;
  revenue_week: number;
  revenue_month: number;
  revenue_total: number;
  total_workshop_registrations: number;
  total_art_purchases: number;
}

export interface RevenueData {
  date: string;
  amount: number;
  orders: number;
}

export interface RevenueAnalytics {
  total: number;
  growth: number; // percentage
  breakdown: RevenueData[];
  average_order_value: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  image_url: string | null;
  available: boolean;
  is_deal_of_day: boolean;
  rating_avg: number | null;
  rating_count: number;
  total_sales: number;
  created_at: string;
  updated_at: string;
}

export interface MenuAnalytics {
  top_sellers: MenuItem[];
  low_sellers: MenuItem[];
  most_reordered: MenuItem[];
  highest_rated: MenuItem[];
  lowest_rated: MenuItem[];
  category_breakdown: {
    category: string;
    total_sales: number;
    revenue: number;
  }[];
}

export interface CustomerAnalytics {
  user_id: string;
  email: string;
  full_name: string | null;
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  points_earned: number;
  points_redeemed: number;
  points_balance: number;
  last_order_date: string | null;
  is_returning: boolean;
  lifetime_value: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface WorkshopAnalytics {
  workshop_id: string;
  title: string;
  bookings: number;
  capacity: number;
  booking_rate: number; // percentage
  attendance: number;
  attendance_rate: number; // percentage
  revenue: number;
  average_rating: number | null;
  repeat_attendees: number;
}

export interface ArtAnalytics {
  artist: string;
  total_sales: number;
  total_revenue: number;
  avg_price: number;
  pieces_sold: number;
}

export interface OrderNotification {
  id: string;
  order_number: string;
  customer_name: string | null;
  customer_email: string;
  total: number;
  items_count: number;
  order_type: string;
  created_at: string;
}

export interface PeakHourData {
  hour: number;
  orders: number;
  revenue: number;
}

export interface DiscountImpact {
  total_discounts_given: number;
  orders_with_discount: number;
  avg_discount_amount: number;
  revenue_with_discount: number;
  revenue_without_discount: number;
}
