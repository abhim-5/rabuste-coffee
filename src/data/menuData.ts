import { MenuItem, MenuCategory, DealOfTheDay } from "@/types/menu";

// Menu Items
export const menuItems: MenuItem[] = [
  // Coffee
  {
    id: "coffee-1",
    name: "Classic Robusta Espresso",
    description: "Bold and strong espresso made from premium Robusta beans, perfect for a quick energy boost.",
    price: 80,
    originalPrice: 100,
    image: "/main-menu/menu1a.jpg",
    category: "coffee",
    rating: 4.8,
    reviewCount: 234,
    isDealOfTheDay: true,
    variations: [
      {
        id: "size",
        name: "Size",
        required: true,
        options: [
          { id: "small", name: "Small", priceModifier: 0 },
          { id: "medium", name: "Medium", priceModifier: 20 },
          { id: "large", name: "Large", priceModifier: 40 },
        ],
      },
      {
        id: "temperature",
        name: "Temperature",
        required: true,
        options: [
          { id: "hot", name: "Hot", priceModifier: 0 },
          { id: "iced", name: "Iced", priceModifier: 10 },
        ],
      },
    ],
    frequentlyBoughtWith: ["pastry-1", "dessert-1"],
  },
  {
    id: "coffee-2",
    name: "Caramel Macchiato",
    description: "Smooth espresso with steamed milk and caramel drizzle, a sweet indulgence.",
    price: 120,
    image: "/main-menu/menu2a.jpg",
    category: "coffee",
    rating: 4.9,
    reviewCount: 189,
    variations: [
      {
        id: "size",
        name: "Size",
        required: true,
        options: [
          { id: "small", name: "Small", priceModifier: 0 },
          { id: "medium", name: "Medium", priceModifier: 20 },
          { id: "large", name: "Large", priceModifier: 40 },
        ],
      },
      {
        id: "milk",
        name: "Milk Type",
        required: false,
        options: [
          { id: "regular", name: "Regular", priceModifier: 0 },
          { id: "oat", name: "Oat", priceModifier: 15 },
          { id: "almond", name: "Almond", priceModifier: 15 },
        ],
      },
    ],
  },
  {
    id: "coffee-3",
    name: "Cappuccino Supreme",
    description: "Perfect blend of espresso and frothed milk with a dusting of cocoa.",
    price: 100,
    image: "/main-menu/menu3a.jpg",
    category: "coffee",
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: "coffee-4",
    name: "Mocha Fusion",
    description: "Rich chocolate mixed with espresso and steamed milk, topped with whipped cream.",
    price: 130,
    image: "/main-menu/menu2b.jpg",
    category: "coffee",
    rating: 4.8,
    reviewCount: 198,
    isDealOfTheDay: true,
  },
  {
    id: "coffee-5",
    name: "Vanilla Latte",
    description: "Creamy latte with a hint of vanilla sweetness.",
    price: 110,
    image: "/main-menu/menu1b.jpg",
    category: "coffee",
    rating: 4.6,
    reviewCount: 145,
  },
  {
    id: "coffee-6",
    name: "Cold Brew Special",
    description: "Smooth cold brew steeped for 18 hours, served over ice.",
    price: 140,
    originalPrice: 160,
    image: "/main-menu/menu3b.jpg",
    category: "coffee",
    rating: 4.9,
    reviewCount: 223,
  },

  // Pizza
  {
    id: "pizza-1",
    name: "Margherita Classic",
    description: "Traditional pizza with fresh mozzarella, tomato sauce, and basil.",
    price: 250,
    image: "/main-menu/menu1a.jpg",
    category: "pizza",
    rating: 4.7,
    reviewCount: 167,
  },
  {
    id: "pizza-2",
    name: "Pepperoni Supremo",
    description: "Loaded with pepperoni, cheese, and Italian herbs.",
    price: 280,
    image: "/main-menu/menu2a.jpg",
    category: "pizza",
    rating: 4.8,
    reviewCount: 201,
  },
  {
    id: "pizza-3",
    name: "Veggie Delight",
    description: "Fresh vegetables with mozzarella and homemade tomato sauce.",
    price: 260,
    image: "/main-menu/menu3a.jpg",
    category: "pizza",
    rating: 4.6,
    reviewCount: 134,
  },

  // Pastries
  {
    id: "pastry-1",
    name: "Butter Croissant",
    description: "Flaky, buttery croissant baked fresh daily.",
    price: 60,
    image: "/main-menu/menu1b.jpg",
    category: "pastries",
    rating: 4.9,
    reviewCount: 289,
  },
  {
    id: "pastry-2",
    name: "Chocolate Danish",
    description: "Rich chocolate filling wrapped in flaky pastry.",
    price: 70,
    image: "/main-menu/menu2b.jpg",
    category: "pastries",
    rating: 4.8,
    reviewCount: 176,
  },
  {
    id: "pastry-3",
    name: "Almond Croissant",
    description: "Croissant filled with almond cream and topped with sliced almonds.",
    price: 75,
    image: "/main-menu/menu3b.jpg",
    category: "pastries",
    rating: 4.7,
    reviewCount: 145,
  },

  // Sandwiches
  {
    id: "sandwich-1",
    name: "Club Sandwich",
    description: "Triple-decker with chicken, bacon, lettuce, and tomato.",
    price: 180,
    image: "/main-menu/menu1a.jpg",
    category: "sandwiches",
    rating: 4.6,
    reviewCount: 112,
  },
  {
    id: "sandwich-2",
    name: "Veggie Panini",
    description: "Grilled vegetables with pesto and mozzarella.",
    price: 150,
    image: "/main-menu/menu2a.jpg",
    category: "sandwiches",
    rating: 4.5,
    reviewCount: 98,
  },

  // Beverages
  {
    id: "beverage-1",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice, no added sugar.",
    price: 80,
    image: "/main-menu/menu1a.jpg",
    category: "beverages",
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: "beverage-2",
    name: "Iced Tea",
    description: "Refreshing iced tea with lemon and mint.",
    price: 60,
    image: "/main-menu/menu2a.jpg",
    category: "beverages",
    rating: 4.5,
    reviewCount: 123,
  },

  // Desserts
  {
    id: "dessert-1",
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.",
    price: 150,
    image: "/main-menu/menu3a.jpg",
    category: "desserts",
    rating: 4.9,
    reviewCount: 245,
  },
  {
    id: "dessert-2",
    name: "Chocolate Brownie",
    description: "Rich, fudgy brownie served warm with vanilla ice cream.",
    price: 120,
    image: "/main-menu/menu3b.jpg",
    category: "desserts",
    rating: 4.8,
    reviewCount: 187,
  },
];

// Deal of the Day
export const dealsOfTheDay: DealOfTheDay[] = [
  {
    id: "deal-1",
    title: "Espresso",
    itemId: "coffee-1",
    discount: 20,
  },
  {
    id: "deal-2",
    title: "Mocha Fusion",
    itemId: "coffee-4",
    discount: 15,
  },
];

// Helper Functions
export const getMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find((item) => item.id === id);
};

export const getMenuItemsByCategory = (category: MenuCategory): MenuItem[] => {
  return menuItems.filter((item) => item.category === category);
};

export const getDealItems = (): MenuItem[] => {
  return menuItems.filter((item) => item.isDealOfTheDay);
};

export const getRecommendedItems = (): MenuItem[] => {
  return menuItems.filter((item) => item.rating >= 4.8).slice(0, 6);
};
