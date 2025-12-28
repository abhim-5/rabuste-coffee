"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { MenuItem } from "@/types/menu";
import { getMenuItemById } from "@/data/menuData";

interface CoffeeDetailProps {
    item: MenuItem | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (item: MenuItem, quantity: number, variations?: Record<string, string>) => void;
    onViewCart: () => void;
}

export function CoffeeDetail({
    item,
    isOpen,
    onClose,
    onAddToCart,
    onViewCart,
}: CoffeeDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});

    // Initialize variations with default values
    useEffect(() => {
        if (item?.variations) {
            const defaultVariations: Record<string, string> = {};
            item.variations.forEach((variation) => {
                defaultVariations[variation.id] = variation.options[0].id;
            });
            setSelectedVariations(defaultVariations);
        }
    }, [item]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setQuantity(1);
        }
    }, [isOpen]);

    if (!item) return null;

    const handleAddToCart = () => {
        onAddToCart(item, quantity, selectedVariations);
        onClose();
    };

    const handleViewCart = () => {
        onClose();
        onViewCart();
    };

    // Calculate total price with variations
    const calculatePrice = () => {
        let price = item.price;
        if (item.variations) {
            item.variations.forEach((variation) => {
                const selectedOptionId = selectedVariations[variation.id];
                const option = variation.options.find((opt) => opt.id === selectedOptionId);
                if (option?.priceModifier) {
                    price += option.priceModifier;
                }
            });
        }
        return price * quantity;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 lg:inset-0 lg:flex lg:items-center lg:justify-center z-50"
                    >
                        <div className="bg-[#fafaf9] lg:bg-white rounded-t-3xl lg:rounded-2xl max-h-[90vh] lg:max-h-[85vh] w-full lg:max-w-4xl overflow-hidden shadow-2xl">
                            {/* Header */}
                            <div className="sticky top-0 bg-[#fafaf9] lg:bg-white z-10 px-4 lg:px-6 py-4 border-b border-[#8B6F47]/20 flex items-center justify-between">
                                <h2 className="font-display text-xl lg:text-2xl font-bold text-[#404040]">
                                    Product Details
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-[#D8CBB8]/30 transition-colors"
                                >
                                    <X className="w-6 h-6 text-[#404040]" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="overflow-y-auto max-h-[calc(90vh-80px)] lg:max-h-[calc(85vh-80px)]">
                                <div className="p-4 lg:p-6">
                                    {/* Main Image and Info Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                        {/* Image */}
                                        <div className="relative w-full aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col">
                                            <h3 className="font-serif text-2xl lg:text-3xl text-[#404040] mb-3">
                                                {item.name}
                                            </h3>

                                            {/* Rating */}
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

                                            {/* Price */}
                                            <div className="flex items-baseline gap-3 mb-6">
                                                <span className="font-serif text-3xl text-[#262626] font-bold">
                                                    ₹{calculatePrice()}
                                                </span>
                                                {item.originalPrice && (
                                                    <span className="font-sans text-lg text-[#78716c] line-through">
                                                        ₹{item.originalPrice}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p className="font-sans text-base text-[#404040] mb-6 leading-relaxed">
                                                {item.description}
                                            </p>

                                            {/* Variations */}
                                            {item.variations && item.variations.length > 0 && (
                                                <div className="space-y-4 mb-6">
                                                    {item.variations.map((variation) => (
                                                        <div key={variation.id}>
                                                            <label className="font-sans text-sm font-semibold text-[#404040] mb-2 block">
                                                                {variation.name}
                                                            </label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {variation.options.map((option) => (
                                                                    <button
                                                                        key={option.id}
                                                                        onClick={() =>
                                                                            setSelectedVariations((prev) => ({
                                                                                ...prev,
                                                                                [variation.id]: option.id,
                                                                            }))
                                                                        }
                                                                        className={`px-4 py-2 rounded-full font-sans text-sm transition-all ${selectedVariations[variation.id] === option.id
                                                                                ? "bg-[#8B6F47] text-white shadow-md"
                                                                                : "bg-[#D8CBB8]/30 text-[#404040] hover:bg-[#D8CBB8]/50"
                                                                            }`}
                                                                    >
                                                                        {option.name}
                                                                        {option.priceModifier &&
                                                                            ` (+₹${option.priceModifier})`}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Quantity and Actions */}
                                            <div className="mt-auto">
                                                <label className="font-sans text-sm font-semibold text-[#404040] mb-2 block">
                                                    Quantity
                                                </label>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="flex items-center gap-3 bg-[#D8CBB8]/30 rounded-full px-4 py-3">
                                                        <button
                                                            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                                            className="w-8 h-8 rounded-full bg-[#8B6F47]/20 hover:bg-[#8B6F47]/40 flex items-center justify-center transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4 text-[#404040]" />
                                                        </button>
                                                        <span className="font-sans text-xl font-semibold text-[#404040] min-w-[32px] text-center">
                                                            {quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => setQuantity((prev) => prev + 1)}
                                                            className="w-8 h-8 rounded-full bg-[#8B6F47]/20 hover:bg-[#8B6F47]/40 flex items-center justify-center transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4 text-[#404040]" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={handleAddToCart}
                                                        className="flex-1 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold px-6 py-4 rounded-full transition-colors shadow-lg flex items-center justify-center gap-2"
                                                    >
                                                        <ShoppingCart className="w-5 h-5" />
                                                        Add to Cart
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={handleViewCart}
                                                        className="bg-[#D8CBB8] hover:bg-[#c9bca9] text-[#404040] font-sans font-semibold px-6 py-4 rounded-full transition-colors"
                                                    >
                                                        View Cart
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Frequently Bought Together */}
                                    {item.frequentlyBoughtWith && item.frequentlyBoughtWith.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="font-display text-xl lg:text-2xl font-bold text-[#404040] mb-4">
                                                Frequently Bought Together
                                            </h4>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                                {item.frequentlyBoughtWith.map((itemId) => {
                                                    const relatedItem = getMenuItemById(itemId);
                                                    if (!relatedItem) return null;
                                                    return (
                                                        <div
                                                            key={itemId}
                                                            className="bg-white rounded-lg p-3 border border-[#8B6F47]/20"
                                                        >
                                                            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
                                                                <Image
                                                                    src={relatedItem.image}
                                                                    alt={relatedItem.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <p className="font-serif text-sm text-[#404040] line-clamp-1">
                                                                {relatedItem.name}
                                                            </p>
                                                            <p className="font-sans text-sm font-bold text-[#262626]">
                                                                ₹{relatedItem.price}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Similar Items */}
                                    {item.similarItems && item.similarItems.length > 0 && (
                                        <div>
                                            <h4 className="font-display text-xl lg:text-2xl font-bold text-[#404040] mb-4">
                                                Similar Products
                                            </h4>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                                {item.similarItems.map((itemId) => {
                                                    const similarItem = getMenuItemById(itemId);
                                                    if (!similarItem) return null;
                                                    return (
                                                        <div
                                                            key={itemId}
                                                            className="bg-white rounded-lg p-3 border border-[#8B6F47]/20 cursor-pointer hover:shadow-md transition-shadow"
                                                        >
                                                            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
                                                                <Image
                                                                    src={similarItem.image}
                                                                    alt={similarItem.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <p className="font-serif text-sm text-[#404040] line-clamp-1">
                                                                {similarItem.name}
                                                            </p>
                                                            <p className="font-sans text-sm font-bold text-[#262626]">
                                                                ₹{similarItem.price}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
