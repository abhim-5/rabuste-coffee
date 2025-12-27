'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Circle, Coffee } from 'lucide-react';

import BlurImage from '@/components/ui/BlurImage';

const images = [
  '/about us/1.jpg',
  '/about us/2.jpg',
  '/about us/3.jpg',
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const heroContent = [
  {
    title: "OUR ORIGINS",
    text: "Born in the heart of Surat, Rabuste is more than a cafe—it's a movement. We introduced the city to the intense, unapologetic soul of authentic dark roast Robusta, crafting a legacy one bold cup at a time."
  },
  {
    title: "THE CRAFT",
    text: "We don't just brew coffee; we curate experiences. From our signature 'Bold Brew' to artisanal lattes, every sip is a testament to our obsession with quality and our mastery of the dark roast."
  },
  {
    title: "THE COMMUNITY",
    text: "Rabuste is the gathering ground for the dreamers, the doers, and the creators. We are a hub where caffeine meets creativity, fostering connections and fueling the passions of our vibrant community."
  }
];

const AboutHero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* ... existing image slider code ... */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          // ...
          className="absolute inset-0 h-full w-full"
        >
          <BlurImage
            src={images[currentIndex]}
            alt={`About Us Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40">
            <div className="grain-texture h-full w-full" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay - Centered like Homepage */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 pt-20 text-center lg:px-8">
        {/* Title */}
        <motion.h1
          key={`title-${currentIndex}`}
          initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display tracking-wide text-white text-[clamp(2.5rem,8vw,6rem)] leading-tight drop-shadow-2xl uppercase"
        >
          {heroContent[currentIndex].title}
        </motion.h1>

        {/* Divider with icon */}
        <motion.div
          key={`divider-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.8, filter: "blur(15px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 mb-8 flex items-center gap-4 text-white/90"
        >
          <span className="h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <Coffee className="h-6 w-6" />
          <span className="h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </motion.div>

        {/* Subtext */}
        <motion.p
          key={`text-${currentIndex}`}
          initial={{ opacity: 0, y: 30, filter: "blur(15px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif mx-auto max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl"
        >
          {heroContent[currentIndex].text}
        </motion.p>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-20"
        aria-label="Previous slide"
        suppressHydrationWarning
      >
        <ChevronLeft size={48} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white/10 rounded-full transition-all z-20"
        aria-label="Next slide"
        suppressHydrationWarning
      >
        <ChevronRight size={48} />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${index === currentIndex ? 'scale-125 text-white' : 'text-white/50 hover:text-white/80'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <Circle
              size={12}
              fill={index === currentIndex ? "currentColor" : "transparent"}
              strokeWidth={2}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default AboutHero;
