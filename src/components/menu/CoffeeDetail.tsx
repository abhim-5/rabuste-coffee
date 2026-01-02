"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { MenuItem } from "@/types/menu";
import { getMenuItemById, menuItems } from "@/data/menuData";

interface CoffeeDetailProps {
    item: MenuItem | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (item: MenuItem, quantity: number, variations?: Record<string, string>) => void;
    onUpdateQuantity: (item: MenuItem, change: number) => void;
    onViewCart: () => void;
    currentCartQuantity: number;
    onRelatedItemClick?: (item: MenuItem) => void;
    getCartQuantityForItem?: (itemId: string) => number;
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
    const [localQuantity, setLocalQuantity] = useState(1);
    const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});

    // Sync with cart quantity when item changes or modal opens
    useEffect(() => {
        if (item && isOpen) {
            setLocalQuantity(currentCartQuantity > 0 ? currentCartQuantity : 1);
        }
    }, [item, isOpen, currentCartQuantity]);

    useEffect(() => {
        if (item?.variations) {
            const defaultVariations: Record<string, string> = {};
            item.variations.forEach((variation) => {
                defaultVariations[variation.id] = variation.options[0].id;
            });
            setSelectedVariations(defaultVariations);
        }
    }, [item]);

    if (!item) return null;

    const handleAddToCart = () => {
        onAddToCart(item, localQuantity, selectedVariations);
        // Don't close modal, just update local state
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
        return price * localQuantity;
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
                                    <div className="relative w-full aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden">
                                        <Image
                                            src={item.image}
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

                                        <div className="flex items-baseline gap-3 mb-6">
                                            <span className="font-serif text-3xl text-green-700 font-bold">
                                                ₹{calculatePrice()}
                                            </span>
                                            {item.originalPrice && (
                                                <span className="font-sans text-lg text-gray-500 line-through">
                                                    ₹{item.originalPrice}
                                                </span>
                                            )}
                                        </div>

                                        <p className="font-sans text-base text-gray-700 mb-6 leading-relaxed">
                                            {item.description}
                                        </p>

                                        {item.variations && item.variations.length > 0 && (
                                            <div className="space-y-4 mb-6">
                                                {item.variations.map((variation) => (
                                                    <div key={variation.id}>
                                                        <label className="font-serif text-sm font-semibold text-[#262626] mb-2 block">
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
                                                                    className={`px-4 py-2 font-sans text-sm transition-all border-[0.5px] ${
                                                                        selectedVariations[variation.id] === option.id
                                                                            ? "bg-[#8B6F47] text-white border-[#8B6F47] shadow-md"
                                                                            : "bg-white/50 text-[#262626] border-[#8B6F47] hover:bg-[#c9baa7]"
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

                                        <div className="mt-auto">
                                            {currentCartQuantity === 0 ? (
                                                <motion.button
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
                                                                {currentCartQuantity}
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

                                {item.frequentlyBoughtWith && item.frequentlyBoughtWith.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-display text-xl lg:text-2xl font-bold text-[#404040] mb-4">
                                            Frequently Bought Together
                                        </h4>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                            {item.frequentlyBoughtWith.map((itemId) => {
                                                const relatedItem = getMenuItemById(itemId);
                                                if (!relatedItem) return null;
                                                const relatedQty = getCartQuantityForItem ? getCartQuantityForItem(relatedItem.id) : 0;
                                                return (
                                                    <div
                                                        key={itemId}
                                                        onClick={() => onRelatedItemClick?.(relatedItem)}
                                                        className="bg-white rounded-lg p-3 border border-[#8B6F47]/20 cursor-pointer hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-2">
                                                            <Image
                                                                src={relatedItem.image}
                                                                alt={relatedItem.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <p className="font-serif text-sm text-[#404040] line-clamp-2 mb-1">
                                                            {relatedItem.name}
                                                        </p>
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-baseline gap-1">
                                                                <span className="font-sans text-sm font-bold text-[#262626]">
                                                                    ₹{relatedItem.price}
                                                                </span>
                                                                {relatedItem.originalPrice && (
                                                                    <span className="font-sans text-xs text-[#78716c] line-through">
                                                                        ₹{relatedItem.originalPrice}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {relatedQty === 0 ? (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onAddToCart(relatedItem, 1);
                                                                    }}
                                                                    className="bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans text-xs font-semibold px-2 py-1 rounded-md transition-colors"
                                                                >
                                                                    Add
                                                                </button>
                                                            ) : (
                                                                <div className="flex items-center gap-1 bg-[#8B6F47] rounded-md px-1 py-0.5">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onUpdateQuantity(relatedItem, -1);
                                                                        }}
                                                                        className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                                                    >
                                                                        <Minus className="w-3 h-3 text-white" />
                                                                    </button>
                                                                    <span className="font-sans text-xs font-bold text-white min-w-[14px] text-center">
                                                                        {relatedQty}
                                                                    </span>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onUpdateQuantity(relatedItem, 1);
                                                                        }}
                                                                        className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                                                    >
                                                                        <Plus className="w-3 h-3 text-white" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                                                )}

                                {/* You May Also Like - Similar items from same category */}
                                {(() => {
                                    const similarItems = menuItems
                                        .filter(i => i.category === item.category && i.id !== item.id)
                                        .slice(0, 4);
                                    if (similarItems.length === 0) return null;
                                    return (
                                        <div className="mb-6">
                                            <h4 className="font-display text-xl lg:text-2xl font-bold text-[#404040] mb-4">
                                                You May Also Like
                                            </h4>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                                {similarItems.map((similarItem) => {
                                                    const similarQty = getCartQuantityForItem ? getCartQuantityForItem(similarItem.id) : 0;
                                                    return (
                                                        <div
                                                            key={similarItem.id}
                                                            onClick={() => onRelatedItemClick?.(similarItem)}
                                                            className="bg-white rounded-lg p-3 border border-[#8B6F47]/20 cursor-pointer hover:shadow-md transition-shadow"
                                                        >
                                                            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-2">
                                                                <Image
                                                                    src={similarItem.image}
                                                                    alt={similarItem.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <p className="font-serif text-sm text-[#404040] line-clamp-2 mb-1">
                                                                {similarItem.name}
                                                            </p>
                                                            <div className="flex items-center justify-between gap-2">
                                                                <div className="flex items-baseline gap-1">
                                                                    <span className="font-sans text-sm font-bold text-[#262626]">
                                                                        ₹{similarItem.price}
                                                                    </span>
                                                                    {similarItem.originalPrice && (
                                                                        <span className="font-sans text-xs text-[#78716c] line-through">
                                                                            ₹{similarItem.originalPrice}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {similarQty === 0 ? (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onAddToCart(similarItem, 1);
                                                                        }}
                                                                        className="bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans text-xs font-semibold px-2 py-1 rounded-md transition-colors"
                                                                    >
                                                                        Add
                                                                    </button>
                                                                ) : (
                                                                    <div className="flex items-center gap-1 bg-[#8B6F47] rounded-md px-1 py-0.5">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onUpdateQuantity(similarItem, -1);
                                                                            }}
                                                                            className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                                                        >
                                                                            <Minus className="w-3 h-3 text-white" />
                                                                        </button>
                                                                        <span className="font-sans text-xs font-bold text-white min-w-[14px] text-center">
                                                                            {similarQty}
                                                                        </span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onUpdateQuantity(similarItem, 1);
                                                                            }}
                                                                            className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                                                        >
                                                                            <Plus className="w-3 h-3 text-white" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
