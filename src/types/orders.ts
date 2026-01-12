export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  
  // Order details
  order_type: 'dine-in' | 'takeaway-now' | 'takeaway-scheduled';
  scheduled_time?: string;
  
  // Totals
  subtotal: number;
  tax: number;
  total: number;
  
  // Status (Simplified to 4 states)
  status: 'pending' | 'confirmed' | 'ready' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed';
  
  // Customer info
  customer_name?: string;
  customer_email?: string;
  
  // Notes
  notes?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  
  // Menu item details
  menu_item_id: string | number;
  menu_item_name: string;
  menu_item_image?: string;
  
  // Variation
  variation_name?: string;
  
  // Pricing
  unit_price: number;
  quantity: number;
  subtotal: number;
  
  created_at: string;
}

export interface CreateOrderRequest {
  orderType: 'dine-in' | 'takeaway-now' | 'takeaway-scheduled';
  scheduledTime?: string;
  items: Array<{
    menuItemId: string | number;
    menuItemName: string;
    menuItemImage: string;
    variationName?: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderNumber?: string;
  orderId?: string;
  pointsEarned?: number;  // Points earned from this order
  error?: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// Product Rating System
export interface ProductRating {
  id: string;
  user_id: string;
  order_id: string;
  order_item_id: string;
  menu_item_id: string;
  menu_item_name: string;
  rating: number; // 1-5 stars
  review_text?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRatingRequest {
  order_id: string;
  ratings: Array<{
    order_item_id: string;
    menu_item_id: string;
    menu_item_name: string;
    rating: number;
    review_text?: string;
  }>;
}

export interface CreateRatingResponse {
  success: boolean;
  message?: string;
  error?: string;
}
