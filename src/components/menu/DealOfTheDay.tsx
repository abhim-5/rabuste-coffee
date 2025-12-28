"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { dealsOfTheDay } from "@/data/menuData";

export function DealOfTheDay() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(23, 59, 59, 999);

            const diff = midnight.getTime() - now.getTime();

            if (diff > 0) {
                setTimeLeft({
                    hours: Math.floor(diff / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000),
                });
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section
            className="relative w-full overflow-hidden py-6 lg:py-8"
            style={{ backgroundColor: "#8B6F47" }}
        >
            <div className="relative z-10 mx-auto w-full px-4 lg:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-6"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-amber-200" />
                        <h2 className="font-display text-2xl lg:text-4xl font-bold text-amber-50">
                            Deal of the Day
                        </h2>
                        <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-amber-200" />
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-2 text-amber-100">
                        <Clock className="w-4 h-4" />
                        <span className="font-sans text-sm lg:text-base">
                            Ends in: {String(timeLeft.hours).padStart(2, "0")}:
                            {String(timeLeft.minutes).padStart(2, "0")}:
                            {String(timeLeft.seconds).padStart(2, "0")}
                        </span>
                    </div>
                </motion.div>

                {/* Marquee Animation */}
                <div className="w-full overflow-hidden">
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{
                            x: ["0%", "-50%"],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {[...dealsOfTheDay, ...dealsOfTheDay].map((deal, index) => (
                            <div
                                key={index}
                                className="inline-flex items-center mx-4 lg:mx-6"
                            >
                                <span className="font-serif text-lg lg:text-2xl text-amber-50">
                                    ✦ {deal.title}
                                </span>
                                <span className="mx-3 font-sans text-base lg:text-xl text-amber-200 font-semibold">
                                    {deal.discount}% OFF
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
