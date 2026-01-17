"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

gsap.registerPlugin(ScrollTrigger);

const ArtGallery = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const heading1Ref = useRef<HTMLSpanElement>(null);
    const heading2Ref = useRef<HTMLSpanElement>(null);
    const heading3Ref = useRef<HTMLSpanElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // --- Effect 22 Logic for Headings (Dance) ---
        const headingEls = [heading1Ref.current, heading2Ref.current, heading3Ref.current].filter(Boolean);
        
        headingEls.forEach((el) => {
            if (!el) return;
            Splitting({ target: el, by: "chars" });
            const words = el.querySelectorAll('.word');
            
            words.forEach(word => {
                const chars = word.querySelectorAll('.char');
                const charsTotal = chars.length;
                chars.forEach(char => {
                    const parent = char.parentNode as HTMLElement;
                    if (parent) gsap.set(parent, { perspective: 1000 });
                });

                gsap.fromTo(chars, {
                    'will-change': 'transform', 
                    x: (i) => {
                        const factor = i < Math.ceil(charsTotal/2) ? i : Math.ceil(charsTotal/2) - Math.abs(Math.floor(charsTotal/2) - i) - 1;
                        return (charsTotal%2 ? Math.abs(Math.ceil(charsTotal/2)-1-factor) : Math.abs(Math.ceil(charsTotal/2)-factor) )*200*(i < charsTotal/2 ? -1 : 1);
                    },
                    y: (i) => {
                        const factor = i < Math.ceil(charsTotal/2) ? i : Math.ceil(charsTotal/2) - Math.abs(Math.floor(charsTotal/2) - i) - 1;
                        return factor*60;
                    },
                    rotationY: -270,
                    rotationZ: (i) => {
                        const factor = i < Math.ceil(charsTotal/2) ? i : Math.ceil(charsTotal/2) - Math.abs(Math.floor(charsTotal/2) - i) - 1;
                        return i < charsTotal/2 ? Math.abs(factor-charsTotal/2)*8 : -1*Math.abs(factor-charsTotal/2)*8;
                    }
                }, {
                    ease: 'power2.inOut',
                    x: 0,
                    y: 0,
                    rotationZ: 0,
                    rotationY: 0,
                    scale: 1,
                    scrollTrigger: {
                        trigger: ".heading-wrap", // Shared trigger for sync
                        start: 'top bottom+=40%',
                        end: 'top top+=15%',
                        scrub: true,
                    }
                });
            });
        });

        // --- Effect 25 Logic for Text (Stretchy Reveal) ---
        if (textRef.current) {
            Splitting({ target: textRef.current, by: "chars" });
            const chars = textRef.current.querySelectorAll('.char');
            
            gsap.fromTo(chars, {
                'will-change': 'transform',
                transformOrigin: '50% 100%',
                scaleY: 0,
                opacity: 0
            }, {
                ease: 'power3.in',
                opacity: 1,
                scaleY: 1,
                stagger: 0.05,
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top center-=10%', // Trigger later to allow heading to finish
                    end: '+=150%', 
                    scrub: true,
                    pin: containerRef.current,
                }
            });
        }
    }, { scope: containerRef });

    return (
        <section 
            id="art-gallery-section"
            ref={containerRef}
            className="w-full py-24 lg:py-40 bg-[#faeade] text-[#7f3b2d] overflow-hidden flex flex-col items-center"
        >
            <div className="container mx-auto px-4 flex flex-col items-center gap-12 lg:gap-20">
                
                {/* Heading: Rabuste | Presents | Art Gallery */}
                <div className="heading-wrap flex flex-col items-center text-center gap-4 lg:gap-8">
                    <span 
                        ref={heading1Ref}
                        className="font-tan-pearl text-6xl md:text-8xl lg:text-[10rem] leading-[0.8] block"
                        data-splitting
                    >
                        Rabuste
                    </span>
                    <span 
                        ref={heading2Ref}
                        className="font-tan-pearl text-2xl md:text-3xl lg:text-[3.5rem] leading-[0.8] block opacity-60"
                        data-splitting
                    >
                        Presents
                    </span>
                    <span 
                        ref={heading3Ref}
                        className="font-tan-pearl text-6xl md:text-8xl lg:text-[10rem] leading-[0.8] block"
                        data-splitting
                    >
                        Art Gallery
                    </span>
                </div>

                {/* Text Content: Effect 25 */}
                <div 
                    ref={textRef}
                    className="max-w-4xl text-center px-4"
                >
                    <p 
                        className="font-display text-xl md:text-3xl lg:text-4xl leading-tight font-medium tracking-tight"
                        data-splitting
                    >
                        Art connects the soul to the divine, expressing emotions that words cannot capture. Experience the vibrant heritage and rhythm of life through our curated collection. Every piece tells a story of tradition and the shared human spirit.
                    </p>
                </div>

                {/* Explore Now Button */}
                <div className="mt-2 lg:mt-4">
                    <Link href="/gallery">
                        <button className="group relative">
                            <div className="absolute inset-0 bg-[#222123] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative font-tan-pearl text-2xl lg:text-4xl text-[#faeade] bg-[#222123] px-10 lg:px-16 py-4 lg:py-6 rounded-full hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl leading-none">
                                Explore Now
                            </div>
                        </button>
                    </Link>
                </div>
            </div>
            
            <style jsx global>{`
                .splitting .word {
                    display: inline-block;
                    white-space: nowrap;
                    margin-right: 0.25em; /* Normal word spacing */
                }
                .splitting .char {
                    display: inline-block;
                    will-change: transform, opacity;
                    letter-spacing: -0.07em; /* Even tighter letter gap */
                }
            `}</style>
        </section>
    );
};

export default ArtGallery;
