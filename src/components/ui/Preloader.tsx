"use client";

import { motion } from "framer-motion";

export default function Preloader() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0d0d]"
        >
            <div className="flex flex-col items-center">
                {/* Coffee Cup Animation */}
                <div className="relative w-24 h-24 mb-8">
                    {/* Steam */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                    opacity: [0, 0.6, 0],
                                    y: [-5, -25],
                                    scale: [0.8, 1.2],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.4,
                                    ease: "easeInOut",
                                }}
                                className="w-1.5 h-8 bg-white/20 rounded-full blur-[2px]"
                            />
                        ))}
                    </div>

                    {/* Cup Body */}
                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#8B6F47]">
                        <path
                            d="M19 8H5C3.89543 8 3 8.89543 3 10V11C3 15.4183 6.58172 19 11 19H13C17.4183 19 21 15.4183 21 11V10C21 8.89543 20.1046 8 19 8Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="opacity-90"
                        />
                        <path
                            d="M21 10H22C22.5523 10 23 10.4477 23 11V13C23 13.5523 22.5523 14 22 14H21"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            className="opacity-90"
                        />
                    </svg>
                </div>

                {/* Loading Text */}
                <motion.p
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="font-display text-[#8B6F47] text-lg tracking-[0.3em] uppercase"
                >
                    Brewing...
                </motion.p>
            </div>
        </motion.div>
    );
}
