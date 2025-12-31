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
            <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-amber-200 self-center" />
            <span className="font-sans text-base lg:text-lg text-amber-100">
                Ends in
            </span>
            <motion.span
                key={timeLeft.seconds}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                className="font-display text-xl lg:text-2xl font-bold text-white tracking-wide"
            >
                {String(timeLeft.hours).padStart(2, '0')}
                <span className="text-amber-300 animate-pulse">:</span>
                {String(timeLeft.minutes).padStart(2, '0')}
                <span className="text-amber-300 animate-pulse">:</span>
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
        <section className="relative w-full py-8 lg:py-12" style={{ backgroundColor: "#8B6F47" }}>
            <div className="mx-auto w-full px-4 lg:px-6 max-w-7xl">
                {/* Header - Styled like WhyRobusta */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-8"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-amber-200" />
                        <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-amber-50">
                            Deal of the Day
                        </h2>
                        <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-amber-200" />
                    </div>
                    
                    {/* Title Separator */}
                    <div className="relative w-28 h-6 lg:w-36 lg:h-8 mb-4">
                        <Image
                            src="/title-separator.png"
                            fill
                            alt="Decorative separator"
                            className="object-contain brightness-200"
                            sizes="(max-width: 768px) 112px, 144px"
                        />
                    </div>

                    {/* Countdown Timer - Red for urgency */}
                    <CountdownTimer />
                    
                    <p className="font-sans text-sm lg:text-base text-amber-100 mt-3">
                        Limited time offers - grab them while they last!
                    </p>
                </motion.div>

                {/* Deal Items Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
                                cartQuantity={getCartQuantity(item.id)}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
