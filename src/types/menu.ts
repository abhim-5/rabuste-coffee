export type MenuCategory = 
  | "coffee" 
  | "pizza" 
  | "pastries" 
  | "sandwiches" 
  | "beverages" 
  | "desserts";

export interface VariationOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface Variation {
  id: string;
  name: string;
  required: boolean;
  options: VariationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: MenuCategory;
  rating: number;
  reviewCount: number;
  isDealOfTheDay?: boolean;
  variations?: Variation[];
  frequentlyBoughtWith?: string[];
  similarItems?: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  subtotal: number;
  selectedVariations?: Record<string, string>;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface DealOfTheDay {
  id: string;
  title: string;
  itemId: string;
  discount: number;
}

export interface ArtPiece {
  id: string;
  title: string;
  price: number;
  artist: string;
  purchaseDate: Date;
  image: string;
}

export interface Workshop {
  id: string;
  title: string;
  image: string;
  host: string;
  date: Date;
  attended: boolean;
}

export interface OrderItem {
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: Date;
  status: "delivered" | "preparing" | "pending" | "cancelled";
  pointsEarned: number;
  total: number;
  items: OrderItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  memberSince: Date;
  totalOrders: number;
  totalSpent: number;
  points: number;
}
