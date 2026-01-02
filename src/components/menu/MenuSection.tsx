"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search } from "lucide-react";
import { MenuItem, MenuCategory } from "@/types/menu";
import { CoffeeCard } from "./CoffeeCard";

interface MenuSectionProps {
    title: string;
    items: MenuItem[];
    onItemClick: (item: MenuItem) => void;
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

export function MenuSection({
    title,
    items,
    onItemClick,
    onAddToCart,
    onUpdateQuantity,
    getCartQuantity,
    showFilters = false,
}: MenuSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"none" | "price-low" | "price-high" | "rating">("none");
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({
        dealsOnly: false,
        temperature: "all" as "all" | "hot" | "cold",
        priceRange: "all" as "all" | "under100" | "100-200" | "above200"
    });
    const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [activeCategory, setActiveCategory] = useState<MenuCategory | "all">("all");
    const [isAtMenuTop, setIsAtMenuTop] = useState(true);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setScrollDirection("down");
            } else if (currentScrollY < lastScrollY) {
                setScrollDirection("up");
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Detect active category based on scroll position
    useEffect(() => {
        if (selectedCategory !== "all") return;

        // Observer for menu title to detect when user is at the top
        const titleObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsAtMenuTop(true);
                        setActiveCategory("all");
                    } else {
                        setIsAtMenuTop(false);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -90% 0px" }
        );

        const titleElement = document.querySelector("[data-menu-title]");
        if (titleElement) {
            titleObserver.observe(titleElement);
        }

        // Observer for category sections - watch when section header is near top
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const categoryId = entry.target.getAttribute("data-category") as MenuCategory;
                    if (entry.isIntersecting && categoryId) {
                        setActiveCategory(categoryId);
                        setIsAtMenuTop(false);
                    }
                });
            },
            { 
                threshold: [0, 0.1], 
                rootMargin: "-120px 0px -75% 0px"
            }
        );

        const categoryElements = document.querySelectorAll("[data-category]");
        categoryElements.forEach((el) => observer.observe(el));

        return () => {
            observer.disconnect();
            titleObserver.disconnect();
        };
    }, [selectedCategory, isAtMenuTop]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.dropdown-container')) {
                setShowSortDropdown(false);
                setShowPriceDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    let filteredItems = selectedCategory === "all"
        ? items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : items.filter(item => 
            item.category === selectedCategory &&
            (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    // Apply advanced filters
    if (advancedFilters.dealsOnly) {
        filteredItems = filteredItems.filter(item => item.isDealOfTheDay || item.originalPrice);
    }
    
    if (advancedFilters.priceRange !== "all") {
        if (advancedFilters.priceRange === "under100") {
            filteredItems = filteredItems.filter(item => item.price < 100);
        } else if (advancedFilters.priceRange === "100-200") {
            filteredItems = filteredItems.filter(item => item.price >= 100 && item.price <= 200);
        } else if (advancedFilters.priceRange === "above200") {
            filteredItems = filteredItems.filter(item => item.price > 200);
        }
    }

    // Apply sorting
    if (sortBy === "price-low") {
        filteredItems = [...filteredItems].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
        filteredItems = [...filteredItems].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
        filteredItems = [...filteredItems].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return (
        <section className="relative w-full py-8 lg:py-12" style={{ backgroundColor: "#D8CBB8" }}>
            <div className="mx-auto w-full px-4 lg:px-6 max-w-7xl">
                {/* Section Header - Static */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-4"
                    data-menu-title
                >
                    <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-[#262626] text-center mb-3">
                        {title}
                    </h2>
                    {/* Title Separator */}
                    <div className="relative w-28 h-6 lg:w-36 lg:h-8">
                        <Image
                            src="/title-separator.png"
                            fill
                            alt="Decorative separator"
                            className="object-contain"
                            sizes="(max-width: 768px) 112px, 144px"
                        />
                    </div>
                </motion.div>

                {/* Marquee Animation */}
                <div className="w-full overflow-hidden mb-6">
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{
                            x: ["0%", "-50%"],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {[...Array(2)].map((_, index) => (
                            <div key={index} className="flex items-center">
                                <span className="font-serif text-lg lg:text-xl text-[#8B6F47]/70 mx-6">✦ Fresh & Delicious</span>
                                <span className="font-serif text-lg lg:text-xl text-[#8B6F47]/70 mx-6">✦ Handcrafted with Love</span>
                                <span className="font-serif text-lg lg:text-xl text-[#8B6F47]/70 mx-6">✦ Premium Quality</span>
                                <span className="font-serif text-lg lg:text-xl text-[#8B6F47]/70 mx-6">✦ Made to Order</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Search Bar with Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-6"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="flex gap-2 flex-wrap">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
                                <input
                                    type="text"
                                    placeholder="Search menu items..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-[0.5px] border-[#8B6F47] bg-[#D8CBB8] text-[#262626] placeholder-[#8B6F47]/60 focus:outline-none focus:bg-white focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/20 font-sans text-sm transition-all"
                                />
                            </div>
                            <div className="relative dropdown-container">
                                <button
                                    onClick={() => {
                                        setShowSortDropdown(!showSortDropdown);
                                        setShowPriceDropdown(false);
                                    }}
                                    className="flex items-center gap-2 px-4 py-3 border-[0.5px] border-[#8B6F47] bg-[#D8CBB8] text-[#262626] font-sans text-sm transition-all cursor-pointer whitespace-nowrap hover:bg-[#c9baa7]"
                                >
                                    {sortBy === "none" ? "Sort By" : 
                                     sortBy === "price-low" ? "Price: Low to High" :
                                     sortBy === "price-high" ? "Price: High to Low" : "Highest Rated"}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}>
                                        <path fill="#8B6F47" d="M6 9L1 4h10z"/>
                                    </svg>
                                </button>
                                {showSortDropdown && (
                                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border-[0.5px] border-[#8B6F47] overflow-hidden z-50 w-[200px]">
                                        {[
                                            { value: "none", label: "Sort By" },
                                            { value: "price-low", label: "Price: Low to High" },
                                            { value: "price-high", label: "Price: High to Low" },
                                            { value: "rating", label: "Highest Rated" }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setSortBy(option.value as any);
                                                    setShowSortDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 font-sans text-sm transition-all ${
                                                    sortBy === option.value
                                                        ? "bg-[#8B6F47] text-white"
                                                        : "bg-white text-[#262626] hover:bg-[#f5f5f0]"
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setAdvancedFilters(prev => ({ ...prev, dealsOnly: !prev.dealsOnly }))}
                                className={`px-4 py-3 border-[0.5px] font-sans text-sm font-semibold transition-all whitespace-nowrap ${
                                    advancedFilters.dealsOnly
                                        ? "bg-[#8B6F47] text-white border-[#8B6F47]"
                                        : "bg-[#D8CBB8] text-[#262626] border-[#8B6F47] hover:bg-[#c9baa7]"
                                }`}
                            >
                                Deals Only
                            </button>
                            <div className="relative dropdown-container">
                                <button
                                    onClick={() => {
                                        setShowPriceDropdown(!showPriceDropdown);
                                        setShowSortDropdown(false);
                                    }}
                                    className="flex items-center gap-2 px-4 py-3 border-[0.5px] border-[#8B6F47] bg-[#D8CBB8] text-[#262626] font-sans text-sm font-semibold transition-all cursor-pointer whitespace-nowrap hover:bg-[#c9baa7]"
                                >
                                    {advancedFilters.priceRange === "all" ? "All Prices" :
                                     advancedFilters.priceRange === "under100" ? "Under ₹100" :
                                     advancedFilters.priceRange === "100-200" ? "₹100 - ₹200" : "Above ₹200"}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${showPriceDropdown ? 'rotate-180' : ''}`}>
                                        <path fill="#8B6F47" d="M5 8L0 3h10z"/>
                                    </svg>
                                </button>
                                {showPriceDropdown && (
                                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border-[0.5px] border-[#8B6F47] overflow-hidden z-50 w-[150px]">
                                        {[
                                            { value: "all", label: "All Prices" },
                                            { value: "under100", label: "Under ₹100" },
                                            { value: "100-200", label: "₹100 - ₹200" },
                                            { value: "above200", label: "Above ₹200" }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setAdvancedFilters(prev => ({ ...prev, priceRange: option.value as any }));
                                                    setShowPriceDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 font-sans text-sm font-semibold transition-all ${
                                                    advancedFilters.priceRange === option.value
                                                        ? "bg-[#8B6F47] text-white"
                                                        : "bg-white text-[#262626] hover:bg-[#f5f5f0]"
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    // Apply filters logic here if needed
                                }}
                                className="px-4 py-3 border-[0.5px] border-[#8B6F47] bg-[#8B6F47] text-white font-sans text-sm font-semibold hover:bg-[#6d5835] transition-all whitespace-nowrap"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Category Filters - Grid instead of scroll */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className={`sticky z-30 py-4 mb-8 lg:mb-10 shadow-md transition-all duration-300 ${
                            scrollDirection === "down" ? "top-0" : "top-[64px] lg:top-[80px]"
                        }`}
                        style={{ backgroundColor: "#D8CBB8" }}
                    >
                        <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
                            {categoryFilters.map((filter) => {
                                const isLongWord = filter.label.length > 8;
                                const isSelected = selectedCategory === filter.id;
                                const isHighlighted = selectedCategory === "all" && activeCategory === filter.id;
                                
                                return (
                                    <button
                                        key={filter.id}
                                        onClick={() => setSelectedCategory(filter.id)}
                                        className={`px-3 lg:w-32 py-2 lg:py-2.5 font-sans font-semibold transition-all border-[0.5px] ${
                                            isLongWord ? "text-xs lg:text-sm" : "text-sm lg:text-base"
                                        } ${
                                            isSelected
                                                ? "bg-[#8B6F47] text-white border-[#8B6F47] shadow-md"
                                                : isHighlighted
                                                ? "bg-[#daa520] text-white border-[#daa520] shadow-sm"
                                                : "bg-[#D8CBB8] text-[#262626] border-[#8B6F47] hover:bg-[#c9baa7]"
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                );
                            })}
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
                                    <div key={category.id} data-category={category.id}>
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            className="flex items-center justify-center mb-8 py-4 border-t-[0.5px] border-b-[0.5px] border-[#8B6F47]"
                                        >
                                            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-4">
                                                <div className="flex items-center gap-0.5 sm:gap-1">
                                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 rotate-45 border border-[#8B6F47]"></div>
                                                    <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 lg:w-1.5 lg:h-1.5 rotate-45 bg-[#8B6F47]"></div>
                                                </div>
                                                <div className="h-[1px] w-3 sm:w-6 lg:w-12 bg-[#8B6F47]"></div>
                                                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#262626] uppercase tracking-[0.05em] sm:tracking-[0.15em] lg:tracking-[0.2em]">
                                                    {category.label}
                                                </h3>
                                                <div className="h-[1px] w-3 sm:w-6 lg:w-12 bg-[#8B6F47]"></div>
                                                <div className="flex items-center gap-0.5 sm:gap-1">
                                                    <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 lg:w-1.5 lg:h-1.5 rotate-45 bg-[#8B6F47]"></div>
                                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 rotate-45 border border-[#8B6F47]"></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-6">
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
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-6">
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
            </div>
        </section>
    );
}
