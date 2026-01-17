# ☕ Rabuste Coffee - Premium Cafe & Cultural Hub

A modern, production-ready Next.js website for Rabuste brand cafe featuring coffee ordering, art gallery, workshops, franchise opportunities, and user authentication.

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)

---

## 📁 Project Structure

```
rabuste-coffee/
├── public/
│   ├── about us/           # About page images
│   ├── carousel-Why Robusta/  # Carousel images
│   ├── home-art/           # Homepage art assets
│   ├── liquid distortion assets/  # Distortion effect images
│   ├── main-menu/          # Menu item images
│   ├── workshop/           # Workshop images
│   ├── workshops/          # Workshop gallery
│   ├── Rabuste logo.png    # Brand logo
│   └── *.mp4               # Video assets
│
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with fonts
│   │   ├── page.tsx        # Homepage
│   │   ├── globals.css     # Global styles & Tailwind
│   │   ├── about/          # About page (legacy)
│   │   ├── about-us/       # About Us page
│   │   ├── gallery/        # Art Gallery page
│   │   ├── menu/           # Coffee Menu page
│   │   ├── points/         # Reward Points page (NEW)
│   │   ├── profile/        # User Profile page
│   │   └── workshops/      # Workshops page
│   │
│   ├── components/
│   │   ├── animations/
│   │   │   ├── LaptopScrollAnimation.tsx  # Laptop scroll effect
│   │   │   └── MobilePhoneVideo.tsx       # Mobile video animation
│   │   │
│   │   ├── auth/
│   │   │   ├── AuthModal.tsx          # Login/Signup modal
│   │   │   └── PasswordProtection.tsx # Password protection
│   │   │
│   │   ├── cart/
│   │   │   ├── Cart.tsx         # Shopping cart drawer
│   │   │   └── CartButton.tsx   # Floating cart button
│   │   │
│   │   ├── effects/
│   │   │   └── HoverDistortion.tsx  # Image distortion effect
│   │   │
│   │   ├── hero/
│   │   │   └── Hero.tsx         # Homepage hero section
│   │   │
│   │   ├── menu/
│   │   │   ├── CoffeeCard.tsx   # Product card component
│   │   │   ├── CoffeeDetail.tsx # Product detail modal
│   │   │   ├── DealOfTheDay.tsx # Deal highlight card
│   │   │   ├── DealSection.tsx  # Deals with countdown timer
│   │   │   └── MenuSection.tsx  # Menu grid section
│   │   │
│   │   ├── navbar/
│   │   │   └── Navbar.tsx       # Responsive navigation with notifications & points
│   │   │
│   │   ├── profile/
│   │   │   ├── ArtCollection.tsx    # User's art purchases
│   │   │   ├── OrderHistory.tsx     # Order history with actions
│   │   │   ├── ProfileHeader.tsx    # Profile info & stats
│   │   │   └── WorkshopsSection.tsx # Attended workshops
│   │   │
│   │   ├── sections/
│   │   │   ├── AboutHero.tsx       # About page hero
│   │   │   ├── ArtGallery.tsx      # Art gallery grid
│   │   │   ├── CustomerReviews.tsx # Reviews carousel
│   │   │   ├── FestsAndWorkshops.tsx  # Events section
│   │   │   ├── FranchiseInfo.tsx   # Franchise details
│   │   │   ├── FranchiseInquiry.tsx # Franchise form
│   │   │   ├── MainMenu.tsx        # Menu preview
│   │   │   ├── OwnerWords.tsx      # Owner quote section
│   │   │   ├── StatsCounter.tsx    # Animated counters
│   │   │   ├── Timeline.tsx        # Company timeline
│   │   │   ├── WhatIsRobusta.tsx   # Robusta info section
│   │   │   └── WhyRobusta.tsx      # Why choose us carousel
│   │   │
│   │   ├── ui/
│   │   │   ├── BlurImage.tsx    # Lazy-loaded blur image
│   │   │   ├── Button.tsx       # Reusable button
│   │   │   ├── Card.tsx         # Card component
│   │   │   ├── Counter.tsx      # Animated counter
│   │   │   ├── Footer.tsx       # Site footer
│   │   │   └── Preloader.tsx    # Loading animation
│   │   │
│   │   └── workshops/
│   │       └── WorkshopCard.tsx # Workshop listing card
│   │
│   ├── data/
│   │   ├── menuData.ts      # Coffee menu data
│   │   └── profileData.ts   # Mock user profile data
│   │
│   ├── hooks/
│   │   └── useCart.tsx      # Cart state management
│   │
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn)
│   │
│   └── types/
│       ├── hover-effect.d.ts  # Hover effect types
│       └── menu.ts            # Menu & profile types
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── postcss.config.mjs
```

---

## ✨ Features Implemented

### 🎨 Design System
- **Typography**: Playfair Display (headings), Cormorant Garamond (body), Inter (UI)
- **Color Palette**: Warm browns (#8B6F47, #6d5638), cream (#D8CBB8), stone neutrals
- **Effects**: Glass morphism, grain texture overlay, custom scrollbar
- **Responsive**: Mobile-first design with breakpoints at 768px and 1024px

### 🏠 Homepage
- **Hero Section**: Full-screen video background with animated text
- **What is Robusta**: Educational section with image
- **Why Robusta**: Horizontal carousel with key features
- **Main Menu Preview**: Grid of featured coffee items
- **Stats Counter**: Animated numbers (customers, cups served, etc.)
- **Customer Reviews**: Testimonial carousel
- **Fests & Workshops**: Upcoming events preview
- **Franchise Info**: Investment opportunity section
- **Owner Words**: Quote from founder
- **Footer**: Links, social media, contact info

### 📱 Navigation
- **Desktop**: Fixed navbar with logo, nav links, cart, profile
- **Mobile**: Bottom navigation bar with icons + labels
- **Scroll Effect**: Glass morphism background on scroll
- **Active States**: Animated tab indicators
- **Notification System** (NEW):
  - Bell icon with shake animation on page load
  - Dropdown with notification list
  - Unread count badge
  - Mark as read / Mark all read functionality
  - Welcome message and promotional notifications
  - Works on both desktop and mobile
- **Points Dropdown** (NEW):
  - Clickable coins icon showing total points
  - Balance display with sparkle animation
  - Recent transactions list (earned/redeemed)
  - Green for earned (+), red for redeemed (-)
  - "View All Transactions" link to points page
  - Works on both desktop and mobile

### ☕ Menu Page
- **Category Tabs**: Hot Drinks, Cold Drinks, Pastries, Specials
- **Product Cards**: 
  - 3:4 aspect ratio images
  - Name (bold, line-clamp-2), rating stars, price
  - Quick add-to-cart button
  - Click to view details
- **Product Detail Modal**:
  - Full product info with customization options
  - Size selection, add-ons
  - Frequently bought together recommendations
  - You may also like section
- **Deal Section**:
  - Countdown timer for daily deals
  - Discounted pricing display

### 🛒 Shopping Cart
- **Slide-out Drawer**: Right-side panel
- **Cart Items**: Image, name, quantity controls, price
- **Quantity Adjustments**: Plus/minus buttons
- **Remove Items**: Delete button per item
- **Cart Summary**: Subtotal, tax, total
- **Checkout Button**: Proceed to payment (placeholder)
- **Empty State**: Friendly message when cart is empty

### 👤 User Profile
- **Profile Header**:
  - Avatar (upload/remove in edit mode)
  - Name (editable), email
  - Member duration (minutes/hours/days/months/years)
  - Stats cards: Total Orders, Reward Points, Total Spent
  - Password change in edit mode
- **Order History**:
  - Expandable order cards
  - First order full, second with gradient fade
  - "View all X orders" button
  - Download Bill & Reorder buttons
  - Item ratings display
  - Total spent badge
- **Workshops Section**:
  - Attended/booked workshops grid
  - Gradient fade on overflow
  - View more/less toggle
  - Total spent display
- **Art Collection**:
  - Purchased art pieces grid
  - Gradient fade effect
  - Total spent display
- **Action Buttons**: Edit Profile & Logout (side by side)
- **Desktop Profile Dashboard** (NEW):
  - Premium two-column layout with left sidebar
  - Profile card with gradient cover and avatar
  - Navigation menu for Orders/Workshops/Art/Points
  - Member tier progress card (Gold → Platinum)
  - Quick stats grid (4 cards at top)
  - Tab-based content switching
  - Sidebar stays fixed while content scrolls
  - Edit Profile modal popup
- **Edit Profile Modal** (NEW):
  - Compact centered modal with max-height constraint
  - Profile photo upload/remove
  - Display name editing
  - Email display (readonly)
  - Optional password change section
  - Save/Cancel with success animation
  - Click outside to close

### 🪙 Points & Rewards (NEW)
- **Points Page** (`/points`):
  - Hero section with dark gradient background
  - Current points balance display (large)
  - Tier progress indicator (Gold → Platinum)
  - Points needed for next tier
- **Ways to Earn**:
  - Orders (1 point per ₹10)
  - Referrals (100 points each)
  - Workshops (50-100 points)
  - Birthday/Promotional bonuses
- **Redemption Catalog**:
  - Free Coffee (50 points)
  - Free Pastry (75 points)
  - 10% Discount (100 points)
  - Workshop Discount (300 points)
- **Transaction History**:
  - Full transaction log with dates/times
  - Filter dropdown (All, Earned, Redeemed, Orders, Bonuses, Workshops)
  - Green indicators for earned
  - Red indicators for redeemed
  - Description and order IDs

### 🔐 Authentication
- **Login/Signup Modal**:
  - Email & password fields
  - Form validation
  - Google reCAPTCHA integration
  - Password strength requirements
  - LocalStorage persistence
- **Session Management**: Check auth on protected pages
- **Logout**: Clear all user data

### 🎨 About Us Page
- **Hero Section**: Brand story header
- **Timeline**: Company history milestones
- **Team Section**: Meet the founders

### 🖼️ Art Gallery Page
- **Gallery Grid**: Masonry-style layout
- **Hover Effects**: Image distortion on hover (Three.js)
- **Art Details**: Title, artist, price

### 🎓 Workshops Page
- **Workshop Cards**: Image, title, date, host
- **Status Badges**: Upcoming/Completed
- **Booking Info**: Capacity, price

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.0 (App Router) |
| **Language** | TypeScript 5.9.3 |
| **Styling** | Tailwind CSS 4.0 |
| **Animations** | Framer Motion 12.x |
| **3D Effects** | Three.js 0.182 |
| **Icons** | Lucide React |
| **Utilities** | clsx, tailwind-merge |
| **Backend** | Supabase (ready for integration) |
| **Security** | Google reCAPTCHA v2 |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/rabuste-coffee.git

# Navigate to project
cd rabuste-coffee

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with all sections |
| `/about-us` | About the brand & team |
| `/menu` | Coffee menu with cart |
| `/gallery` | Art gallery showcase |
| `/workshops` | Workshop listings |
| `/profile` | User profile with dashboard (protected) |
| `/points` | Reward points system & transactions (NEW) |

---

## 🎨 Component Highlights

### CoffeeCard
- Uniform 3:4 aspect ratio
- Fixed-height content area (100px)
- Bold product name with line-clamp
- Star ratings display
- Brown price color (#5d4e37)
- Hover scale effect

### Cart
- Slide-out drawer animation
- Quantity controls
- Real-time total calculation
- Empty state handling

### ProfileHeader
- Dynamic member duration
- Editable profile image
- Password change functionality
- Stats cards with icons

### Desktop Profile Dashboard (NEW)
- Two-column layout with fixed sidebar
- Sidebar navigation menu for sections
- Member tier progress indicator
- Quick stats grid (4 cards)
- Tabbed content area
- Edit profile modal popup

### Points Page (NEW)
- Hero section with points balance & tier
- Ways to earn points grid
- Redemption options catalog
- Transaction history with filters
- Filter by: All, Earned, Redeemed, Orders, Bonuses, Workshops

### DealSection
- Live countdown timer
- Inline timer display
- Deal of the day highlight

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.89.0",
    "framer-motion": "^12.23.26",
    "gsap": "^3.14.2",
    "hover-effect": "^1.2.1",
    "lucide-react": "^0.562.0",
    "next": "16.1.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-google-recaptcha": "^3.1.0",
    "tailwind-merge": "^3.4.0",
    "three": "^0.182.0"
  }
}
```

---

## 📄 License

This project is proprietary software for Rabuste Coffee brand.

---

## 👥 Contributors

- Development Team @ Rabuste

---

*Last Updated: January 2026 - Added Points System, Desktop Profile Dashboard, Edit Profile Modal*




