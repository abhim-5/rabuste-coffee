"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Home, Info, UtensilsCrossed, Palette, Wrench, Coins } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import AuthModal from "@/components/auth/AuthModal";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "About Us", href: "/about-us", icon: Info },
  { name: "Menu", href: "/menu", icon: UtensilsCrossed },
  { name: "Art Gallery", href: "/gallery", icon: Palette },
  { name: "Workshops", href: "/workshops", icon: Wrench },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [buttonRect, setButtonRect] = useState<DOMRect | undefined>();
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Check if user is logged in from localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem('rabuste_auth');
    const email = localStorage.getItem('rabuste_user_email');
    const image = localStorage.getItem('rabuste_user_image');
    const name = localStorage.getItem('rabuste_user_name') || '';
    if (authStatus === 'true' && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
      setUserProfileImage(image || null);
      setUserName(name);
    }
  }, []);

  const handleLogin = (email: string, password: string, name?: string, profileImage?: string) => {
    // Save auth state
    localStorage.setItem('rabuste_auth', 'true');
    localStorage.setItem('rabuste_user_email', email);
    localStorage.setItem('rabuste_user_password', password);
    if (name) {
      localStorage.setItem('rabuste_user_name', name);
    }
    if (profileImage) {
      localStorage.setItem('rabuste_user_image', profileImage);
    }
    // Save registration date if not already set
    if (!localStorage.getItem('rabuste_member_since')) {
      localStorage.setItem('rabuste_member_since', new Date().toISOString());
    }
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('rabuste_auth');
    localStorage.removeItem('rabuste_user_email');
    localStorage.removeItem('rabuste_user_password');
    localStorage.removeItem('rabuste_user_name');
    localStorage.removeItem('rabuste_user_image');
    setIsLoggedIn(false);
    setUserEmail('');
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
    if (!name || name.trim() === '') return 'GU';
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

            {/* Right Actions */}
            <div className="flex items-center gap-6 flex-shrink-0">
              {/* Notification Button */}
              <motion.button
                initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
                animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-full transition-colors duration-300 hover:bg-amber-900/30"
              >
                <Bell className="w-5 h-5 transition-colors duration-500 text-amber-50" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"
                />              </motion.button>

              {/* Auth Section */}
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  {/* Reward Points Icon */}
                  <motion.button
                    initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2.5 rounded-full transition-colors duration-300 hover:bg-amber-900/30"
                  >
                    <Coins className="w-5 h-5 text-amber-400" />
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      250
                    </span>
                  </motion.button>

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
                      {userProfileImage ? (
                        <Image
                          src={userProfileImage}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="rounded-full object-cover w-8 h-8 border-2 border-amber-500/30"
                        />
                      ) : userName ? (
                        <span className="rounded-full bg-gradient-to-br from-[#8B6F47] to-[#6d5638] text-white font-bold flex items-center justify-center w-8 h-8 text-sm">
                          {getInitials(userName)}
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
            <motion.button
              initial={{ y: -50, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.9 }}
              className={`relative p-2 rounded-full transition-colors duration-300 ${scrolled ? "hover:bg-amber-900/30" : "hover:bg-white/10"
                }`}
            >
              <Bell className={`w-5 h-5 transition-colors duration-500 ${scrolled ? "text-amber-50" : "text-white"
                }`} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
            </motion.button>

            {/* Auth Section */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* Reward Points Icon */}
                <motion.button
                  initial={{ y: -50, opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 rounded-full transition-colors duration-300 hover:bg-amber-900/30"
                >
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    250
                  </span>
                </motion.button>

                {/* Profile Icon */}
                <Link href="/profile">
                  <motion.button
                    initial={{ y: -50, opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full"
                  >
                    {userProfileImage ? (
                      <Image
                        src={userProfileImage}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full object-cover w-8 h-8 border-2 border-amber-500/30"
                      />
                    ) : userName ? (
                      <span className="rounded-full bg-gradient-to-br from-[#8B6F47] to-[#6d5638] text-white font-bold flex items-center justify-center w-8 h-8 text-sm">
                        {getInitials(userName)}
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
        onLogin={handleLogin}
        buttonRect={buttonRect}
      />
    </>
  );
}
