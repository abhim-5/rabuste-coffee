"use client";

import { motion } from "framer-motion";
import Counter from "@/components/ui/Counter";

const stats = [
    {
        value: 40,
        title: "VARIETIES OF COFFEE",
        suffix: "+",
        description: "From bold Robusta to smooth Arabica blends, curated for the perfect cup.",
    },
    {
        value: 3500,
        title: "COMMUNITY REVIEWS",
        suffix: "+",
        description: "A rapidly growing community of coffee enthusiasts sharing their love for our roasts.",
    },
    {
        value: 3,
        title: "SOURCING REGIONS",
        description: "Premium beans globally sourced from the finest plantations in Vietnam, Brazil, and India.",
    },
];

export default function StatsCounter() {
    return (
        <section className="relative w-full py-10 lg:py-32 bg-[#e3a458]">
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
                            <div className="font-display text-7xl lg:text-8xl text-[#7f3b2d] mb-2">
                                <Counter value={stat.value} />
                                {stat.suffix && <span className="text-4xl lg:text-5xl ml-1">{stat.suffix}</span>}
                            </div>
                            <h3 className="font-display text-lg lg:text-xl tracking-wider text-[#262626] uppercase mb-2 font-semibold">
                                {stat.title}
                            </h3>
                            <p className="font-serif text-black max-w-xs mx-auto leading-relaxed text-sm lg:text-base">
                                {stat.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
