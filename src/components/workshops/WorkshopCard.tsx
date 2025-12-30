"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Users, MessageSquare, X } from "lucide-react";

interface Workshop {
    id: string;
    title: string;
    date: string;
    attendees: number;
    image: string;
    description: string;
    reviews: Array<{
        name: string;
        comment: string;
        date: string;
    }>;
}

interface WorkshopCardProps {
    workshop: Workshop;
    index: number;
    activeReviewWorkshopId: string | null;
    setActiveReviewWorkshopId: (id: string | null) => void;
}

export function WorkshopCard({
    workshop,
    index,
    activeReviewWorkshopId,
    setActiveReviewWorkshopId
}: WorkshopCardProps) {
    const imgRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: imgRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 400,
        damping: 90
    });

    const y = useTransform(smoothProgress, [0, 1], ["20%", "-20%"]);

    return (
        <div
            className="sticky w-full flex items-start justify-center p-2 lg:p-4"
            style={{
                top: `${20 + (index * 5)}px`,
                height: '100vh',
                marginBottom: '-5vh',
                zIndex: index + 1
            }}
        >
            <div className="w-full max-w-[85vw] mx-auto bg-[#E8DBC8] rounded-xl shadow-[0_-5px_30px_rgba(0,0,0,0.15)] overflow-hidden border border-[#8B6F47]/20 relative flex flex-col lg:flex-row h-[85vh]">
                {/* Mobile Layout: Title First */}
                <div className="lg:hidden px-6 pt-6 pb-2 shrink-0 text-center">
                    <div className="flex items-center justify-center gap-2 text-[#8B6F47] mb-2 text-[10px] font-bold tracking-widest uppercase font-oswald">
                        <span>{workshop.date}</span>
                        <span className="w-1 h-1 bg-current rounded-full" />
                        <span>{workshop.attendees} Attendees</span>
                    </div>
                    <h3 className="font-display text-xl text-[#2A2A2A] leading-none uppercase tracking-wide">
                        {workshop.title}
                    </h3>
                </div>

                {/* Left Side - Image with Parallax */}
                <div className="lg:w-[40%] p-4 lg:p-8 flex items-center justify-center bg-[#E0D4C3] shrink-0 h-[40vh] lg:h-auto">
                    <div className="relative w-full h-full lg:aspect-[4/5] shadow-2xl rotate-1 group max-w-md lg:h-auto">
                        <div ref={imgRef} className="relative w-full h-full overflow-hidden">
                            <motion.div style={{ y, scale: 1.5 }} className="relative w-full h-full">
                                <Image
                                    src={workshop.image}
                                    alt={workshop.title}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </motion.div>
                        </div>
                        {/* Painting Border */}
                        <div className="absolute inset-0 border-[12px] lg:border-[16px] border-white pointer-events-none" />

                        {/* Date Sticker */}
                        <div className="hidden lg:block absolute -top-6 -left-6 bg-[#8B6F47] text-white p-4 shadow-xl rotate-[-8deg] z-10">
                            <p className="font-oswald text-sm tracking-widest uppercase text-center leading-none">
                                {workshop.date.split(" ")[0]}<br />
                                <span className="text-2xl font-bold">{workshop.date.split(" ")[1]}</span>
                            </p>
                        </div>

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="lg:w-[60%] p-6 lg:p-16 flex flex-col h-full bg-white/60 backdrop-blur-sm overflow-hidden text-left relative">
                    <div className="hidden lg:block mb-8 shrink-0">
                        <div className="flex items-center gap-3 text-[#8B6F47] mb-4 text-xs font-bold tracking-[0.2em] uppercase font-oswald">
                            <Users className="w-4 h-4" />
                            <span>{workshop.attendees} Attendees</span>
                        </div>
                        <h3 className="font-display text-2xl lg:text-4xl text-[#2A2A2A] mb-4 leading-none uppercase tracking-widest">
                            {workshop.title}
                        </h3>
                        <div className="w-16 h-1 bg-[#8B6F47]" />
                    </div>

                    <div className="prose prose-stone mb-4 lg:mb-8 shrink-0 max-w-none text-center lg:text-left px-2 lg:px-0">
                        <p className="font-serif text-xl lg:text-2xl text-[#404040] leading-snug line-clamp-4 lg:line-clamp-6">
                            {workshop.description}
                        </p>
                    </div>

                    <div className="lg:hidden mt-auto pb-6 text-center">
                        <button
                            onClick={() => setActiveReviewWorkshopId(workshop.id)}
                            className="bg-[#8B6F47] text-white font-oswald text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-lg"
                        >
                            View Reviews
                        </button>
                    </div>

                    <div className="hidden lg:flex mt-auto flex-1 min-h-0 flex-col pt-6 border-t border-[#8B6F47]/20">
                        <div className="flex items-center gap-3 mb-6">
                            <MessageSquare className="w-5 h-5 text-[#8B6F47]" />
                            <h4 className="font-oswald text-sm uppercase tracking-widest text-[#404040] font-bold">
                                What Participants Said
                            </h4>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                            {workshop.reviews.map((review, idx) => (
                                <div key={idx} className="bg-white/70 p-5 rounded-lg shadow-sm border border-[#8B6F47]/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B6F47] to-[#6F4E28] flex items-center justify-center text-white font-bold text-sm">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-oswald text-sm font-bold text-[#2A2A2A]">{review.name}</p>
                                            <p className="text-xs text-[#8B6F47] font-oswald">{review.date}</p>
                                        </div>
                                    </div>
                                    <p className="font-serif text-sm md:text-base text-[#404040] leading-relaxed italic">
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence>
                        {activeReviewWorkshopId === workshop.id && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-end"
                                onClick={() => setActiveReviewWorkshopId(null)}
                            >
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "100%" }}
                                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                    className="w-full bg-[#E8DBC8] rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="sticky top-0 bg-[#8B6F47] text-white px-6 py-4 flex items-center justify-between z-10 shadow-lg">
                                        <h4 className="font-oswald text-sm uppercase tracking-widest font-bold">Workshop Details</h4>
                                        <button
                                            onClick={() => setActiveReviewWorkshopId(null)}
                                            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-xl border-8 border-white">
                                            <Image
                                                src={workshop.image}
                                                alt={workshop.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="font-display text-2xl text-[#2A2A2A] mb-3 uppercase tracking-wide">{workshop.title}</h3>
                                            <p className="font-serif text-base text-[#404040] leading-relaxed mb-4">{workshop.description}</p>
                                            <div className="flex items-center gap-2 text-[#8B6F47] text-xs font-bold font-oswald">
                                                <span>{workshop.date}</span>
                                                <span className="w-1 h-1 bg-current rounded-full" />
                                                <span>{workshop.attendees} Attendees</span>
                                            </div>
                                        </div>

                                        <div className="border-t border-[#8B6F47]/20 pt-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <MessageSquare className="w-5 h-5 text-[#8B6F47]" />
                                                <h4 className="font-oswald text-sm uppercase tracking-widest text-[#404040] font-bold">
                                                    Participant Reviews
                                                </h4>
                                            </div>

                                            <div className="space-y-4">
                                                {workshop.reviews.map((review, idx) => (
                                                    <div key={idx} className="bg-white/70 p-4 rounded-lg shadow-sm">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B6F47] to-[#6F4E28] flex items-center justify-center text-white font-bold text-xs">
                                                                {review.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-oswald text-sm font-bold text-[#2A2A2A]">{review.name}</p>
                                                                <p className="text-xs text-[#8B6F47] font-oswald">{review.date}</p>
                                                            </div>
                                                        </div>
                                                        <p className="font-serif text-sm md:text-base text-[#404040] leading-relaxed italic">
                                                            {review.comment}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
