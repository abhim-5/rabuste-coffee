"use client";

import { motion } from "framer-motion";
import { Star, Minus, Plus, Sparkles } from "lucide-react";
import Image from "next/image";
import { MenuItem } from "@/types/menu";

interface CoffeeCardProps {
    item: MenuItem;
    onCardClick: (item: MenuItem) => void;
    onAddToCart: (item: MenuItem) => void;
    onUpdateQuantity: (item: MenuItem, change: number) => void;
    cartQuantity: number;
}

export function CoffeeCard({
    item,
    onCardClick,
    onAddToCart,
    onUpdateQuantity,
    cartQuantity
}: CoffeeCardProps) {

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart(item);
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateQuantity(item, 1);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateQuantity(item, -1);
    };

    const discountPercentage = item.originalPrice
        ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            onClick={() => onCardClick(item)}
            className="relative bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer border border-[#8B6F47]/20 transition-all"
        >
            {/* Deal Badge */}
            {item.isDealOfTheDay && (
                <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    <span className="font-sans text-xs font-bold">DEAL</span>
                </div>
            )}

            {/* Discount Badge */}
            {discountPercentage > 0 && (
                <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-1 rounded-lg shadow-lg">
                    <span className="font-sans text-xs font-bold">-{discountPercentage}%</span>
                </div>
            )}

            {/* Image - Taller for visual appeal */}
            <div className="relative w-full aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                />
            </div>

            {/* Content - Fixed height for uniform cards */}
            <div className="p-3 h-[100px] flex flex-col justify-between">
                {/* Name and Rating Row */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-base md:text-lg text-[#262626] leading-snug line-clamp-2 flex-1 font-semibold">
                        {item.name}
                    </h3>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="font-sans text-xs font-semibold text-[#404040]">{item.rating}</span>
                    </div>
                </div>

                {/* Price and Add Button Row */}
                <div className="flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-sans text-lg md:text-xl text-[#5d4e37] font-bold">
                            ₹{item.price}
                        </span>
                        {item.originalPrice && (
                            <span className="font-sans text-xs text-[#78716c] line-through">
                                ₹{item.originalPrice}
                            </span>
                        )}
                    </div>

                    <div className="flex-shrink-0 w-[80px]">
                        {cartQuantity === 0 ? (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAdd}
                                className="w-full bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans text-xs font-semibold px-2 py-1.5 rounded-md transition-colors shadow-md"
                            >
                                Add
                            </motion.button>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                className="flex items-center justify-between bg-[#8B6F47] rounded-md px-1 py-1 shadow-md"
                            >
                                <button
                                    onClick={handleDecrement}
                                    className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0"
                                >
                                    <Minus className="w-3 h-3 text-white" />
                                </button>
                                <span className="font-sans text-xs font-bold text-white min-w-[16px] text-center">
                                    {cartQuantity}
                                </span>
                                <button
                                    onClick={handleIncrement}
                                    className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0"
                                >
                                    <Plus className="w-3 h-3 text-white" />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
