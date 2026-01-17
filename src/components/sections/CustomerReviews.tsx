"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const reviews = [
    {
        id: 1,
        text: "The ambiance at Rabuste is simply unmatched. It's not just coffee; it's an experience that lingers long after the last sip.",
        name: "Aditi S.",
        rating: 5,
    },
    {
        id: 2,
        text: "I've travelled across Europe tasting coffees, but the Robusta here has a depth and richness that is truly world-class.",
        name: "James Anderson",
        rating: 5,
    },
    {
        id: 3,
        text: "The workshops opened my eyes to the art of brewing. The passion this team has for coffee is contagious and inspiring.",
        name: "Priya M.",
        rating: 4.5,
    },
    {
        id: 4,
        text: "Finally, a place that takes coffee seriously without being pretentious. The perfect spot for both work and deep conversations.",
        name: "Rahul K.",
        rating: 5,
    },
];

export default function CustomerReviews() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useGSAP(() => {
        if (!titleRef.current || !containerRef.current) return;

        const words = titleRef.current.querySelectorAll('.word');

        // Effect 29: Alternating Scale (Discipline above Motivation Always)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom-=20%", // Animate as it enters view
                end: "bottom center", 
                scrub: 1,
            }
        });

        // Loop through words to apply specific Effect 29 logic
        words.forEach((word, pos) => {
            const chars = word.querySelectorAll('.char');
            
            tl.fromTo(chars, {
                willChange: 'transform', 
                // Alternating origin: even words (0, 2) from Top-Right (100% 0%), odd (1) from Bottom-Left (0% 100%)
                // Matches index2.js logic: pos%2 ? 0 : 100, pos%2 ? 100 : 0
                transformOrigin: `${pos % 2 ? 0 : 100}% ${pos % 2 ? 100 : 0}%`,
                scale: 0
            }, 
            {
                ease: 'power4',
                scale: 1,
                stagger:  {
                    each: 0.05,
                    from: pos % 2 ? 'end' : 'start'
                },
            }, 0); 
        });

    }, { scope: containerRef });

    const nextReview = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    return (
        <section
            ref={containerRef}
            className="relative w-full pt-24 pb-12 overflow-hidden flex flex-col items-center justify-center text-[#404040]"
            style={{ 
                backgroundColor: "#e3a458",
            }}
        >
            {/* Cinematic Overlay - Reduced to avoid darkening the solid color too much */}
             <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/5 to-black/10 pointer-events-none" />

            {/* Animated Heading (Effect 29: Verified "Discipline above...") */}
            <div className="relative z-10 w-full overflow-hidden py-4 mb-4 flex justify-center">
                <h2 
                    ref={titleRef} 
                    className="font-['TanPearl'] text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter text-[#7f3b2d] flex gap-4 md:gap-6 flex-wrap justify-center leading-none"
                >
                    {["Reviews", "of", "Customer"].map((word, wordIndex) => (
                        <span key={wordIndex} className="word inline-block">
                            {word.split("").map((char, charIndex) => (
                                <span key={charIndex} className="char inline-block" style={{ minWidth: "0.05em" }}>
                                    {char}
                                </span>
                            ))}
                        </span>
                    ))}
                </h2>
            </div>

            {/* Review Content */}
            <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center">
                <Quote className="w-12 h-12 text-[#7f3b2d]/20 mb-6" />

                <div className="relative w-full min-h-[200px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="flex flex-col items-center"
                        >
                            <p className="font-serif text-xl md:text-3xl leading-relaxed text-[#2a2a2a] mb-6">
                                "{reviews[currentIndex].text}"
                            </p>
                            
                            <div className="flex items-center gap-1 text-[#7f3b2d] mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-5 h-5 ${i < Math.floor(reviews[currentIndex].rating) ? "fill-current" : "opacity-30"}`} 
                                    />
                                ))}
                            </div>

                            <h3 className="font-display text-lg md:text-2xl font-bold text-[#7f3b2d]">
                                - {reviews[currentIndex].name}
                            </h3>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-8 mt-10">
                    <button 
                        onClick={prevReview}
                        className="p-3 rounded-full border border-[#7f3b2d]/20 text-[#7f3b2d] hover:bg-[#7f3b2d] hover:text-[#faeade] transition-all duration-300 hover:scale-110"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={nextReview}
                        className="p-3 rounded-full border border-[#7f3b2d]/20 text-[#7f3b2d] hover:bg-[#7f3b2d] hover:text-[#faeade] transition-all duration-300 hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Franchise Inquiry Button */}
                <div className="mt-12">
                   <Link href="/about-us#franchise-inquiry">
                        <button className="px-8 py-3 bg-[#7f3b2d] text-[#faeade] rounded-full font-display text-xl hover:bg-[#5e2b21] transition-all duration-300 hover:scale-105 shadow-lg">
                            Own our Franchise
                        </button>
                   </Link>
                </div>
            </div>

        </section>
    );
}
