"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Home, Info, UtensilsCrossed, Palette, Wrench, Coins, X, Gift, Coffee, History, Plus, Minus, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "About Us", href: "/about-us", icon: Info },
  { name: "Menu", href: "/menu", icon: UtensilsCrossed },
  { name: "Art Gallery", href: "/gallery", icon: Palette },
  { name: "Workshops", href: "/workshops", icon: Wrench },
];

// Mock points transactions data
const mockPointsTransactions = [
  {
    id: 1,
    type: "earned",
    title: "Welcome Bonus",
    points: 100,
    date: "Jan 1, 2026",
    icon: Sparkles,
  },
  {
    id: 2,
    type: "earned",
    title: "Order #1234",
    points: 75,
    date: "Dec 28, 2025",
    icon: ShoppingBag,
  },
  {
    id: 3,
    type: "redeemed",
    title: "Free Coffee Redeemed",
    points: -50,
    date: "Dec 25, 2025",
    icon: Coffee,
  },
  {
    id: 4,
    type: "earned",
    title: "Workshop Attendance",
    points: 125,
    date: "Dec 20, 2025",
    icon: TrendingUp,
  },
];

const totalPoints = 250;

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "welcome",
    title: "Welcome to Rabuste! ☕",
    message: "We're thrilled to have you here. Explore our artisanal coffee and exclusive workshops.",
    time: "Just now",
    unread: true,
    icon: Coffee,
  },
  {
    id: 2,
    type: "offer",
    title: "Special Offer! 🎉",
    message: "Get 20% off on your first order. Use code: WELCOME20",
    time: "2 hours ago",
    unread: true,
    icon: Gift,
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | undefined>();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [bellAnimating, setBellAnimating] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Use centralized auth state
  const { user, loading, signOut } = useAuth();
  // Debug logging
useEffect(() => {
  console.log('🔐 Navbar Auth State:', {
    loading,
    hasUser: !!user,
    userEmail: user?.email,
    userId: user?.id
  });
}, [loading, user]);
  const { hasStaffAccess } = useRole();

  // Bell animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setBellAnimating(true);
      setTimeout(() => setBellAnimating(false), 1000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (pointsRef.current && !pointsRef.current.contains(event.target as Node)) {
        setShowPoints(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if navbar should have background
      setScrolled(currentScrollY > 20);

      // Determine if navbar should hide (scrolling down) or show (scrolling up)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setHidden(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Helper to generate initials
  const getInitials = (name: string) => {
    if (!name || name.trim() === '') return 'U';
    const firstName = name.trim().split(' ')[0];
    return firstName.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: hidden ? -120 : 0,
          opacity: hidden ? 0 : 1
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 hidden lg:block transition-all duration-500 bg-black/95 backdrop-blur-xl shadow-2xl border-b border-neutral-900/40"
      >
        <div className="w-full px-6 lg:px-16">
          <div className="flex items-center h-20">
            {/* Logo & Brand */}
            <Link href="/" className="flex-shrink-0">
              <motion.div
                initial={{ x: -100, opacity: 0, filter: "blur(10px)" }}
                animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative w-12 h-12">
                  <Image
                    src="/Rabuste logo.png"
                    width={48}
                    height={48}
                    alt="Rabuste Logo"
                    className="w-full h-full object-contain drop-shadow-lg"
                    priority
                  />
                </div>
                <span className="font-display text-2xl font-semibold tracking-tight transition-colors duration-500 text-amber-50">
                  Rabuste
                </span>
              </motion.div>
            </Link>

            {/* Center Navigation */}
            <div className="flex items-center gap-2 flex-grow justify-center">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.8,
                        delay: 0.3 + index * 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ y: -2 }}
                      className="relative px-7 py-2 cursor-pointer group"
                    >
                      <span
                        className={`font-serif text-lg font-semibold tracking-wide transition-colors duration-300 ${isActive
                          ? "text-amber-400"
                          : "text-amber-50 group-hover:text-amber-300"
                          }`}
                      >
                        {item.name}
                      </span>
                      {isActive && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 origin-left"
                          transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                        />
                      )}
                      {!isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Right Actions - Auth State Aware */}
            <div className="flex items-center gap-6 flex-shrink-0">
              {loading ? (
                // Loading state - show spinner
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="flex items-center gap-2 px-6 py-2.5"
                >
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </motion.div>
              ) : user ? (
                // Authenticated user - show notifications, points, dashboard, profile
                <>
                  {/* Notification Button */}
                  <div className="relative" ref={notificationRef}>
                    <motion.button
                      initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
                      animate={{
                        x: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        rotate: bellAnimating ? [0, -15, 15, -15, 15, 0] : 0
                      }}
                      transition={{
                        duration: bellAnimating ? 0.5 : 0.8,
                        delay: bellAnimating ? 0 : 1.2,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2.5 rounded-full transition-colors duration-300 hover:bg-amber-900/30"
                    >
                      <Bell className="w-5 h-5 transition-colors duration-500 text-amber-50" />
                      {unreadCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.5 }}
                          className="absolute top-1 right-1 w-4 h-4 bg-amber-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                        >
                          {unreadCount}
                        </motion.span>
                      )}
                    </motion.button>

                    {/* Notification Dropdown */}
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute right-0 top-14 w-80 bg-[#D8CBB8] border-[0.5px] border-[#8B6F47] rounded-lg shadow-2xl overflow-hidden z-50 no-dark-mode"
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between px-4 py-3 border-b border-[#8B6F47] bg-[#D8CBB8]">
                            <h3 className="font-display text-lg font-semibold text-[#262626]">Notifications</h3>
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="text-xs text-[#8B6F47] hover:text-[#6B5537] font-medium transition-colors"
                              >
                                Mark all read
                              </button>
                            )}
                          </div>

                          {/* Notifications List */}
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.length > 0 ? (
                              notifications.map((notification, index) => {
                                const IconComponent = notification.icon;
                                return (
                                  <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => markAsRead(notification.id)}
                                    className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[#8B6F47]/10 ${notification.unread ? "bg-white" : ""
                                      }`}
                                  >
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.type === "welcome" ? "bg-[#8B6F47]" : "bg-green-600"
                                      }`}>
                                      <IconComponent className={`w-5 h-5 ${notification.type === "welcome" ? "text-white" : "text-white"
                                        }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <p className="font-sans text-sm font-semibold text-[#262626] line-clamp-1">
                                          {notification.title}
                                        </p>
                                        {notification.unread && (
                                          <span className="w-2 h-2 bg-[#8B6F47] rounded-full flex-shrink-0 mt-1.5" />
                                        )}
                                      </div>
                                      <p className="font-sans text-xs text-[#262626]/70 line-clamp-2 mt-0.5">
                                        {notification.message}
                                      </p>
                                      <p className="font-sans text-[10px] text-[#8B6F47]/60 mt-1">
                                        {notification.time}
                                      </p>
                                    </div>
                                  </motion.div>
                                );
                              })
                            ) : (
                              <div className="py-8 text-center">
                                <Bell className="w-10 h-10 text-[#8B6F47]/30 mx-auto mb-2" />
                                <p className="text-sm text-[#262626]/50">No notifications</p>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="px-4 py-2 border-t border-[#8B6F47] bg-[#D8CBB8]">
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="w-full text-center text-xs text-[#8B6F47] hover:text-[#6B5537] font-medium py-1 transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Reward Points & Profile Section */}
                  <div className="flex items-center gap-4">
                    {/* Reward Points */}
                    <div className="relative" ref={pointsRef}>
                      <motion.button
                        initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
                        animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowPoints(!showPoints)}
                        className="relative p-2.5 rounded-full transition-colors duration-300 hover:bg-amber-900/30"
                      >
                        <Coins className="w-5 h-5 text-amber-400" />
                        <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {totalPoints}
                        </span>
                      </motion.button>

                      {/* Points Dropdown */}
                      <AnimatePresence>
                        {showPoints && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right-0 top-14 w-80 bg-[#D8CBB8] border-[0.5px] border-[#8B6F47] rounded-lg shadow-2xl overflow-hidden z-50 no-dark-mode"
                          >
                            {/* Header with Total Points */}
                            <div className="px-4 py-4 border-b border-[#8B6F47] bg-white">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-[#8B6F47]/60 font-medium uppercase tracking-wider">Your Balance</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Coins className="w-6 h-6 text-[#8B6F47]" />
                                    <span className="font-display text-3xl font-bold text-[#8B6F47]">{totalPoints}</span>
                                    <span className="text-[#262626]/70 text-sm">points</span>
                                  </div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-[#8B6F47] flex items-center justify-center">
                                  <Sparkles className="w-6 h-6 text-white" />
                                </div>
                              </div>
                            </div>

                            {/* Recent Transactions */}
                            <div className="px-4 py-2 border-b border-[#8B6F47]">
                              <p className="text-xs text-[#8B6F47]/60 font-medium uppercase tracking-wider">Recent Activity</p>
                            </div>
                            <div className="max-h-56 overflow-y-auto">
                              {mockPointsTransactions.map((transaction, index) => {
                                const IconComponent = transaction.icon;
                                const isEarned = transaction.type === "earned";
                                return (
                                  <motion.div
                                    key={transaction.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#8B6F47]/10 transition-colors"
                                  >
                                    <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${isEarned ? "bg-green-600" : "bg-red-600"
                                      }`}>
                                      <IconComponent className={`w-4 h-4 ${isEarned ? "text-white" : "text-white"}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-sans text-sm font-medium text-[#262626] line-clamp-1">
                                        {transaction.title}
                                      </p>
                                      <p className="font-sans text-[10px] text-[#8B6F47]/60">
                                        {transaction.date}
                                      </p>
                                    </div>
                                    <div className={`flex items-center gap-0.5 font-semibold text-sm ${isEarned ? "text-green-700" : "text-red-600"
                                      }`}>
                                      {isEarned ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                      {Math.abs(transaction.points)}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>

                            {/* Footer with View All */}
                            <div className="px-4 py-3 border-t border-[#8B6F47] bg-[#D8CBB8]">
                              <Link href="/points" onClick={() => setShowPoints(false)}>
                                <button className="w-full flex items-center justify-center gap-2 py-2 bg-[#8B6F47] hover:bg-[#6B5537] text-white text-sm font-semibold transition-colors">
                                  <History className="w-4 h-4" />
                                  View All Transactions
                                </button>
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Dashboard Button (Staff Only) */}
                    {hasStaffAccess && (
                      <Link href="/dashboard">
                        <motion.button
                          initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
                          animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                          transition={{ duration: 0.6, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/60 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002-2M13 13h6m-3-3v6" />
                          </svg>
                          <span className="font-sans text-xs font-medium">Dashboard</span>
                        </motion.button>
                      </Link>
                    )}

                    {/* Profile Icon */}
                    <Link href="/profile">
                      <motion.button
                        initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
                        animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-full transition-all duration-300"
                      >
                        {user.user_metadata?.picture || user.user_metadata?.avatar_url ? (
                          <Image
                            src={(user.user_metadata.picture || user.user_metadata.avatar_url) || ''}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="rounded-full object-cover w-8 h-8 border-2 border-amber-500/30"
                          />
                        ) : user.user_metadata?.name ? (
                          <span className="rounded-full bg-gradient-to-br from-[#8B6F47] to-[#6d5638] text-white font-bold flex items-center justify-center w-8 h-8 text-sm">
                            {getInitials(user.user_metadata.name)}
                          </span>
                        ) : (
                          <div className="p-2 rounded-full bg-amber-500">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </motion.button>
                    </Link>
                  </div>
                </>
              ) : (
                <motion.button
                  ref={loginButtonRef}
                  initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
                  animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    setButtonRect((e.target as HTMLButtonElement).getBoundingClientRect());
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-2 px-7 py-3 rounded-full border border-white/60 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span className="font-sans text-sm font-semibold tracking-[0.2em] uppercase">Login</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.nav >

      {/* Mobile Top Bar */}
      < motion.div
        initial={{ y: 0, opacity: 1 }
        }
        animate={{
          y: hidden ? -80 : 0,
          opacity: hidden ? 0 : 1
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 lg:hidden transition-all duration-500 bg-black/95 backdrop-blur-xl shadow-2xl border-b border-neutral-900/40`
        }
      >
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo & Brand */}
          <Link href="/">
            <motion.div
              initial={{ y: -50, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/Rabuste logo.png"
                  width={40}
                  height={40}
                  alt="Rabuste Logo"
                  className="w-full h-full object-contain drop-shadow-lg"
                  priority
                />
              </div>
              <span className={`font-display text-xl font-semibold transition-colors duration-500 ${scrolled ? "text-amber-50" : "text-white drop-shadow-lg"
                }`}>
                Rabuste
              </span>
            </motion.div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notification */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                initial={{ y: -50, opacity: 0, filter: "blur(10px)" }}
                animate={{
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  rotate: bellAnimating ? [0, -15, 15, -15, 15, 0] : 0
                }}
                transition={{ duration: bellAnimating ? 0.5 : 0.8, delay: bellAnimating ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full transition-colors duration-300 ${scrolled ? "hover:bg-amber-900/30" : "hover:bg-white/10"
                  }`}
              >
                <Bell className={`w-5 h-5 transition-colors duration-500 ${scrolled ? "text-amber-50" : "text-white"
                  }`} />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-amber-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              {/* Mobile Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute -right-10 top-14 w-[90vw] max-w-[280px] bg-[#D8CBB8] border-[0.5px] border-[#8B6F47] rounded-lg shadow-2xl overflow-hidden z-50 no-dark-mode"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-2.5 py-2 border-b border-[#8B6F47] bg-[#D8CBB8]">
                      <h3 className="font-display text-sm font-semibold text-[#262626] truncate mr-2">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] text-[#8B6F47] hover:text-[#6B5537] font-medium transition-colors whitespace-nowrap flex-shrink-0"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => {
                          const IconComponent = notification.icon;
                          return (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => markAsRead(notification.id)}
                              className={`flex gap-2 px-2.5 py-2 cursor-pointer transition-colors hover:bg-[#8B6F47]/10 active:bg-[#8B6F47]/10 ${notification.unread ? "bg-white" : ""
                                }`}
                            >
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notification.type === "welcome" ? "bg-[#8B6F47]" : "bg-green-600"
                                }`}>
                                <IconComponent className={`w-3.5 h-3.5 ${notification.type === "welcome" ? "text-white" : "text-white"
                                  }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1">
                                  <p className="font-sans text-sm font-semibold text-[#262626] line-clamp-1 break-words">
                                    {notification.title}
                                  </p>
                                  {notification.unread && (
                                    <span className="w-2 h-2 bg-[#8B6F47] rounded-full flex-shrink-0 mt-1.5" />
                                  )}
                                </div>
                                <p className="font-sans text-xs text-[#262626]/70 line-clamp-2 mt-0.5 break-words">
                                  {notification.message}
                                </p>
                                <p className="font-sans text-[10px] text-[#8B6F47]/60 mt-0.5">
                                  {notification.time}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className="py-8 text-center">
                          <Bell className="w-10 h-10 text-[#8B6F47]/30 mx-auto mb-2" />
                          <p className="text-sm text-[#262626]/50">No notifications</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-2.5 py-1.5 border-t border-[#8B6F47]">
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="w-full text-center text-xs text-[#8B6F47] hover:text-[#6B5537] font-medium py-1 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Section */}
            {!loading && user ? (
              <div className="flex items-center gap-3">
                {/* Reward Points */}
                <div className="relative" ref={pointsRef}>
                  <motion.button
                    initial={{ y: -50, opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPoints(!showPoints)}
                    className="relative p-2 rounded-full transition-colors duration-300 hover:bg-amber-900/30"
                  >
                    <Coins className="w-5 h-5 text-amber-400" />
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {totalPoints}
                    </span>
                  </motion.button>

                  {/* Mobile Points Dropdown */}
                  <AnimatePresence>
                    {showPoints && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-12 w-[90vw] max-w-[280px] bg-[#D8CBB8] border-[0.5px] border-[#8B6F47] rounded-lg shadow-2xl overflow-hidden z-50 no-dark-mode"
                      >
                        {/* Header with Total Points */}
                        <div className="px-4 py-3 border-b border-[#8B6F47] bg-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[10px] text-[#8B6F47]/60 font-medium uppercase tracking-wider">Your Balance</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Coins className="w-5 h-5 text-[#8B6F47]" />
                                <span className="font-display text-2xl font-bold text-[#8B6F47]">{totalPoints}</span>
                                <span className="text-[#262626]/70 text-xs">points</span>
                              </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#8B6F47] flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="px-4 py-1.5 border-b border-[#8B6F47]">
                          <p className="text-[10px] text-[#8B6F47]/60 font-medium uppercase tracking-wider">Recent Activity</p>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {mockPointsTransactions.slice(0, 3).map((transaction, index) => {
                            const IconComponent = transaction.icon;
                            const isEarned = transaction.type === "earned";
                            return (
                              <motion.div
                                key={transaction.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#8B6F47]/10 active:bg-[#8B6F47]/10 transition-colors"
                              >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isEarned ? "bg-green-600" : "bg-red-600"
                                  }`}>
                                  <IconComponent className={`w-4 h-4 ${isEarned ? "text-white" : "text-white"}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-sans text-sm font-medium text-[#262626] line-clamp-1">
                                    {transaction.title}
                                  </p>
                                  <p className="font-sans text-[10px] text-[#8B6F47]/60">
                                    {transaction.date}
                                  </p>
                                </div>
                                <div className={`flex items-center gap-0.5 font-semibold text-sm ${isEarned ? "text-green-700" : "text-red-600"
                                  }`}>
                                  {isEarned ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                  {Math.abs(transaction.points)}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Footer with View All */}
                        <div className="px-4 py-2.5 border-t border-[#8B6F47] bg-[#D8CBB8]">
                          <Link href="/points" onClick={() => setShowPoints(false)}>
                            <button className="w-full flex items-center justify-center gap-2 py-2 bg-[#8B6F47] hover:bg-[#6B5537] text-white text-sm font-semibold transition-colors">
                              <History className="w-4 h-4" />
                              View All Transactions
                            </button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Icon */}
                <Link href="/profile">
                  <motion.button
                    initial={{ y: -50, opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full"
                  >
                    {user.user_metadata?.picture || user.user_metadata?.avatar_url ? (
                      <Image
                        src={(user.user_metadata.picture || user.user_metadata.avatar_url) || ''}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full object-cover w-8 h-8 border-2 border-amber-500/30"
                      />
                    ) : user.user_metadata?.name ? (
                      <span className="rounded-full bg-gradient-to-br from-[#8B6F47] to-[#6d5638] text-white font-bold flex items-center justify-center w-8 h-8 text-sm">
                        {getInitials(user.user_metadata.name)}
                      </span>
                    ) : (
                      <div className="p-2 rounded-full bg-amber-500">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </motion.button>
                </Link>
              </div>
            ) : (
              <motion.button
                initial={{ y: -50, opacity: 0, filter: "blur(10px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  setButtonRect((e.target as HTMLButtonElement).getBoundingClientRect());
                  setShowAuthModal(true);
                }}
                className="px-5 py-2.5 rounded-full border border-white/60 bg-white/5 backdrop-blur-md text-white text-sm font-semibold tracking-[0.2em] uppercase"
              >
                Login
              </motion.button>
            )}
          </div>
        </div>
      </motion.div >

      {/* Mobile Bottom Navigation (Instagram-style) */}
      < motion.nav
        initial={{ y: 0 }}
        animate={{ y: hidden ? 120 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-black/95 backdrop-blur-xl border-t border-neutral-900/40 pb-safe"
      >
        <div className="relative flex items-center justify-around h-16 px-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} className="flex-1">
                <motion.div
                  initial={{ y: 80, opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center justify-center gap-1 py-2 cursor-pointer"
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="relative"
                  >
                    <Icon
                      className={`w-6 h-6 transition-colors duration-300 ${isActive
                        ? "text-amber-400"
                        : "text-amber-100/70"
                        }`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="activeMobileTab"
                        className="absolute -bottom-1 left-1/2 w-1 h-1 bg-amber-400 rounded-full"
                        style={{ x: "-50%" }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                  <span
                    className={`font-sans text-[10px] font-medium transition-colors duration-300 ${isActive
                      ? "text-amber-400"
                      : "text-amber-100/70"
                      }`}
                  >
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.nav >

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        buttonRect={buttonRect}
      />
    </>
  );
}
