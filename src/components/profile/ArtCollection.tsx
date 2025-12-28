"use client";

import { motion } from "framer-motion";
import { Palette, User as UserIcon, Calendar, IndianRupee } from "lucide-react";
import Image from "next/image";
import { ArtPiece } from "@/types/menu";

interface ArtCollectionProps {
    artPieces: ArtPiece[];
}

export function ArtCollection({ artPieces }: ArtCollectionProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-IN", {
            month: "short",
            year: "numeric",
        }).format(date);
    };

    const totalValue = artPieces.reduce((sum, piece) => sum + piece.price, 0);

    return (
        <section className="w-full py-12 lg:py-16" style={{ backgroundColor: "#D8CBB8" }}>
            <div className="mx-auto w-full px-4 lg:px-6 max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                            <Palette className="w-7 h-7 text-[#8B6F47]" />
                            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#404040]">
                                Art Collection
                            </h2>
                        </div>
                        {artPieces.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#8B6F47]/30">
                                <p className="font-sans text-sm text-[#78716c]">
                                    Total Value:{" "}
                                    <span className="font-bold text-[#262626]">
                                        ₹{totalValue.toLocaleString()}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                    <p className="font-sans text-base text-[#78716c]">
                        Your curated collection from our gallery
                    </p>
                </motion.div>

                {/* Art Grid */}
                {artPieces.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {artPieces.map((piece, index) => (
                            <motion.div
                                key={piece.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-[#8B6F47]/20 hover:shadow-2xl transition-all cursor-pointer"
                            >
                                {/* Art Image */}
                                <div className="relative w-full aspect-square overflow-hidden">
                                    <Image
                                        src={piece.image}
                                        alt={piece.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <button className="w-full bg-white/90 hover:bg-white text-[#404040] font-sans font-semibold py-2 rounded-lg transition-colors">
                                            View in Gallery
                                        </button>
                                    </div>
                                </div>

                                {/* Art Details */}
                                <div className="p-5">
                                    <h3 className="font-serif text-xl font-semibold text-[#404040] mb-2 line-clamp-1">
                                        {piece.title}
                                    </h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-[#78716c]">
                                            <UserIcon className="w-4 h-4" />
                                            <span className="font-sans text-sm">{piece.artist}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#78716c]">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-sans text-sm">
                                                Purchased {formatDate(piece.purchaseDate)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 pt-3 border-t border-[#8B6F47]/20">
                                        <IndianRupee className="w-5 h-5 text-[#262626]" />
                                        <span className="font-serif text-xl font-bold text-[#262626]">
                                            {piece.price.toLocaleString()}
                                        </span>
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
                        className="text-center py-12 bg-white/80 rounded-2xl"
                    >
                        <Palette className="w-16 h-16 text-[#78716c] mx-auto mb-4" />
                        <p className="font-serif text-xl text-[#404040] mb-2">
                            No art pieces collected yet
                        </p>
                        <p className="font-sans text-sm text-[#78716c] mb-6">
                            Explore our gallery to start your collection!
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold rounded-full transition-colors shadow-md"
                        >
                            Browse Art Gallery
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
