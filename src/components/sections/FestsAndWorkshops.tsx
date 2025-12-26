"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const workshopItems = [
    { src: "/workshops/1.jpg", title: "Pottery Workshop" },
    { src: "/workshops/2.jpg", title: "Coffee Brewing" },
    { src: "/workshops/3.jpg", title: "Latte Art Class" },
    { src: "/workshops/4.jpg", title: "Pastry Baking" },
    { src: "/workshops/5.jpg", title: "Coffee Tasting" },
    { src: "/workshops/6.jpg", title: "Live Music" },
];

export default function FestsAndWorkshops() {
    // Split images for the split layout
    const topItems = workshopItems.slice(0, 3);
    const bottomItems = workshopItems.slice(3, 6);

    return (
        <section
            className="relative w-full overflow-hidden pt-2 pb-4 lg:py-20"
            style={{ backgroundColor: "#D8CBB8" }}
        >
            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 lg:px-6 flex flex-col items-center">
                {/* Heading & Separator */}
                <div className="relative z-10 mx-auto w-full px-4 lg:px-6 flex flex-col items-center mb-4 lg:mb-12">
                    <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-[#262626] mb-4 text-center">
                        Fests & Workshops
                    </h2>
                    <div className="relative w-32 h-8 lg:w-40 lg:h-10">
                        <Image
                            src="/title-separator.png"
                            fill
                            alt="Decorative separator"
                            className="object-contain"
                        />
                    </div>

                    {/* Mobile Description: Placed before subheading as requested */}
                    <p className="max-w-2xl text-center text-lg text-[#575757] font-serif mt-6 mb-2 px-2 lg:hidden">
                        Rabuste Cafe organizes inclusive workshops to promote artisanship and celebrate
                        creativity. Join us to learn directly from master craftsmen and experience
                        the joy of making.
                    </p>

                    {/* Join Now Button (Mobile only) */}
                    <div className="lg:hidden mt-4 mb-2">
                        <JoinNowButton />
                    </div>

                    {/* Subheading */}
                    <h3 className="font-serif text-xl lg:text-2xl text-[#3d3d3d] mt-6 font-medium italic">
                        Our Past Workshops
                    </h3>

                    {/* Marquee Text - Both Mobile and Desktop */}
                    <div className="w-full overflow-hidden mt-6 mb-4">
                        <motion.div
                            className="flex whitespace-nowrap"
                            animate={{
                                x: ["0%", "-50%"],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            <span className="font-display text-2xl lg:text-3xl text-[#8B6F47]/40 mx-4">
                                ✦ Pottery ✦ Coffee Brewing ✦ Latte Art ✦ Pastry Baking ✦ Coffee Tasting ✦ Live Music ✦
                            </span>
                            <span className="font-display text-2xl lg:text-3xl text-[#8B6F47]/40 mx-4">
                                ✦ Pottery ✦ Coffee Brewing ✦ Latte Art ✦ Pastry Baking ✦ Coffee Tasting ✦ Live Music ✦
                            </span>
                        </motion.div>
                    </div>
                </div>


                {/* Desktop Split Layout Container */}
                <div className="hidden lg:flex flex-col items-center w-full gap-8">
                    {/* Top 3 Images */}
                    <div className="grid grid-cols-3 gap-6 w-full">
                        {topItems.map((item, index) => (
                            <WorkshopImage key={`top-${index}`} src={item.src} title={item.title} index={index} />
                        ))}
                    </div>

                    {/* Description Text (Centered) */}
                    <p className="max-w-3xl text-center text-lg text-[#575757] font-serif my-2 leading-relaxed px-4">
                        Rabuste Cafe organizes inclusive workshops to promote artisanship and celebrate
                        creativity. Join us to learn directly from master craftsmen and experience
                        the joy of making.
                    </p>

                    {/* Bottom 3 Images */}
                    <div className="grid grid-cols-3 gap-6 w-full">
                        {bottomItems.map((item, index) => (
                            <WorkshopImage key={`bottom-${index}`} src={item.src} title={item.title} index={index + 3} />
                        ))}
                    </div>

                    {/* Join Now Button */}
                    <div className="mt-4">
                        <JoinNowButton />
                    </div>
                </div>

                {/* Mobile Layout (Original Stack) - Preserving 2x3 Grid */}
                <div className="lg:hidden flex flex-col items-center w-full">
                    <div className="grid grid-cols-2 gap-4 w-full mb-0">
                        {workshopItems.map((item, index) => (
                            <WorkshopImage key={`mobile-${index}`} src={item.src} title={item.title} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Reusable Image Component
function WorkshopImage({ src, title, index }: { src: string; title: string; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative aspect-square w-full overflow-hidden rounded-lg group cursor-pointer"
        >
            <Image
                src={src}
                fill
                alt={title}
                className="object-cover transition-all duration-500 lg:group-hover:scale-110 lg:group-hover:blur-[2px]"
            />
            {/* Overlay with Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-90 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-[#f0f0f0] font-display text-3xl lg:text-4xl font-bold tracking-wide transform translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-500 drop-shadow-md text-center px-4">
                    {title}
                </span>
            </div>
        </motion.div>
    );
}

function JoinNowButton() {
    const [isHovered, setIsHovered] = useState(false);
    const text = "Join Now";

    return (
        <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative px-8 py-3 lg:px-10 lg:py-4 bg-[#8B6F47]/20 hover:bg-[#8B6F47]/30 border-2 border-[#8B6F47]/40 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
            suppressHydrationWarning
        >
            <span className="flex space-x-[2px]">
                {text.split("").map((char, index) => (
                    <motion.span
                        key={index}
                        animate={
                            isHovered
                                ? {
                                    y: [0, -4, 0],
                                    transition: {
                                        duration: 0.4,
                                        delay: index * 0.05,
                                        ease: "easeInOut",
                                    },
                                }
                                : { y: 0 }
                        }
                        className="inline-block font-serif text-lg lg:text-xl font-semibold text-[#4a4a4a]"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </span>
        </button>
    );
}
