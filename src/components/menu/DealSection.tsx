"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock } from "lucide-react";
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

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            const diff = endOfDay.getTime() - now.getTime();

            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft({ hours, minutes, seconds });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-baseline justify-center gap-2"
        >
            <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-[#8B6F47] self-center" />
            <span className="font-sans text-base lg:text-lg text-[#262626] font-semibold">
                Ends in
            </span>
            <motion.span
                key={timeLeft.seconds}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                className="font-serif text-xl lg:text-2xl font-bold text-[#8B6F47] tracking-wide"
            >
                {String(timeLeft.hours).padStart(2, '0')}
                <span className="text-[#262626] animate-pulse">:</span>
                {String(timeLeft.minutes).padStart(2, '0')}
                <span className="text-[#262626] animate-pulse">:</span>
                {String(timeLeft.seconds).padStart(2, '0')}
            </motion.span>
        </motion.div>
    );
}

export function DealSection({
    dealItems,
    onItemClick,
    onAddToCart,
    onUpdateQuantity,
    getCartQuantity,
}: DealSectionProps) {
    if (dealItems.length === 0) return null;

    return (
        <section className="relative w-full py-8 lg:py-12" style={{ backgroundColor: "#b8a890" }}>
            <div className="mx-auto w-full px-4 lg:px-6 max-w-7xl">
                {/* Header - Matching product grid style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-8"
                >
                    <div className="flex items-center justify-center py-4 border-t-[0.5px] border-b-[0.5px] border-[#8B6F47] w-full mb-6">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <Sparkles className="w-5 h-5 lg:w-7 lg:h-7 text-amber-600 fill-amber-600 animate-pulse" />
                            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#262626] uppercase tracking-[0.1em] sm:tracking-[0.15em] lg:tracking-[0.2em] mx-2 sm:mx-4 whitespace-nowrap">
                                Deal of the Day
                            </h2>
                            <Sparkles className="w-5 h-5 lg:w-7 lg:h-7 text-amber-600 fill-amber-600 animate-pulse" />
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    <CountdownTimer />
                </motion.div>

                {/* Deal Items Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-6">
                    {dealItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <CoffeeCard
                                item={item}
                                onCardClick={onItemClick}
                                onAddToCart={onAddToCart}
                                onUpdateQuantity={onUpdateQuantity}
                                cartQuantity={getCartQuantity(String(item.id))}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
