"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Star } from "lucide-react";
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

    // Category display mapping
    const categoryLabels: Record<string, string> = {
        coffee: "COFFEE",
        pizza: "PIZZA",
        pastries: "PASTRIES",
        sandwiches: "SANDWICHES",
        beverages: "BEVERAGES",
        desserts: "DESSERTS"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full min-h-[250px] lg:min-h-0 flex flex-col cursor-pointer border border-[#8B6F47]/10 rounded-2xl overflow-hidden transition-shadow"
            style={{ backgroundColor: "#faeade" }}
        >
            {/* Deal Badge - Top Left Corner */}
            {(item.isDealOfTheDay || discountPercentage > 0) && (
                <div className="absolute top-2 left-2 lg:top-3 lg:left-3 z-10">
                    <div className="bg-red-600 text-white px-2 py-0.5 lg:px-3 lg:py-0.5 rounded-md shadow-lg flex items-center justify-center">
                        <span className="font-sans text-[8px] lg:text-[10px] font-bold tracking-wide">
                            {`DEAL ${discountPercentage}% OFF`}
                        </span>
                    </div>
                </div>
            )}

            {/* Image Container - Fixed height on mobile for maximum image space */}
            <div 
                className="relative w-full h-[170px] lg:h-auto lg:aspect-[4/3] overflow-hidden group"
                onClick={() => onCardClick(item)}
                style={{ backgroundColor: "#faeade" }}
            >
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            {/* Content Section - Reduced padding for less height */}
            <div className="p-2 lg:p-3 flex flex-col flex-1" style={{ backgroundColor: "#ffff" }}>
                {/* Product Name */}
                <div className="mb-1">
                    <h4 className="font-serif text-base lg:text-2xl font-bold text-[#262626] leading-tight">
                        {item.name}
                    </h4>
                </div>

                {/* Rating - Only show if there are reviews */}
                <div className="flex items-center gap-1 mb-2">
                    {item.reviewCount > 0 ? (
                        <>
                            <div className="flex items-center">
                                <Star className="w-3 h-3 lg:w-4 lg:h-4 fill-amber-500 text-amber-500" />
                            </div>
                            <span className="font-sans text-xs lg:text-sm text-[#404040] font-bold pt-0.5">
                                {item.rating.toFixed(1)}
                            </span>
                            <span className="font-sans text-[10px] lg:text-xs text-gray-500 pt-0.5">
                                ({item.reviewCount})
                            </span>
                        </>
                    ) : (
                         <span className="font-sans text-[10px] lg:text-xs font-medium text-[#7f3b2d] bg-[#faeade] px-1.5 py-0.5 rounded">
                            New
                        </span>
                    )}
                </div>

                {/* Description - Hidden on mobile */}
                <p className="hidden lg:block font-sans text-sm lg:text-base text-gray-700 leading-snug mb-2 line-clamp-2 flex-1">
                    {item.description}
                </p>

                    {/* Bottom Section - Price on left, Button on right */}
                    <div className="mt-auto flex items-end justify-between gap-2">
                        {item.available ? (
                            <>
                                {/* Price - Actual price first, then crossed price on right */}
                                <div className="flex items-center gap-1.5">
                                    <span className="font-sans text-lg lg:text-2xl font-bold text-green-700">
                                        ₹{item.price}
                                    </span>
                                    {item.originalPrice && (
                                        <span className="font-sans text-[10px] lg:text-xs text-gray-500 line-through">
                                            ₹{item.originalPrice}
                                        </span>
                                    )}
                                </div>

                                {/* Add to Cart / Quantity Button - Smaller on mobile */}
                                <div className="w-20 lg:w-28">
                                    {cartQuantity === 0 ? (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleAdd}
                                            className="w-full h-8 lg:h-10 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans text-[10px] lg:text-xs font-semibold px-2 lg:px-3 rounded-md transition-colors uppercase tracking-wider whitespace-nowrap flex items-center justify-center"
                                        >
                                            Add
                                        </motion.button>
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0.95 }}
                                            animate={{ scale: 1 }}
                                            className="flex items-center justify-between bg-[#8B6F47] rounded-md px-1.5 lg:px-2 h-8 lg:h-10 w-full"
                                        >
                                            <button
                                                onClick={handleDecrement}
                                                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0"
                                            >
                                                <Minus className="w-3 h-3 text-white" />
                                            </button>
                                            <span className="font-sans text-sm font-bold text-white">
                                                {cartQuantity}
                                            </span>
                                            <button
                                                onClick={handleIncrement}
                                                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0"
                                            >
                                                <Plus className="w-3 h-3 text-white" />
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="w-full flex items-center justify-center py-2 bg-gray-100 rounded-md">
                                <span className="font-sans text-sm font-bold text-red-600 uppercase tracking-wider">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </div>
            </div>
        </motion.div>
    );
}
