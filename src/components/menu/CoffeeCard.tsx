"use client";

import { motion } from "framer-motion";
import { Star, Minus, Plus, Sparkles } from "lucide-react";
import Image from "next/image";
import { MenuItem } from "@/types/menu";
import { useState } from "react";

interface CoffeeCardProps {
    item: MenuItem;
    onCardClick: (item: MenuItem) => void;
    onAddToCart: (item: MenuItem, quantity: number) => void;
}

export function CoffeeCard({ item, onCardClick, onAddToCart }: CoffeeCardProps) {
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        setQuantity((prev) => prev + 1);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart(item, quantity);
        setQuantity(1); // Reset quantity after adding
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
            <div className="relative w-full aspect-[4/5] overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Name */}
                <h3 className="font-serif text-lg lg:text-xl text-[#404040] mb-2 line-clamp-1">
                    {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span className="font-sans text-sm text-[#404040] font-semibold">
                            {item.rating}
                        </span>
                    </div>
                    <span className="font-sans text-xs text-[#78716c]">
                        ({item.reviewCount} reviews)
                    </span>
                </div>

                {/* Price Row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                        <span className="font-serif text-xl lg:text-2xl text-[#262626] font-bold">
                            ₹{item.price}
                        </span>
                        {item.originalPrice && (
                            <span className="font-sans text-sm text-[#78716c] line-through">
                                ₹{item.originalPrice}
                            </span>
                        )}
                    </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 bg-[#D8CBB8]/30 rounded-full px-3 py-2">
                        <button
                            onClick={handleDecrement}
                            className="w-6 h-6 rounded-full bg-[#8B6F47]/20 hover:bg-[#8B6F47]/40 flex items-center justify-center transition-colors"
                        >
                            <Minus className="w-3 h-3 text-[#404040]" />
                        </button>
                        <span className="font-sans text-base font-semibold text-[#404040] min-w-[24px] text-center">
                            {quantity}
                        </span>
                        <button
                            onClick={handleIncrement}
                            className="w-6 h-6 rounded-full bg-[#8B6F47]/20 hover:bg-[#8B6F47]/40 flex items-center justify-center transition-colors"
                        >
                            <Plus className="w-3 h-3 text-[#404040]" />
                        </button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        className="flex-1 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-md"
                    >
                        Add
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
