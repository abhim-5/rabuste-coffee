"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import {
  Coins,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Coffee,
  Sparkles,
  Gift,
  Calendar,
  Filter,
  ChevronDown,
  Award,
  Target,
  Zap,
} from "lucide-react";
import Image from "next/image";

// Extended mock transactions data
const allTransactions = [
  {
    id: 1,
    type: "earned",
    title: "Welcome Bonus",
    description: "Thank you for joining Rabuste!",
    points: 100,
    date: "Jan 1, 2026",
    time: "10:30 AM",
    icon: Sparkles,
    category: "bonus",
  },
  {
    id: 2,
    type: "earned",
    title: "Order #1234",
    description: "Cappuccino, Croissant, Espresso",
    points: 75,
    date: "Dec 28, 2025",
    time: "2:15 PM",
    icon: ShoppingBag,
    category: "order",
  },
  {
    id: 3,
    type: "redeemed",
    title: "Free Coffee Redeemed",
    description: "Signature Robusta Blend",
    points: -50,
    date: "Dec 25, 2025",
    time: "11:00 AM",
    icon: Coffee,
    category: "redemption",
  },
  {
    id: 4,
    type: "earned",
    title: "Workshop Attendance",
    description: "Latte Art Masterclass",
    points: 125,
    date: "Dec 20, 2025",
    time: "4:00 PM",
    icon: TrendingUp,
    category: "workshop",
  },
  {
    id: 5,
    type: "earned",
    title: "Order #1198",
    description: "Mocha, Blueberry Muffin",
    points: 45,
    date: "Dec 15, 2025",
    time: "9:30 AM",
    icon: ShoppingBag,
    category: "order",
  },
  {
    id: 6,
    type: "earned",
    title: "Referral Bonus",
    description: "Friend joined using your code",
    points: 200,
    date: "Dec 10, 2025",
    time: "6:45 PM",
    icon: Gift,
    category: "bonus",
  },
  {
    id: 7,
    type: "redeemed",
    title: "10% Order Discount",
    description: "Applied to Order #1150",
    points: -100,
    date: "Dec 5, 2025",
    time: "1:20 PM",
    icon: TrendingDown,
    category: "redemption",
  },
  {
    id: 8,
    type: "earned",
    title: "Order #1150",
    description: "Cold Brew, Chocolate Cake",
    points: 60,
    date: "Dec 5, 2025",
    time: "1:15 PM",
    icon: ShoppingBag,
    category: "order",
  },
  {
    id: 9,
    type: "earned",
    title: "Birthday Bonus 🎂",
    description: "Happy Birthday from Rabuste!",
    points: 150,
    date: "Nov 25, 2025",
    time: "12:00 AM",
    icon: Sparkles,
    category: "bonus",
  },
  {
    id: 10,
    type: "earned",
    title: "Order #1089",
    description: "Flat White, Bagel",
    points: 35,
    date: "Nov 20, 2025",
    time: "8:45 AM",
    icon: ShoppingBag,
    category: "order",
  },
];

// Stats data
const stats = {
  totalPoints: 250,
  totalEarned: 790,
  totalRedeemed: 150,
  tier: "Gold Member",
  nextTier: "Platinum",
  pointsToNextTier: 250,
};

// Rewards available
const rewards = [
  { id: 1, name: "Free Coffee", points: 50, image: "/main-menu/coffee-1.jpg" },
  { id: 2, name: "Free Pastry", points: 75, image: "/main-menu/pastry-1.jpg" },
  { id: 3, name: "10% Off Order", points: 100, image: "/main-menu/coffee-2.jpg" },
  { id: 4, name: "Free Workshop Entry", points: 300, image: "/workshop/workshop-1.jpg" },
];

const filterOptions = ["All", "Earned", "Redeemed", "Orders", "Bonuses", "Workshops"];

export default function PointsPage() {
  const [filter, setFilter] = useState("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredTransactions = allTransactions.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Earned") return t.type === "earned";
    if (filter === "Redeemed") return t.type === "redeemed";
    if (filter === "Orders") return t.category === "order";
    if (filter === "Bonuses") return t.category === "bonus";
    if (filter === "Workshops") return t.category === "workshop";
    return true;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0EB] pt-16 lg:pt-20 pb-20 lg:pb-8">
        {/* Hero Section */}
        <section className="relative py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2d2520] to-[#1a1a1a]" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-40 h-40 bg-amber-500 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-60 h-60 bg-amber-600 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-amber-50 mb-2">
                Reward Points
              </h1>
              <p className="text-amber-100/70 font-sans">
                Track your earnings and redeem exclusive rewards
              </p>
            </motion.div>

            {/* Points Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  {/* Current Balance */}
                  <div className="text-center lg:text-left">
                    <p className="text-amber-100/60 text-sm font-medium uppercase tracking-wider mb-1">
                      Current Balance
                    </p>
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <div className="w-14 h-14 rounded-full bg-amber-500/30 flex items-center justify-center">
                        <Coins className="w-8 h-8 text-amber-400" />
                      </div>
                      <div>
                        <span className="font-display text-5xl lg:text-6xl font-bold text-amber-400">
                          {stats.totalPoints}
                        </span>
                        <span className="text-amber-100/70 text-lg ml-2">points</span>
                      </div>
                    </div>
                  </div>

                  {/* Tier Progress */}
                  <div className="w-full lg:w-auto">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" />
                        <span className="text-amber-50 font-semibold">{stats.tier}</span>
                      </div>
                      <span className="text-amber-100/50 text-sm">{stats.nextTier}</span>
                    </div>
                    <div className="w-full lg:w-48 h-2 bg-amber-900/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "50%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      />
                    </div>
                    <p className="text-amber-100/50 text-xs mt-1 text-right">
                      {stats.pointsToNextTier} pts to {stats.nextTier}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-amber-500/20">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-semibold">+{stats.totalEarned}</span>
                    </div>
                    <p className="text-amber-100/50 text-xs">Total Earned</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-semibold">-{stats.totalRedeemed}</span>
                    </div>
                    <p className="text-amber-100/50 text-xs">Total Redeemed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Ways to Earn Section */}
        <section className="py-10 lg:py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#3d3226] mb-2">
                Ways to Earn Points
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8B6F47]" />
                <Zap className="w-5 h-5 text-[#8B6F47]" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#8B6F47]" />
              </div>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: ShoppingBag, title: "Orders", desc: "1 point per ₹10", color: "amber" },
                { icon: Gift, title: "Referrals", desc: "+200 points each", color: "green" },
                { icon: Calendar, title: "Workshops", desc: "+125 points", color: "blue" },
                { icon: Sparkles, title: "Bonuses", desc: "Special rewards", color: "purple" },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                      item.color === "amber"
                        ? "bg-amber-100 text-amber-600"
                        : item.color === "green"
                        ? "bg-green-100 text-green-600"
                        : item.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#3d3226] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#78716c]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Available Rewards */}
        <section className="py-10 lg:py-12 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#3d3226] mb-2">
                Redeem Your Points
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8B6F47]" />
                <Target className="w-5 h-5 text-[#8B6F47]" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#8B6F47]" />
              </div>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {rewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-[#F5F0EB] rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <div className="relative h-28 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                    <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      <Coins className="w-3 h-3" />
                      {reward.points}
                    </div>
                    <Image
                      src={reward.image}
                      alt={reward.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-sm font-semibold text-[#3d3226]">
                      {reward.name}
                    </h3>
                    <button
                      className={`mt-2 w-full py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        stats.totalPoints >= reward.points
                          ? "bg-[#8B6F47] text-white hover:bg-[#6d5638]"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={stats.totalPoints < reward.points}
                    >
                      {stats.totalPoints >= reward.points ? "Redeem" : "Not Enough Points"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Transaction History */}
        <section className="py-10 lg:py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8"
            >
              <div className="text-center lg:text-left">
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#3d3226]">
                  Transaction History
                </h2>
                <p className="text-[#78716c] text-sm mt-1">
                  Your complete points activity
                </p>
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#e7e5e4] hover:border-[#8B6F47] transition-colors"
                >
                  <Filter className="w-4 h-4 text-[#8B6F47]" />
                  <span className="text-sm font-medium text-[#3d3226]">{filter}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#78716c] transition-transform ${
                      showFilterMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showFilterMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 w-40 bg-white rounded-xl shadow-lg border border-[#e7e5e4] overflow-hidden z-20"
                    >
                      {filterOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilter(option);
                            setShowFilterMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            filter === option
                              ? "bg-[#8B6F47] text-white"
                              : "text-[#3d3226] hover:bg-[#F5F0EB]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Transactions List */}
            <div className="max-w-3xl mx-auto space-y-3">
              {filteredTransactions.map((transaction, index) => {
                const IconComponent = transaction.icon;
                const isEarned = transaction.type === "earned";

                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          isEarned ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <IconComponent
                          className={`w-6 h-6 ${isEarned ? "text-green-600" : "text-red-500"}`}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-sans font-semibold text-[#3d3226]">
                              {transaction.title}
                            </h3>
                            <p className="text-sm text-[#78716c] line-clamp-1">
                              {transaction.description}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p
                              className={`font-bold text-lg ${
                                isEarned ? "text-green-600" : "text-red-500"
                              }`}
                            >
                              {isEarned ? "+" : ""}
                              {transaction.points}
                            </p>
                            <p className="text-xs text-[#a8a29e]">points</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-[#a8a29e]">
                          <Calendar className="w-3 h-3" />
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span>{transaction.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <Coins className="w-16 h-16 text-[#d6d3d1] mx-auto mb-4" />
                  <p className="text-[#78716c] font-medium">No transactions found</p>
                  <p className="text-sm text-[#a8a29e]">Try a different filter</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
