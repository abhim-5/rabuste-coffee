"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";
import { MenuItem } from "@/types/menu";
import { CoffeeCard } from "./CoffeeCard";

interface DealSectionProps {
    dealItems: MenuItem[];
    onItemClick: (item: MenuItem) => void;
    onAddToCart: (item: MenuItem) => void;
    onUpdateQuantity: (item: MenuItem, change: number) => void;
    getCartQuantity: (itemId: string) => number;
}

interface ProductCountdownProps {
    expiryDate: string;
    onExpire: () => void;
}

function ProductCountdown({ expiryDate, onExpire }: ProductCountdownProps) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!expiryDate) return;

            const now = new Date().getTime();
            const end = new Date(expiryDate).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
                onExpire();
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds, isExpired: false });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [expiryDate, onExpire]);

    if (!timeLeft || timeLeft.isExpired) return null;

    // Determine color based on urgency
    const isUrgent = timeLeft.hours < 1;
    const textColor = isUrgent ? "text-red-600" : "text-[#8B6F47]";

    return (
        <div className={`flex items-center gap-1.5 text-xs font-bold ${textColor} bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-current/20`}>
            <Clock className="w-3 h-3" />
            <span className="font-mono tracking-wide">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
            </span>
        </div>
    );
}

export function DealSection({
    dealItems,
    onItemClick,
    onAddToCart,
    onUpdateQuantity,
    getCartQuantity,
}: DealSectionProps) {
    const [activeDeals, setActiveDeals] = useState<MenuItem[]>([]);

    // Initialize deals and filter out already expired ones immediately
    useEffect(() => {
        const now = new Date().getTime();
        const validDeals = dealItems.filter(item => {
            if (!item.dealExpiry) return true; // Keep if no expiry set (assumed permanent deal or handle elsewhere)
            return new Date(item.dealExpiry).getTime() > now;
        });
        setActiveDeals(validDeals);
    }, [dealItems]);

    const handleExpire = (itemId: string | number) => {
        setActiveDeals(prev => prev.filter(item => item.id !== itemId));
    };

    if (activeDeals.length === 0) return null;

    return (
        <section className="relative w-full py-8 lg:py-12 bg-gradient-to-b from-[#b8a890] to-[#c5b59d]">
            <div className="mx-auto w-full px-4 lg:px-6 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-10"
                >
                    <div className="relative">
                        <div className="flex items-center gap-3 px-8 py-3 bg-[#262626] text-[#b8a890] rounded-full shadow-xl border border-[#b8a890]/30 transform hover:scale-105 transition-transform duration-300">
                            <Sparkles className="w-5 h-5 animate-pulse text-amber-400" />
                            <h2 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold uppercase tracking-[0.15em] mx-2">
                                Limited Time Deals
                            </h2>
                            <Sparkles className="w-5 h-5 animate-pulse text-amber-400" />
                        </div>
                        {/* Decorative line */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#262626]/20 -z-10 transform scale-x-150" />
                    </div>
                    
                    <p className="mt-4 font-sans text-[#262626]/70 text-sm font-medium">
                        Grab them before the timer runs out!
                    </p>
                </motion.div>

                {/* Deal Items Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-8">
                    <AnimatePresence>
                        {activeDeals.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                                transition={{ duration: 0.4 }}
                                className="relative"
                            >
                                {/* Countdown Overlay - Positioned appropriately for the card */}
                                {item.dealExpiry && (
                                    <div className="absolute top-3 right-3 z-20">
                                        <ProductCountdown 
                                            expiryDate={item.dealExpiry} 
                                            onExpire={() => handleExpire(item.id)} 
                                        />
                                    </div>
                                )}
                                
                                <CoffeeCard
                                    item={item}
                                    onCardClick={onItemClick}
                                    onAddToCart={onAddToCart}
                                    onUpdateQuantity={onUpdateQuantity}
                                    cartQuantity={getCartQuantity(String(item.id))}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
