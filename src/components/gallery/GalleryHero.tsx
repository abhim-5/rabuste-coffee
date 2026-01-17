'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Coffee } from 'lucide-react';
import Image from 'next/image';

export default function GalleryHero() {
    const heroRef = useRef<HTMLDivElement>(null);

    // Parallax effect for hero image
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const smoothScrollProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const heroScale = useTransform(smoothScrollProgress, [0, 1], [1, 1.1]);

    return (
        <section ref={heroRef} className="relative z-30 min-h-screen w-full overflow-hidden bg-black">
            {/* Background Image with Parallax */}
            <motion.div style={{ scale: heroScale }} className="absolute inset-0 z-0 origin-top">
                <Image
                    src="/gallery/gallery-hero.jpg"
                    alt="Art Gallery"
                    fill
                    className="object-cover object-top scale-125 md:scale-100"
                    priority
                />
            </motion.div>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40" aria-hidden>
                <div className="grain-texture h-full w-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto flex h-full min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20 md:pt-36 md:pb-28 text-center lg:px-8 lg:pt-44">
                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="font-tan-pearl tracking-wide text-[#faeade] text-[clamp(3rem,12vw,8rem)] leading-none drop-shadow-2xl lowercase text-center"
                >
                    art gallery
                </motion.h1>
            </div>
        </section>
    );
}
