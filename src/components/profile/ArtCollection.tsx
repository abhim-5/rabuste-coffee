"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, ChevronRight } from "lucide-react";
import Image from "next/image";
import { ArtPiece } from "@/types/menu";

// Extend ArtPiece locally or ensure globally it has status. 
// Assuming ArtPiece definition in types/menu or hooks might need update, 
// but useProfileArt hooks defines it with status. 
// We will cast or assume it's there.
interface ExtendedArtPiece extends ArtPiece {
    status?: 'pending' | 'purchased' | 'cancelled';
}

interface ArtCollectionProps {
    artPieces: ExtendedArtPiece[];
    isDesktop?: boolean;
}

export function ArtCollection({ artPieces, isDesktop = false }: ArtCollectionProps) {
    const [showAll, setShowAll] = useState(false);

    const formatDate = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat("en-IN", {
            month: "short",
            year: "numeric",
        }).format(dateObj);
    };

    const totalValue = artPieces.reduce((sum, piece) => sum + piece.price, 0);
    const displayedArt = showAll ? artPieces : artPieces.slice(0, isDesktop ? 4 : 2);

    // Desktop version
    if (isDesktop) {
        return (
            <div className="space-y-4">
                {artPieces.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            {displayedArt.map((piece, index) => (
                                <motion.div
                                    key={piece.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[#F5F0EB] rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                                >
                                    <div className="flex gap-4 p-4">
                                        <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden">
                                            <img
                                                src={piece.image}
                                                alt={piece.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                     <h3 className="font-sans text-base font-semibold text-[#262626] line-clamp-1">
                                                        {piece.title}
                                                    </h3>
                                                    {isDesktop && (
                                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
                                                            piece.status === 'purchased' ? 'bg-green-100 text-green-700 border-green-200' :
                                                            piece.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                                            'bg-amber-100 text-amber-700 border-amber-200'
                                                        }`}>
                                                            {piece.status || 'Pending'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="font-sans text-sm text-[#78716c] mb-1">
                                                    by {piece.artist}
                                                </p>
                                                 {!isDesktop && (
                                                     <div className="mb-1">
                                                         <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
                                                            piece.status === 'purchased' ? 'bg-green-100 text-green-700 border-green-200' :
                                                            piece.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                                            'bg-amber-100 text-amber-700 border-amber-200'
                                                        }`}>
                                                            {piece.status || 'Pending'}
                                                        </span>
                                                     </div>
                                                 )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-sans text-xs text-[#a8a29e]">
                                                    {formatDate(piece.purchaseDate)}
                                                </span>
                                                <span className="font-display text-lg font-bold text-[#8B6F47]">
                                                    ₹{piece.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {artPieces.length > 4 && !showAll && (
                            <button
                                onClick={() => setShowAll(true)}
                                className="w-full flex items-center justify-center gap-2 py-3 text-[#8B6F47] hover:text-[#6d5638] font-sans font-semibold text-sm transition-colors"
                            >
                                View all {artPieces.length} pieces
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}

                        {showAll && artPieces.length > 4 && (
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
                        <Palette className="w-16 h-16 text-[#d6d3d1] mx-auto mb-4" />
                        <p className="font-display text-xl text-[#404040] mb-2">No art pieces yet</p>
                        <p className="font-sans text-sm text-[#78716c]">
                            Explore our gallery to start your collection!
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <section className="w-full py-8 lg:py-10" style={{ backgroundColor: "#D8CBB8" }}>
            <div className="mx-auto w-full px-4 lg:px-6 max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-8"
                >
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#404040] mb-3 text-center">
                        Art Collection
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
                        {artPieces.length} pieces {artPieces.length > 0 && <>• <span className="font-semibold text-[#8B6F47]">₹{totalValue.toLocaleString()} spent</span></>}
                    </p>
                </motion.div>

                {/* Art List - Single Column */}
                {artPieces.length > 0 ? (
                    <div className="relative">
                        <div className="space-y-3">
                            {displayedArt.map((piece, index) => {
                                const isSecondItem = index === 1 && !showAll && artPieces.length > 2;

                                return (
                                    <motion.div
                                        key={piece.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${isSecondItem ? 'relative border-0' : 'border border-[#8B6F47]/10'}`}
                                    >
                                        {/* Gradient overlay for second item */}
                                        {isSecondItem && (
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-[#D8CBB8] z-10 pointer-events-none" />
                                        )}

                                        <div className="flex items-center gap-4 p-4">
                                            <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden">
                                                <img
                                                    src={piece.image}
                                                    alt={piece.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-sans text-sm font-semibold text-[#262626] mb-1 line-clamp-1">
                                                    {piece.title}
                                                </h3>
                                                <p className="font-sans text-xs text-[#78716c] mb-1">
                                                    by {piece.artist}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                     <p className="font-sans text-xs text-[#a8a29e]">
                                                        {formatDate(piece.purchaseDate)}
                                                    </p>
                                                    <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-full border ${
                                                        piece.status === 'purchased' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        piece.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                                        'bg-amber-100 text-amber-700 border-amber-200'
                                                    }`}>
                                                        {piece.status || 'Pending'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0 text-right">
                                                <span className="font-sans text-sm font-bold text-[#8B6F47]">
                                                    ₹{piece.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* View More Button */}
                        {artPieces.length > 2 && !showAll && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setShowAll(true)}
                                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/60 hover:bg-white/80 text-[#8B6F47] font-sans text-sm font-medium rounded-full transition-colors"
                            >
                                View all {artPieces.length} pieces
                                <ChevronRight className="w-3 h-3" />
                            </motion.button>
                        )}

                        {showAll && artPieces.length > 2 && (
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
