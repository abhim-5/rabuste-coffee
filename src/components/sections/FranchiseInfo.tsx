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
            className="relative w-full overflow-hidden bg-cover bg-center py-6 lg:py-16 text-[#404040]"
            style={{ backgroundImage: "url('/bg-texture.jpg')" }}
        >
            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 lg:px-6 flex flex-col items-center">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 lg:mb-12 text-center text-[#7f3b2d]"
                >
                    Own our Franchise
                </motion.h2>

                {/* Benefits Grid - Horizontal on Mobile (3 cols) */}
                <div className="grid grid-cols-3 gap-2 lg:gap-8 w-full max-w-5xl mb-4 lg:mb-12">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center p-2 lg:p-6 group"
                        >
                             <div className="p-3 lg:p-4 rounded-full bg-[#7f3b2d]/10 mb-2 lg:mb-6 group-hover:bg-[#7f3b2d]/20 transition-colors duration-300">
                                <benefit.icon className="w-6 h-6 lg:w-10 lg:h-10 text-[#7f3b2d]" />
                            </div>
                            <h3 className="font-serif text-sm lg:text-xl font-bold mb-1 lg:mb-3 text-[#7f3b2d]">
                                {benefit.title}
                            </h3>
                            <p className="text-black text-xs lg:text-base leading-tight lg:leading-relaxed font-serif hidden lg:block">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Buy Now Button (Matching Join Now Style) */}
                <Link href="/about-us#franchise-inquiry">
                    <BuyNowButton />
                </Link>
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
            className="relative px-8 py-3 lg:px-10 lg:py-4 bg-[#7f3b2d]/10 hover:bg-[#7f3b2d]/20 border-2 border-[#7f3b2d]/30 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
                        className="inline-block font-serif text-lg lg:text-xl font-semibold text-[#7f3b2d]"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </span>
        </button>
    );
}
