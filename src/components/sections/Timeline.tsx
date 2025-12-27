'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Image from 'next/image';

const timelineData = [
    {
        year: '2023',
        title: 'The Inception',
        description: 'Rabuste Coffee opened its doors in Surat, introducing the city to its first-ever authentic dark roast Robusta experience. A humble beginning with a bold vision.',
        image: '/about us/1.jpg'
    },
    {
        year: '2023-Q4',
        title: 'First 1000 Cups',
        description: 'Within months, the aroma of our bold brew captivated the neighborhood. We celebrated serving our 1000th cup, marking the start of a loyal community.',
        image: '/about us/2.jpg'
    },
    {
        year: '2024',
        title: 'Menu Expansion',
        description: 'We expanded our menu to include artisanal lattes and our signature "Bold Brew" series, catering to both purists and experimental coffee lovers.',
        image: '/about us/3.jpg'
    },
    {
        year: '2024-Q3',
        title: 'Community Hub',
        description: 'Rabuste became more than a cafe; it became a hub for artists, thinkers, and friends. We hosted our first art workshop, blending coffee culture with creativity.',
        image: '/about us/1.jpg'
    },
    {
        year: 'Today',
        title: 'A Growing Legacy',
        description: 'Continuing to redefine the coffee scene, we are now a landmark for Robusta lovers. The journey is just beginning.',
        image: '/about us/2.jpg'
    }
];

const TimelineItem = ({ data, index }: { data: typeof timelineData[0], index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const isEven = index % 2 === 0;

    return (
        <div ref={ref} className={`flex justify-between items-center w-full mb-32 ${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Content Side Spacer */}
            <div className="w-[45%] hidden md:block" />

            {/* Cinematic Timeline Node */}
            <motion.div
                initial={{ scale: 0, boxShadow: "0 0 0px rgba(139, 111, 71, 0)" }}
                animate={isInView ? { scale: 1, boxShadow: "0 0 20px rgba(139, 111, 71, 0.6)" } : {}}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-[#D8CBB8] bg-[#8B6F47] z-20 shadow-[0_0_15px_rgba(139,111,71,0.5)]"
            >
                <div className="absolute inset-0 bg-[#8B6F47] animate-ping rounded-full opacity-20" />
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
                        <div className="relative w-full h-56 mb-6 rounded-lg overflow-hidden shadow-inner">
                            <div className="absolute inset-0 bg-[#8B6F47]/10 z-10 mix-blend-overlay" />
                            <Image
                                src={data.image}
                                alt={data.title}
                                fill
                                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                            />
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
                    <Image
                        src={data.image}
                        alt={data.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="text-[#8B6F47] font-bold text-sm tracking-wider uppercase block mb-2">{data.year}</span>
                <h3 className="font-display text-2xl font-bold text-[#404040] mb-2">{data.title}</h3>
                <p className="font-serif text-[#5C5C5C] leading-relaxed">{data.description}</p>
            </div>
        </motion.div>
    )
}

const Timeline = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 20,
        restDelta: 0.001
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section
            ref={containerRef}
            className="relative w-full py-24 lg:py-40 overflow-hidden bg-[#D8CBB8]"
        >
            {/* Cinematic Background Layers */}

            {/* 1. Vignette for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.15)_100%)] pointer-events-none" />

            {/* 2. Abstract Grain/Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]" />

            {/* 3. Parallax Background Title */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            >
                <h2 className="text-[18vw] lg:text-[25vw] font-display font-bold text-[#6F4E28] leading-none tracking-tighter opacity-5 blur-[2px]">
                    JOURNEY
                </h2>
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="text-center mb-20 lg:mb-32"
                >
                    <h4 className="font-serif text-[#8B6F47] text-lg lg:text-xl tracking-[0.2em] uppercase mb-4">Since 2023</h4>
                    <h2 className="font-display text-5xl lg:text-7xl font-bold text-[#404040] drop-shadow-sm">
                        Our Historic Path
                    </h2>
                    <div className="w-24 h-1 bg-[#8B6F47] mx-auto mt-8 rounded-full opacity-60" />
                </motion.div>

                {/* Desktop View */}
                <div className="hidden md:block relative">
                    {/* Base Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#8B6F47]/10 -translate-x-1/2 rounded-full" />

                    {/* Glowing Active Line */}
                    <motion.div
                        style={{ scaleY, originY: 0 }}
                        className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#8B6F47] via-[#BC9F75] to-[#8B6F47] -translate-x-1/2 shadow-[0_0_10px_rgba(139,111,71,0.5)] rounded-full"
                    />

                    {timelineData.map((item, index) => (
                        <TimelineItem key={index} data={item} index={index} />
                    ))}
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
