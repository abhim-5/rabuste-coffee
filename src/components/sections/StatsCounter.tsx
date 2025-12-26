"use client";

import { motion } from "framer-motion";
import Counter from "@/components/ui/Counter";

const stats = [
    {
        value: 250,
        title: "VARIETIES OF COFFEE",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit aenean",
    },
    {
        value: 123,
        title: "HOURS OF TESTING",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit aenean",
    },
    {
        value: 321,
        title: "COFFEE MARKETS",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit aenean",
    },
];

export default function StatsCounter() {
    return (
        <section className="relative w-full py-10 lg:py-32 bg-[#D8CBB8]">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <div className="font-display text-7xl lg:text-8xl text-[#A67C52] mb-2">
                                <Counter value={stat.value} />
                            </div>
                            <h3 className="font-display text-lg lg:text-xl tracking-wider text-[#262626] uppercase mb-2 font-semibold">
                                {stat.title}
                            </h3>
                            <p className="font-serif text-[#666] max-w-xs mx-auto leading-relaxed text-sm lg:text-base">
                                {stat.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
