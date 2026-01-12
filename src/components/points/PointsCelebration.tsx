// Points Celebration Popup Component
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface PointsCelebrationProps {
    pointsEarned: number;
    orderNumber: string;
    onClose: () => void;
}

export default function PointsCelebration({ pointsEarned, orderNumber, onClose }: PointsCelebrationProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Show popup after slight delay for better UX
        const timer = setTimeout(() => setShow(true), 300);

        // Trigger confetti celebration
        if (pointsEarned > 0) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#D4AF37', '#FFD700', '#FFA500']
            });
        }

        return () => clearTimeout(timer);
    }, [pointsEarned]);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 300);
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition z-10"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Header with gradient */}
                        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-8 text-center relative overflow-hidden">
                            {/* Animated sparkles */}
                            <div className="absolute inset-0 overflow-hidden">
                                <Sparkles className="absolute top-4 left-4 w-6 h-6 text-white/30 animate-pulse" />
                                <Sparkles className="absolute top-8 right-8 w-4 h-4 text-white/40 animate-pulse delay-75" />
                                <Sparkles className="absolute bottom-6 left-12 w-5 h-5 text-white/30 animate-pulse delay-150" />
                            </div>

                            {/* Award icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 relative"
                            >
                                <Award className="w-10 h-10 text-amber-600" />
                            </motion.div>

                            {/* Success message */}
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-bold text-white mb-2"
                            >
                                🎉 Points Earned!
                            </motion.h2>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-6 text-center">
                            {/* Points display */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.4 }}
                                className="mb-6"
                            >
                                <div className="inline-block bg-amber-50 rounded-2xl px-8 py-4 border-2 border-amber-200">
                                    <p className="text-sm text-amber-700 font-medium mb-1">You Earned</p>
                                    <p className="text-5xl font-bold text-amber-600">+{pointsEarned}</p>
                                    <p className="text-sm text-amber-700 mt-1">points</p>
                                </div>
                            </motion.div>

                            {/* Order info */}
                            <p className="text-gray-600 mb-6">
                                From order <span className="font-semibold text-gray-900">#{orderNumber}</span>
                            </p>

                            {/* Value indicator */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <p className="text-sm text-gray-600">
                                    Your points are worth <span className="font-bold text-gray-900">₹{(pointsEarned / 10).toFixed(2)}</span> in discounts!
                                </p>
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-3">
                                <Link href="/points" className="block">
                                    <button className="w-full bg-[#8B6F47] text-white py-3 rounded-xl font-semibold hover:bg-[#6d5638] transition flex items-center justify-center gap-2">
                                        <span>View Points History</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </Link>

                                <button
                                    onClick={handleClose}
                                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
