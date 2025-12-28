# 🍵 Rabuste Coffee - Premium Cafe & Cultural Hub Website

A modern, production-ready website for Rabuste brand cafe featuring coffee sales, art gallery, workshops, and franchise opportunities.

## ✨ Features Implemented

### 🎨 Design System
- **Cinematic Fonts**: 
  - Playfair Display (display/heading)
  - Cormorant Garamond (serif/body)
  - Inter (sans-serif/UI)
- **Color Palette**: Warm amber accents with stone neutrals
- **Grain Texture Overlay**: Subtle vintage aesthetic
- **Glass Morphism Effects**: Modern backdrop blur effects
- **Custom Scrollbar**: Branded scrollbar styling

### 📱 Navigation System

#### Desktop Navbar (≥1024px)
- **Top Left**: Animated logo with Rabuste branding
- **Center**: Horizontal navigation tabs (Home | About Us | Art Gallery | Workshops)
  - Active tab indicator with smooth animations
  - Hover effects with scale transforms
  - Underline transitions
- **Top Right**: 
  - Notification bell icon with badge
  - Login/Profile button with gradient styling
- **Scroll Effect**: Glass morphism on scroll

#### Mobile Navigation (<1024px)
- **Top Bar**: Logo, notification, and login (Instagram-style)
- **Bottom Navigation Bar**:
  - Fixed position with safe area support
  - Icon + label for each tab
  - Active state with scale animation
  - Smooth transitions between tabs
  - Glass morphism background

### 🎭 Animations
- **Framer Motion** powered animations:
  - Navbar slide-in on mount
  - Hover scale effects on interactive elements
  - Active tab transitions with layout animations
  - Smooth scroll-triggered effects
  - Tap feedback animations

### 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS with custom theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: PostgreSQL (via Supabase - ready to integrate)
- **ORM**: Prisma (to be configured)
- **Deployment**: Vercel-ready

## 📦 Project Structure

```
rabuste-coffee/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx             # Home page
│   │   ├── about/page.tsx       # About page
│   │   ├── gallery/page.tsx     # Art gallery page
│   │   ├── workshops/page.tsx   # Workshops page
│   │   └── globals.css          # Global styles & utilities
│   ├── components/
│   │   ├── navbar/
│   │   │   └── Navbar.tsx       # Main navigation component
│   │   └── ui/
│   │       ├── Button.tsx       # Reusable button component
│   │       └── Card.tsx         # Reusable card component
│   └── lib/
│       └── utils.ts             # Utility functions (cn, etc.)
└── public/                      # Static assets
```

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
