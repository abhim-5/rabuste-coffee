// TypeScript types for menu and cart functionality
// Designed to be backend-ready - interfaces match typical API responses

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For showing discounts
  image: string;
  category: MenuCategory;
  rating: number;
  reviewCount: number;
  isDealOfTheDay?: boolean;
  tags?: string[];
  variations?: ProductVariation[];
  frequentlyBoughtWith?: string[]; // Array of MenuItem IDs
  similarItems?: string[]; // Array of MenuItem IDs
}

export interface ProductVariation {
  id: string;
  name: string;
  options: {
    id: string;
    name: string;
    priceModifier?: number; // Additional cost
  }[];
}

export type MenuCategory = 
  | "coffee"
  | "pizza"
  | "pastries"
  | "sandwiches"
  | "beverages"
  | "desserts";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedVariations?: Record<string, string>; // variationId -> optionId
  subtotal: number;
}

export interface DealOfTheDay {
  id: string;
  menuItemId: string;
  discount: number; // percentage
  expiresAt: Date;
  title: string;
  description: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Profile & User Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  memberSince: Date;
  points: number;
  totalOrders: number;
  totalSpent: number;
}

export interface Order {
  id: string;
  date: Date;
  items: {
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  pointsEarned: number;
}

export type OrderStatus = "delivered" | "preparing" | "pending" | "cancelled";

export interface Workshop {
  id: string;
  title: string;
  host: string;
  date: Date;
  image: string;
  attended: boolean;
}

export interface ArtPiece {
  id: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  purchaseDate: Date;
}

