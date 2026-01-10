"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, User, GraduationCap, ChevronRight } from "lucide-react";
import { Workshop } from "@/types/menu";

interface WorkshopsSectionProps {
    workshops: Workshop[];
    totalSpent: number;
    isDesktop?: boolean;
}

export function WorkshopsSection({ workshops, totalSpent, isDesktop = false }: WorkshopsSectionProps) {
    const [showAll, setShowAll] = useState(false);

    if (workshops.length === 0 && !isDesktop) return null;

    const displayedWorkshops = showAll ? workshops : workshops.slice(0, isDesktop ? 4 : 2);

    // Desktop version
    if (isDesktop) {
        return (
            <div className="space-y-4">
                {workshops.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            {displayedWorkshops.map((workshop, index) => (
                                <motion.div
                                    key={workshop.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[#F5F0EB] rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                                >
                                    <div className="flex gap-4 p-4">
                                        <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden">
                                            <Image
                                                src={workshop.image}
                                                alt={workshop.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="96px"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-sans text-base font-semibold text-[#262626] mb-1 line-clamp-1">
                                                    {workshop.title}
                                                </h3>
                                                <p className="font-sans text-sm text-[#78716c] mb-2">
                                                    Host: {workshop.host}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    workshop.status === 'confirmed' 
                                                    ? "bg-green-100 text-green-700" 
                                                    : workshop.status === 'pending'
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}>
                                                    {workshop.status === 'confirmed' ? "Confirmed" : 
                                                     workshop.status === 'pending' ? "Pending" : 
                                                     workshop.status || 'Pending'}
                                                </span>
                                                <span className="font-display text-lg font-bold text-[#8B6F47]">
                                                    ₹{workshop.price || 500}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {workshops.length > 4 && !showAll && (
                            <button
                                onClick={() => setShowAll(true)}
                                className="w-full flex items-center justify-center gap-2 py-3 text-[#8B6F47] hover:text-[#6d5638] font-sans font-semibold text-sm transition-colors"
                            >
                                View all {workshops.length} workshops
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}

                        {showAll && workshops.length > 4 && (
                            <button
                                onClick={() => setShowAll(false)}
                                className="w-full flex items-center justify-center gap-2 py-3 text-[#78716c] hover:text-[#404040] font-sans font-semibold text-sm transition-colors"
                            >
                                Show less
                            </button>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <GraduationCap className="w-16 h-16 text-[#d6d3d1] mx-auto mb-4" />
                        <p className="font-display text-xl text-[#404040] mb-2">No workshops yet</p>
                        <p className="font-sans text-sm text-[#78716c]">
                            Check out our upcoming workshops!
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <section className="w-full py-8 lg:py-10" style={{ backgroundColor: "#D8CBB8" }}>
            <div className="mx-auto w-full px-4 lg:px-6 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center mb-8"
                >
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#404040] mb-3 text-center">
                        My Workshops
                    </h2>
                    <div className="relative w-24 h-6 mb-3">
                        <Image
                            src="/title-separator.png"
                            fill
                            alt=""
                            className="object-contain"
                        />
                    </div>
                    <p className="font-sans text-sm text-[#78716c] text-center">
                        {workshops.length} workshops • <span className="font-semibold text-[#8B6F47]">₹{totalSpent.toLocaleString()} spent</span>
                    </p>
                </motion.div>

                <div className="relative">
                    <div className="space-y-3">
                        {displayedWorkshops.map((workshop, index) => {
                            const isSecondItem = index === 1 && !showAll && workshops.length > 2;

                            return (
                                <motion.div
                                    key={workshop.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isSecondItem ? 'relative border-0' : 'border border-[#8B6F47]/10'}`}
                                >
                                    {/* Gradient overlay for second item */}
                                    {isSecondItem && (
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-[#D8CBB8] z-10 pointer-events-none" />
                                    )}

                                    <div className="flex items-center gap-4 p-4">
                                        <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden">
                                            <Image
                                                src={workshop.image}
                                                alt={workshop.title}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-sans text-sm font-semibold text-[#262626] mb-1 line-clamp-1">
                                                {workshop.title}
                                            </h3>
                                            <p className="font-sans text-xs text-[#78716c] mb-2">
                                                Host: {workshop.host}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    workshop.status === 'confirmed' 
                                                    ? "bg-green-100 text-green-700" 
                                                    : workshop.status === 'pending'
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}>
                                                    {workshop.status === 'confirmed' ? "Confirmed" : 
                                                     workshop.status === 'pending' ? "Pending" : 
                                                     workshop.status || 'Pending'}
                                                </span>
                                                <span className="text-xs text-[#a8a29e]">•</span>
                                                <span className="font-sans text-xs text-[#78716c]">
                                                    {new Date(workshop.date).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 text-right">
                                            <span className="font-sans text-sm font-bold text-[#8B6F47]">
                                                ₹{workshop.price || 500}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* View More Button */}
                    {workshops.length > 2 && !showAll && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setShowAll(true)}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/60 hover:bg-white/80 text-[#8B6F47] font-sans text-sm font-medium rounded-full transition-colors"
                        >
                            View all {workshops.length} workshops
                            <ChevronRight className="w-3 h-3" />
                        </motion.button>
                    )}

                    {showAll && workshops.length > 2 && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setShowAll(false)}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/60 hover:bg-white/80 text-[#78716c] font-sans text-sm font-medium rounded-full transition-colors"
                        >
                            Show less
                        </motion.button>
                    )}
                </div>
            </div>
        </section>
    );
}
