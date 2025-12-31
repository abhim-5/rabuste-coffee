"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MenuItem } from "@/types/menu";
import { CoffeeCard } from "./CoffeeCard";

interface DealSectionProps {
    dealItems: MenuItem[];
    onItemClick: (item: MenuItem) => void;
    onAddToCart: (item: MenuItem) => void;
    onUpdateQuantity: (item: MenuItem, change: number) => void;
    getCartQuantity: (itemId: string) => number;
}

export function DealSection({
    dealItems,
    onItemClick,
    onAddToCart,
    onUpdateQuantity,
    getCartQuantity,
}: DealSectionProps) {
    if (dealItems.length === 0) return null;

    return (
        <section className="relative w-full py-8 lg:py-12" style={{ backgroundColor: "#8B6F47" }}>
            <div className="mx-auto w-full px-4 lg:px-6 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-8"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-amber-200" />
                        <h2 className="font-display text-3xl lg:text-4xl font-bold text-amber-50">
                            Deal of the Day
                        </h2>
                        <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-amber-200" />
                    </div>
                    <p className="font-sans text-sm lg:text-base text-amber-100">
                        Limited time offers - grab them while they last!
                    </p>
                </motion.div>

                {/* Deal Items Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {dealItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <CoffeeCard
                                item={item}
                                onCardClick={onItemClick}
                                onAddToCart={onAddToCart}
                                onUpdateQuantity={onUpdateQuantity}
                                cartQuantity={getCartQuantity(item.id)}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
