"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, User } from "lucide-react";
import { Workshop } from "@/types/menu";

interface WorkshopsSectionProps {
    workshops: Workshop[];
}

export function WorkshopsSection({ workshops }: WorkshopsSectionProps) {
    if (workshops.length === 0) return null;

    return (
        <section className="py-12 px-4 lg:px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
            >
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#404040] mb-2">
                    My Workshops
                </h2>
                <p className="font-serif text-[#78716c]">
                    History of workshops you have attended or booked.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workshops.map((workshop, index) => (
                    <motion.div
                        key={workshop.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#e7e5e4] hover:shadow-md transition-shadow"
                    >
                        <div className="relative h-48 w-full group">
                            <Image
                                src={workshop.image}
                                alt={workshop.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        </div>

                        <div className="p-5">
                            <h3 className="font-display text-xl font-bold text-[#262626] mb-3 line-clamp-1">
                                {workshop.title}
                            </h3>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[#57534e]">
                                    <User className="w-4 h-4 text-[#8B6F47]" />
                                    <span className="font-sans text-sm">Host: {workshop.host}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#57534e]">
                                    <Calendar className="w-4 h-4 text-[#8B6F47]" />
                                    <span className="font-sans text-sm">
                                        {format(new Date(workshop.date), "MMMM d, yyyy")}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[#f5f5f4] flex justify-between items-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${workshop.attended
                                        ? "bg-green-100 text-green-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}>
                                    {workshop.attended ? "Completed" : "Upcoming"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
