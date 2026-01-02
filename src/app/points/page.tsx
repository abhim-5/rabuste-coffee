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
  { id: 1, name: "Free Coffee", points: 50, image: "/about us/1.jpg" },
  { id: 2, name: "Free Pastry", points: 75, image: "/about us/2.jpg" },
  { id: 3, name: "10% Off Order", points: 100, image: "/about us/3.jpg" },
  { id: 4, name: "Free Workshop Entry", points: 300, image: "/main-menu/menu1a.jpg" },
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

                {/* Tier Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span className="text-[#262626] font-semibold text-sm">{stats.tier}</span>
                    </div>
                    <span className="text-[#78716c] text-sm">{stats.nextTier}</span>
                  </div>
                  <div className="w-full h-2 bg-[#F5F0EB] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "50%" }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                    />
                  </div>
                  <p className="text-[#78716c] text-xs mt-1 text-right">
                    {stats.pointsToNextTier} pts to {stats.nextTier}
                  </p>
                </div>

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

            {/* Ways to Earn */}
            <div className="mb-6">
              <h2 className="font-display text-xl font-bold text-[#262626] mb-4 text-center">
                Ways to Earn Points
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: ShoppingBag, title: "Orders", desc: "1 point per ₹10", color: "amber" },
                  { icon: Gift, title: "Referrals", desc: "+200 points", color: "green" },
                  { icon: Calendar, title: "Workshops", desc: "+125 points", color: "blue" },
                  { icon: Sparkles, title: "Bonuses", desc: "Special rewards", color: "purple" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-2xl p-4 shadow-sm text-center"
                  >
                    <div
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        item.color === "amber"
                          ? "bg-amber-100 text-amber-600"
                          : item.color === "green"
                          ? "bg-green-100 text-green-600"
                          : item.color === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-sans text-sm font-semibold text-[#262626] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#78716c]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Redeem Rewards - Mobile */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-[#262626]">
                  Redeem Rewards
                </h2>
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="bg-white border-[0.5px] border-[#8B6F47] rounded-2xl overflow-hidden shadow-sm"
                  >
                    <div className="relative h-32 overflow-hidden bg-[#F5F0EB]">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
                      <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        <Coins className="w-3 h-3" />
                        {reward.points}
                      </div>
                      <Image
                        src={reward.image}
                        alt={reward.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-sans text-sm font-semibold text-[#262626] mb-2">
                        {reward.name}
                      </h3>
                      <button
                        className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors border-[0.5px] ${
                          stats.totalPoints >= reward.points
                            ? "bg-[#8B6F47] text-white border-[#8B6F47] hover:bg-[#6d5638]"
                            : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                        }`}
                        disabled={stats.totalPoints < reward.points}
                      >
                        {stats.totalPoints >= reward.points ? "Redeem Now" : "Need More Points"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-[#262626]">
                  Recent Activity
                </h2>
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-1 px-3 py-2 bg-white rounded-full border-[0.5px] border-[#8B6F47] text-sm text-[#262626] font-medium whitespace-nowrap"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">{filter}</span>
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
                      className={`w-full text-left px-4 py-2.5 text-sm ${
                        filter === option
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
                {filteredTransactions.slice(0, 5).map((transaction) => {
                  const IconComponent = transaction.icon;
                  const isEarned = transaction.type === "earned";

                  return (
                    <div
                      key={transaction.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border-[0.5px] border-[#8B6F47]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            isEarned ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${isEarned ? "text-green-600" : "text-red-500"}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-sans font-semibold text-sm text-[#262626]">
                            {transaction.title}
                          </h3>
                          <p className="text-xs text-[#78716c]">{transaction.description}</p>
                          <p className="text-xs text-[#a8a29e] mt-1">
                            {transaction.date} • {transaction.time}
                          </p>
                        </div>
                        <p
                          className={`font-bold text-lg flex-shrink-0 ${
                            isEarned ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {isEarned ? "+" : ""}
                          {transaction.points}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Similar to Profile Page */}
        <div className="hidden lg:block pt-28 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8 items-start">
              {/* Left Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-80 flex-shrink-0 self-start"
              >
                <div className="sticky top-28 space-y-6">
                  {/* Points Balance Card */}
                  <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="h-28 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 relative">
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 right-4 w-20 h-20 bg-amber-300 rounded-full blur-2xl" />
                        <div className="absolute bottom-4 left-4 w-16 h-16 bg-amber-200 rounded-full blur-xl" />
                      </div>
                      <div className="relative h-full flex items-center justify-center">
                        <Coins className="w-16 h-16 text-white" />
                      </div>
                    </div>

                    {/* Content */}
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
                        </div>
                      </div>

                      {/* Tier Info */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-600" />
                            <span className="text-[#262626] font-semibold text-sm">{stats.tier}</span>
                          </div>
                          <span className="text-[#78716c] text-xs">{stats.nextTier}</span>
                        </div>
                        <div className="w-full h-2 bg-[#F5F0EB] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "50%" }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                          />
                        </div>
                        <p className="text-[#78716c] text-xs mt-1 text-right">
                          {stats.pointsToNextTier} pts to next tier
                        </p>
                      </div>

                      {/* Stats */}
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

                  {/* Ways to Earn Quick Card */}
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h3 className="font-display text-lg font-bold text-[#262626] mb-4">
                      Earn Points
                    </h3>
                    <div className="space-y-3">
                      {[
                        { icon: ShoppingBag, title: "Orders", desc: "1 pt per ₹10" },
                        { icon: Gift, title: "Referrals", desc: "+200 pts" },
                        { icon: Calendar, title: "Workshops", desc: "+125 pts" },
                        { icon: Sparkles, title: "Bonuses", desc: "Special" },
                      ].map((item) => (
                        <div key={item.title} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-4 h-4 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#262626]">{item.title}</p>
                            <p className="text-xs text-[#78716c]">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 space-y-6"
              >
                {/* Available Rewards Section */}
                <div className="bg-white rounded-3xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-2xl font-bold text-[#262626]">
                      Redeem Rewards
                    </h2>
                    <Target className="w-6 h-6 text-amber-600" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {rewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="border-[0.5px] border-[#8B6F47] rounded-2xl overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-32 overflow-hidden bg-[#F5F0EB]">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
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
                        <div className="p-3 bg-white">
                          <h3 className="font-sans text-sm font-semibold text-[#262626] mb-2">
                            {reward.name}
                          </h3>
                          <button
                            className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors border-[0.5px] ${
                              stats.totalPoints >= reward.points
                                ? "bg-[#8B6F47] text-white border-[#8B6F47] hover:bg-[#6d5638]"
                                : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                            }`}
                            disabled={stats.totalPoints < reward.points}
                          >
                            {stats.totalPoints >= reward.points ? "Redeem Now" : "Need More Points"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transaction History */}
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

                    {/* Filter Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F5F0EB] rounded-xl border-[0.5px] border-[#8B6F47] hover:bg-[#e7e0d5] transition-colors"
                      >
                        <Filter className="w-4 h-4 text-[#8B6F47]" />
                        <span className="text-sm font-medium text-[#262626]">{filter}</span>
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
                            className="absolute right-0 top-12 w-40 bg-white rounded-xl shadow-lg border-[0.5px] border-[#8B6F47] overflow-hidden z-20"
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
                                    : "text-[#262626] hover:bg-[#F5F0EB]"
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

                  {/* Transactions List */}
                  <div className="space-y-3">
                    {filteredTransactions.map((transaction) => {
                      const IconComponent = transaction.icon;
                      const isEarned = transaction.type === "earned";

                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center gap-4 p-4 rounded-2xl border-[0.5px] border-[#e7e5e4] hover:border-[#8B6F47] hover:shadow-sm transition-all"
                        >
                          <div
                            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                              isEarned ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            <IconComponent
                              className={`w-6 h-6 ${isEarned ? "text-green-600" : "text-red-500"}`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-sans font-semibold text-[#262626]">
                              {transaction.title}
                            </h3>
                            <p className="text-sm text-[#78716c] line-clamp-1">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-[#a8a29e]">
                              <Calendar className="w-3 h-3" />
                              <span>{transaction.date}</span>
                              <span>•</span>
                              <span>{transaction.time}</span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <p
                              className={`font-bold text-xl ${
                                isEarned ? "text-green-600" : "text-red-500"
                              }`}
                            >
                              {isEarned ? "+" : ""}
                              {transaction.points}
                            </p>
                            <p className="text-xs text-[#a8a29e]">points</p>
                          </div>
                        </div>
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
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
