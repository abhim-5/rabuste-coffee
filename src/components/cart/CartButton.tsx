"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
    itemCount: number;
    onClick: () => void;
}

export function CartButton({ itemCount, onClick }: CartButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-40 bg-[#8B6F47] hover:bg-[#6d5638] text-white p-4 rounded-full shadow-2xl transition-colors"
        >
            <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                        {itemCount}
                    </motion.div>
                )}
            </div>
        </motion.button>
    );
}
