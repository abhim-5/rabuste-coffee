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
  
  // Status
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
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
  error?: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}
