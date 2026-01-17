"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function WhatIsRobusta() {
  const sectionRef = useRef<HTMLSectionElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null); // Ref for paragraphs
  
  // Parallax Logic
  const imageContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90
  });

  const y = useTransform(smoothProgress, [0, 1], ["20%", "-20%"]);

  useEffect(() => {
    if (!titleRef.current || !textContainerRef.current) return;

    // Helper to init splitting
    const initSplitting = (el: HTMLElement, by: string) => {
        // Check for specific children class based on 'by' type to avoid double init
        const checkClass = by.includes('chars') ? '.char' : '.word';
        if (el.querySelectorAll(checkClass).length === 0) {
            Splitting({ target: el, by: by });
        }
    };

    initSplitting(titleRef.current, "chars");
    initSplitting(textContainerRef.current, "words");

    const ctx = gsap.context(() => {
      
      // --- Title Animation (Set 1, Effect 2: Stretchy Reveal) ---
      const titleChars = titleRef.current?.querySelectorAll('.char');
      if (titleChars?.length) {
          gsap.set(titleChars, { 
            opacity: 0, 
            yPercent: 120, 
            scaleY: 2.3, 
            scaleX: 0.7, 
            transformOrigin: '50% 0%',
            willChange: 'opacity, transform',
            display: 'inline-block' 
          });

          gsap.to(titleChars, {
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

      // --- Paragraph Animation (Set 2, Effect 1: Word Opacity Fade) ---
      const paragraphWords = textContainerRef.current?.querySelectorAll(".word");
      if (paragraphWords?.length) {
        gsap.set(paragraphWords, { opacity: 0.1, willChange: 'opacity' });
        
        gsap.fromTo(paragraphWords, {
            opacity: 0.1
        }, 
        {
            ease: 'none',
            opacity: 1,
            stagger: 0.02,
            scrollTrigger: {
                trigger: textContainerRef.current,
                start: 'top bottom-=10%',
                end: 'bottom center+=10%',
                scrub: true,
            }
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style jsx>{`
        .word {
          display: inline-block;
          white-space: nowrap;
        }
        .char {
          display: inline-block;
        }
      `}</style>
      <section 
        ref={sectionRef} 
        className="w-full bg-[#faeade] text-[#7f3b2d] overflow-hidden"
      >
      <div className="w-full h-full flex flex-col md:flex-row min-h-[80vh]">
        
        {/* Left Content (Text) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-20 gap-8 md:gap-12 relative z-10 order-1 md:order-1">
          <h2 
            ref={titleRef}
            className="text-[12vw] md:text-[6rem] lg:text-[7.5rem] leading-[0.9] text-[#7f3b2d] font-['TanPearl'] relative -top-12 md:-top-35"
          >
            What is Robusta
          </h2>
          
          <div 
            ref={textContainerRef}
            className="flex flex-col gap-6 text-[#7f3b2d]/80 font-sans text-base md:text-lg leading-relaxed max-w-xl"
          >
            <p>
              Robusta coffee, originating from the Coffea canephora plant, creates a bold statement in every cup. 
              Unlike its delicate cousin Arabica, Robusta thrives in lower altitudes and hotter climates, 
              developing a strong, full-bodied profile with distinctive earthy and nutty notes.
            </p>
            <p>
              Packed with nearly double the caffeine and rich in antioxidants, it produces a thick, 
              golden crema that is essential for the perfect espresso. It is coffee solely defined by strength, 
              resilience, and an unapologetically intense flavor.
            </p>
          </div>
        </div>

        {/* Right Content (Image) with Parallax */}
        <div 
            ref={imageContainerRef}
            className="w-full md:w-1/2 relative h-[50vh] md:h-auto overflow-hidden order-2 md:order-2"
        >
          <motion.div 
            style={{ y, scale: 1.5 }} 
            className="absolute inset-0 w-full h-full"
          >
             <Image
              src="/what is robusta- image.jpg"
              alt="Raw Robusta Coffee Beans"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>

      </div>
    </section>
    </>
  );
}
