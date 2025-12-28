import React from 'react';
import * as mot from 'framer-motion';
// Using namespace import to avoid potential conflict if any, though explicit import { motion } fits best.
// To be safe and standard:
import { motion } from 'framer-motion';
import Button from './Button';

interface WorkshopProps {
    title: string;
    description: string;
    duration: string;
    mode: string;
}

const cardVariants = {
    offscreen: {
        y: 50,
        opacity: 0,
        scale: 0.9
    },
    onscreen: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8
        }
    }
};

export default function WorkshopCard({ title, description, duration, mode }: WorkshopProps) {
    return (
        <motion.div
            className="bg-rabuste-cream p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full text-left"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="mb-4">
                <span className="text-xs tracking-widest uppercase text-rabuste-mocha font-bold border border-rabuste-mocha px-2 py-1 rounded-sm">
                    {mode}
                </span>
            </div>
            <h3 className="font-serif text-2xl mb-3 text-rabuste-espresso">{title}</h3>
            <p className="text-rabuste-mocha mb-6 flex-grow font-sans leading-relaxed text-sm">
                {description}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-rabuste-mocha/10">
                <span className="text-sm text-rabuste-espresso font-semibold flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {duration}
                </span>
                <Button variant="primary" className="text-xs px-5 py-2">Enroll</Button>
            </div>
        </motion.div>
    );
}
