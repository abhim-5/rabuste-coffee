"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search } from "lucide-react";
import { MenuItem, MenuCategory } from "@/types/menu";
import { CoffeeCard } from "./CoffeeCard";
import { VoiceSearch } from './VoiceSearch';
import { analyticsService } from '@/lib/search/analytics.service';

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
    { id: "robusta-cold", label: "Robusta Cold" },
    { id: "robusta-hot", label: "Robusta Hot" },
    { id: "blend-cold", label: "Blend Cold" },
    { id: "blend-hot", label: "Blend Hot" },
    { id: "manual-brew", label: "Manual Brew" },
    { id: "shakes-tea", label: "Shakes & Tea" },
    { id: "food", label: "Food" },
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
    const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "rating">("default");
    const [advancedFilters, setAdvancedFilters] = useState({
        dealsOnly: false,
        priceRange: "all" as "all" | "under100" | "100-200" | "above200",
        temperature: "all" as "all" | "hot" | "cold" | "manual",
        milk: "all" as "all" | "with-milk" | "no-milk"
    });
    const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
    const lastScrollYRef = useRef(0);
    const [activeCategory, setActiveCategory] = useState<MenuCategory | "all">("all");
    const [isAtMenuTop, setIsAtMenuTop] = useState(true);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [searchMessage, setSearchMessage] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // New State for Voice & History
    const [isListening, setIsListening] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // Import search service lazily
    const [searchService, setSearchService] = useState<any>(null);
    const [autocompleteService, setAutocompleteService] = useState<any>(null);

    useEffect(() => {
        // Dynamically import search service
        import('@/lib/search').then(module => {
            setSearchService(module.searchService);
            setAutocompleteService(module.autocompleteService);
            // Initialize with menu items
            if (items.length > 0) {
                module.searchService.initialize(items);
                module.autocompleteService.buildSuggestions(items);
            }
        });
        
        // Load history
        setSearchHistory(analyticsService.getHistory());
    }, [items]);

    // Handle Voice
    const handleVoiceTranscript = (transcript: string, isFinal: boolean) => {
        setSearchQuery(transcript);
        
        if (isFinal) {
            setIsListening(false);
            // Trigger search immediately
            if (searchService) {
                analyticsService.trackSearch(transcript, 0);
                setSearchHistory(analyticsService.getHistory());
            }
        }
    };
    
    // Handle Search Submit
    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            setShowHistory(false);
            analyticsService.trackSearch(searchQuery, searchResults.results.length);
            setSearchHistory(analyticsService.getHistory());
        }
    };

    // Generate autocomplete suggestions as user types
    useEffect(() => {
        if (searchQuery.trim().length >= 2 && autocompleteService) {
            const newSuggestions = autocompleteService.getSuggestions(searchQuery, 5);
            setSuggestions(newSuggestions);
            setShowSuggestions(newSuggestions.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery, autocompleteService]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
                setScrollDirection("down");
            } else if (currentScrollY < lastScrollYRef.current) {
                setScrollDirection("up");
            }
            lastScrollYRef.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []); // Empty dependency array - no infinite loop!

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
                setShowFilterDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle Enter key press in search input
    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Hide suggestions dropdown
            setShowSuggestions(false);
            // Force re-render by updating a trigger state
            setSearchQuery(searchQuery);
        }
    };

    // Intelligent search filtering using useMemo to prevent re-renders
    const searchResults = useMemo(() => {
        let results: MenuItem[] = [];
        let message: string | null = null;
        
        if (searchQuery.trim() && searchService) {
            try {
                // Use intelligent search
                const searchResult = searchService.search(searchQuery, items);
                results = searchResult.hits;
                message = searchResult.message || null;
                
                // Apply category filter if not "all"
                if (selectedCategory !== "all") {
                    results = results.filter(item => item.category === selectedCategory);
                }
            } catch (error) {
                console.error('Search error:', error);
                results = [];
                message = 'Search error occurred';
            }
        } else if (!searchQuery.trim()) {
            // No search query - use category filter only
            message = null;
            results = selectedCategory === "all"
                ? items
                : items.filter(item => item.category === selectedCategory);
        } else {
            // Search service not loaded yet, show all items
            results = items;
        }

        return { results, message };
    }, [searchQuery, searchService, items, selectedCategory]);

    // Update search message in useEffect to avoid re-render loops
    useEffect(() => {
        setSearchMessage(searchResults.message);
    }, [searchResults.message]);

    let filteredItems = searchResults.results;

    // Apply advanced filters
    if (advancedFilters.dealsOnly) {
        filteredItems = filteredItems.filter(item => item.isDealOfTheDay || item.originalPrice);
    }

    // Apply temperature filter
    if (advancedFilters.temperature !== "all") {
        filteredItems = filteredItems.filter(item => {
            const itemName = item.name.toLowerCase();
            const category = item.category.toLowerCase();
            
            if (advancedFilters.temperature === "hot") {
                return itemName.includes('hot') || category.includes('hot');
            } else if (advancedFilters.temperature === "cold") {
                return itemName.includes('iced') || itemName.includes('cold') || category.includes('cold');
            } else if (advancedFilters.temperature === "manual") {
                return category === 'manual-brew' || itemName.includes('brew');
            }
            return true;
        });
    }

    // Apply milk filter
    if (advancedFilters.milk !== "all") {
        filteredItems = filteredItems.filter(item => {
            const itemName = item.name.toLowerCase();
            const milkDrinks = ['latte', 'cappuccino', 'flat white', 'mocha', 'frappe', 'shake'];
            const hasMilk = milkDrinks.some(drink => itemName.includes(drink));
            
            if (advancedFilters.milk === "with-milk") {
                return hasMilk;
            } else if (advancedFilters.milk === "no-milk") {
                return !hasMilk || itemName.includes('americano') || itemName.includes('espresso');
            }
            return true;
        });
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
        <section className="relative w-full py-8 lg:py-12" style={{ backgroundColor: "#faeade" }}>
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
                    <h2 className="font-tan-pearl text-4xl lg:text-6xl font-bold text-[#7f3b2d] text-center mb-3 lowercase">
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
                    className="mb-6 relative z-40"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="flex gap-2 flex-wrap items-center">

            {/* Smart Search Bar */}
            <div className="flex-1 relative group z-40">
                <div
                className={`flex items-center bg-[#faeade] border-[0.5px] transition-all duration-300 ease-out
                  ${
                    showSuggestions || isListening
                      ? "border-[#8B6F47] ring-1 ring-[#8B6F47]/20"
                      : "border-[#8B6F47] hover:bg-[#ebdec8]"
                  }
                  py-2 w-full`}
              >
                <div className="pl-3 lg:pl-4 text-[#262626]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 ${
                      showSuggestions ? "scale-110 text-[#8B6F47]" : "text-[#262626]"
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={isListening ? "Listening..." : "Search coffee..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowHistory(false); // Hide history when typing
                  }}
                  onFocus={() => {
                    if (!searchQuery) setShowHistory(true); // Show history on focus if empty
                  }}
                  onBlur={() => {
                    // Delayed hide to allow clicking items
                    setTimeout(() => {
                      setShowSuggestions(false);
                      setShowHistory(false);
                    }, 200);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchSubmit();
                  }}
                  className="flex-1 bg-transparent border-none outline-none px-3 text-[#262626] placeholder:text-[#262626]/60 text-sm h-full font-medium font-sans"
                />
                
                {/* Voice Search & Clear Buttons */}
                <div className="flex items-center pr-2 gap-1">
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSuggestions([]);
                        setShowHistory(true);
                      }}
                      className="p-1.5 hover:bg-[#8B6F47]/10 rounded-full text-[#8B6F47]/40 hover:text-[#8B6F47] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  )}
                  
                  <VoiceSearch 
                    onTranscript={handleVoiceTranscript}
                    isListening={isListening}
                    setIsListening={setIsListening}
                  />
                </div>
              </div>

              {/* Suggestions Dropdown (Autocomplete) */}
              {showSuggestions && suggestions.length > 0 && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#8B6F47]/10 overflow-hidden z-40">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-3 hover:bg-[#8B6F47]/5 text-[#4A3B28] text-sm flex items-center gap-2 group transition-colors"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                        analyticsService.trackSearch(suggestion, 0); // Track suggestion click
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#8B6F47]/30 group-hover:text-[#8B6F47] transition-colors">
                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                      </svg>
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* History Dropdown (Recent Searches) */}
              {showHistory && !searchQuery && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#8B6F47]/10 overflow-hidden z-40">
                  <div className="px-4 py-2 bg-[#8B6F47]/5 text-[10px] font-bold text-[#8B6F47] uppercase tracking-wider flex justify-between items-center">
                    <span>Recent Searches</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        analyticsService.clearHistory();
                        setSearchHistory([]);
                      }}
                      className="hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  {searchHistory.map((term, index) => (
                    <div
                      key={index}
                      className="w-full text-left px-4 py-3 hover:bg-[#8B6F47]/5 text-[#4A3B28] text-sm flex items-center justify-between group transition-colors cursor-pointer"
                      role="option"
                    >
                      <div 
                        className="flex items-center gap-2 flex-1 h-full"
                        onMouseDown={(e) => {
                           e.preventDefault(); // Prevent blur
                           setSearchQuery(term);
                           setShowHistory(false);
                           analyticsService.trackSearch(term, 0);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#8B6F47]/40 group-hover:text-[#8B6F47]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {term}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#8B6F47]/30 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100">
                          →
                        </span>
                        <button
                            onMouseDown={(e) => {
                                e.stopPropagation(); 
                                e.preventDefault();
                            }}
                            onClick={(e) => {
                                e.stopPropagation(); // prevent triggering search
                                analyticsService.removeFromHistory(term);
                                setSearchHistory(analyticsService.getHistory());
                            }}
                            className="p-1 hover:bg-[#8B6F47]/10 rounded-full text-[#8B6F47]/40 hover:text-red-500 transition-colors"
                            title="Remove from history"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
                            
                            {/* Sort Button */}
                            <div className="relative dropdown-container">
                                <button
                                    onClick={() => {
                                        setShowSortDropdown(!showSortDropdown);
                                        setShowFilterDropdown(false);
                                    }}
                                    className="flex items-center gap-1 px-4 py-2 border-[0.5px] border-[#8B6F47] bg-[#faeade] text-[#262626] font-sans text-sm font-semibold transition-all cursor-pointer whitespace-nowrap hover:bg-[#ebdec8]"
                                >
                                    Sort
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}>
                                        <path fill="#8B6F47" d="M5 8L0 3h10z" />
                                    </svg>
                                </button>
                                {showSortDropdown && (
                                    <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border-[0.5px] border-[#8B6F47] overflow-hidden z-20 w-[180px]">
                                        {[
                                            { value: "default", label: "Default" },
                                            { value: "price-low", label: "Price: Low-High" },
                                            { value: "price-high", label: "Price: High-Low" },
                                            { value: "rating", label: "Highest Rated" }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setSortBy(option.value as any);
                                                    setShowSortDropdown(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 font-sans text-xs transition-all ${sortBy === option.value
                                                    ? "bg-[#8B6F47] text-white font-semibold"
                                                    : "bg-white text-[#262626] hover:bg-[#f5f5f0]"
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Filter Button */}
                            <div className="relative dropdown-container">
                                <button
                                    onClick={() => {
                                        setShowFilterDropdown(!showFilterDropdown);
                                        setShowSortDropdown(false);
                                    }}
                                    className={`flex items-center gap-1 px-4 py-2 border-[0.5px] font-sans text-sm font-semibold transition-all whitespace-nowrap ${
                                        advancedFilters.dealsOnly || advancedFilters.temperature !== 'all' || advancedFilters.milk !== 'all' || advancedFilters.priceRange !== 'all'
                                            ? "bg-[#8B6F47] text-white border-[#8B6F47]"
                                            : "bg-[#faeade] text-[#262626] border-[#8B6F47] hover:bg-[#ebdec8]"
                                    }`}
                                >
                                    Filter
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`}>
                                        <path fill="currentColor" d="M5 8L0 3h10z" />
                                    </svg>
                                </button>
                                {showFilterDropdown && (
                                    <div className="absolute top-full right-0 left-auto mt-1 bg-white rounded-lg shadow-lg border-[0.5px] border-[#8B6F47] overflow-hidden z-20 w-[240px] lg:w-auto max-h-[400px] overflow-y-auto lg:overflow-visible">
                                        {/* Desktop: Horizontal Layout - BIGGER */}
                                        <div className="hidden lg:flex lg:flex-row lg:divide-x lg:divide-[#8B6F47]/10">
                                            {/* Temperature */}
                                            <div className="p-3 min-w-[180px]">
                                                <p className="font-sans text-xs font-bold text-[#8B6F47] mb-2">TEMPERATURE</p>
                                                {[
                                                    { value: "all", label: "All" },
                                                    { value: "hot", label: "Hot" },
                                                    { value: "cold", label: "Cold/Iced" },
                                                    { value: "manual", label: "Cold Brew" }
                                                ].map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => setAdvancedFilters(prev => ({ ...prev, temperature: option.value as any }))}
                                                        className={`w-full text-left px-3 py-2 font-sans text-sm transition-all rounded mb-1 ${
                                                            advancedFilters.temperature === option.value
                                                                ? "bg-[#8B6F47] text-white font-semibold"
                                                                : "bg-transparent text-[#262626] hover:bg-[#f5f5f0]"
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            {/* Milk */}
                                            <div className="p-3 min-w-[160px]">
                                                <p className="font-sans text-xs font-bold text-[#8B6F47] mb-2">MILK</p>
                                                {[
                                                    { value: "all", label: "All" },
                                                    { value: "with-milk", label: "With Milk" },
                                                    { value: "no-milk", label: "Black" }
                                                ].map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => setAdvancedFilters(prev => ({ ...prev, milk: option.value as any }))}
                                                        className={`w-full text-left px-3 py-2 font-sans text-sm transition-all rounded mb-1 ${
                                                            advancedFilters.milk === option.value
                                                                ? "bg-[#8B6F47] text-white font-semibold"
                                                                : "bg-transparent text-[#262626] hover:bg-[#f5f5f0]"
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            {/* Price */}
                                            <div className="p-3 min-w-[160px]">
                                                <p className="font-sans text-xs font-bold text-[#8B6F47] mb-2">PRICE</p>
                                                {[
                                                    { value: "all", label: "All" },
                                                    { value: "under100", label: "< ₹100" },
                                                    { value: "100-200", label: "₹100-200" },
                                                    { value: "above200", label: "> ₹200" }
                                                ].map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => setAdvancedFilters(prev => ({ ...prev, priceRange: option.value as any }))}
                                                        className={`w-full text-left px-3 py-2 font-sans text-sm transition-all rounded mb-1 ${
                                                            advancedFilters.priceRange === option.value
                                                                ? "bg-[#8B6F47] text-white font-semibold"
                                                                : "bg-transparent text-[#262626] hover:bg-[#f5f5f0]"
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            {/* Deals + Clear */}
                                            <div className="p-3 min-w-[140px] flex flex-col">
                                                <div className="flex-1">
                                                    <p className="font-sans text-xs font-bold text-[#8B6F47] mb-2">OTHER</p>
                                                    <button
                                                        onClick={() => setAdvancedFilters(prev => ({ ...prev, dealsOnly: !prev.dealsOnly }))}
                                                        className={`w-full text-left px-3 py-2 font-sans text-sm transition-all rounded mb-1 flex items-center justify-between ${
                                                            advancedFilters.dealsOnly
                                                                ? "bg-[#8B6F47] text-white font-semibold"
                                                                : "bg-transparent text-[#262626] hover:bg-[#f5f5f0]"
                                                        }`}
                                                    >
                                                        <span>Deals</span>
                                                        {advancedFilters.dealsOnly && <span>✓</span>}
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setAdvancedFilters({
                                                            dealsOnly: false,
                                                            priceRange: "all",
                                                            temperature: "all",
                                                            milk: "all"
                                                        });
                                                        setShowFilterDropdown(false);
                                                    }}
                                                    className="w-full px-3 py-2 font-sans text-sm font-semibold text-[#8B6F47] hover:bg-[#f5f5f0] transition-all rounded border border-[#8B6F47]/20"
                                                >
                                                    Clear All
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Mobile: 2-Column Grid Layout */}
                                        <div className="lg:hidden grid grid-cols-2 divide-x divide-y divide-[#8B6F47]/10">
                                            {/* Temperature */}
                                            <div className="p-2">
                                                <p className="font-sans text-[10px] font-bold text-[#8B6F47] mb-1">TEMPERATURE</p>
                                                {[
                                                    { value: "all", label: "All" },
                                                    { value: "hot", label: "Hot" },
                                                    { value: "cold", label: "Cold/Iced" },
                                                    { value: "manual", label: "Brew" }
                                                ].map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => setAdvancedFilters(prev => ({ ...prev, temperature: option.value as any }))}
                                                        className={`w-full text-left px-2 py-1 font-sans text-xs transition-all rounded mb-0.5 ${
                                                            advancedFilters.temperature === option.value
                                                                ? "bg-[#8B6F47] text-white font-semibold"
                                                                : "bg-transparent text-[#262626] hover:bg-[#f5f5f0]"
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            {/* Milk */}
                                            <div className="p-2">
                                                <p className="font-sans text-[10px] font-bold text-[#8B6F47] mb-1">MILK</p>
                                                {[
                                                    { value: "all", label: "All" },
                                                    { value: "with-milk", label: "With Milk" },
                                                    { value: "no-milk", label: "Black" }
                                                ].map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => setAdvancedFilters(prev => ({ ...prev, milk: option.value as any }))}
                                                        className={`w-full text-left px-2 py-1 font-sans text-xs transition-all rounded mb-0.5 ${
                                                            advancedFilters.milk === option.value
                                                                ? "bg-[#8B6F47] text-white font-semibold"
                                                                : "bg-transparent text-[#262626] hover:bg-[#f5f5f0]"
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            {/* Price */}
                                            <div className="p-2">
                                                <p className="font-sans text-[10px] font-bold text-[#8B6F47] mb-1">PRICE</p>
                                                {[
                                                    { value: "all", label: "All" },
                                                    { value: "under100", label: "Under ₹100" },
                                                    { value: "100-200", label: "₹100-200" },
                                                    { value: "above200", label: "Above ₹200" }
                                                ].map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => setAdvancedFilters(prev => ({ ...prev, priceRange: option.value as any }))}
                                                        className={`w-full text-left px-2 py-1 font-sans text-xs transition-all rounded mb-0.5 ${
                                                            advancedFilters.priceRange === option.value
                                                                ? "bg-[#8B6F47] text-white font-semibold"
                                                                : "bg-transparent text-[#262626] hover:bg-[#f5f5f0]"
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            {/* Deals */}
                                            <div className="p-2 flex flex-col justify-start">
                                                <p className="font-sans text-[10px] font-bold text-[#8B6F47] mb-1">OTHER</p>
                                                <button
                                                    onClick={() => setAdvancedFilters(prev => ({ ...prev, dealsOnly: !prev.dealsOnly }))}
                                                    className={`w-full text-left px-2 py-1 font-sans text-xs transition-all rounded flex items-center justify-between ${
                                                        advancedFilters.dealsOnly
                                                            ? "bg-[#8B6F47] text-white font-semibold"
                                                            : "bg-transparent text-[#262626] hover:bg-[#f5f5f0]"
                                                    }`}
                                                >
                                                    <span>Deals Only</span>
                                                    {advancedFilters.dealsOnly && <span>✓</span>}
                                                </button>
                                            </div>
                                            
                                            {/* Clear All - Full Width */}
                                            <div className="col-span-2 p-2 pt-0 border-t border-[#8B6F47]/10">
                                                <button
                                                    onClick={() => {
                                                        setAdvancedFilters({
                                                            dealsOnly: false,
                                                            priceRange: "all",
                                                            temperature: "all",
                                                            milk: "all"
                                                        });
                                                        setShowFilterDropdown(false);
                                                    }}
                                                    className="w-full mt-2 px-2 py-1.5 font-sans text-xs font-semibold text-[#8B6F47] bg-[#8B6F47]/5 hover:bg-[#8B6F47]/10 transition-all rounded flex items-center justify-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Clear All Filters
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Apply Button */}
                            <button
                                onClick={() => {
                                    setShowSuggestions(false);
                                    setShowSortDropdown(false);
                                    setShowFilterDropdown(false);
                                    setSearchQuery(searchQuery + ' ');
                                    setTimeout(() => setSearchQuery(searchQuery.trim()), 0);
                                }}
                                className="px-4 py-2 border-[0.5px] border-[#8B6F47] bg-[#8B6F47] text-white font-sans text-sm font-semibold hover:bg-[#6d5835] transition-all whitespace-nowrap"
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
                        className={`sticky z-30 py-4 mb-8 lg:mb-10 shadow-md transition-all duration-300 ${scrollDirection === "down" ? "top-0" : "top-[64px] lg:top-[80px]"
                            }`}
                        style={{ backgroundColor: "#faeade" }}
                    >
                        <div className="flex flex-wrap justify-center gap-1.5 lg:gap-3">
                            {categoryFilters.map((filter) => {
                                const isLongWord = filter.label.length > 8;
                                const isSelected = selectedCategory === filter.id;
                                const isHighlighted = selectedCategory === "all" && activeCategory === filter.id;

                                return (
                                    <button
                                        key={filter.id}
                                        onClick={() => setSelectedCategory(filter.id)}
                                        className={`px-2 lg:px-6 py-1.5 lg:py-2.5 font-sans font-semibold transition-all border-[0.5px] ${isLongWord ? "text-[10px] lg:text-sm" : "text-xs lg:text-base"
                                            } ${isSelected
                                                ? "bg-[#8B6F47] text-white border-[#8B6F47] shadow-md"
                                                : isHighlighted
                                                    ? "bg-[#daa520] text-white border-[#daa520] shadow-sm"
                                                    : "bg-[#faeade] text-[#262626] border-[#8B6F47] hover:bg-[#ebdcc8]"
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
                                const categoryItems = filteredItems.filter((item) => item.category === category.id);
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
                                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
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
                                                        cartQuantity={getCartQuantity(String(item.id))}
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
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
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
                                    cartQuantity={getCartQuantity(String(item.id))}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="font-serif text-xl text-[#404040]">
                            {searchMessage || "No items found in this category"}
                        </p>
                        {searchMessage && (
                            <p className="font-sans text-sm text-[#8B6F47] mt-2">
                                Try searching for coffee-related items like "latte", "espresso", or "cold brew"
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
