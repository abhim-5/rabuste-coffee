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
                    className="absolute text-[10rem] font-bold text-[#8B6F47]/10 font-display select-none blur-[0.5px]"
                >
                    {data.year.split('-')[0]}
                </motion.span>

                {/* Floating Keywords/Deco */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 0.8, y: 8 } : {}} // y: 8 is translate-y-8
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="absolute flex flex-col items-center gap-2 transform"
                >
                    <span className="w-1 h-12 bg-gradient-to-b from-transparent via-[#8B6F47] to-transparent" />
                    <span className="font-serif text-[#8B6F47] tracking-[0.4em] text-sm uppercase font-bold">
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
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#8B6F47] to-[#BC9F75] rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />

                    <div className="relative bg-[#EBE3D9]/60 backdrop-blur-xl p-6 lg:p-8 rounded-xl shadow-2xl border border-white/40 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]">

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

            <div className="relative bg-[#EBE3D9]/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/30 flex-grow">
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

// Professional Espresso Machine SVG Component - Large and Realistic
const CoffeeMachine = ({ progress }: { progress: any }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 -top-36 z-30 w-48 h-56 lg:w-56 lg:h-64"
        >
            <svg viewBox="0 0 200 220" fill="none" className="w-full h-full drop-shadow-2xl">
                <defs>
                    {/* Stainless Steel Gradient */}
                    <linearGradient id="steel-body" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#B8B8B8" />
                        <stop offset="25%" stopColor="#E8E8E8" />
                        <stop offset="50%" stopColor="#D0D0D0" />
                        <stop offset="75%" stopColor="#A8A8A8" />
                        <stop offset="100%" stopColor="#888888" />
                    </linearGradient>

                    {/* Dark Accent Gradient */}
                    <linearGradient id="dark-accent" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3D2B1F" />
                        <stop offset="50%" stopColor="#2C1A10" />
                        <stop offset="100%" stopColor="#1A0F08" />
                    </linearGradient>

                    {/* Copper/Bronze Accent */}
                    <linearGradient id="copper-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#CD7F32" />
                        <stop offset="50%" stopColor="#B87333" />
                        <stop offset="100%" stopColor="#8B4513" />
                    </linearGradient>

                    {/* Chrome Highlight */}
                    <linearGradient id="chrome-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#E0E0E0" />
                        <stop offset="100%" stopColor="#A0A0A0" />
                    </linearGradient>

                    {/* Coffee Color */}
                    <linearGradient id="coffee-drip" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4A2C17" />
                        <stop offset="100%" stopColor="#2C1A10" />
                    </linearGradient>

                    {/* Shadows */}
                    <filter id="machine-shadow" x="-20%" y="-10%" width="140%" height="130%">
                        <feDropShadow dx="4" dy="8" stdDeviation="6" floodOpacity="0.4" />
                    </filter>

                    <filter id="inner-shadow">
                        <feOffset dx="0" dy="2" />
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* === MAIN MACHINE BODY === */}
                <g filter="url(#machine-shadow)">
                    {/* Base Platform */}
                    <rect x="20" y="185" width="160" height="20" rx="3" fill="url(#dark-accent)" />
                    <rect x="25" y="188" width="150" height="3" rx="1" fill="#4A3425" opacity="0.6" />

                    {/* Main Body - Stainless Steel */}
                    <rect x="30" y="40" width="140" height="145" rx="8" fill="url(#steel-body)" />

                    {/* Body Side Panels - Dark */}
                    <rect x="30" y="40" width="15" height="145" rx="4" fill="url(#dark-accent)" />
                    <rect x="155" y="40" width="15" height="145" rx="4" fill="url(#dark-accent)" />

                    {/* Top Section */}
                    <rect x="25" y="30" width="150" height="18" rx="4" fill="url(#dark-accent)" />
                    <rect x="35" y="33" width="130" height="4" rx="2" fill="url(#copper-accent)" />

                    {/* Bean Hopper - Transparent Container */}
                    <path d="M70 30 L75 5 L125 5 L130 30 Z" fill="#3D2B1F" stroke="#2C1A10" strokeWidth="2" />
                    <path d="M75 28 L78 8 L122 8 L125 28 Z" fill="#1A0F08" opacity="0.7" />
                    <ellipse cx="100" cy="5" rx="28" ry="5" fill="#2C1A10" stroke="#4A3425" strokeWidth="1" />
                    {/* Coffee Beans inside hopper */}
                    <ellipse cx="92" cy="15" rx="4" ry="6" fill="#3D2B1F" transform="rotate(-20 92 15)" />
                    <ellipse cx="100" cy="18" rx="4" ry="6" fill="#4A3425" transform="rotate(10 100 18)" />
                    <ellipse cx="108" cy="14" rx="4" ry="6" fill="#2C1A10" transform="rotate(25 108 14)" />
                </g>

                {/* === CONTROL PANEL === */}
                <rect x="50" y="55" width="100" height="50" rx="4" fill="#1A0F08" stroke="#4A3425" strokeWidth="1" />

                {/* Digital Display */}
                <rect x="58" y="62" width="84" height="20" rx="2" fill="#0a1a0a" />
                <rect x="60" y="64" width="80" height="16" rx="1" fill="#001a00" />
                <text x="100" y="76" textAnchor="middle" fill="#00ff00" fontSize="8" fontFamily="'Courier New', monospace" fontWeight="bold">READY</text>

                {/* Control Buttons */}
                <circle cx="68" cy="94" r="6" fill="#1a1a1a" stroke="url(#copper-accent)" strokeWidth="1.5" />
                <circle cx="68" cy="94" r="3" fill="#333" />

                <circle cx="88" cy="94" r="6" fill="#1a1a1a" stroke="url(#copper-accent)" strokeWidth="1.5" />
                <circle cx="88" cy="94" r="3" fill="#333" />

                <circle cx="108" cy="94" r="6" fill="#1a1a1a" stroke="url(#copper-accent)" strokeWidth="1.5" />
                <circle cx="108" cy="94" r="3" fill="#333" />

                {/* Power Button - Glowing Red */}
                <circle cx="132" cy="94" r="8" fill="#1a1a1a" stroke="url(#copper-accent)" strokeWidth="2" />
                <circle cx="132" cy="94" r="5" fill="#8B0000" />
                <motion.circle
                    cx="132" cy="94" r="5"
                    fill="#FF0000"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* === GROUP HEAD / BREWING UNIT === */}
                {/* Main Group Head Housing */}
                <rect x="70" y="115" width="60" height="35" rx="4" fill="url(#chrome-highlight)" stroke="#888" strokeWidth="1" />

                {/* Group Head Details */}
                <rect x="85" y="120" width="30" height="8" rx="2" fill="url(#steel-body)" />
                <rect x="90" y="130" width="20" height="15" rx="2" fill="url(#dark-accent)" />

                {/* Portafilter */}
                <rect x="80" y="150" width="40" height="12" rx="3" fill="url(#chrome-highlight)" stroke="#666" strokeWidth="1" />
                <ellipse cx="100" cy="162" rx="22" ry="6" fill="url(#steel-body)" stroke="#888" strokeWidth="1" />

                {/* Portafilter Handle */}
                <rect x="50" y="153" width="30" height="6" rx="3" fill="url(#dark-accent)" />
                <circle cx="50" cy="156" r="5" fill="url(#dark-accent)" stroke="#4A3425" strokeWidth="1" />

                {/* Spouts */}
                <rect x="88" y="162" width="6" height="15" rx="1" fill="url(#copper-accent)" />
                <rect x="106" y="162" width="6" height="15" rx="1" fill="url(#copper-accent)" />

                {/* === DRIP TRAY === */}
                <rect x="55" y="178" width="90" height="7" rx="2" fill="url(#dark-accent)" />
                <rect x="60" y="180" width="80" height="3" fill="#1A0F08" />

                {/* Grate Pattern */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <rect key={i} x={65 + i * 10} y="179" width="2" height="5" rx="0.5" fill="#4A3425" />
                ))}

                {/* === STEAM WAND === */}
                <rect x="155" y="110" width="8" height="50" rx="2" fill="url(#chrome-highlight)" />
                <circle cx="159" cy="160" r="4" fill="url(#steel-body)" stroke="#888" strokeWidth="1" />
                <rect x="157" y="160" width="4" height="20" rx="1" fill="url(#chrome-highlight)" />

                {/* Steam Animation */}
                <motion.path
                    d="M159 105 Q155 90 162 75"
                    stroke="#FFF"
                    strokeWidth="2"
                    strokeOpacity="0.15"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.25, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                />
                <motion.path
                    d="M159 105 Q165 88 158 70"
                    stroke="#FFF"
                    strokeWidth="1.5"
                    strokeOpacity="0.1"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.2, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                />

                {/* === HOT WATER DISPENSER === */}
                <rect x="37" y="120" width="8" height="40" rx="2" fill="url(#chrome-highlight)" />
                <circle cx="41" cy="160" r="3" fill="url(#steel-body)" />

                {/* === PRESSURE GAUGE === */}
                <circle cx="42" cy="75" r="12" fill="#EEE" stroke="url(#copper-accent)" strokeWidth="2" />
                <circle cx="42" cy="75" r="9" fill="#FFF" />
                <motion.line
                    x1="42" y1="75" x2="42" y2="68"
                    stroke="#C00"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ rotate: -45 }}
                    animate={{ rotate: [-45, 45, -45] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{ transformOrigin: "42px 75px" }}
                />
                <circle cx="42" cy="75" r="2" fill="#333" />

                {/* Gauge Labels */}
                <text x="42" y="83" textAnchor="middle" fill="#333" fontSize="4" fontWeight="bold">BAR</text>
            </svg>

            {/* Coffee Dripping Animation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
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
            {/* Rabuste Logo as the Cup/Destination */}
            <motion.div
                className="relative w-28 h-28 lg:w-36 lg:h-36"
                style={{
                    filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))"
                }}
            >
                <Image
                    src="/Rabuste logo.png"
                    alt="Rabuste Coffee"
                    fill
                    className="object-contain"
                />
            </motion.div>

            {/* Realistic Steam Rising */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-24 h-24">
                {[0, 1, 2].map((i) => (
                    <motion.svg
                        key={i}
                        viewBox="0 0 50 100"
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-28"
                        style={{ filter: 'blur(2px)' }}
                    >
                        <motion.path
                            d="M 25 100 Q 20 85, 25 70 Q 30 55, 25 40 Q 20 25, 25 10 Q 28 0, 25 0"
                            fill="none"
                            stroke="url(#steamGradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: [0, 1, 1],
                                opacity: [0, 1, 0.7],
                                x: [0, i % 2 === 0 ? 10 : -10, i % 2 === 0 ? -5 : 5],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 0.8,
                                ease: "easeInOut"
                            }}
                        />
                        <defs>
                            <linearGradient id="steamGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                                <stop offset="30%" stopColor="#F5F5F5" stopOpacity="0.85" />
                                <stop offset="60%" stopColor="#E8E8E8" stopOpacity="0.95" />
                                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
                            </linearGradient>
                        </defs>
                    </motion.svg>
                ))}
            </div>


        </motion.div>
    );
};

const ZigzagLine = ({ progress }: { progress: any }) => {
    // Path starts from center (50), smoothly curves to original zigzag, and smoothly ends at center (50)
    const pathD = `
        M 50 0
        C 50 30, 5 60, 5 100
        C 5 100, 95 100, 95 250
        C 95 400, 5 400, 5 550
        C 5 700, 95 700, 95 850
        C 95 1000, 5 1000, 5 1150
        C 5 1300, 95 1300, 95 1450
        C 95 1550, 50 1620, 50 1650
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
                    stroke="#8B6F47"
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

const Timeline = () => {
    const containerRef = useRef(null);
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
    }, []);

    const scaleY = useSpring(fastScrollProgress, {
        stiffness: 70,
        damping: 20,
        restDelta: 0.001
    });

    return (
        <section
            ref={containerRef}
            className="relative w-full py-24 lg:py-40 pb-40 lg:pb-56 overflow-hidden bg-[#D8CBB8]"
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
                        className="absolute w-1 h-1 bg-[#D4AF37] rounded-full opacity-30 blur-[1px]"
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
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="text-center mb-40 lg:mb-56"
                >
                    <h4 className="font-serif text-[#8B6F47] text-lg lg:text-xl tracking-[0.2em] uppercase mb-4">Since 2023</h4>
                    <h2 className="font-display text-5xl lg:text-7xl font-bold text-[#404040] drop-shadow-sm">
                        Our Historic Path
                    </h2>
                    <div className="relative w-28 h-6 lg:w-40 lg:h-10 mx-auto mt-8">
                        <Image
                            src="/title-separator.png"
                            fill
                            alt="Decorative separator"
                            className="object-contain opacity-80"
                        />
                    </div>
                </motion.div>

                {/* Desktop View - Timeline with both lines originating from machine */}
                <div className="hidden md:block relative pt-20">
                    {/* Zigzag Animation Layer - Contains machine, zigzag curve, and cup */}
                    <ZigzagLine progress={scaleY} />

                    {/* Base Line - Starts from top (machine area), ends at cup area */}
                    <div className="absolute left-1/2 top-0 w-[2px] bg-[#8B6F47]/10 -translate-x-1/2 rounded-full -z-10" style={{ bottom: '-17.75rem' }} />

                    {/* Glowing Active Line (Liquid Style) - Animated with scroll */}
                    <motion.div
                        style={{ scaleY, originY: 0, bottom: '-17.75rem' }}
                        className="absolute left-1/2 top-0 w-[4px] bg-[#4A3425] -translate-x-1/2 shadow-[0_0_10px_rgba(74,52,37,0.4)] rounded-full -z-10"
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
