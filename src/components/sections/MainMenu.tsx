"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { HoverDistortion, HoverDistortionRef } from "@/components/effects/HoverDistortion";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    id: 1,
    imageA: "/main-menu/menu1a.jpg",
    imageB: "/main-menu/menu1b.jpg",
    nameA: "Classic Robusta Espresso",
    nameB: "Double Shot Intensity",
    priceA: "₹60",
    priceB: "₹70",
  },
  {
    id: 2,
    imageA: "/main-menu/menu2a.jpg",
    imageB: "/main-menu/menu2b.jpg",
    nameA: "Bold Brew Latte",
    nameB: "Premium Caramel Latte",
    priceA: "₹50",
    priceB: "₹60",
  },
  {
    id: 3,
    imageA: "/main-menu/menu3a.jpg",
    imageB: "/main-menu/menu3b.jpg",
    nameA: "Dark Roast Americano",
    nameB: "Signature Black Coffee",
    priceA: "₹70",
    priceB: "₹100",
  },
];

export function MainMenu() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [marqueeDuration, setMarqueeDuration] = useState(25);

  useEffect(() => {
    const updateDuration = () => {
      setMarqueeDuration(window.innerWidth < 1024 ? 15 : 25);
    };
    updateDuration();
    window.addEventListener('resize', updateDuration);
    return () => window.removeEventListener('resize', updateDuration);
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden pt-16 lg:pt-28 pb-0"
      style={{ backgroundColor: "#e3a458" }}
    >
      <div className="relative z-10 mx-auto w-full px-4 lg:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mb-12 lg:mb-16"
        >
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-[#7f3b2d] mb-6 text-center">
            Our Main Menu
          </h2>

          {/* Title Separator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-32 h-8 lg:w-40 lg:h-10"
          >
            <Image
              src="/title-separator.png"
              fill
              alt="Decorative separator"
              className="object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Marquee Text Animation - Both Phone and Desktop */}
        <div className="w-full overflow-hidden mb-8 lg:mb-12">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: marqueeDuration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span className="font-display text-2xl lg:text-3xl text-[#7f3b2d]/20 mx-4">
              ✦ Classic Robusta ✦ Bold Brew ✦ Dark Roast ✦ Premium Latte ✦ Signature Coffee ✦ Espresso ✦
            </span>
            <span className="font-display text-2xl lg:text-3xl text-[#7f3b2d]/20 mx-4">
              ✦ Classic Robusta ✦ Bold Brew ✦ Dark Roast ✦ Premium Latte ✦ Signature Coffee ✦ Espresso ✦
            </span>
          </motion.div>
        </div>

        {/* Desktop: 3 items in a row */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 xl:gap-6 px-4 xl:px-6">
          {menuItems.map((item, index) => (
            <DesktopMenuItem key={item.id} item={item} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Mobile: Stacked items */}
        <div className="lg:hidden space-y-12">
          {menuItems.map((item, index) => (
            <MobileMenuItem key={item.id} item={item} index={index} isInView={isInView} />
          ))}
        </div>

        {/* See More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mt-12 lg:mt-16"
        >
          <SeeMoreButton />
        </motion.div>
        <br />
        <br />
      </div>
    </section>
  );
}

// See More Button Component with Wavy Text Animation
function SeeMoreButton() {
  const [isHovered, setIsHovered] = useState(false);
  const text = "See More";

  return (
    <Link href="/menu">
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative px-8 py-4 bg-[#7f3b2d]/5 hover:bg-[#7f3b2d]/10 border-2 border-[#7f3b2d]/20 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
      suppressHydrationWarning
    >
      <span className="flex space-x-[2px]">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            animate={
              isHovered
                ? {
                  y: [0, -8, 0],
                  transition: {
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: "easeInOut",
                  },
                }
                : { y: 0 }
            }
            className="inline-block font-serif text-lg lg:text-xl font-semibold text-[#7f3b2d]"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </button>
    </Link>
  );
}

// Desktop Menu Item with Hover Distortion
function DesktopMenuItem({ item, index, isInView }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentName, setCurrentName] = useState(item.nameA);
  const [currentPrice, setCurrentPrice] = useState(item.priceA);
  const [currentImage, setCurrentImage] = useState(item.imageA);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90
  });

  const y = useTransform(smoothProgress, [0, 1], ["20%", "-20%"]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => {
      setCurrentName(item.nameB);
      setCurrentPrice(item.priceB);
      setCurrentImage(item.imageB);
    }, 300);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => {
      setCurrentName(item.nameA);
      setCurrentPrice(item.priceA);
      setCurrentImage(item.imageA);
    }, 300);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay: 0.4 + index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      {/* Image with Hover Distortion and Parallax */}
      <div
        className="relative w-full aspect-[4/5] overflow-hidden cursor-pointer border border-white/20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div style={{ y, scale: 1.5 }} className="relative w-full h-full">
          <HoverDistortion
            image1={item.imageA}
            image2={item.imageB}
            displacementImage="/liquid distortion assets/4.png"
            intensity={0.5}
            speedIn={1.6}
            speedOut={1.2}
            className="w-full h-full"
          />
        </motion.div>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${!isHovered ? "bg-white w-6" : "bg-white/50"
            }`} />
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isHovered ? "bg-white w-6" : "bg-white/50"
            }`} />
        </div>
      </div>

      {/* Name and Price */}
      <div className="mt-6 w-full flex justify-between items-baseline">
        <motion.h3
          key={currentName}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-xl xl:text-2xl text-[#7f3b2d]"
        >
          {currentName}
        </motion.h3>
        <motion.p
          key={currentPrice}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-xl xl:text-2xl text-[#7f3b2d] font-bold"
        >
          {currentPrice}
        </motion.p>
      </div>
    </motion.div>
  );
}

// Mobile Menu Item with Clickable Arrow
function MobileMenuItem({ item, index, isInView }: any) {
  const itemRef = useRef(null);
  const distortionRef = useRef<HoverDistortionRef>(null);
  const [showingB, setShowingB] = useState(false);

  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90
  });

  const y = useTransform(smoothProgress, [0, 1], ["20%", "-20%"]);

  const handleArrowClick = () => {
    if (distortionRef.current) {
      if (!showingB) {
        distortionRef.current.next();
        setShowingB(true);
      } else {
        distortionRef.current.previous();
        setShowingB(false);
      }
    }
  };

  const currentName = showingB ? item.nameB : item.nameA;
  const currentPrice = showingB ? item.priceB : item.priceA;

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay: 0.4 + index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      {/* Image with Distortion and Parallax */}
      <div
        className="relative w-full max-w-[340px] aspect-[4/5] overflow-hidden border border-white/20"
      >
        <motion.div style={{ y, scale: 1.5 }} className="relative w-full h-full">
          <HoverDistortion
            ref={distortionRef}
            image1={item.imageA}
            image2={item.imageB}
            displacementImage="/liquid distortion assets/4.png"
            intensity={0.5}
            speedIn={1.6}
            speedOut={1.2}
            className="w-full h-full"
            disableAutoTrigger={true}
          />
        </motion.div>

        {/* Arrow Button */}
        <button
          onClick={handleArrowClick}
          className="absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-[#7f3b2d]/10 hover:bg-[#7f3b2d]/20 backdrop-blur-sm border border-[#7f3b2d]/20 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Switch menu item"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#7f3b2d]"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${!showingB ? "bg-white w-6" : "bg-white/50"
            }`} />
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${showingB ? "bg-white w-6" : "bg-white/50"
            }`} />
        </div>
      </div>

      {/* Name and Price */}
      <div className="mt-4 w-full max-w-[340px] flex justify-between items-baseline">
        <motion.h3
          key={currentName}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-lg text-[#7f3b2d]"
        >
          {currentName}
        </motion.h3>
        <motion.p
          key={currentPrice}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-lg text-[#7f3b2d] font-bold"
        >
          {currentPrice}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default MainMenu;
