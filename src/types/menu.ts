export type MenuCategory = 
  | "rabuste-special"
  | "robusta-cold"
  | "robusta-hot"
  | "blend-cold"
  | "blend-hot"
  | "manual-brew"
  | "shakes-tea"
  | "food"
  | "Art Gallery";

// Variation structure with optional custom content
export interface Variation {
  name: string;         // e.g., "Tonic", "Red Bull"
  price: number;        // Full price for this variation
  image?: string;       // Optional custom image (falls back to main item image)
  description?: string; // Optional custom description (falls back to main item description)
}

export interface MenuItem {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: MenuCategory;
  rating: number;
  reviewCount: number;
  isDealOfTheDay?: boolean;
  dealExpiry?: string;
  variations?: Variation[];  // Updated to use new structure
  available?: boolean;
  frequentlyBoughtWith?: string[];
  similarItems?: string[];
  is_rabuste_special?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  subtotal: number;
  selectedVariation?: Variation;  // Full variation object instead of Record
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
  status?: string; // pending, confirmed, cancelled, attended
  price?: number; // Workshop price
  hasReviewed?: boolean;
  reviewId?: string;
  reviewRating?: number;
  reviewText?: string;
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
  status: "completed" | "delivered" | "ready" | "confirmed" | "preparing" | "pending" | "cancelled";
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
