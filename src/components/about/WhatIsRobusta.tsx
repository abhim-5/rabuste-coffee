"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function WhatIsRobusta() {
  const sectionRef = useRef<HTMLSectionElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    // Initialize Splitting
    Splitting({ target: titleRef.current, by: "chars" });

    const ctx = gsap.context(() => {
      const chars = titleRef.current?.querySelectorAll(".char");
      
      if (chars?.length) {
        gsap.fromTo(chars, { 
            'will-change': 'opacity, transform', 
            opacity: 0, 
            yPercent: 120, 
            scaleY: 2.3, 
            scaleX: 0.7, 
            transformOrigin: '50% 0%' 
        }, 
        {
            duration: 1,
            ease: 'back.inOut(2)',
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            stagger: 0.03,
            scrollTrigger: {
                trigger: titleRef.current,
                start: 'top bottom', // Adjusted start for better visibility check
                end: 'bottom center',
                scrub: true
            }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-[#faeade] text-[#7f3b2d] overflow-hidden"
    >
      <div className="container mx-auto h-full flex flex-col md:flex-row min-h-[80vh]">
        
        {/* Left Content (Text) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-20 gap-8 md:gap-12 relative z-10">
          <h2 
            ref={titleRef}
            data-splitting
            className="text-[12vw] md:text-[6rem] lg:text-[7.5rem] leading-[0.9] text-[#7f3b2d] font-['TanPearl']"
          >
            What is Robusta
          </h2>
          
          <div className="flex flex-col gap-6 text-[#7f3b2d]/80 font-sans text-base md:text-lg leading-relaxed max-w-xl">
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

        {/* Right Content (Image) */}
        <div className="w-full md:w-1/2 relative h-[50vh] md:h-auto overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
             <Image
              src="/what is robusta- image.jpg"
              alt="Raw Robusta Coffee Beans"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
