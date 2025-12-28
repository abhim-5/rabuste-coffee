import { MenuItem, DealOfTheDay, ProductVariation } from "@/types/menu";

// Product Variations
const coffeeVariations: ProductVariation[] = [
  {
    id: "size",
    name: "Size",
    options: [
      { id: "small", name: "Small (8oz)", priceModifier: 0 },
      { id: "medium", name: "Medium (12oz)", priceModifier: 20 },
      { id: "large", name: "Large (16oz)", priceModifier: 40 },
    ],
  },
  {
    id: "temperature",
    name: "Temperature",
    options: [
      { id: "hot", name: "Hot" },
      { id: "iced", name: "Iced", priceModifier: 10 },
    ],
  },
  {
    id: "milk",
    name: "Milk Type",
    options: [
      { id: "regular", name: "Regular Milk" },
      { id: "oat", name: "Oat Milk", priceModifier: 15 },
      { id: "almond", name: "Almond Milk", priceModifier: 15 },
      { id: "soy", name: "Soy Milk", priceModifier: 10 },
    ],
  },
];

// Menu Items
export const menuItems: MenuItem[] = [
  // COFFEE
  {
    id: "coffee-001",
    name: "Classic Robusta Espresso",
    description: "Our signature double-shot espresso crafted from premium Robusta beans. Bold, intense, and perfectly balanced with notes of dark chocolate and hazelnut.",
    price: 80,
    originalPrice: 100,
    image: "/main-menu/menu1a.jpg",
    category: "coffee",
    rating: 4.8,
    reviewCount: 234,
    isDealOfTheDay: true,
    tags: ["espresso", "bold", "signature"],
    variations: coffeeVariations,
    frequentlyBoughtWith: ["pastries-001", "coffee-002"],
    similarItems: ["coffee-003", "coffee-004"],
  },
  {
    id: "coffee-002",
    name: "Caramel Macchiato",
    description: "Velvety espresso layered with steamed milk and topped with rich caramel drizzle. A sweet indulgence for coffee lovers.",
    price: 120,
    originalPrice: 150,
    image: "/main-menu/menu2a.jpg",
    category: "coffee",
    rating: 4.9,
    reviewCount: 189,
    tags: ["sweet", "caramel", "popular"],
    variations: coffeeVariations,
    frequentlyBoughtWith: ["pastries-002", "desserts-001"],
    similarItems: ["coffee-005", "coffee-006"],
  },
  {
    id: "coffee-003",
    name: "Cappuccino Supreme",
    description: "Traditional Italian cappuccino with equal parts espresso, steamed milk, and velvety milk foam. Dusted with cocoa powder.",
    price: 100,
    image: "/main-menu/menu3a.jpg",
    category: "coffee",
    rating: 4.7,
    reviewCount: 156,
    tags: ["classic", "foam", "italian"],
    variations: coffeeVariations,
    frequentlyBoughtWith: ["pastries-003"],
    similarItems: ["coffee-001", "coffee-004"],
  },
  {
    id: "coffee-004",
    name: "Vanilla Latte Deluxe",
    description: "Smooth espresso combined with steamed milk and a touch of Madagascar vanilla. Topped with delicate latte art.",
    price: 110,
    image: "/main-menu/menu1b.jpg",
    category: "coffee",
    rating: 4.8,
    reviewCount: 203,
    tags: ["vanilla", "smooth", "art"],
    variations: coffeeVariations,
    frequentlyBoughtWith: ["pastries-001"],
    similarItems: ["coffee-002", "coffee-005"],
  },
  {
    id: "coffee-005",
    name: "Mocha Fusion",
    description: "Decadent blend of rich espresso, steamed milk, and Belgian chocolate. Topped with whipped cream and chocolate shavings.",
    price: 130,
    originalPrice: 160,
    image: "/main-menu/menu2b.jpg",
    category: "coffee",
    rating: 4.9,
    reviewCount: 278,
    isDealOfTheDay: false,
    tags: ["chocolate", "dessert", "indulgent"],
    variations: coffeeVariations,
    frequentlyBoughtWith: ["desserts-002"],
    similarItems: ["coffee-002", "coffee-006"],
  },
  {
    id: "coffee-006",
    name: "Cold Brew Special",
    description: "Slow-steeped for 16 hours, our cold brew is smooth, naturally sweet, and less acidic. Served over ice.",
    price: 95,
    image: "/main-menu/menu3b.jpg",
    category: "coffee",
    rating: 4.6,
    reviewCount: 142,
    tags: ["cold", "smooth", "refreshing"],
    variations: coffeeVariations.filter(v => v.id !== "temperature"),
    frequentlyBoughtWith: ["pastries-002"],
    similarItems: ["coffee-003"],
  },

  // PIZZA
  {
    id: "pizza-001",
    name: "Margherita Classic",
    description: "Traditional Italian pizza with fresh mozzarella, San Marzano tomatoes, and fragrant basil on our wood-fired crust.",
    price: 250,
    image: "/main-menu/menu1a.jpg",
    category: "pizza",
    rating: 4.7,
    reviewCount: 98,
    tags: ["vegetarian", "classic", "italian"],
    frequentlyBoughtWith: ["beverages-001", "coffee-001"],
    similarItems: ["pizza-002"],
  },
  {
    id: "pizza-002",
    name: "Pepperoni Supremo",
    description: "Loaded with premium pepperoni, mozzarella cheese, and our signature tomato sauce. A crowd favorite!",
    price: 280,
    originalPrice: 320,
    image: "/main-menu/menu2a.jpg",
    category: "pizza",
    rating: 4.9,
    reviewCount: 156,
    isDealOfTheDay: true,
    tags: ["pepperoni", "popular", "meat"],
    frequentlyBoughtWith: ["beverages-002"],
    similarItems: ["pizza-003"],
  },
  {
    id: "pizza-003",
    name: "Veggie Delight",
    description: "Colorful medley of bell peppers, mushrooms, olives, onions, and tomatoes on a bed of melted mozzarella.",
    price: 260,
    image: "/main-menu/menu3a.jpg",
    category: "pizza",
    rating: 4.6,
    reviewCount: 87,
    tags: ["vegetarian", "healthy", "colorful"],
    frequentlyBoughtWith: ["beverages-001"],
    similarItems: ["pizza-001"],
  },

  // PASTRIES
  {
    id: "pastries-001",
    name: "Butter Croissant",
    description: "Flaky, buttery croissant baked fresh every morning. Pairs perfectly with your favorite coffee.",
    price: 60,
    image: "/main-menu/menu1b.jpg",
    category: "pastries",
    rating: 4.8,
    reviewCount: 167,
    tags: ["breakfast", "fresh", "french"],
    frequentlyBoughtWith: ["coffee-001", "coffee-004"],
    similarItems: ["pastries-002", "pastries-003"],
  },
  {
    id: "pastries-002",
    name: "Chocolate Muffin",
    description: "Moist chocolate muffin loaded with chocolate chips. A chocolate lover's dream!",
    price: 70,
    image: "/main-menu/menu2b.jpg",
    category: "pastries",
    rating: 4.7,
    reviewCount: 134,
    tags: ["chocolate", "sweet", "breakfast"],
    frequentlyBoughtWith: ["coffee-002", "coffee-006"],
    similarItems: ["pastries-003", "desserts-001"],
  },
  {
    id: "pastries-003",
    name: "Blueberry Danish",
    description: "Delicate Danish pastry filled with sweet blueberry compote and topped with vanilla glaze.",
    price: 75,
    originalPrice: 90,
    image: "/main-menu/menu3b.jpg",
    category: "pastries",
    rating: 4.9,
    reviewCount: 201,
    tags: ["fruity", "glazed", "breakfast"],
    frequentlyBoughtWith: ["coffee-003"],
    similarItems: ["pastries-001"],
  },

  // BEVERAGES
  {
    id: "beverages-001",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice packed with Vitamin C. The perfect refreshing companion to your meal.",
    price: 80,
    image: "/main-menu/menu1a.jpg",
    category: "beverages",
    rating: 4.6,
    reviewCount: 92,
    tags: ["fresh", "healthy", "juice"],
    frequentlyBoughtWith: ["pizza-001", "pastries-001"],
    similarItems: ["beverages-002"],
  },
  {
    id: "beverages-002",
    name: "Iced Lemon Tea",
    description: "Refreshing iced tea infused with fresh lemon and a hint of mint. Perfectly chilled and revitalizing.",
    price: 70,
    image: "/main-menu/menu2a.jpg",
    category: "beverages",
    rating: 4.5,
    reviewCount: 78,
    tags: ["tea", "refreshing", "cold"],
    frequentlyBoughtWith: ["pizza-002", "sandwiches-001"],
    similarItems: ["beverages-001"],
  },

  // DESSERTS
  {
    id: "desserts-001",
    name: "Tiramisu",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream. Dusted with cocoa.",
    price: 150,
    image: "/main-menu/menu3a.jpg",
    category: "desserts",
    rating: 4.9,
    reviewCount: 145,
    tags: ["italian", "coffee", "creamy"],
    frequentlyBoughtWith: ["coffee-001", "coffee-003"],
    similarItems: ["desserts-002"],
  },
  {
    id: "desserts-002",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten chocolate center. Served with vanilla ice cream.",
    price: 140,
    image: "/main-menu/menu1b.jpg",
    category: "desserts",
    rating: 4.8,
    reviewCount: 189,
    tags: ["chocolate", "warm", "indulgent"],
    frequentlyBoughtWith: ["coffee-005"],
    similarItems: ["desserts-001"],
  },

  // SANDWICHES
  {
    id: "sandwiches-001",
    name: "Grilled Chicken Sandwich",
    description: "Tender grilled chicken with fresh lettuce, tomatoes, and our special sauce on artisan bread.",
    price: 180,
    image: "/main-menu/menu2b.jpg",
    category: "sandwiches",
    rating: 4.7,
    reviewCount: 112,
    tags: ["grilled", "protein", "lunch"],
    frequentlyBoughtWith: ["beverages-002", "coffee-006"],
    similarItems: ["sandwiches-002"],
  },
  {
    id: "sandwiches-002",
    name: "Veggie Club Sandwich",
    description: "Triple-decker sandwich loaded with fresh vegetables, cheese, and tangy mayo on toasted bread.",
    price: 160,
    image: "/main-menu/menu3a.jpg",
    category: "sandwiches",
    rating: 4.6,
    reviewCount: 95,
    tags: ["vegetarian", "fresh", "lunch"],
    frequentlyBoughtWith: ["beverages-001"],
    similarItems: ["sandwiches-001"],
  },
];

// Deal of the Day
export const dealsOfTheDay: DealOfTheDay[] = [
  {
    id: "deal-001",
    menuItemId: "coffee-001",
    discount: 20,
    expiresAt: new Date(new Date().setHours(23, 59, 59, 999)),
    title: "Classic Robusta Espresso",
    description: "20% off on our signature espresso!",
  },
  {
    id: "deal-002",
    menuItemId: "pizza-002",
    discount: 12.5,
    expiresAt: new Date(new Date().setHours(23, 59, 59, 999)),
    title: "Pepperoni Supremo",
    description: "Special discount on our best-selling pizza!",
  },
];

// Helper functions to get items by ID (prepares for API integration)
export const getMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find((item) => item.id === id);
};

export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  return menuItems.filter((item) => item.category === category);
};

export const getDealItems = (): MenuItem[] => {
  return menuItems.filter((item) => item.isDealOfTheDay);
};

export const getRecommendedItems = (): MenuItem[] => {
  // For now, return items with high ratings
  return menuItems.filter((item) => item.rating >= 4.8).slice(0, 6);
};
