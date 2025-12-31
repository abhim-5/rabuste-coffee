"use client";

import { motion, AnimatePresence } from "framer-motion";
<<<<<<< HEAD
import { X, Minus, Plus, ShoppingBag, Clock, Download } from "lucide-react";
import Image from "next/image";
import { CartItem } from "@/types/menu";
import { useState } from "react";
import { getRecommendedItems } from "@/data/menuData";
=======
import { X, Minus, Plus, ShoppingBag, Download } from "lucide-react";
import Image from "next/image";
import { CartItem } from "@/types/menu";
import { useState } from "react";
import { menuItems } from "@/data/menuData";
>>>>>>> 0a026f9 (Polished the menu page)

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

<<<<<<< HEAD
=======
type OrderType = "dine-in" | "takeaway-now" | "takeaway-scheduled";

>>>>>>> 0a026f9 (Polished the menu page)
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
<<<<<<< HEAD
    const [pickupTime, setPickupTime] = useState<string>("30");
    const recommendedItems = getRecommendedItems().slice(0, 3);
=======
    const [orderType, setOrderType] = useState<OrderType>("takeaway-scheduled");
    const [scheduledTime, setScheduledTime] = useState<string>("30");
    const recommendedItems = menuItems.filter(i => i.rating >= 4.8).slice(0, 3);
>>>>>>> 0a026f9 (Polished the menu page)

    const handlePayNow = () => {
        alert("Payment UI would be integrated here. This is a frontend mockup.");
    };

    const handleDownloadBill = () => {
        alert("Bill download functionality would be implemented here.");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
<<<<<<< HEAD
                    {/* Backdrop */}
=======
>>>>>>> 0a026f9 (Polished the menu page)
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

<<<<<<< HEAD
                    {/* Cart Drawer */}
=======
>>>>>>> 0a026f9 (Polished the menu page)
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full lg:w-[480px] bg-[#fafaf9] shadow-2xl z-50 flex flex-col"
                    >
<<<<<<< HEAD
                        {/* Header */}
=======
>>>>>>> 0a026f9 (Polished the menu page)
                        <div className="bg-[#8B6F47] px-6 py-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6 text-amber-50" />
                                <div>
                                    <h2 className="font-display text-2xl font-bold text-amber-50">
                                        Your Cart
                                    </h2>
                                    <p className="font-sans text-sm text-amber-100">
                                        {itemCount} {itemCount === 1 ? "item" : "items"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-6 h-6 text-amber-50" />
                            </button>
                        </div>

<<<<<<< HEAD
                        {/* Cart Content */}
=======
>>>>>>> 0a026f9 (Polished the menu page)
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
<<<<<<< HEAD
                                    {/* Cart Items */}
=======
>>>>>>> 0a026f9 (Polished the menu page)
                                    <div className="space-y-4 mb-6">
                                        {items.map((cartItem, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="bg-white rounded-xl p-4 shadow-sm border border-[#8B6F47]/20"
                                            >
                                                <div className="flex gap-4">
<<<<<<< HEAD
                                                    {/* Image */}
=======
>>>>>>> 0a026f9 (Polished the menu page)
                                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={cartItem.menuItem.image}
                                                            alt={cartItem.menuItem.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

<<<<<<< HEAD
                                                    {/* Details */}
=======
>>>>>>> 0a026f9 (Polished the menu page)
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-serif text-base text-[#404040] mb-1 line-clamp-1">
                                                            {cartItem.menuItem.name}
                                                        </h3>

<<<<<<< HEAD
                                                        {/* Selected Variations */}
                                                        {cartItem.selectedVariations && (
                                                            <div className="flex flex-wrap gap-1 mb-2">
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
                                                                                className="font-sans text-xs text-[#78716c] bg-[#D8CBB8]/30 px-2 py-0.5 rounded"
                                                                            >
                                                                                {option.name}
                                                                            </span>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Price and Quantity */}
=======
>>>>>>> 0a026f9 (Polished the menu page)
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-sans text-lg font-bold text-[#262626]">
                                                                ₹{cartItem.subtotal}
                                                            </span>

<<<<<<< HEAD
                                                            {/* Quantity Controls */}
=======
>>>>>>> 0a026f9 (Polished the menu page)
                                                            <div className="flex items-center gap-2 bg-[#D8CBB8]/30 rounded-full px-2 py-1">
                                                                <button
                                                                    onClick={() => {
                                                                        if (cartItem.quantity === 1) {
                                                                            onRemoveItem(index);
                                                                        } else {
                                                                            onUpdateQuantity(index, cartItem.quantity - 1);
                                                                        }
                                                                    }}
                                                                    className="w-6 h-6 rounded-full bg-[#8B6F47]/20 hover:bg-[#8B6F47]/40 flex items-center justify-center transition-colors"
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
                                                                    className="w-6 h-6 rounded-full bg-[#8B6F47]/20 hover:bg-[#8B6F47]/40 flex items-center justify-center transition-colors"
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

<<<<<<< HEAD
                                    {/* You Might Also Like */}
=======
>>>>>>> 0a026f9 (Polished the menu page)
                                    {recommendedItems.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="font-display text-lg font-bold text-[#404040] mb-3">
                                                You Might Also Like
                                            </h3>
                                            <div className="grid grid-cols-3 gap-2">
                                                {recommendedItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => onAddRecommendedItem(item.id)}
                                                        className="bg-white rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow border border-[#8B6F47]/20"
                                                    >
                                                        <div className="relative w-full aspect-square rounded-md overflow-hidden mb-1">
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
                                                        <p className="font-sans text-xs font-bold text-[#262626]">
                                                            ₹{item.price}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

<<<<<<< HEAD
                                    {/* Pickup Time */}
                                    <div className="mb-6">
                                        <label className="flex items-center gap-2 font-sans text-sm font-semibold text-[#404040] mb-3">
                                            <Clock className="w-4 h-4" />
                                            Pickup/Delivery Time
                                        </label>
                                        <select
                                            value={pickupTime}
                                            onChange={(e) => setPickupTime(e.target.value)}
                                            className="w-full bg-white border border-[#8B6F47]/30 rounded-lg px-4 py-3 font-sans text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#8B6F47]"
                                        >
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="45">45 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="90">1.5 hours</option>
                                            <option value="120">2 hours</option>
                                        </select>
=======
                                    {/* Ordering Options */}
                                    <div className="mb-6">
                                        <h3 className="font-sans text-sm font-semibold text-[#404040] mb-3">
                                            How would you like to order?
                                        </h3>

                        <div className="space-y-3">
                            {/* 1. Takeaway Scheduled Option - FIRST (Promoted) */}
                            <label
                                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${orderType === 'takeaway-scheduled'
                                        ? 'border-[#8B6F47] bg-[#8B6F47]/5'
                                        : 'border-[#8B6F47]/20 bg-white hover:border-[#8B6F47]/40'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="orderType"
                                    checked={orderType === "takeaway-scheduled"}
                                    onChange={() => setOrderType("takeaway-scheduled")}
                                    className="mt-1 w-5 h-5 text-[#8B6F47] focus:ring-[#8B6F47]"
                                />
                                <div className="flex-1">
                                    <p className="font-sans text-base font-semibold text-[#404040] mb-1">
                                        ⏰ Takeaway - Schedule Pickup (Recommended)
                                    </p>
                                    <p className="font-sans text-xs text-[#78716c] mb-3">
                                        I'll collect my order after some time
                                    </p>

                                    {/* Time Selector - only show when this option is selected */}
                                    {orderType === "takeaway-scheduled" && (
                                        <select
                                            value={scheduledTime}
                                            onChange={(e) => setScheduledTime(e.target.value)}
                                            className="w-full bg-white border border-[#8B6F47]/30 rounded-lg px-3 py-2 font-sans text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#8B6F47]"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="15">In 15 minutes</option>
                                            <option value="30">In 30 minutes</option>
                                            <option value="45">In 45 minutes</option>
                                            <option value="60">In 1 hour</option>
                                            <option value="90">In 1.5 hours</option>
                                            <option value="120">In 2 hours</option>
                                        </select>
                                    )}
                                </div>
                            </label>

                            {/* 2. Takeaway Now Option */}
                            <label
                                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${orderType === 'takeaway-now'
                                        ? 'border-[#8B6F47] bg-[#8B6F47]/5'
                                        : 'border-[#8B6F47]/20 bg-white hover:border-[#8B6F47]/40'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="orderType"
                                    checked={orderType === "takeaway-now"}
                                    onChange={() => setOrderType("takeaway-now")}
                                    className="mt-1 w-5 h-5 text-[#8B6F47] focus:ring-[#8B6F47]"
                                />
                                <div className="flex-1">
                                    <p className="font-sans text-base font-semibold text-[#404040] mb-1">
                                        🚗 Takeaway - Ready Now
                                    </p>
                                    <p className="font-sans text-xs text-[#78716c]">
                                        I'm outside or nearby, prepare my order now
                                    </p>
                                </div>
                            </label>

                            {/* 3. Dine-in Option */}
                            <label
                                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${orderType === 'dine-in'
                                        ? 'border-[#8B6F47] bg-[#8B6F47]/5'
                                        : 'border-[#8B6F47]/20 bg-white hover:border-[#8B6F47]/40'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="orderType"
                                    checked={orderType === "dine-in"}
                                    onChange={() => setOrderType("dine-in")}
                                    className="mt-1 w-5 h-5 text-[#8B6F47] focus:ring-[#8B6F47]"
                                />
                                <div className="flex-1">
                                    <p className="font-sans text-base font-semibold text-[#404040] mb-1">
                                        🪑 Dine-In (Earn Points!)
                                    </p>
                                    <p className="font-sans text-xs text-[#78716c]">
                                        Order from your table and earn reward points
                                    </p>
                                </div>
                            </label>
                        </div>

>>>>>>> 0a026f9 (Polished the menu page)
                                    </div>
                                </>
                            )}
                        </div>

<<<<<<< HEAD
                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="bg-white border-t border-[#8B6F47]/20 px-6 py-5">
                                {/* Total */}
=======
                        {items.length > 0 && (
                            <div className="bg-white border-t border-[#8B6F47]/20 px-6 py-5">
>>>>>>> 0a026f9 (Polished the menu page)
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-serif text-xl text-[#404040]">Total</span>
                                    <span className="font-serif text-2xl font-bold text-[#262626]">
                                        ₹{total}
                                    </span>
                                </div>

<<<<<<< HEAD
                                {/* Actions */}
=======
>>>>>>> 0a026f9 (Polished the menu page)
                                <div className="space-y-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handlePayNow}
                                        className="w-full bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold px-6 py-4 rounded-full transition-colors shadow-lg"
                                    >
                                        Pay Now
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleDownloadBill}
                                        className="w-full bg-[#D8CBB8] hover:bg-[#c9bca9] text-[#404040] font-sans font-semibold px-6 py-4 rounded-full transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download Bill
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
<<<<<<< HEAD
=======

>>>>>>> 0a026f9 (Polished the menu page)
