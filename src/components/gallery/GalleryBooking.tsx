"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Coffee } from "lucide-react";
import Image from "next/image";

interface GalleryBookingProps {
    isOpen: boolean;
    onClose: () => void;
    bookingNumber: string;
    artPieceName: string;
    artist: string;
    price: number;
}

export function GalleryBooking({
    isOpen,
    onClose,
    bookingNumber,
    artPieceName,
    artist,
    price,
}: GalleryBookingProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-gradient-to-br from-[#F5EFE6] to-[#E8DBC8] rounded-2xl shadow-2xl max-w-md w-full border-2 border-[#8B6F47] overflow-hidden">
                            {/* Header */}
                            <div className="bg-[#8B6F47] px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                    <h2 className="font-display text-xl text-white font-bold">
                                        Booking Confirmed!
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Booking Number */}
                                <div className="bg-white rounded-lg p-4 border-2 border-[#8B6F47] text-center">
                                    <p className="font-sans text-sm text-[#8B6F47] mb-1">
                                        Your Booking Number
                                    </p>
                                    <p className="font-display text-3xl font-bold text-[#262626]">
                                        {bookingNumber}
                                    </p>
                                </div>

                                {/* Art Details */}
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-sans text-sm text-[#8B6F47] mb-1">Artwork</p>
                                        <p className="font-serif text-lg text-[#262626] font-bold">
                                            {artPieceName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-sans text-sm text-[#8B6F47] mb-1">Artist</p>
                                        <p className="font-serif text-base text-[#262626]">{artist}</p>
                                    </div>
                                    <div>
                                        <p className="font-sans text-sm text-[#8B6F47] mb-1">Price</p>
                                        <p className="font-serif text-xl text-green-700 font-bold">
                                            ₹{price.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <p className="font-sans text-sm text-amber-900 leading-relaxed">
                                        <strong>Next Steps:</strong>
                                        <br />
                                        1. Visit Rabuste Coffee with this booking number
                                        <br />
                                        2. Make payment at the counter (cash only)
                                        <br />
                                        3. Collect your beautiful artwork!
                                    </p>
                                </div>

                                {/* Coffee Icon */}
                                <div className="flex justify-center pt-2">
                                    <Coffee className="w-12 h-12 text-[#8B6F47]/30" />
                                </div>

                                {/* Close Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="w-full bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold px-6 py-3 rounded-lg transition-colors"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
