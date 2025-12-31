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
