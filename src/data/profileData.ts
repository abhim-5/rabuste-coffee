import { UserProfile, Order, Workshop, ArtPiece } from "@/types/menu";

// Mock User Profile
export const mockUserProfile: UserProfile = {
  id: "user-001",
  name: "Arjun Mehta",
  email: "arjun.mehta@example.com",
  phone: "+91 98765 43210",
  avatar: "/main-menu/menu1a.jpg", // Placeholder - will use coffee image
  memberSince: new Date(2024, 0, 15), // January 15, 2024
  points: 2847,
  totalOrders: 23,
  totalSpent: 8450,
};

// Mock Order History
export const mockOrders: Order[] = [
  {
    id: "ORD-2024-0023",
    date: new Date(2024, 11, 25), // Dec 25, 2024
    items: [
      {
        name: "Classic Robusta Espresso",
        image: "/main-menu/menu1a.jpg",
        quantity: 2,
        price: 80,
      },
      {
        name: "Butter Croissant",
        image: "/main-menu/menu1b.jpg",
        quantity: 1,
        price: 60,
      },
    ],
    total: 220,
    status: "delivered",
    pointsEarned: 220,
  },
  {
    id: "ORD-2024-0022",
    date: new Date(2024, 11, 20),
    items: [
      {
        name: "Caramel Macchiato",
        image: "/main-menu/menu2a.jpg",
        quantity: 1,
        price: 120,
      },
      {
        name: "Margherita Classic",
        image: "/main-menu/menu1a.jpg",
        quantity: 1,
        price: 250,
      },
    ],
    total: 370,
    status: "delivered",
    pointsEarned: 370,
  },
  {
    id: "ORD-2024-0021",
    date: new Date(2024, 11, 15),
    items: [
      {
        name: "Mocha Fusion",
        image: "/main-menu/menu2b.jpg",
        quantity: 1,
        price: 130,
      },
    ],
    total: 130,
    status: "delivered",
    pointsEarned: 130,
  },
  {
    id: "ORD-2024-0020",
    date: new Date(2024, 11, 10),
    items: [
      {
        name: "Pepperoni Supremo",
        image: "/main-menu/menu2a.jpg",
        quantity: 2,
        price: 280,
      },
      {
        name: "Fresh Orange Juice",
        image: "/main-menu/menu1a.jpg",
        quantity: 2,
        price: 80,
      },
    ],
    total: 720,
    status: "delivered",
    pointsEarned: 720,
  },
  {
    id: "ORD-2024-0019",
    date: new Date(2024, 11, 5),
    items: [
      {
        name: "Tiramisu",
        image: "/main-menu/menu3a.jpg",
        quantity: 1,
        price: 150,
      },
      {
        name: "Cappuccino Supreme",
        image: "/main-menu/menu3a.jpg",
        quantity: 2,
        price: 100,
      },
    ],
    total: 350,
    status: "delivered",
    pointsEarned: 350,
  },
];

// Mock Workshops
export const mockWorkshops: Workshop[] = [
  {
    id: "work-001",
    title: "Coffee Brewing Masterclass",
    host: "Rohan Sharma",
    date: new Date(2024, 10, 20), // Nov 20, 2024
    image: "/main-menu/menu1a.jpg",
    attended: true,
  },
  {
    id: "work-002",
    title: "Latte Art Workshop",
    host: "Priya Desai",
    date: new Date(2024, 9, 15), // Oct 15, 2024
    image: "/main-menu/menu2a.jpg",
    attended: true,
  },
  {
    id: "work-003",
    title: "Coffee Tasting Session",
    host: "Amit Kumar",
    date: new Date(2024, 8, 10), // Sep 10, 2024
    image: "/main-menu/menu3a.jpg",
    attended: true,
  },
];

// Mock Art Collection
export const mockArtCollection: ArtPiece[] = [
  {
    id: "art-001",
    title: "Morning Brew",
    artist: "Kavya Iyer",
    image: "/main-menu/menu1b.jpg",
    price: 3500,
    purchaseDate: new Date(2024, 10, 1),
  },
  {
    id: "art-002",
    title: "Coffee Dreams",
    artist: "Rahul Verma",
    image: "/main-menu/menu2b.jpg",
    price: 4200,
    purchaseDate: new Date(2024, 9, 15),
  },
  {
    id: "art-003",
    title: "Espresso Abstract",
    artist: "Neha Kapoor",
    image: "/main-menu/menu3b.jpg",
    price: 2800,
    purchaseDate: new Date(2024, 8, 20),
  },
];
