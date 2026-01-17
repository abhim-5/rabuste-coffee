"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlurImage from "@/components/ui/BlurImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

gsap.registerPlugin(ScrollTrigger);

const carouselImages = [
  "/robusta-pack.png",
  "/carousel-Why%20Robusta/1.jpg",
  "/carousel-Why%20Robusta/2.jpg",
  "/carousel-Why%20Robusta/3.jpg",
  "/carousel-Why%20Robusta/4.jpg",
  "/carousel-Why%20Robusta/5.jpg",
];

const reasons = [
  {
    icon: "/icon1.png",
    title: "THE PERFECT CUP",
    description: "Robusta delivers double the caffeine with a powerful, unapologetic flavor profile that true coffee lovers crave.",
  },
  {
    icon: "/icon2.png",
    title: "THE MOKA POT",
    description: "We believe in serving bold coffee in a cozy space, perfect for your grab-and-go lifestyle with quality intact.",
  },
  {
    icon: "/icon3.png",
    title: "SUPREME BEANS",
    description: "Hand-selected Robusta beans, expertly dark roasted to bring out chocolatey notes with smooth finish.",
  },
  {
    icon: "/icon4.png",
    title: "THE COFFEE MACHINE",
    description: "More than a café - we're a creative space where Surat's coffee culture meets artistic inspiration.",
  },
  {
    icon: "/icon5.png",
    title: "FRENCH PRESS",
    description: "Named to celebrate Robusta coffee, we're Surat's first café exclusively dedicated to this bold bean variety.",
  },
  {
    icon: "/icon6.png",
    title: "COFFEE TO GO",
    description: "Every cup is a testament to our commitment to dark roast excellence and authentic coffee craftsmanship.",
  },
];

export function RobustaVsAmericano() {
  const ref = useRef(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const carouselRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const carouselInView = useInView(carouselRef, { amount: 0.3 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Theme configuration
  const SECTION_BG = "#e3a458";
  const THEME_COLOR = "#7f3b2d";

  useEffect(() => {
    if (!titleRef.current) return;

    // Initialize Splitting for Title
    if (titleRef.current.querySelectorAll('.char').length === 0) {
      Splitting({ target: titleRef.current, by: "chars" });
    }

    // Initialize Splitting for Reason Descriptions
    const reasonDescriptions = ref.current?.querySelectorAll('.reason-description');
    reasonDescriptions?.forEach((desc: HTMLElement) => {
        if (desc.querySelectorAll('.word').length === 0) {
          Splitting({ target: desc, by: "words" });
        }
    });

    const ctx = gsap.context(() => {
      // --- Title Animation ---
      const chars = titleRef.current?.querySelectorAll('.char');
      if (chars?.length) {
        gsap.set(chars, { 
          opacity: 0, 
          yPercent: 120, 
          scaleY: 2.3, 
          scaleX: 0.7, 
          transformOrigin: '50% 0%',
          willChange: 'opacity, transform',
          display: 'inline-block' 
        });

        gsap.to(chars, {
          duration: 1,
          ease: 'back.inOut(2)',
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: 0.03,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top bottom-=10%', 
            end: 'center center',
            scrub: true
          }
        });
      }

      // --- Descriptions Animation (Word Opacity Fade) ---
      reasonDescriptions?.forEach((desc: HTMLElement) => {
          const words = desc.querySelectorAll('.word');
          if (words.length) {
              gsap.fromTo(words, {
                  opacity: 0.1
              }, 
              {
                  ease: 'none',
                  opacity: 1,
                  stagger: 0.02,
                  scrollTrigger: {
                      trigger: desc,
                      start: 'top bottom-=10%',
                      end: 'bottom center+=10%',
                      scrub: true,
                  }
              });
          }
      });

    }, ref);

    return () => ctx.revert();
  }, []);

  // Reset to first image when carousel comes into view
  useEffect(() => {
    if (carouselInView && currentImageIndex !== 0) {
      setCurrentImageIndex(0);
      setIsAutoPlaying(true);
    }
  }, [carouselInView]);

  // Auto-loop carousel only when visible and autoplay is enabled
  useEffect(() => {
    if (!carouselInView || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselInView, isAutoPlaying]);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

    // Pause autoplay and resume after 3 seconds
    setIsAutoPlaying(false);
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    autoPlayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 3000);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);

    // Pause autoplay and resume after 3 seconds
    setIsAutoPlaying(false);
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    autoPlayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 3000);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentImageIndex ? 1 : -1);
    setCurrentImageIndex(index);

    // Pause autoplay and resume after 3 seconds
    setIsAutoPlaying(false);
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    autoPlayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 3000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 1,
    }),
  };

  return (
    <>
      <style jsx global>{`
        .word {
          display: inline-block;
          white-space: nowrap;
        }
        .char {
          display: inline-block;
        }
      `}</style>
      <section
        ref={ref}
        className="relative w-full overflow-hidden -mt-20 pt-16 pb-2 lg:mt-0 lg:py-16"
        style={{ backgroundColor: SECTION_BG }}
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
          {/* Heading */}
          <div className="flex flex-col items-center mb-6 lg:mb-16">
            <h2 
              ref={titleRef}
              className="font-['TanPearl'] text-[10vw] lg:text-[5rem] xl:text-[6rem] leading-[0.9] mb-6 text-center lg:whitespace-nowrap relative -top-12 lg:-top-24" 
              style={{ color: THEME_COLOR }}
            >
              Robusta vs Americano
            </h2>
          </div>

        {/* Desktop Layout: 3 items - Image - 3 items */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] gap-6 xl:gap-8 items-start">
          {/* Left Column - First 3 items */}
          <div className="space-y-6 xl:space-y-8 pt-8">
            {reasons.slice(0, 3).map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 text-right"
              >
                <div className="flex-1">
                  <h3 className="font-display text-xl xl:text-2xl font-semibold mb-2" style={{ color: THEME_COLOR }}>
                    {reason.title}
                  </h3>
                  <p className="reason-description font-serif text-base xl:text-lg leading-relaxed text-black">
                    {reason.description}
                  </p>
                </div>
                <div className="flex-shrink-0 w-14 h-14 xl:w-16 xl:h-16 relative">
                  <Image
                    src={reason.icon}
                    fill
                    alt={reason.title}
                    className="object-contain"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center Image with Carousel */}
          <div ref={carouselRef} className="relative flex flex-col items-center gap-1 -mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, filter: "blur(15px)" }}
              animate={isInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[380px] xl:w-[450px] h-[480px] xl:h-[560px] flex items-center justify-center overflow-hidden"
              style={{ perspective: "1200px" }}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentImageIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 40 },
                    duration: 0.5,
                  }}
                  className="absolute inset-0"
                >
                  <BlurImage
                    src={carouselImages[currentImageIndex]}
                    fill
                    alt="Robusta Coffee"
                    className="object-contain"
                    priority={currentImageIndex === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 380px, 450px"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Desktop Navigation Arrows - Below Image */}
            <div className="flex items-center gap-6">
              <motion.button
                onClick={handlePrevious}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full backdrop-blur-sm transition-all duration-500"
                style={{ 
                  backgroundColor: `${THEME_COLOR}0D`, 
                  color: THEME_COLOR,
                  border: `1px solid ${THEME_COLOR}1A`
                }}
                aria-label="Previous image"
                suppressHydrationWarning
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <div className="flex gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className="w-2 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      backgroundColor: index === currentImageIndex ? THEME_COLOR : `${THEME_COLOR}33`,
                      width: index === currentImageIndex ? '2rem' : '0.5rem'
                    }}
                    aria-label={`Go to image ${index + 1}`}
                    suppressHydrationWarning
                  />
                ))}
              </div>

              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full backdrop-blur-sm transition-all duration-500"
                style={{ 
                  backgroundColor: `${THEME_COLOR}0D`, 
                  color: THEME_COLOR,
                  border: `1px solid ${THEME_COLOR}1A`
                }}
                aria-label="Next image"
                suppressHydrationWarning
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Right Column - Last 3 items */}
          <div className="space-y-6 xl:space-y-8 pt-8">
            {reasons.slice(3, 6).map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 text-left"
              >
                <div className="flex-shrink-0 w-14 h-14 xl:w-16 xl:h-16 relative">
                  <Image
                    src={reason.icon}
                    fill
                    alt={reason.title}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl xl:text-2xl font-semibold mb-2" style={{ color: THEME_COLOR }}>
                    {reason.title}
                  </h3>
                  <p className="reason-description font-serif text-base xl:text-lg leading-relaxed text-black">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Layout: Stacked */}
        <div className="lg:hidden space-y-2">
          {/* Center Image First on Mobile with Side Arrows */}
          <div className="relative flex items-center justify-center gap-3">
            {/* Left Arrow */}
            <motion.button
              onClick={handlePrevious}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full backdrop-blur-sm transition-all duration-500 z-10"
              style={{ 
                backgroundColor: `${THEME_COLOR}0D`, 
                color: THEME_COLOR,
                border: `1px solid ${THEME_COLOR}1A`
              }}
              aria-label="Previous image"
              suppressHydrationWarning
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Image Carousel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, filter: "blur(15px)" }}
              animate={isInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[340px] h-[320px] overflow-hidden"
              style={{ perspective: "1200px" }}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentImageIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 40 },
                    duration: 0.5,
                  }}
                  className="absolute inset-0"
                >
                  <BlurImage
                    src={carouselImages[currentImageIndex]}
                    fill
                    alt="Robusta Coffee"
                    className="object-contain"
                    priority={currentImageIndex === 0}
                    sizes="(max-width: 768px) 100vw, 340px"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Right Arrow */}
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full backdrop-blur-sm transition-all duration-500 z-10"
              style={{ 
                backgroundColor: `${THEME_COLOR}0D`, 
                color: THEME_COLOR,
                border: `1px solid ${THEME_COLOR}1A`
              }}
              aria-label="Next image"
              suppressHydrationWarning
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className="w-2 h-2 rounded-full transition-all duration-500"
                style={{ 
                  backgroundColor: index === currentImageIndex ? THEME_COLOR : `${THEME_COLOR}33`,
                  width: index === currentImageIndex ? '1.5rem' : '0.5rem'
                }}
                aria-label={`Go to image ${index + 1}`}
                suppressHydrationWarning
              />
            ))}
          </div>

          {/* All items stacked */}
          <div className="space-y-5">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-12 h-12 relative">
                  <Image
                    src={reason.icon}
                    fill
                    alt={reason.title}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-base font-semibold mb-1.5" style={{ color: THEME_COLOR }}>
                    {reason.title}
                  </h3>
                  <p className="reason-description font-serif text-sm leading-relaxed text-black">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>

  );
}

export default RobustaVsAmericano;
