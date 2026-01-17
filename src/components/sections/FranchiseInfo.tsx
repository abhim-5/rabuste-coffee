"use client";

import { motion } from "framer-motion";
import { TrendingUp, Award, Users } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const benefits = [
    {
        icon: TrendingUp,
        title: "High ROI",
        description: "Proven business model with excellent returns.",
    },
    {
        icon: Award,
        title: "Premium Brand",
        description: "Join a recognized and loved luxury coffee brand.",
    },
    {
        icon: Users,
        title: "Full Support",
        description: "Comprehensive training and marketing assistance.",
    },
];

export default function FranchiseInfo() {
    return (
        <section
            className="relative w-full overflow-hidden bg-[#faeade] py-20 lg:py-24 text-[#7f3b2d]"
        >
            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 lg:px-6 flex flex-col items-center pb-20">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 lg:mb-16 text-center text-[#7f3b2d] tracking-wide"
                >
                    Own our Franchise
                </motion.h2>

                {/* Benefits Grid */}
                <div className="grid grid-cols-3 gap-4 lg:gap-12 w-full max-w-6xl mb-12 lg:mb-20">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center p-4 lg:p-8 group rounded-2xl hover:bg-[#7f3b2d]/5 transition-colors duration-300"
                        >
                             <div className="p-4 lg:p-6 rounded-full bg-[#7f3b2d]/10 mb-4 lg:mb-6 group-hover:bg-[#7f3b2d]/20 transition-colors duration-300">
                                <benefit.icon className="w-8 h-8 lg:w-12 lg:h-12 text-[#7f3b2d]" />
                            </div>
                            <h3 className="font-serif text-base lg:text-2xl font-bold mb-2 lg:mb-4 text-[#7f3b2d]">
                                {benefit.title}
                            </h3>
                            <p className="text-[#7f3b2d]/80 text-xs lg:text-lg leading-tight lg:leading-relaxed font-serif hidden lg:block max-w-xs mx-auto">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Buy Now Button */}
                <Link href="/about-us#franchise-inquiry">
                    <BuyNowButton />
                </Link>
            </div>

            {/* Zig-Zag / Drip Divider to Black Footer */}
            <div className="absolute bottom-0 left-0 w-full h-[15vw] md:h-[10vw] pointer-events-none z-20 translate-y-1">
                <img 
                    src="/footer-dip.png" 
                    alt="decorative divider" 
                    className="w-full h-full object-cover"
                />
            </div>
        </section>
    );
}

function BuyNowButton() {
    const [isHovered, setIsHovered] = useState(false);
    const text = "Buy Now";

    return (
        <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative px-10 py-4 lg:px-12 lg:py-5 bg-[#7f3b2d] hover:bg-[#5e2b21] text-[#faeade] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
                        className="inline-block font-display text-xl lg:text-2xl font-bold tracking-wide"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </span>
        </button>
    );
}
