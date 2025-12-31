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
            className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer border border-[#8B6F47]/20 transition-all"
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

            {/* Image */}
            <div className="relative w-full aspect-[4/5] lg:aspect-[3/2] overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="p-4 lg:p-3">
                {/* Name */}
                <h3 className="font-serif text-lg lg:text-xl text-[#404040] mb-2 lg:mb-1 line-clamp-1">
                    {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3 lg:mb-2">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span className="font-sans text-sm text-[#404040] font-semibold">
                            {item.rating}
                        </span>
                    </div>
                    <span className="font-sans text-xs text-[#78716c]">
                        ({item.reviewCount})
                    </span>
                </div>

                {/* Price and Add Button */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2 flex-shrink min-w-0">
                        <span className="font-serif text-lg lg:text-2xl text-[#262626] font-bold truncate">
                            ₹{item.price}
                        </span>
                        {item.originalPrice && (
                            <span className="font-sans text-xs lg:text-sm text-[#78716c] line-through">
                                ₹{item.originalPrice}
                            </span>
                        )}
                    </div>

                    {/* Smart Add Button / Quantity Controls */}
                    <div className="flex-shrink-0">
                        {cartQuantity === 0 ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAdd}
                                className="bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans text-xs lg:text-sm font-semibold px-4 lg:px-6 py-2 rounded-full transition-colors shadow-md"
                            >
                                Add
                            </motion.button>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1.5 lg:gap-2 bg-[#8B6F47] rounded-full px-2 lg:px-3 py-1.5 lg:py-2 shadow-md"
                            >
                                <button
                                    onClick={handleDecrement}
                                    className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0"
                                >
                                    <Minus className="w-3 h-3 text-white" />
                                </button>
                                <span className="font-sans text-sm lg:text-base font-bold text-white min-w-[20px] lg:min-w-[24px] text-center">
                                    {cartQuantity}
                                </span>
                                <button
                                    onClick={handleIncrement}
                                    className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0"
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
