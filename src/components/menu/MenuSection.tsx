"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { MenuItem } from "@/types/menu";
import { CoffeeCard } from "./CoffeeCard";

interface MenuSectionProps {
    title: string;
    items: MenuItem[];
    onItemClick: (item: MenuItem) => void;
    onAddToCart: (item: MenuItem, quantity: number) => void;
}

export function MenuSection({
    title,
    items,
    onItemClick,
    onAddToCart,
}: MenuSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    if (items.length === 0) return null;

    return (
        <section
            ref={ref}
            className="relative w-full py-12 lg:py-16"
            style={{ backgroundColor: "#D8CBB8" }}
        >
            <div className="mx-auto w-full px-4 lg:px-6 max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-8 lg:mb-12"
                >
                    <h2 className="font-display text-3xl lg:text-5xl font-bold text-[#404040] mb-4 text-center">
                        {title}
                    </h2>

                    {/* Title Separator */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative w-32 h-8 lg:w-40 lg:h-10"
                    >
                        <Image
                            src="/title-separator.png"
                            fill
                            alt="Decorative separator"
                            className="object-contain"
                        />
                    </motion.div>
                </motion.div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <CoffeeCard
                                item={item}
                                onCardClick={onItemClick}
                                onAddToCart={onAddToCart}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
