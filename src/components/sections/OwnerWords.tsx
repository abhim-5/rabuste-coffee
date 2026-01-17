"use client";

import BlurImage from "@/components/ui/BlurImage";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

gsap.registerPlugin(ScrollTrigger);

export function OwnerWords() {
  const ref = useRef(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Parallax effect for the image
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  useEffect(() => {
    // 1. Initialize Splitting for Heading (Words + Chars)
    if (headingRef.current) {
        // Reset if already split to prevent duplication/errors on re-renders
        if (headingRef.current.querySelector('.word')) return;
        
        Splitting({ target: headingRef.current, by: "chars" });
    }
    
    // 2. Initialize Splitting for Paragraphs (Words only)
    if (paragraphContainerRef.current) {
        const paragraphs = paragraphContainerRef.current.querySelectorAll('p');
        paragraphs.forEach(p => {
             if (p.querySelector('.word')) return; // Skip if already split
             Splitting({ target: p, by: "words" });
        });
    }

    const ctx = gsap.context(() => {
        // give it a tick to ensure DOM updates
        setTimeout(() => {
            // --- Effect 28 (Liberation) for Heading ---
            if (headingRef.current) {
                const words = headingRef.current.querySelectorAll('.word');
                
                // Ensure words and chars display correctly for transforms
                gsap.set(words, { display: 'inline-block', verticalAlign: 'top', margin: '0 0.2em' });
                const allChars = headingRef.current.querySelectorAll('.char');
                gsap.set(allChars, { display: 'inline-block' });

                words.forEach(word => {
                    const chars = word.querySelectorAll('.char');
                    if (!chars.length) return;
                    
                    const charsTotal = chars.length;
                    
                    gsap.fromTo(chars, {
                        'will-change': 'transform, filter', 
                        transformOrigin: '50% 100%',
                        scale: position => {
                            const factor = position < Math.ceil(charsTotal/2) ? position : Math.ceil(charsTotal/2) - Math.abs(Math.floor(charsTotal/2) - position) - 1;
                            return gsap.utils.mapRange(0, Math.ceil(charsTotal/2), 0.5, 2.1, factor);
                        },
                        y: position => {
                            const factor = position < Math.ceil(charsTotal/2) ? position : Math.ceil(charsTotal/2) - Math.abs(Math.floor(charsTotal/2) - position) - 1;
                            return gsap.utils.mapRange(0, Math.ceil(charsTotal/2), 0, 60, factor);
                        },
                        rotation: position => {
                            const factor = position < Math.ceil(charsTotal/2) ? position : Math.ceil(charsTotal/2) - Math.abs(Math.floor(charsTotal/2) - position) - 1;
                            return position < charsTotal/2 ? gsap.utils.mapRange(0, Math.ceil(charsTotal/2), -4, 0, factor) : gsap.utils.mapRange(0, Math.ceil(charsTotal/2), 0, 4, factor);
                        },
                        filter: 'blur(12px) opacity(0)',
                    }, 
                    {
                        ease: 'power2.inOut',
                        y: 0,
                        rotation: 0,
                        scale: 1,
                        filter: 'blur(0px) opacity(1)',
                        scrollTrigger: {
                            trigger: headingRef.current,
                            start: 'top bottom-=10%',
                            end: 'bottom center',
                            scrub: true,
                        },
                        stagger: {
                            amount: 0.15,
                            from: 'center'
                        }
                    });
                });
            }

            // --- Paragraph Animation (Staggered Words) ---
            if (paragraphContainerRef.current) {
                const paragraphs = paragraphContainerRef.current.querySelectorAll('p');
                paragraphs.forEach(p => {
                    const words = p.querySelectorAll('.word');
                    // Style words for spacing
                    gsap.set(words, { display: 'inline-block', verticalAlign: 'top', margin: '0 0.15em' });
                    
                    if (words.length) {
                        gsap.fromTo(words, {
                            opacity: 0.1,
                            willChange: 'opacity'
                        }, 
                        {
                            ease: 'none',
                            opacity: 1,
                            stagger: 0.05,
                            scrollTrigger: {
                                trigger: p,
                                start: 'top bottom-=5%',
                                end: 'bottom center+=10%',
                                scrub: true,
                            }
                        });
                    }
                });
            }
        }, 100); // reduced timeout 

    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full py-20 lg:py-32 overflow-hidden bg-[#faeade]"
    >
      {/* Background Textures */}
      
      {/* 1. Grain Texture */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />
      
      {/* 2. Delicate Floral/Organic Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply" />

      {/* 3. Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(127,59,45,0.03)_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left: The Image (5 cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              animate={isInView ? { opacity: 1, clipPath: "inset(0 0% 0 0)" } : {}}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border border-[#7f3b2d]/20"
            >
               {/* Decorative border frame offset */}
               <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#fff9ea]/30 z-20 pointer-events-none" />
               
               <motion.div style={{ y }} className="relative w-full h-[120%] -top-[10%]">
                 <BlurImage
                    src="/about us/owner_pic.png" // Use actual path
                    alt="Vaibhav Sutaria - Founder"
                    fill
                    className="object-cover"
                 />
               </motion.div>
            </motion.div>
            
            {/* Name Tag Floating */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute -bottom-6 -right-6 bg-[#7f3b2d] text-[#faeade] py-4 px-8 rounded-tr-3xl rounded-bl-3xl shadow-xl z-30"
            >
                <h3 className="font-tan-pearl text-xl lg:text-2xl tracking-wide">
                    Vaibhav Sutaria
                </h3>
                <p className="font-serif text-xs uppercase tracking-[0.2em] opacity-80 mt-1 text-center">
                    Founder & Curator
                </p>
            </motion.div>
          </div>

          {/* Right: The Words (7 cols) */}
          <div className="lg:col-span-7 space-y-8 lg:pl-10">
            
            {/* Header */}
            <div className="relative">
                <h2 ref={headingRef} className="font-tan-pearl text-4xl lg:text-7xl text-[#7f3b2d] leading-[0.9] lowercase mb-6">
                    words from the <br/> owner
                </h2>
            </div>

            {/* Letter Content */}
            <div 
                ref={paragraphContainerRef}
                className="relative space-y-6 text-lg lg:text-xl font-serif text-[#7f3b2d]/80 leading-relaxed"
            >
                {/* Background Quote Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] lg:text-[12rem] font-tan-pearl text-[#7f3b2d] opacity-[0.07] select-none pointer-events-none blur-[2px] z-0 leading-none font-bold">
                    "
                </div>

                <p className="relative z-10">
                    Welcome to Rabuste Coffee. What started as a simple passion for the bold, intense flavors of Robusta has grown into a movement. We wanted to challenge the status quo and prove that coffee doesn't always have to be subtle—it can be loud, proud, and unapologetically bold.
                </p>
                <p className="relative z-10">
                    We believe that every cup tells a story. From the farmers who nurture the bean to the barista who crafts the brew, it's a journey of dedication. Our mission is to share this authentic experience with you, one sip at a time.
                </p>
                
                {/* Signature Image or Text (No animation needed, static is fine or simple fade) */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.8 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="pt-8 opacity-80"
                >
                     <p className="font-handwriting text-3xl text-[#7f3b2d]">
                        Vaibhav Sutaria
                     </p>
                </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default OwnerWords;
