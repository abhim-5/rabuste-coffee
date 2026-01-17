"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useRef } from "react";
import Link from "next/link";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

gsap.registerPlugin(ScrollTrigger);

interface ClipPathLabelProps {
    title: string;
    color: string;
    bg: string;
    className: string;
    borderColor?: string;
}

const ClipPathLabel = ({ title, color, bg, className, borderColor = "#222123" }: ClipPathLabelProps) => {
    return (
        <div className="flex justify-center w-full mb-0"> {/* Margin removed for direct control via translate-y */}
            <div
                style={{
                    clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
                    borderColor: borderColor,
                    opacity: 0
                }}
                className={`${className} border-[2px] lg:border-[5.5px] text-nowrap overflow-hidden rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer`}
            >
                <div 
                    className="pb-3 lg:pb-5 px-6 lg:px-14 pt-3 lg:pt-4" 
                    style={{ backgroundColor: bg }}
                >
                    <h2 
                        className="font-antonio text-4xl lg:text-7xl xl:text-8xl font-bold uppercase tracking-tight"
                        style={{ color: color }}
                    >
                        {title}
                    </h2>
                </div>
            </div>
        </div>
    );
};

const MenuLabels = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const labelsData = [
        { title: "Robusta Cold", bg: "#c88e64", color: "#faeade" },
        { title: "Robusta Hot", bg: "#7f3b2d", color: "#faeade" },
        { title: "Blend Cold", bg: "#222123", color: "#faeade" },
        { title: "Blend Hot", bg: "#FED775", color: "#7f3b2d" },
        { title: "Manual Brew", bg: "#c88e64", color: "#faeade" },
        { title: "Shakes & Tea", bg: "#7f3b2d", color: "#faeade" },
        { title: "Food", bg: "#222123", color: "#faeade" },
    ];

    useGSAP(async () => {
        // Dynamically import Splitting to avoid SSR issues
        const Splitting = (await import("splitting")).default;
        
        // 1. Heading Animation (3D Fly-In)
        if (headingRef.current) {
            // Force a re-init of Splitting to be safe
            Splitting({ target: headingRef.current, by: "chars" });
            
            const chars = headingRef.current.querySelectorAll('.char');
            chars.forEach(char => {
                const parent = char.parentNode as HTMLElement;
                if (parent) {
                    gsap.set(parent, { perspective: 2000 });
                }
            });

            gsap.fromTo(chars, {
                opacity: 0,
                y: (i, _, arr) => -40 * Math.abs(i - arr.length / 2),
                z: () => gsap.utils.random(-1500, -600),
                rotationX: () => gsap.utils.random(-500, -200)
            }, {
                opacity: 1,
                y: 0,
                z: 0,
                rotationX: 0,
                stagger: {
                    each: 0.05,
                    from: "center"
                },
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 70%",
                    end: "top 20%",
                    scrub: 1.2,
                }
            });
        }

        // 2. Labels Reveal Timeline (Faster)
        const labelsTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".labels-container",
                start: "top 65%",
                end: "top 10% ", // Faster completion
                scrub: 1.5,
            }
        });

        labelsData.forEach((_, index) => {
            labelsTl.to(`.label-${index}`, {
                duration: 0.6,
                opacity: 1,
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                ease: "power2.out"
            });
        });

    }, { scope: containerRef });

    return (
        <section 
            id="menu-section"
            ref={containerRef}
            className="w-full py-20 lg:py-40 overflow-hidden flex flex-col items-center bg-[#faeade]"
        >
            <div className="container mx-auto px-4 flex flex-col items-center">
                {/* Heading */}
                <div className="mb-24 lg:mb-32 overflow-visible">
                    <h1 
                        ref={headingRef}
                        className="font-tan-pearl text-5xl md:text-8xl lg:text-9xl xl:text-[11rem] text-[#7f3b2d] text-center lowercase leading-none whitespace-nowrap"
                    >
                        Our menu
                    </h1>
                </div>

                {/* Animated Labels */}
                <div className="labels-container flex flex-col items-center w-full max-w-6xl">
                    {labelsData.map((label, index) => {
                        let rotation = 'rotate-[3deg]';
                        let translate = '';
                        
                        // Precise transformations for overlapping look
                        if (index === 0) { rotation = 'rotate-[3.2deg]'; translate = 'translate-y-0'; }
                        if (index === 1) { rotation = 'rotate-[-1.5deg]'; translate = '-translate-y-2 md:-translate-y-4'; }
                        if (index === 2) { rotation = 'rotate-[1.8deg]'; translate = '-translate-y-4 md:-translate-y-8'; }
                        if (index === 3) { rotation = 'rotate-[-4.5deg]'; translate = '-translate-y-6 md:-translate-y-12'; }
                        if (index === 4) { rotation = 'rotate-[2.5deg]'; translate = '-translate-y-8 md:-translate-y-16'; }
                        if (index === 5) { rotation = 'rotate-[-1.2deg]'; translate = '-translate-y-10 md:-translate-y-20'; }
                        if (index === 6) { rotation = 'rotate-[3.5deg]'; translate = '-translate-y-12 md:-translate-y-24'; }

                        return (
                            <div 
                                key={index} 
                                className={`relative ${rotation} ${translate} w-min block`}
                                style={{ zIndex: 10 - index }}
                            >
                                <ClipPathLabel
                                    title={label.title}
                                    color={label.color}
                                    bg={label.bg}
                                    className={`label-${index}`}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Order Now Button */}
                <div className="mt-8 lg:mt-12 z-20"> {/* Increased gap (switched to positive margin) */}
                    <Link href="/menu">
                        <button className="group relative" suppressHydrationWarning>
                            <div className="absolute inset-0 bg-[#222123] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative font-tan-pearl text-2xl lg:text-4xl text-[#faeade] bg-[#222123] px-10 lg:px-16 py-4 lg:py-6 rounded-full hover:rotate-[2deg] transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 leading-none">
                                Order Now
                            </div>
                        </button>
                    </Link>
                </div>
            </div>
            
            <style jsx global>{`
                .splitting .char {
                    display: inline-block;
                    will-change: transform, opacity;
                }
                .splitting .word {
                    display: inline-block;
                    perspective: 2000px;
                }
            `}</style>
        </section>
    );
};

export default MenuLabels;
