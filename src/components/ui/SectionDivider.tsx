"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface SectionDividerProps {
  backgroundColor?: string;
  themeColor?: string;
}

export default function SectionDivider({ 
  backgroundColor = "#e3a458", 
  themeColor = "#7f3b2d" 
}: SectionDividerProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Animate the path's horizontal position to create a "wave" effect on scroll
  // Increased range from ["-10%", "10%"] to ["-30%", "30%"] for more sensitivity
  const x = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);

  return (
    <div 
      ref={containerRef}
      className="w-full py-12 lg:py-20 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="w-full h-12 lg:h-20">
        <motion.svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="w-[150%] h-full ml-[-25%]" // Wider than 100% to allow for horizontal movement
          style={{ color: `${themeColor}33`, x }}
        >
          <motion.path
            d="M-200,30 C50,30 150,10 300,10 C450,10 550,50 700,50 C850,50 950,10 1100,10 C1250,10 1350,30 1500,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="4" // Slightly bolder
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </motion.svg>
      </div>
    </div>
  );
}
