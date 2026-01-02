"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { CartItem } from "@/types/menu";
import { menuItems } from "@/data/menuData";

const galleryItems = [
  { id: 1, name: 'Dawn Chorus', price: 12999 },
  { id: 2, name: 'Midnight Falls', price: 15999 },
  { id: 3, name: 'Wetland Companions', price: 18999 },
  { id: 4, name: 'Monsoon Transit', price: 21999 },
  { id: 5, name: 'Summer Garden', price: 16999 },
  { id: 6, name: 'Bamboo Sanctuary', price: 19999 },
];

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    total: number;
    itemCount: number;
    onUpdateQuantity: (index: number, quantity: number) => void;
    onRemoveItem: (index: number) => void;
    onAddRecommendedItem: (itemId: string) => void;
}

type OrderType = "dine-in" | "takeaway-now" | "takeaway-scheduled";

export function Cart({
    isOpen,
    onClose,
    items,
    total,
    itemCount,
    onUpdateQuantity,
    onRemoveItem,
    onAddRecommendedItem,
}: CartProps) {
    const [orderType, setOrderType] = React.useState<OrderType>("dine-in");
    
    // Check if cart contains any gallery items
    const hasGalleryItems = items.some(item => item.menuItem.id.startsWith('gallery-'));
    const hasMenuItems = items.some(item => !item.menuItem.id.startsWith('gallery-'));
    
    // Get gallery items not in cart (only if cart has gallery items)
    const cartArtIds = items.map(item => {
        const match = item.menuItem.id.match(/gallery-(\d+)/);
        return match ? parseInt(match[1]) : null;
    }).filter(id => id !== null);
    
    const recommendedArtworks = hasGalleryItems 
        ? galleryItems.filter(art => !cartArtIds.includes(art.id))
        : [];
    
    // Get menu items not in cart (only if cart has menu items)
    const cartMenuIds = items.map(item => item.menuItem.id).filter(id => !id.startsWith('gallery-'));
    const recommendedMenuItems = hasMenuItems
        ? menuItems.filter(item => !cartMenuIds.includes(item.id)).slice(0, 3)
        : [];

    const handleConfirmBooking = () => {
        const bookingNumber = Math.floor(100000 + Math.random() * 900000);
        alert(`Booking Confirmed!\n\nYour Booking Number: ${bookingNumber}\n\nPlease visit Rabuste Coffee and show this number at the counter.\nPay in cash and collect your artwork.\n\nThank you!`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full lg:w-[480px] shadow-2xl z-50 flex flex-col"
                        style={{ backgroundColor: "#D8CBB8" }}
                    >
                        <div className="px-6 py-5 flex items-center justify-between border-b-[0.5px] border-[#8B6F47]" style={{ backgroundColor: "#D8CBB8" }}>
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6 text-[#8B6F47]" />
                                <div>
                                    <h2 className="font-display text-2xl font-bold text-[#262626]">
                                        Your Cart
                                    </h2>
                                    <p className="font-sans text-sm text-[#8B6F47]">
                                        {itemCount} {itemCount === 1 ? "item" : "items"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 border-[0.5px] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag className="w-16 h-16 text-[#78716c] mb-4" />
                                    <p className="font-serif text-xl text-[#404040] mb-2">
                                        Your cart is empty
                                    </p>
                                    <p className="font-sans text-sm text-[#78716c]">
                                        Add some delicious items to get started!
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6">
                                        {items.map((cartItem, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="bg-white p-3 border-[0.5px] border-[#8B6F47] shadow-sm"
                                            >
                                                <div className="flex gap-3 items-center">
                                                    <div className="relative w-16 h-16 overflow-hidden flex-shrink-0 bg-gray-100">
                                                        <Image
                                                            src={cartItem.menuItem.image}
                                                            alt={cartItem.menuItem.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-serif text-sm text-[#404040] mb-1 line-clamp-1">
                                                            {cartItem.menuItem.name}
                                                        </h3>

                                                        {cartItem.selectedVariations && (
                                                            <div className="flex flex-wrap gap-1 mb-1">
                                                                {Object.entries(cartItem.selectedVariations).map(
                                                                    ([varId, optId]) => {
                                                                        const variation = cartItem.menuItem.variations?.find(
                                                                            (v) => v.id === varId
                                                                        );
                                                                        const option = variation?.options.find(
                                                                            (o) => o.id === optId
                                                                        );
                                                                        if (!option) return null;
                                                                        return (
                                                                            <span
                                                                                key={varId}
                                                                                className="font-sans text-xs text-[#262626] bg-[#D8CBB8]/50 px-2 py-0.5 border-[0.5px] border-[#8B6F47]"
                                                                            >
                                                                                {option.name}
                                                                            </span>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="flex items-center justify-between">
                                                            <span className="font-sans text-base font-bold text-green-700">
                                                                ₹{cartItem.subtotal}
                                                            </span>

                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        if (cartItem.quantity === 1) {
                                                                            onRemoveItem(index);
                                                                        } else {
                                                                            onUpdateQuantity(index, cartItem.quantity - 1);
                                                                        }
                                                                    }}
                                                                    className="w-6 h-6 border-[0.5px] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white flex items-center justify-center transition-colors"
                                                                >
                                                                    <Minus className="w-3 h-3 text-[#404040]" />
                                                                </button>
                                                                <span className="font-sans text-sm font-semibold text-[#404040] min-w-[20px] text-center">
                                                                    {cartItem.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        onUpdateQuantity(index, cartItem.quantity + 1)
                                                                    }
                                                                    className="w-6 h-6 border-[0.5px] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white flex items-center justify-center transition-colors"
                                                                >
                                                                    <Plus className="w-3 h-3 text-[#404040]" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {recommendedArtworks.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="font-display text-lg font-bold text-[#404040] mb-3">
                                                You Might Also Like
                                            </h3>
                                            <div className="grid grid-cols-3 gap-2">
                                                {recommendedArtworks.map((art) => (
                                                    <div
                                                        key={art.id}
                                                        className="bg-white p-2 border-[0.5px] border-[#8B6F47]"
                                                    >
                                                        <div className="relative w-full aspect-square overflow-hidden mb-1 bg-gray-100">
                                                            <Image
                                                                src={`/gallery/${art.id}.jpg`}
                                                                alt={art.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <p className="font-sans text-xs text-[#404040] line-clamp-1">
                                                            {art.name}
                                                        </p>
                                                        <p className="font-sans text-xs font-bold text-green-700">
                                                            ₹{art.price.toLocaleString('en-IN')}
                                                        </p>
                                                        <button
                                                            onClick={() => onAddRecommendedItem(`gallery-${art.id}`)}
                                                            className="w-full mt-2 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans text-[10px] sm:text-xs px-2 py-1.5 transition-colors"
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {hasMenuItems && !hasGalleryItems && recommendedMenuItems.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="font-display text-lg font-bold text-[#404040] mb-3">
                                                You Might Also Like
                                            </h3>
                                            <div className="grid grid-cols-3 gap-2">
                                                {recommendedMenuItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="bg-white p-2 border-[0.5px] border-[#8B6F47]"
                                                    >
                                                        <div className="relative w-full aspect-square overflow-hidden mb-1 bg-gray-100">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <p className="font-sans text-xs text-[#404040] line-clamp-1">
                                                            {item.name}
                                                        </p>
                                                        <p className="font-sans text-xs font-bold text-green-700">
                                                            ₹{item.price.toLocaleString('en-IN')}
                                                        </p>
                                                        <button
                                                            onClick={() => onAddRecommendedItem(item.id)}
                                                            className="w-full mt-2 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans text-[10px] sm:text-xs px-2 py-1.5 transition-colors"
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {hasMenuItems && !hasGalleryItems && (
                                        <div className="mb-6">
                                            <label className="block font-sans text-sm font-semibold text-[#404040] mb-3">
                                                How would you like to order?
                                            </label>
                                            <div className="space-y-3">
                                                <label className={`flex items-start gap-3 p-4 border-[0.5px] cursor-pointer transition-colors ${
                                                    orderType === "takeaway-scheduled"
                                                        ? "border-[#8B6F47] bg-white"
                                                        : "border-black bg-[#8B6F47]/5 hover:border-[#8B6F47]/50"
                                                }`}>
                                                    <input
                                                        type="radio"
                                                        name="orderType"
                                                        checked={orderType === "takeaway-scheduled"}
                                                        onChange={() => setOrderType("takeaway-scheduled")}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-lg">🕐</span>
                                                            <span className="font-sans text-sm font-semibold text-[#404040]">
                                                                Takeaway - Schedule Pickup (Recommended)
                                                            </span>
                                                        </div>
                                                        <p className="font-sans text-xs text-[#78716c] mb-2">
                                                            I'll collect my order after some time
                                                        </p>
                                                        {orderType === "takeaway-scheduled" && (
                                                            <select className="w-full p-2 border-[0.5px] border-[#8B6F47] font-sans text-sm bg-white text-black">
                                                                <option>In 15 minutes</option>
                                                                <option>In 30 minutes</option>
                                                                <option>In 1 hour</option>
                                                                <option>In 1.5 hours</option>
                                                                <option>In 2 hours</option>
                                                            </select>
                                                        )}
                                                    </div>
                                                </label>

                                                <label className={`flex items-start gap-3 p-4 border-[0.5px] cursor-pointer transition-colors ${
                                                    orderType === "takeaway-now"
                                                        ? "border-[#8B6F47] bg-white"
                                                        : "border-black bg-[#8B6F47]/5 hover:border-[#8B6F47]/50"
                                                }`}>
                                                    <input
                                                        type="radio"
                                                        name="orderType"
                                                        checked={orderType === "takeaway-now"}
                                                        onChange={() => setOrderType("takeaway-now")}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-lg">🚗</span>
                                                            <span className="font-sans text-sm font-semibold text-[#404040]">
                                                                Takeaway - Ready Now
                                                            </span>
                                                        </div>
                                                        <p className="font-sans text-xs text-[#78716c]">
                                                            I'm outside or nearby, prepare my order now
                                                        </p>
                                                    </div>
                                                </label>

                                                <label className={`flex items-start gap-3 p-4 border-[0.5px] cursor-pointer transition-colors ${
                                                    orderType === "dine-in"
                                                        ? "border-[#8B6F47] bg-white"
                                                        : "border-black bg-[#8B6F47]/5 hover:border-[#8B6F47]/50"
                                                }`}>
                                                    <input
                                                        type="radio"
                                                        name="orderType"
                                                        checked={orderType === "dine-in"}
                                                        onChange={() => setOrderType("dine-in")}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-lg">🏠</span>
                                                            <span className="font-sans text-sm font-semibold text-[#404040]">
                                                                Dine-In (Earn Points!)
                                                            </span>
                                                        </div>
                                                        <p className="font-sans text-xs text-[#78716c]">
                                                            Order from your table and earn reward points
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="border-t-[0.5px] border-[#8B6F47] px-6 py-5" style={{ backgroundColor: "#D8CBB8" }}>
                                {hasMenuItems && !hasGalleryItems && (
                                    <>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="font-serif text-xl text-[#404040]">Total</span>
                                            <span className="font-serif text-2xl font-bold text-green-700">
                                                ₹{total}
                                            </span>
                                        </div>
                                        
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full mb-3 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold px-6 py-4 transition-colors shadow-lg border-[0.5px] border-[#8B6F47]"
                                        >
                                            Pay Now
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-white hover:bg-gray-50 text-[#8B6F47] font-sans font-semibold px-6 py-4 transition-colors shadow-lg border-[0.5px] border-[#8B6F47] flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download Bill
                                        </motion.button>
                                    </>
                                )}

                                {hasGalleryItems && (
                                    <>
                                        <div className="mb-4 p-4 bg-white border-[0.5px] border-[#8B6F47]">
                                            <p className="font-sans text-sm text-[#404040] mb-2">
                                                <strong>Payment Method:</strong> Cash at Café
                                            </p>
                                            <p className="font-sans text-xs text-[#78716c]">
                                                Visit Rabuste Coffee, show your booking number, pay in cash, and collect your artwork.
                                            </p>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleConfirmBooking}
                                            className="w-full bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold px-6 py-4 transition-colors shadow-lg border-[0.5px] border-[#8B6F47]"
                                        >
                                            Confirm Booking
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
