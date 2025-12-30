"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { HoverDistortion } from "@/components/effects/HoverDistortion";

export function WhatIsRobusta() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-cover bg-center py-16 lg:py-28 bg-[#D8CBB8]"
      style={{ backgroundImage: "url('/bg-texture.jpg')" }}
    >
      {/* Coffee bean decorative elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="35" ry="48" fill="#404040" transform="rotate(-15 50 50)" />
          <path d="M50 20 Q30 50 50 80" stroke="#8B4513" strokeWidth="3" fill="none" />
        </svg>
      </div>
      <div className="absolute bottom-32 right-16 opacity-10">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="40" ry="52" fill="#404040" transform="rotate(20 50 50)" />
          <path d="M50 15 Q25 50 50 85" stroke="#8B4513" strokeWidth="3" fill="none" />
        </svg>
      </div>
      <div className="absolute top-1/3 right-1/4 opacity-8 hidden lg:block">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="30" ry="42" fill="#404040" transform="rotate(-30 50 50)" />
          <path d="M50 18 Q32 50 50 82" stroke="#8B4513" strokeWidth="2.5" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mb-12 lg:mb-16 px-4"
        >
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-[#404040] mb-6 text-center">
            What is Robusta?
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

        {/* Content Grid - Mobile: Stacked, Desktop: Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Desktop: Image on left */}
          <ImageWithParallax isInView={isInView} />

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 space-y-6 px-4 lg:px-0"
          >
            <p className="font-serif text-lg lg:text-xl xl:text-2xl leading-relaxed text-black">
              Robusta coffee is one of the two main species of coffee beans, known for its bold,
              intense flavor and higher caffeine content. Unlike the milder Arabica, Robusta beans
              deliver a powerful, earthy taste with a distinctive bitter edge that coffee purists
              have come to love.
            </p>

            <p className="font-serif text-lg lg:text-xl xl:text-2xl leading-relaxed text-black">
              At Rabuste, we've mastered the art of dark roasting premium Robusta beans,
              bringing out rich, chocolatey notes with a smooth finish. Our unique roasting
              process ensures maximum flavor extraction while maintaining the bean's
              strength.
            </p>

            {/* Decorative tagline */}
            <div className="pt-4">
              <p className="font-display text-xl lg:text-2xl xl:text-3xl font-semibold text-[#404040] italic">
                Bold. Intense. Uncompromising.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section >
  );
}

// Image with Parallax Component
function ImageWithParallax({ isInView }: { isInView: boolean }) {
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="order-2 lg:order-1 lg:px-0"
    >
      <div className="relative w-full aspect-[3/2] lg:aspect-[4/3] overflow-hidden lg:rounded-lg pointer-events-none lg:pointer-events-auto">
        <motion.div style={{ y, scale: 1.15 }} className="relative w-full h-full">
          <HoverDistortion
            image1="/liquid distortion assets/img_one.jpg"
            image2="/liquid distortion assets/img_two.jpg"
            displacementImage="/liquid distortion assets/4.png"
            intensity={0.5}
            speedIn={1.6}
            speedOut={1.2}
            className="w-full h-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default WhatIsRobusta;
