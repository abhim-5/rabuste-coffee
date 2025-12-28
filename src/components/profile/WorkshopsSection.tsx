"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, User, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Workshop } from "@/types/menu";

interface WorkshopsSectionProps {
    workshops: Workshop[];
}

export function WorkshopsSection({ workshops }: WorkshopsSectionProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    return (
        <section className="w-full py-12 lg:py-16 bg-white">
            <div className="mx-auto w-full px-4 lg:px-6 max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <GraduationCap className="w-7 h-7 text-[#8B6F47]" />
                        <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#404040]">
                            Workshops Attended
                        </h2>
                    </div>
                    <p className="font-sans text-base text-[#78716c]">
                        Your learning journey with Rabuste
                    </p>
                </motion.div>

                {/* Workshops Grid */}
                {workshops.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workshops.map((workshop, index) => (
                            <motion.div
                                key={workshop.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="bg-[#D8CBB8]/20 rounded-2xl overflow-hidden border border-[#8B6F47]/20 shadow-md hover:shadow-xl transition-all"
                            >
                                {/* Workshop Image */}
                                <div className="relative w-full aspect-video">
                                    <Image
                                        src={workshop.image}
                                        alt={workshop.title}
                                        fill
                                        className="object-cover"
                                    />
                                    {workshop.attended && (
                                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="font-sans text-xs font-bold">Attended</span>
                                        </div>
                                    )}
                                </div>

                                {/* Workshop Details */}
                                <div className="p-5">
                                    <h3 className="font-serif text-xl font-semibold text-[#404040] mb-3 line-clamp-2">
                                        {workshop.title}
                                    </h3>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[#78716c]">
                                            <User className="w-4 h-4" />
                                            <span className="font-sans text-sm">By {workshop.host}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#78716c]">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-sans text-sm">{formatDate(workshop.date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center py-12 bg-[#D8CBB8]/10 rounded-2xl"
                    >
                        <GraduationCap className="w-16 h-16 text-[#78716c] mx-auto mb-4" />
                        <p className="font-serif text-xl text-[#404040] mb-2">
                            No workshops attended yet
                        </p>
                        <p className="font-sans text-sm text-[#78716c] mb-6">
                            Join our workshops to learn and earn rewards!
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold rounded-full transition-colors shadow-md"
                        >
                            Browse Workshops
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
