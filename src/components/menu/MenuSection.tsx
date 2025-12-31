"use client";

<<<<<<< HEAD
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { MenuItem } from "@/types/menu";
=======
import { useState } from "react";
import { motion } from "framer-motion";
import { MenuItem, MenuCategory } from "@/types/menu";
>>>>>>> 0a026f9 (Polished the menu page)
import { CoffeeCard } from "./CoffeeCard";

interface MenuSectionProps {
    title: string;
    items: MenuItem[];
    onItemClick: (item: MenuItem) => void;
<<<<<<< HEAD
    onAddToCart: (item: MenuItem, quantity: number) => void;
}

=======
    onAddToCart: (item: MenuItem) => void;
    onUpdateQuantity: (item: MenuItem, change: number) => void;
    getCartQuantity: (itemId: string) => number;
    showFilters?: boolean;
}

const categoryFilters: { id: MenuCategory | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "coffee", label: "Coffee" },
    { id: "pizza", label: "Pizza" },
    { id: "pastries", label: "Pastries" },
    { id: "sandwiches", label: "Sandwiches" },
    { id: "beverages", label: "Beverages" },
    { id: "desserts", label: "Desserts" },
];

>>>>>>> 0a026f9 (Polished the menu page)
export function MenuSection({
    title,
    items,
    onItemClick,
    onAddToCart,
<<<<<<< HEAD
}: MenuSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    if (items.length === 0) return null;

    return (
        <section
            ref={ref}
            className="relative w-full py-12 lg:py-16"
            style={{ backgroundColor: "#D8CBB8" }}
        >
=======
    onUpdateQuantity,
    getCartQuantity,
    showFilters = false,
}: MenuSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "all">("all");

    const filteredItems = selectedCategory === "all"
        ? items
        : items.filter(item => item.category === selectedCategory);

    return (
        <section className="relative w-full py-8 lg:py-12" style={{ backgroundColor: "#D8CBB8" }}>
>>>>>>> 0a026f9 (Polished the menu page)
            <div className="mx-auto w-full px-4 lg:px-6 max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
<<<<<<< HEAD
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-8 lg:mb-12"
                >
                    <h2 className="font-display text-3xl lg:text-5xl font-bold text-[#404040] mb-4 text-center">
                        {title}
                    </h2>

                    {/* Title Separator */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative w-32 h-8 lg:w-40 lg:h-10"
                    >
                        <Image
                            src="/title-separator.png"
                            fill
                            alt="Decorative separator"
                            className="object-contain"
                        />
                    </motion.div>
                </motion.div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <CoffeeCard
                                item={item}
                                onCardClick={onItemClick}
                                onAddToCart={onAddToCart}
                            />
                        </motion.div>
                    ))}
                </div>
=======
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 lg:mb-8"
                >
                    <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#404040] text-center mb-4">
                        {title}
                    </h2>
                </motion.div>

                {/* Category Filters - Grid instead of scroll */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 lg:mb-8"
                    >
                        <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
                            {categoryFilters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedCategory(filter.id)}
                                    className={`px-3 py-2 rounded-full font-sans text-xs lg:text-sm font-semibold transition-all ${selectedCategory === filter.id
                                            ? "bg-[#8B6F47] text-white shadow-md"
                                            : "bg-white/80 text-[#404040] hover:bg-white"
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Items Grid - Show all items grouped by category when All is selected */}
                {selectedCategory === "all" ? (
                    <div className="space-y-12">
                        {categoryFilters
                            .filter((cat) => cat.id !== "all")
                            .map((category) => {
                                const categoryItems = items.filter((item) => item.category === category.id);
                                if (categoryItems.length === 0) return null;

                                return (
                                    <div key={category.id}>
                                        <motion.h3
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            className="font-display text-2xl lg:text-3xl font-bold text-[#404040] mb-6"
                                        >
                                            {category.label}
                                        </motion.h3>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                            {categoryItems.map((item, index) => (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                                >
                                                    <CoffeeCard
                                                        item={item}
                                                        onCardClick={onItemClick}
                                                        onAddToCart={onAddToCart}
                                                        onUpdateQuantity={onUpdateQuantity}
                                                        cartQuantity={getCartQuantity(item.id)}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    /* Show all filtered items without sections */
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <CoffeeCard
                                    item={item}
                                    onCardClick={onItemClick}
                                    onAddToCart={onAddToCart}
                                    onUpdateQuantity={onUpdateQuantity}
                                    cartQuantity={getCartQuantity(item.id)}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="font-serif text-xl text-[#404040]">
                            No items found in this category
                        </p>
                    </div>
                )}
>>>>>>> 0a026f9 (Polished the menu page)
            </div>
        </section>
    );
}
