"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Home, Info, UtensilsCrossed, Palette, Wrench, X, ShoppingBag, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "About Us", href: "/about-us", icon: Info },
  { name: "Menu", href: "/menu", icon: UtensilsCrossed },
  { name: "Art Gallery", href: "/gallery", icon: Palette },
  { name: "Workshops", href: "/workshops", icon: Wrench },
];

// Mock points transactions data




export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | undefined>();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]); // Use DB data
  const [bellAnimating, setBellAnimating] = useState(false);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Use centralized auth state
  const { user, loading, signOut } = useAuth();
  // Get role info
  const { userProfile, hasStaffAccess } = useRole();

  // Fetch Notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) setNotifications(data);
    };

    fetchNotifications();

    // Realtime Subscription
    const channel = supabase
      .channel('navbar_notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications', 
        filter: `user_id=eq.${user.id}` 
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        setBellAnimating(true);
        setTimeout(() => setBellAnimating(false), 1000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Debug logging
  useEffect(() => {
    console.log('🔐 Navbar Auth State:', {
      loading,
      hasUser: !!user,
      userEmail: user?.email,
      userId: user?.id
    });
  }, [loading, user]);

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id: string, link?: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    
    // DB Update
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);

    if (link) {
      setShowNotifications(false);
      router.push(link);
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    await supabase.from('notifications').delete().eq('id', id);
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    if (user) {
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
    }
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

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
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
        className="fixed top-0 left-0 right-0 z-50 hidden lg:block transition-all duration-500 bg-[#120d0a] border-b border-[#fff9eb]/10 shadow-lg"
      >
        <div className="w-full px-6 lg:px-16">
          <div className="flex items-center h-22">
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
                <div className="relative w-14 h-14">
                  <Image
                    src="/Rabuste logo.png"
                    width={56}
                    height={56}
                    alt="Rabuste Logo"
                    className="w-full h-full object-contain drop-shadow-xl"
                    priority
                  />
                </div>
                <span className="font-tan-pearl text-4xl tracking-wide transition-colors duration-500 text-[#fff9eb] drop-shadow-md mt-2">
                  rabuste
                </span>
              </motion.div>
            </Link>

            {/* Center Navigation */}
            <div className="flex items-center gap-8 flex-grow justify-center h-full">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href} className="h-full flex items-center">
                    <motion.div
                      initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="relative px-4 h-full flex items-center cursor-pointer group"
                    >
                      <span
                        className={`font-serif text-[22px] tracking-wider transition-all duration-300 ${isActive
                          ? "text-[#fff9eb] font-semibold"
                          : "text-[#fff9eb]/70 group-hover:text-[#fff9eb]"
                          }`}
                      >
                        {item.name}
                      </span>
                      
                      {/* Premium Underline Effect - At bottom edge */}
                      <span className={`absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#fff9eb] transition-transform duration-500 origin-center ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`} />
                    </motion.div>
                  </Link>
                );
              })}

              {/* Admin Panel Button */}
              {(userProfile?.role === 'admin' || userProfile?.role === 'superadmin') && (
                <Link href="/admin" className="h-full flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative px-4 h-full flex items-center cursor-pointer group"
                  >
                    <span
                      className={`font-serif text-[22px] tracking-wider transition-all duration-300 ${
                        pathname.startsWith('/admin')
                          ? "text-[#fff9eb] font-semibold"
                          : "text-[#fff9eb]/70 group-hover:text-[#fff9eb]"
                      }`}
                    >
                      Admin
                    </span>
                    <span className={`absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#fff9eb] transition-transform duration-500 origin-center ${
                      pathname.startsWith('/admin') ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`} />
                  </motion.div>
                </Link>
              )}
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
                  <div className="w-5 h-5 border-2 border-[#fff9eb]/30 border-t-[#fff9eb] rounded-full animate-spin"></div>
                </motion.div>
              ) : user ? (
                // Authenticated user - show notifications, points, dashboard, profile
                <>
                  {/* Notification Button - Hidden for Admins */}
                  {!(userProfile?.role === 'admin' || userProfile?.role === 'superadmin') && (
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
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 rounded-full transition-colors duration-300 group"
                    >
                      <Bell className="w-6 h-6 text-[#fff9eb]/80 group-hover:text-[#fff9eb] transition-colors" />
                      {unreadCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.5 }}
                          className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                        />
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
                          className="absolute right-0 top-16 w-80 bg-[#1a1a1a]/95 backdrop-blur-xl border border-[#fff9eb]/10 rounded-xl shadow-2xl overflow-hidden z-50 no-dark-mode"
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between px-5 py-4 border-b border-[#fff9eb]/10">
                            <h3 className="font-serif text-lg font-medium text-[#fff9eb]">Notifications</h3>
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="text-xs text-[#fff9eb]/50 hover:text-[#fff9eb] transition-colors"
                              >
                                Mark all read
                              </button>
                            )}
                          </div>

                          {/* Notifications List */}
                          <div className="max-h-80 overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                              notifications.map((notification, index) => {
                                let IconComponent = Bell;
                                if (notification.type === 'order') IconComponent = ShoppingBag;
                                if (notification.type === 'art_purchase') IconComponent = Palette;
                                if (notification.type === 'workshop_request') IconComponent = Wrench;
                                if (notification.type === 'system') IconComponent = Info;

                                const bgClass = notification.type === 'order' ? 'bg-blue-500/20 text-blue-400' :
                                                notification.type === 'art_purchase' ? 'bg-purple-500/20 text-purple-400' :
                                                notification.type === 'workshop_request' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-[#fff9eb]/10 text-[#fff9eb]';

                                return (
                                  <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => markAsRead(notification.id, notification.link)}
                                    className={`relative group flex gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-[#fff9eb]/5 border-b border-[#fff9eb]/5 last:border-0 ${
                                      !notification.is_read ? "bg-[#fff9eb]/5" : ""
                                    }`}
                                  >
                                    <button
                                      onClick={(e) => deleteNotification(notification.id, e)}
                                      className="lg:opacity-0 lg:group-hover:opacity-100 absolute top-2 right-2 p-1.5 text-[#fff9eb]/30 hover:text-red-400 transition-all duration-200 z-10"
                                      title="Delete notification"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bgClass}`}>
                                      <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <p className="font-sans text-sm font-medium text-[#fff9eb] line-clamp-1">
                                          {notification.title}
                                        </p>
                                      </div>
                                      <p className="font-sans text-xs text-[#fff9eb]/60 line-clamp-2 mt-1 leading-relaxed">
                                        {notification.message}
                                      </p>
                                      <p className="font-sans text-[10px] text-[#fff9eb]/40 mt-2">
                                        {formatTime(notification.created_at)}
                                      </p>
                                    </div>
                                  </motion.div>
                                );
                              })
                            ) : (
                              <div className="py-12 text-center">
                                <Bell className="w-12 h-12 text-[#fff9eb]/10 mx-auto mb-3" />
                                <p className="text-sm text-[#fff9eb]/30">No notifications yet</p>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="px-4 py-3 border-t border-[#fff9eb]/10 bg-[#fff9eb]/5">
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="w-full text-center text-xs text-[#fff9eb]/50 hover:text-[#fff9eb] py-1 transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  )}

                  {/* Reward Points & Profile Section */}
                  <div className="flex items-center gap-4">


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
                            className="rounded-full object-cover w-9 h-9 border border-[#fff9eb]/30"
                          />
                        ) : user.user_metadata?.name ? (
                          <span className="rounded-full bg-[#fff9eb] text-black font-bold flex items-center justify-center w-9 h-9 text-sm">
                            {getInitials(user.user_metadata.name)}
                          </span>
                        ) : (
                          <div className="p-2 rounded-full border border-[#fff9eb]/30 text-[#fff9eb] hover:bg-[#fff9eb] hover:text-black transition-colors">
                            <User className="w-5 h-5" />
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
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 249, 235, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    setButtonRect((e.target as HTMLButtonElement).getBoundingClientRect());
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#fff9eb]/40 text-[#fff9eb] hover:border-[#fff9eb] transition-all duration-300"
                >
                  <span className="font-serif text-sm tracking-widest uppercase">Login</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.nav >

      {/* Mobile Top Bar */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 lg:hidden transition-all duration-500 bg-[#120d0a] border-b border-[#fff9eb]/10 shadow-lg"
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
              <span className="font-tan-pearl text-2xl transition-colors duration-500 text-[#fff9eb] drop-shadow-md">
                rabuste
              </span>
            </motion.div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notification - Hidden for Admins */}
            {user && !(userProfile?.role === 'admin' || userProfile?.role === 'superadmin') && (
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
                          let IconComponent = Bell;
                          if (notification.type === 'order') IconComponent = ShoppingBag;
                          if (notification.type === 'art_purchase') IconComponent = Palette;
                          if (notification.type === 'workshop_request') IconComponent = Wrench;
                          if (notification.type === 'system') IconComponent = Info;

                          const bgClass = notification.type === 'order' ? 'bg-blue-600' :
                                          notification.type === 'art_purchase' ? 'bg-purple-600' :
                                          notification.type === 'workshop_request' ? 'bg-amber-600' :
                                          'bg-[#8B6F47]';

                          return (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => markAsRead(notification.id, notification.link)}
                              className={`relative group flex gap-2 px-2.5 py-2 cursor-pointer transition-colors hover:bg-[#8B6F47]/10 active:bg-[#8B6F47]/10 ${!notification.is_read ? "bg-white" : ""
                                }`}
                            >
                              <button
                                onClick={(e) => deleteNotification(notification.id, e)}
                                className="absolute top-1 right-1 p-1.5 text-[#8B6F47]/40 hover:text-red-500 active:text-red-600 rounded-full transition-colors z-10"
                                title="Delete notification"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${bgClass}`}>
                                <IconComponent className="w-3.5 h-3.5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1">
                                  <p className="font-sans text-sm font-semibold text-[#262626] line-clamp-1 break-words">
                                    {notification.title}
                                  </p>

                                </div>
                                <p className="font-sans text-xs text-[#262626]/70 line-clamp-2 mt-0.5 break-words">
                                  {notification.message}
                                </p>
                                <p className="font-sans text-[10px] text-[#8B6F47]/60 mt-0.5">
                                  {formatTime(notification.created_at)}
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
            )}

            {/* Auth Section */}
            {!loading && user ? (
              <div className="flex items-center gap-3">
                {/* Admin Button */}
                {(userProfile?.role === 'admin' || userProfile?.role === 'superadmin') && (
                  <Link href="/admin">
                    <motion.button
                      initial={{ y: -50, opacity: 0, filter: "blur(10px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      whileTap={{ scale: 0.9 }}
                      className="relative p-2 rounded-full transition-colors duration-300 hover:bg-amber-900/30"
                    >
                      <LayoutDashboard className="w-5 h-5 text-amber-50" />
                    </motion.button>
                  </Link>
                )}

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
      </motion.nav>

      {/* Mobile Bottom Navigation (Instagram-style) */}
      < motion.nav
        initial={{ y: 0 }}
        animate={{ y: hidden ? 120 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden bg-black/95 backdrop-blur-xl border-t border-neutral-900/40 pb-safe"
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
