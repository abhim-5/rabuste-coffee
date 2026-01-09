"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { MenuItem, Variation } from "@/types/menu";
// Removed static data import
import { getDisplayImage, getDisplayPrice, getDisplayDescription } from "@/lib/utils/variationHelpers";

interface CoffeeDetailProps {
    item: MenuItem | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (item: MenuItem, quantity: number, variation?: Variation) => void;
    onUpdateQuantity: (item: MenuItem, change: number) => void;
    onViewCart: () => void;
    currentCartQuantity: number;
    onRelatedItemClick?: (item: MenuItem) => void;
    getCartQuantityForItem?: (itemId: string | number) => number;
}

export function CoffeeDetail({
    item,
    isOpen,
    onClose,
    onAddToCart,
    onUpdateQuantity,
    onViewCart,
    currentCartQuantity,
    onRelatedItemClick,
    getCartQuantityForItem,
}: CoffeeDetailProps) {
    // null = base item (no variation selected)
    const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
    const [localQuantity, setLocalQuantity] = useState(1);

    // Reset to base item (no variation) when modal opens
    useEffect(() => {
        if (item && isOpen) {
            setSelectedVariation(null); // Start with base item
            setLocalQuantity(1);
        }
    }, [item, isOpen]);

    if (!item) return null;

    // Get display values - variation overrides item if selected
    const displayImage = getDisplayImage(item, selectedVariation);
    const displayPrice = getDisplayPrice(item, selectedVariation);
    const displayDescription = getDisplayDescription(item, selectedVariation);

    // When variation changes, button should reset to "Add to Cart" (quantity = 0)
    // We track this with currentCartQuantity which should be 0 when switching
    const currentSelectionQuantity = currentCartQuantity;

    const handleAddToCart = () => {
        onAddToCart(item, 1, selectedVariation || undefined);
    };

    const handleIncrement = () => {
        onUpdateQuantity(item, 1);
    };

    const handleDecrement = () => {
        onUpdateQuantity(item, -1);
    };

    const handleViewCart = () => {
        onClose();
        onViewCart();
    };

    const handleVariationClick = (variation: Variation | null) => {
        setSelectedVariation(variation);
    };

    return (
        <AnimatePresence mode="sync">
            {isOpen && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                />
            )}
            {isOpen && (
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="fixed inset-x-0 bottom-0 lg:inset-0 lg:flex lg:items-center lg:justify-center z-50 pointer-events-none"
                >
                    <div className="rounded-2xl max-h-[90vh] lg:max-h-[85vh] w-full lg:max-w-4xl overflow-hidden shadow-2xl pointer-events-auto border-[0.5px] border-[#8B6F47]" style={{ backgroundColor: "#D8CBB8" }}>
                        <div className="sticky top-0 z-10 px-4 lg:px-6 py-4 border-b-[0.5px] border-[#8B6F47] flex items-center justify-between" style={{ backgroundColor: "#D8CBB8" }}>
                            <h2 className="font-serif text-xl lg:text-2xl font-bold text-[#262626]">
                                Product Details
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-[#c9baa7] transition-colors border-[0.5px] border-[#8B6F47]"
                            >
                                <X className="w-6 h-6 text-[#262626]" />
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[calc(90vh-80px)] lg:max-h-[calc(85vh-80px)]">
                            <div className="p-4 lg:p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                    {/* Dynamic Image - changes with variation */}
                                    <div className="relative w-full aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden">
                                        <Image
                                            key={displayImage} // Force re-render when image changes
                                            src={displayImage}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <h3 className="font-serif text-2xl lg:text-3xl text-[#404040] mb-3">
                                            {item.name}
                                        </h3>

                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(item.rating)
                                                            ? "fill-amber-500 text-amber-500"
                                                            : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-sans text-sm text-[#404040] font-semibold">
                                                {item.rating}
                                            </span>
                                            <span className="font-sans text-sm text-[#78716c]">
                                                ({item.reviewCount} reviews)
                                            </span>
                                        </div>

                                        {/* Dynamic Price - updates with variation */}
                                        <div className="flex items-baseline gap-3 mb-6">
                                            <span className="font-serif text-3xl text-green-700 font-bold">
                                                ₹{displayPrice}
                                            </span>
                                            {item.originalPrice && (
                                                <span className="font-sans text-lg text-gray-500 line-through">
                                                    ₹{item.originalPrice}
                                                </span>
                                            )}
                                        </div>

                                        {/* Dynamic Description - updates with variation */}
                                        <p className="font-sans text-base text-gray-700 mb-6 leading-relaxed">
                                            {displayDescription}
                                        </p>

                                        {/* Variation Rectangles - Base + Variations */}
                                        {item.variations && item.variations.length > 0 && (
                                            <div className="mb-6">
                                                <label className="font-serif text-sm font-semibold text-[#262626] mb-2 block">
                                                    Select Option
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {/* Base Item Rectangle */}
                                                    <button
                                                        onClick={() => handleVariationClick(null)}
                                                        className={`px-4 py-2 font-sans text-sm transition-all border-[0.5px] ${selectedVariation === null
                                                            ? "bg-[#8B6F47] text-white border-[#8B6F47] shadow-md"
                                                            : "bg-white/50 text-[#262626] border-[#8B6F47] hover:bg-[#c9baa7]"
                                                            }`}
                                                    >
                                                        Normal (₹{item.price})
                                                    </button>

                                                    {/* Variation Rectangles */}
                                                    {item.variations.map((variation) => (
                                                        <button
                                                            key={variation.name}
                                                            onClick={() => handleVariationClick(variation)}
                                                            className={`px-4 py-2 font-sans text-sm transition-all border-[0.5px] ${selectedVariation?.name === variation.name
                                                                ? "bg-[#8B6F47] text-white border-[#8B6F47] shadow-md"
                                                                : "bg-white/50 text-[#262626] border-[#8B6F47] hover:bg-[#c9baa7]"
                                                                }`}
                                                        >
                                                            {variation.name}
                                                            {variation.price !== item.price && ` (₹${variation.price})`}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-auto">
                                            {/* Always show Add to Cart when switching variations, or show quantity if already in cart */}
                                            {currentSelectionQuantity === 0 ? (
                                                <motion.button
                                                    key={`add-${selectedVariation?.name || 'base'}`}
                                                    initial={{ opacity: 0.8 }}
                                                    animate={{ opacity: 1 }}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleAddToCart}
                                                    className="w-full bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold px-6 py-4 rounded-full transition-colors shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    <ShoppingCart className="w-5 h-5" />
                                                    Add to Cart
                                                </motion.button>
                                            ) : (
                                                <>
                                                    <label className="font-sans text-sm font-semibold text-[#404040] mb-2 block">
                                                        Quantity
                                                    </label>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-3 bg-[#D8CBB8]/30 rounded-full px-4 py-3">
                                                            <button
                                                                onClick={handleDecrement}
                                                                className="w-8 h-8 rounded-full bg-[#8B6F47]/20 hover:bg-[#8B6F47]/40 flex items-center justify-center transition-colors"
                                                            >
                                                                <Minus className="w-4 h-4 text-[#404040]" />
                                                            </button>
                                                            <span className="font-sans text-xl font-semibold text-[#404040] min-w-[32px] text-center">
                                                                {currentSelectionQuantity}
                                                            </span>
                                                            <button
                                                                onClick={handleIncrement}
                                                                className="w-8 h-8 rounded-full bg-[#8B6F47]/20 hover:bg-[#8B6F47]/40 flex items-center justify-center transition-colors"
                                                            >
                                                                <Plus className="w-4 h-4 text-[#404040]" />
                                                            </button>
                                                        </div>

                                                        <motion.button
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={handleViewCart}
                                                            className="flex-1 bg-[#D8CBB8] hover:bg-[#c9bca9] text-[#404040] font-sans font-semibold px-6 py-3 rounded-full transition-colors shadow-md border-[0.5px] border-[#8B6F47]"
                                                        >
                                                            View Cart
                                                        </motion.button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* You May Also Like - Disabled as it relied on static data */}
                                {null}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
