'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Plus, SlidersHorizontal, Coffee } from 'lucide-react';
import { ProductEditCard } from '@/components/admin/ProductEditCard';
import { AddProductModal } from '@/components/admin/AddProductModal';
import { MenuItem, MenuCategory } from '@/types/menu';
import { VoiceSearch } from '@/components/menu/VoiceSearch';
import { analyticsService } from '@/lib/search/analytics.service';

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

export default function MenuManagementPage() {
    const [products, setProducts] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        dealsOnly: false,
        unavailableOnly: false,
        priceRange: 'all' as 'all' | 'under100' | '100-200' | 'above200'
    });

    // Smart Search State
    const [isListening, setIsListening] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // Services
    const [searchService, setSearchService] = useState<any>(null);
    const [autocompleteService, setAutocompleteService] = useState<any>(null);

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Initialize Search Services
    useEffect(() => {
        // Dynamically import search service
        import('@/lib/search').then(module => {
            setSearchService(module.searchService);
            setAutocompleteService(module.autocompleteService);
            // Initialize with menu items
            if (products.length > 0) {
                module.searchService.initialize(products);
                module.autocompleteService.buildSuggestions(products);
            }
        });
        
        // Load history
        setSearchHistory(analyticsService.getHistory());
    }, [products]);

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
            // We use filteredProducts length below, for now just pass 0 or calculate if needed
            analyticsService.trackSearch(searchQuery, 0); 
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

    const fetchProducts = async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('products_with_ratings_view')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map view fields to MenuItem interface
            const mappedProducts = (data || []).map((item: any) => ({
                ...item,
                rating: item.weighted_rating || 0,
                reviewCount: item.real_vote_count || 0,
                // Ensure other fields map correctly if needed, broadly spreading item works if names match
            }));

            setProducts(mappedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductUpdate = async (productId: string, updates: Partial<MenuItem>) => {
        try {
            const response = await fetch('/api/admin/products/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, ...updates })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to update product');
            }

            return data.product;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        try {
            const response = await fetch(`/api/products?id=${productId}`, {
                method: 'DELETE',
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to delete product');
            }
            
            // Refresh list
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    // Intelligent Search + Filtering
    const filteredProducts = useMemo(() => {
        let results: MenuItem[] = [];
        
        // 1. Smart Search
        if (searchQuery.trim() && searchService) {
            try {
                const searchResult = searchService.search(searchQuery, products);
                results = searchResult.hits;
            } catch (error) {
                console.error('Search error:', error);
                results = [];
            }
        } else if (!searchQuery.trim()) {
            results = [...products];
        } else {
             // Fallback if service not ready
             results = products.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.description?.toLowerCase().includes(searchQuery.toLowerCase())
             );
        }

        // 2. Category Filter
        if (selectedCategory !== 'all') {
            results = results.filter(product => product.category === selectedCategory);
        }

        // 3. Advanced Filters
        if (filters.dealsOnly) {
            results = results.filter(product => product.is_deal_of_day);
        }
        if (filters.unavailableOnly) {
            results = results.filter(product => !product.available);
        }

        // 4. Price Filter
        if (filters.priceRange !== 'all') {
            results = results.filter(product => {
                const price = product.discount_price || product.price;
                if (filters.priceRange === 'under100') return price < 100;
                if (filters.priceRange === '100-200') return price >= 100 && price <= 200;
                if (filters.priceRange === 'above200') return price > 200;
                return true;
            });
        }

        return results;
    }, [products, searchQuery, searchService, selectedCategory, filters]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
                    <p className="text-gray-600 mt-1">Manage products, pricing, and deals</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#8B6F47] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#725a39] transition shadow-sm font-medium"
                >
                    <Plus size={20} />
                    Add Item
                </button>
            </div>

            {/* Smart Search and Filters Container */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative z-50">
                <div className="flex gap-4 items-start">
                    
                    {/* Replicated Smart Search Bar */}
                    <div className="flex-1 relative group z-50">
                         <div
                            className={`flex items-center bg-white border-[0.5px] transition-all duration-300 ease-out rounded-lg
                              ${
                                showSuggestions || isListening
                                  ? "border-[#8B6F47] ring-1 ring-[#8B6F47]/20"
                                  : "border-gray-300 hover:border-[#8B6F47]"
                              }
                              py-2 w-full`}
                          >
                            <div className="pl-3 text-gray-400">
                              <Search
                                size={20}
                                className={`transition-transform duration-300 ${
                                  showSuggestions ? "scale-110 text-[#8B6F47]" : "text-gray-400"
                                }`}
                              />
                            </div>
                            <input
                              type="text"
                              placeholder={isListening ? "Listening..." : "Search products (fuzzy)..."}
                              value={searchQuery}
                              onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowHistory(false);
                              }}
                              onFocus={() => {
                                if (!searchQuery) setShowHistory(true);
                              }}
                              onBlur={() => {
                                setTimeout(() => {
                                  setShowSuggestions(false);
                                  setShowHistory(false);
                                }, 200);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearchSubmit();
                              }}
                              className="flex-1 bg-transparent border-none outline-none px-3 text-gray-900 placeholder:text-gray-400 text-sm h-full font-medium"
                            />
                            
                            {/* Voice Search & Clear */}
                            <div className="flex items-center pr-2 gap-1">
                              {searchQuery && (
                                <button
                                  onClick={() => {
                                    setSearchQuery("");
                                    setSuggestions([]);
                                    setShowHistory(true);
                                  }}
                                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-[#8B6F47] transition-colors"
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

                          {/* Suggestions Dropdown */}
                          {showSuggestions && suggestions.length > 0 && searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#8B6F47]/10 overflow-hidden z-[60]">
                              {suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  className="w-full text-left px-4 py-3 hover:bg-[#8B6F47]/5 text-[#4A3B28] text-sm flex items-center gap-2 group transition-colors"
                                  onClick={() => {
                                    setSearchQuery(suggestion);
                                    setShowSuggestions(false);
                                    analyticsService.trackSearch(suggestion, 0);
                                  }}
                                >
                                  <Search className="w-4 h-4 text-[#8B6F47]/30 group-hover:text-[#8B6F47] transition-colors" />
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* History Dropdown */}
                          {showHistory && !searchQuery && searchHistory.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#8B6F47]/10 overflow-hidden z-[60]">
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
                                >
                                  <div 
                                    className="flex items-center gap-2 flex-1 h-full"
                                    onMouseDown={(e) => {
                                       e.preventDefault();
                                       setSearchQuery(term);
                                       setShowHistory(false);
                                       analyticsService.trackSearch(term, 0);
                                    }}
                                  >
                                    <Search className="w-4 h-4 text-[#8B6F47]/40 group-hover:text-[#8B6F47]" />
                                    {term}
                                  </div>
                                  <button
                                        onMouseDown={(e) => {
                                            e.stopPropagation(); 
                                            e.preventDefault();
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            analyticsService.removeFromHistory(term);
                                            setSearchHistory(analyticsService.getHistory());
                                        }}
                                        className="p-1 hover:bg-[#8B6F47]/10 rounded-full text-[#8B6F47]/40 hover:text-red-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                        </svg>
                                    </button>
                                </div>
                              ))}
                            </div>
                          )}
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 h-[42px] ${
                            showFilters ? 'bg-[#8B6F47] text-white border-[#8B6F47]' : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <SlidersHorizontal size={20} />
                        Filters
                    </button>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 mt-4 flex-wrap">
                    {categoryFilters.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                selectedCategory === cat.id
                                    ? 'bg-[#8B6F47] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.dealsOnly}
                                onChange={(e) => setFilters({ ...filters, dealsOnly: e.target.checked })}
                                className="w-4 h-4 text-[#8B6F47] rounded"
                            />
                            <span className="text-sm">Deals Only</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.unavailableOnly}
                                onChange={(e) => setFilters({ ...filters, unavailableOnly: e.target.checked })}
                                className="w-4 h-4 text-[#8B6F47] rounded"
                            />
                            <span className="text-sm">Unavailable Only</span>
                        </label>

                        <select
                            value={filters.priceRange}
                            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value as any })}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                            onClick={(e) => e.stopPropagation()} // Prevent closing anything
                        >
                            <option value="all">All Prices</option>
                            <option value="under100">Under ₹100</option>
                            <option value="100-200">₹100 - ₹200</option>
                            <option value="above200">Above ₹200</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 z-0 relative">
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                        <Coffee className="w-4 h-4 text-[#8B6F47]" />
                        <p className="text-sm text-gray-600">Total Products</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600 mb-1">Showing</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredProducts.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600 mb-1">Active Deals</p>
                    <p className="text-2xl font-bold text-green-700">
                        {products.filter(p => p.is_deal_of_day).length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600 mb-1">Unavailable</p>
                    <p className="text-2xl font-bold text-red-700">
                        {products.filter(p => !p.available).length}
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-[#8B6F47] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 mt-4">Loading products...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-600">No products found</p>
                    <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search term</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 z-0 relative">
                    {filteredProducts.map(product => (
                        <ProductEditCard
                            key={product.id}
                            product={product}
                            onUpdate={handleProductUpdate}
                            onRefresh={fetchProducts}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                </div>
            )}
            
            <AddProductModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSuccess={() => {
                    fetchProducts();
                }} 
            />
        </div>
    );
}
