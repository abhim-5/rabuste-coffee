'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Image from 'next/image';

const timelineData = [
    {
        year: '2023',
        title: 'The Inception',
        description: 'Rabuste Coffee opened its doors in Surat, introducing the city to its first-ever authentic dark roast Robusta experience. A humble beginning with a bold vision.',
        image: '/about us/1.jpg',
        context: 'Genesis'
    },
    {
        year: '2023-Q4',
        title: 'First 1000 Cups',
        description: 'Within months, the aroma of our bold brew captivated the neighborhood. We celebrated serving our 1000th cup, marking the start of a loyal community.',
        image: '/about us/2.jpg',
        context: 'Milestone'
    },
    {
        year: '2024',
        title: 'Menu Expansion',
        description: 'We expanded our menu to include artisanal lattes and our signature "Bold Brew" series, catering to both purists and experimental coffee lovers.',
        image: '/about us/3.jpg',
        context: 'Evolution'
    },
    {
        year: '2024-Q3',
        title: 'Community Hub',
        description: 'Rabuste became more than a cafe; it became a hub for artists, thinkers, and friends. We hosted our first art workshop, blending coffee culture with creativity.',
        image: '/about us/1.jpg',
        context: 'Culture'
    },
    {
        year: 'Today',
        title: 'A Growing Legacy',
        description: 'Continuing to redefine the coffee scene, we are now a landmark for Robusta lovers. The journey is just beginning.',
        image: '/about us/2.jpg',
        context: 'Future'
    }
];

const TimelineItem = ({ data, index }: { data: typeof timelineData[0], index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const isEven = index % 2 === 0;

    const imgRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: imgRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 400,
        damping: 90
    });

    const y = useTransform(smoothProgress, [0, 1], ["20%", "-20%"]);

    return (
        <div ref={ref} className={`flex justify-between items-center w-full mb-32 ${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Content Side Spacer with Context Nodes */}
            <div className="w-[45%] hidden md:flex justify-center items-center relative h-full min-h-[100px]">
                {/* Ghost Date */}
                <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute text-[10rem] font-bold text-[#8B6F47]/20 font-display select-none"
                >
                    {data.year.split('-')[0]}
                </motion.span>

                {/* Floating Keywords/Deco */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 8 } : {}} // Increased opacity for visibility
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="absolute flex flex-col items-center gap-2 transform"
                >
                    <span className="w-1 h-12 bg-gradient-to-b from-transparent via-[#8B6F47] to-transparent" />
                    <span className="font-serif text-[#8B6F47] tracking-[0.3em] text-xl uppercase font-bold text-center">
                        {data.context}
                    </span>
                </motion.div>
            </div>

            {/* Cinematic Timeline Node */}
            <motion.div
                initial={{ scale: 0, boxShadow: "0 0 0px rgba(44, 26, 16, 0)" }}
                animate={isInView ? { scale: 1, boxShadow: "0 0 20px rgba(44, 26, 16, 0.4)" } : {}}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-[#D8CBB8] bg-[#4A3425] z-20 shadow-[0_0_15px_rgba(74,52,37,0.5)]"
            >
                <div className="absolute inset-0 bg-[#2C1A10] animate-ping rounded-full opacity-20" />
            </motion.div>

            {/* Card Side */}
            <div className={`w-full md:w-[45%] flex ${isEven ? 'justify-start' : 'justify-end'}`}>
                <motion.div
                    initial={{ opacity: 0, x: isEven ? -100 : 100, rotateY: isEven ? -15 : 15 }}
                    animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // Cinematic easing
                    className="relative group w-full max-w-lg perspective-1000"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#7f3b2d] to-[#BC9F75] rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />

                    <div className="relative bg-[#faeade]/90 backdrop-blur-xl p-6 lg:p-8 rounded-xl shadow-2xl border border-white/40 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]">

                        {/* Subtle Grain Overlay on Card */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

                        {/* Image Container with Parallax Effect */}
                        <div ref={imgRef} className="relative w-full h-56 mb-6 rounded-lg overflow-hidden shadow-inner">
                            <div className="absolute inset-0 bg-[#8B6F47]/10 z-10 mix-blend-overlay" />
                            <motion.div style={{ y, scale: 1.5 }} className="relative w-full h-full">
                                <Image
                                    src={data.image}
                                    alt={data.title}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>

                        <div className="relative z-10">
                            <span className="inline-block px-4 py-1 bg-gradient-to-r from-[#8B6F47] to-[#6F4E28] text-[#EBE3D9] text-sm font-bold tracking-widest uppercase rounded-full mb-4 shadow-md">
                                {data.year}
                            </span>
                            <h3 className="font-display text-3xl lg:text-4xl font-bold text-[#404040] mb-3 drop-shadow-sm">
                                {data.title}
                            </h3>
                            <p className="font-serif text-[#5C5C5C] leading-relaxed text-lg">
                                {data.description}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Mobile Timeline Item
const MobileTimelineItem = ({ data, index }: { data: typeof timelineData[0], index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

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
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex gap-6 mb-16 relative"
        >
            {/* Glowing Thread Line */}
            <div className="absolute left-[19px] top-8 bottom-[-64px] w-0.5 bg-gradient-to-b from-[#8B6F47] to-transparent last:hidden opacity-50" />

            <div className="flex-shrink-0 mt-2 z-10">
                <div className="w-10 h-10 rounded-full border-2 border-[#D8CBB8] bg-[#8B6F47] shadow-[0_0_10px_rgba(139,111,71,0.4)] flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#EBE3D9] rounded-full" />
                </div>
            </div>

            <div className="relative bg-[#faeade]/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/30 flex-grow">
                <div className="relative w-full h-48 mb-5 rounded-lg overflow-hidden shadow-sm">
                    <motion.div style={{ y, scale: 1.5 }} className="relative w-full h-full">
                        <Image
                            src={data.image}
                            alt={data.title}
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </div>
                <span className="text-[#8B6F47] font-bold text-sm tracking-wider uppercase block mb-2">{data.year}</span>
                <h3 className="font-display text-2xl font-bold text-[#404040] mb-2">{data.title}</h3>
                <p className="font-serif text-[#5C5C5C] leading-relaxed">{data.description}</p>
            </div>
        </motion.div>
    )
}

// Professional Espresso Machine Image Component
const CoffeeMachine = ({ progress }: { progress: any }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 -top-36 z-30 w-64 h-60 lg:w-[22rem] lg:h-[22rem]"
        >
            <div className="relative w-full h-full drop-shadow-2xl">
                <Image
                    src="/coffee-machine.png"
                    alt="Professional Espresso Machine"
                    fill
                    className="object-contain"
                    priority
                />
                
                {/* Coffee Dripping Animation aligned with image */}
                <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    {[0, 1].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-4 bg-gradient-to-b from-[#4A2C17] to-[#2C1A10] rounded-full shadow-lg"
                            initial={{ opacity: 0, y: 0 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                y: [0, 20, 40, 60],
                                scaleY: [1, 1.3, 1, 0.8],
                                scaleX: [1, 0.8, 1, 1.2]
                            }}
                            transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                delay: i * 0.5,
                                ease: "easeIn"
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// Coffee Cup using Rabuste Logo - Coffee pours into it
const CoffeeCup = ({ progress }: { progress: any }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    // Transform progress to create filling effect
    const fillProgress = useTransform(progress, [0.8, 1], [0, 1]);

    return (
        <motion.div
            ref={ref}
            className="absolute left-1/2 -translate-x-1/2 -bottom-93 z-[60] flex flex-col items-center"
        >
            {/* Rabuste Logo as the Cup/Destination - Made Bigger */}
            <motion.div
                className="relative w-36 h-36 lg:w-48 lg:h-48"
                style={{
                    filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))"
                }}
            >
                <Image
                    src="/coffee.png"
                    alt="Coffee Cup"
                    fill
                    className="object-contain"
                />
            </motion.div>

            {/* Steam removed as requested */}


        </motion.div>
    );
};

const ZigzagLine = ({ progress }: { progress: any }) => {
    // Path starts from center (50), smoothly curves to original zigzag, and smoothly ends at center (50)
    // Adjusted end point to 1600 (higher up) to meet top of cup
    const pathD = `
        M 50 0
        C 50 30, 5 60, 5 100
        C 5 100, 95 100, 95 250
        C 95 400, 5 400, 5 550
        C 5 700, 95 700, 95 850
        C 95 1000, 5 1000, 5 1150
        C 5 1300, 95 1300, 95 1450
        C 95 1550, 50 1580, 50 1600
    `;

    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            {/* Coffee Machine at top */}
            <CoffeeMachine progress={progress} />

            {/* Expanded viewBox to preventing horizontal clipping of thick strokes */}
            <svg width="100%" height="100%" viewBox="-20 0 140 1500" preserveAspectRatio="none" className="overflow-visible">
                <defs>
                    {/* Rich Coffee Gradient - Lighter/Golden Blend */}
                    <linearGradient id="coffee-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#C5A572" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#9C7E54" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#C5A572" stopOpacity="0.8" />
                    </linearGradient>

                    {/* Smoother Gloss */}
                    <filter id="liquid-gloss">
                        <feSpecularLighting result="specular" specularConstant="0.6" specularExponent="20" lightingColor="#FFF">
                            <fePointLight x="50" y="50" z="300" />
                        </feSpecularLighting>
                        <feComposite in="specular" in2="SourceAlpha" operator="in" result="specular" />
                        <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="0.3" k4="0" />
                    </filter>
                </defs>

                {/* Background Track (Empty Pipe) - Thinner and subtler */}
                <path
                    d={pathD}
                    fill="transparent"
                    stroke="#7f3b2d"
                    strokeWidth="5"
                    strokeOpacity="0.05"
                    strokeLinecap="butt"
                />

                {/* The Liquid Fill - Thinner */}
                <motion.path
                    d={pathD}
                    fill="transparent"
                    stroke="url(#coffee-liquid)"
                    strokeWidth="3"
                    strokeLinecap="butt"
                    style={{ pathLength: progress }}
                    filter="url(#liquid-gloss)"
                />

                {/* Highlight/Sheen Line for Wet Look */}
                <motion.path
                    d={pathD}
                    fill="transparent"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    strokeOpacity="0.15"
                    strokeLinecap="butt"
                    style={{ pathLength: progress }}
                    className="blur-[0.5px]"
                />
            </svg>

            {/* Coffee Cup with Rabuste Logo at bottom */}
            <CoffeeCup progress={progress} />
        </div>
    );
};

// ... imports ...
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

gsap.registerPlugin(ScrollTrigger);

// ... (TimelineData, TimelineItem, MobileTimelineItem, CoffeeMachine, CoffeeCup, ZigzagLine components remain unchanged) ...

const Timeline = () => {
    const containerRef = useRef(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Make progress faster: Complete the animation slightly before the section ends
    const linearProgress = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

    // Apply ease-in with faster acceleration at end
    const fastScrollProgress = useTransform(linearProgress, (value) => {
        // Custom easing: gentle at start, accelerates more at the very end
        // Using cubic for the last 30%, linear-ish for the rest
        if (value > 0.7) {
            // Last 30%: accelerate faster
            return 0.6 + (value - 0.7) * (value - 0.7) * 13.33;
        }
        return value * 0.857; // First 70%: slightly slower
    });

    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        setParticles([...Array(5)].map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            scale: Math.random() * 0.5 + 0.5,
            duration: Math.random() * 10 + 10,
            targetY: Math.random() * -20
        })));
        
        // Dynamically import Splitting to avoid SSR issues
        const initializeSplitting = async () => {
            const Splitting = (await import("splitting")).default;
            
            // --- Effect 18 (Zoom In) for Title ---
            if (titleRef.current && !titleRef.current.classList.contains('splitting')) {
                Splitting({ target: titleRef.current, by: "chars" });
            }

            const ctx = gsap.context(() => {
                 if (titleRef.current) {
                    const chars = titleRef.current.querySelectorAll('.char');
                    
                    // Set perspective on parent of chars (words) for 3D effect
                    if (chars.length) {
                        chars.forEach(char => {
                             if (char.parentNode) gsap.set(char.parentNode, { perspective: 1000 });
                             gsap.set(char, { display: 'inline-block', transformStyle: 'preserve-3d' });
                        });

                        gsap.fromTo(chars, { 
                            'will-change': 'opacity, transform', 
                            opacity: 0.2,
                            z: -800
                        }, 
                        {
                            ease: 'back.out(1.2)',
                            opacity: 1,
                            z: 0,
                            stagger: 0.04,
                            scrollTrigger: {
                                trigger: titleRef.current,
                                start: 'top bottom-=10%',
                                end: 'bottom center',
                                scrub: true,
                            }
                        });
                    }
                 }
            }, containerRef);

            return () => ctx.revert();
        };

        initializeSplitting();
    }, []);

    const scaleY = useSpring(fastScrollProgress, {
        stiffness: 70,
        damping: 20,
        restDelta: 0.001
    });

    return (
        <section
            ref={containerRef}
            className="relative w-full py-24 lg:py-40 pb-40 lg:pb-56 overflow-hidden bg-[#e3a458]"
        >
            {/* Cinematic Background Layers (Cleaner, No Text) */}

            {/* 1. Vignette for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.15)_100%)] pointer-events-none" />

            {/* 2. Abstract Grain/Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]" />

            {/* 3. Subtle Floating Dust Particles (Kept for atmosphere, but subtle) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-[#faeade] rounded-full opacity-30 blur-[1px]"
                        initial={{
                            x: p.x + "%",
                            y: p.y + "%",
                            scale: p.scale
                        }}
                        animate={{
                            y: [null, p.targetY + "%"],
                            opacity: [0.1, 0.4, 0.1]
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
                {/* Title Section - Pushed up to make room for machine */}
                <div className="text-center mb-40 lg:mb-56">
                    <h2 ref={titleRef} className="font-tan-pearl text-5xl lg:text-7xl font-bold text-[#7f3b2d] drop-shadow-sm lowercase">
                        our historic path
                    </h2>
                    <div className="relative w-28 h-6 lg:w-40 lg:h-10 mx-auto mt-8">
                        <Image
                            src="/title-separator.png"
                            fill
                            alt="Decorative separator"
                            className="object-contain opacity-80"
                        />
                    </div>
                </div>

                {/* Desktop View - Timeline with both lines originating from machine */}
                <div className="hidden md:block relative pt-20">
                    {/* Zigzag Animation Layer - Connects machine nozzle to cup */}
                    {/* Zigzag path starts at M 50 0 (nozzle/top) */}
                    <ZigzagLine progress={scaleY} />

                    {/* Timeline Line (Static Base) - Starts at first item, ends at last item */}
                    {/* Color changed to neutral timeline color, adjusted top/bottom to match content */}
                    <div className="absolute left-1/2 w-[2px] bg-[#7f3b2d]/20 -translate-x-1/2 rounded-full -z-10" style={{ top: '10rem', bottom: '10rem' }} />

                    {/* Timeline Line (Active Fill) - Animated with scroll */}
                    <motion.div
                        style={{ scaleY, originY: 0, top: '10rem', bottom: '10rem' }}
                        className="absolute left-1/2 w-[2px] bg-[#7f3b2d] -translate-x-1/2 rounded-full -z-10"
                    />

                    {/* Add extra padding at top for coffee machine */}
                    <div className="pt-8">
                        {timelineData.map((item, index) => (
                            <TimelineItem key={index} data={item} index={index} />
                        ))}
                    </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                    {timelineData.map((item, index) => (
                        <MobileTimelineItem key={index} data={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Timeline;
