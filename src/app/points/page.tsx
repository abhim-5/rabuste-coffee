// Updated Points Page - Using REAL Database Data
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  Coins,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Award,
  Filter,
  ChevronDown,
  Sparkles,
  Gift,
  Calendar,
  Loader2,
} from "lucide-react";

const filterOptions = ["All", "Earned", "Redeemed"];

export default function PointsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [balance, setBalance] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const supabase = createClient();

      // Get balance
      const balanceRes = await fetch('/api/points/balance');
      const balanceData = await balanceRes.json();
      setBalance(balanceData);

      // Get transactions
      const { data: txData } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      setTransactions(txData || []);
    } catch (error) {
      console.error('Error fetching points data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Earned") return t.transaction_type === "earned";
    if (filter === "Redeemed") return t.transaction_type === "redeemed";
    return true;
  });

  const getIconForSource = (source: string) => {
    switch (source) {
      case 'order': return ShoppingBag;
      case 'workshop': return Calendar;
      case 'bonus':
      case 'admin_grant': return Gift;
      default: return Sparkles;
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#D8CBB8" }}>
          <div className="text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-700">Please sign in to view your points</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#D8CBB8" }}>
          <Loader2 className="w-8 h-8 animate-spin text-[#8B6F47]" />
        </main>
        <Footer />
      </>
    );
  }

  const stats = {
    totalPoints: balance?.available_points || 0,
    totalEarned: balance?.total_earned || 0,
    totalRedeemed: balance?.total_redeemed || 0,
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ backgroundColor: "#D8CBB8" }}>
        {/* Mobile Layout */}
        <div className="lg:hidden pt-16 pb-20">
          <div className="container mx-auto px-4 py-8">
            {/* Points Balance Card - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg p-6 mb-6"
            >
              <div className="text-center">
                <p className="text-[#78716c] text-sm font-medium uppercase tracking-wider mb-2">
                  Current Balance
                </p>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                    <Coins className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <span className="font-display text-5xl font-bold text-amber-600">
                      {stats.totalPoints}
                    </span>
                    <span className="text-[#78716c] text-lg ml-2">points</span>
                  </div>
                </div>

                <p className="text-sm text-[#78716c] mb-4">
                  Worth ₹{balance?.discount_value?.toFixed(2) || '0.00'} in discounts
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e7e5e4]">
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-bold">+{stats.totalEarned}</span>
                    </div>
                    <p className="text-[#78716c] text-xs">Total Earned</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="text-red-500 font-bold">-{stats.totalRedeemed}</span>
                    </div>
                    <p className="text-[#78716c] text-xs">Total Redeemed</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* How It Works */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">💡 How Points Work</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Earn 1 point for every ₹10 you spend</li>
                <li>• {balance?.conversion_rate || 10} points = ₹1 discount</li>
                <li>• Redeem at checkout for instant savings</li>
                <li>• Points never expire!</li>
              </ul>
            </div>

            {/* Transactions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-[#262626]">
                  Recent Activity
                </h2>
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-1 px-3 py-2 bg-white rounded-full border-[0.5px] border-[#8B6F47] text-sm text-[#262626] font-medium"
                >
                  <Filter className="w-4 h-4" />
                  <span>{filter}</span>
                </button>
              </div>

              {showFilterMenu && (
                <div className="mb-4 bg-white rounded-xl shadow-sm border-[0.5px] border-[#8B6F47] overflow-hidden">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilter(option);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm ${filter === option
                          ? "bg-[#8B6F47] text-white"
                          : "text-[#262626] hover:bg-[#F5F0EB]"
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600">No transactions yet</p>
                    <p className="text-sm text-gray-500">Start shopping to earn points!</p>
                  </div>
                ) : (
                  filteredTransactions.slice(0, 10).map((tx) => {
                    const isEarned = tx.transaction_type === "earned";
                    const IconComponent = getIconForSource(tx.source);

                    return (
                      <div
                        key={tx.id}
                        className="bg-white rounded-2xl p-4 shadow-sm border-[0.5px] border-[#8B6F47]"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isEarned ? "bg-green-100" : "bg-red-100"
                              }`}
                          >
                            <IconComponent
                              className={`w-5 h-5 ${isEarned ? "text-green-600" : "text-red-500"}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-sans font-semibold text-sm text-[#262626]">
                              {tx.description || `${isEarned ? 'Earned' : 'Redeemed'} Points`}
                            </h3>
                            <p className="text-xs text-[#78716c] capitalize">{tx.source.replace('_', ' ')}</p>
                            <p className="text-xs text-[#a8a29e] mt-1">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <p
                            className={`font-bold text-lg flex-shrink-0 ${isEarned ? "text-green-600" : "text-red-500"
                              }`}
                          >
                            {isEarned ? "+" : "-"}
                            {tx.points}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block pt-28 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8 items-start">
              {/* Left Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-80 flex-shrink-0 sticky top-28"
              >
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                  <div className="h-28 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 relative">
                    <div className="relative h-full flex items-center justify-center">
                      <Coins className="w-16 h-16 text-white" />
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="text-center -mt-8 mb-4">
                      <div className="inline-block bg-white rounded-2xl shadow-lg px-6 py-3">
                        <p className="text-[#78716c] text-xs uppercase tracking-wider mb-1">
                          Your Balance
                        </p>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="font-display text-4xl font-bold text-amber-600">
                            {stats.totalPoints}
                          </span>
                          <span className="text-[#78716c] text-sm">pts</span>
                        </div>
                        <p className="text-xs text-[#78716c] mt-1">
                          = ₹{balance?.discount_value?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded-xl">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-bold text-lg">+{stats.totalEarned}</span>
                        </div>
                        <p className="text-[#78716c] text-xs">Earned</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-xl">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingDown className="w-4 h-4 text-red-500" />
                          <span className="text-red-500 font-bold text-lg">-{stats.totalRedeemed}</span>
                        </div>
                        <p className="text-[#78716c] text-xs">Used</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-white rounded-2xl shadow-sm p-5">
                  <h3 className="font-display text-lg font-bold text-[#262626] mb-3">
                    💡 How It Works
                  </h3>
                  <ul className="space-y-2 text-sm text-[#78716c]">
                    <li>• 1 point per ₹10 spent</li>
                    <li>• {balance?.conversion_rate || 10} points = ₹1 off</li>
                    <li>• Use at checkout</li>
                    <li>• Never expires!</li>
                  </ul>
                </div>
              </motion.aside>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1"
              >
                <div className="bg-white rounded-3xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-[#262626]">
                        Transaction History
                      </h2>
                      <p className="text-sm text-[#78716c] mt-1">
                        Your complete points activity
                      </p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F5F0EB] rounded-xl border-[0.5px] border-[#8B6F47] hover:bg-[#e7e0d5]"
                      >
                        <Filter className="w-4 h-4 text-[#8B6F47]" />
                        <span className="text-sm font-medium text-[#262626]">{filter}</span>
                        <ChevronDown className={`w-4 h-4 ${showFilterMenu ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {showFilterMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 top-12 w-40 bg-white rounded-xl shadow-lg border overflow-hidden z-20"
                          >
                            {filterOptions.map((option) => (
                              <button
                                key={option}
                                onClick={() => {
                                  setFilter(option);
                                  setShowFilterMenu(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm ${filter === option
                                    ? "bg-[#8B6F47] text-white"
                                    : "hover:bg-[#F5F0EB]"
                                  }`}
                              >
                                {option}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredTransactions.length === 0 ? (
                      <div className="text-center py-12">
                        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No transactions yet</p>
                        <p className="text-sm text-gray-500">Start shopping to earn points!</p>
                      </div>
                    ) : (
                      filteredTransactions.map((tx) => {
                        const isEarned = tx.transaction_type === "earned";
                        const IconComponent = getIconForSource(tx.source);

                        return (
                          <div
                            key={tx.id}
                            className="flex items-center gap-4 p-4 rounded-2xl border hover:shadow-sm transition"
                          >
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${isEarned ? "bg-green-100" : "bg-red-100"
                                }`}
                            >
                              <IconComponent
                                className={`w-6 h-6 ${isEarned ? "text-green-600" : "text-red-500"}`}
                              />
                            </div>

                            <div className="flex-1">
                              <h3 className="font-semibold text-[#262626]">
                                {tx.description || `${isEarned ? 'Earned' : 'Redeemed'} Points`}
                              </h3>
                              <p className="text-sm text-[#78716c] capitalize">
                                {tx.source.replace('_', ' ')}
                              </p>
                              <p className="text-xs text-[#a8a29e] mt-1">
                                {new Date(tx.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>

                            <div className="text-right">
                              <p
                                className={`font-bold text-xl ${isEarned ? "text-green-600" : "text-red-500"
                                  }`}
                              >
                                {isEarned ? "+" : "-"}
                                {tx.points}
                              </p>
                              <p className="text-xs text-[#a8a29e]">points</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
