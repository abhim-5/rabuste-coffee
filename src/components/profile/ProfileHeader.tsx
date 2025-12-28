"use client";

import { motion } from "framer-motion";
import { Camera, Edit2, Award, ShoppingBag, Coins } from "lucide-react";
import Image from "next/image";
import { UserProfile } from "@/types/menu";

interface ProfileHeaderProps {
    user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    const memberDuration = Math.floor(
        (new Date().getTime() - user.memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    return (
        <section
            className="relative w-full overflow-hidden pt-8 pb-12 lg:pt-12 lg:pb-16"
            style={{
                background: "linear-gradient(135deg, #8B6F47 0%, #6d5638 50%, #8B6F47 100%)",
            }}
        >
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 bg-amber-200 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto w-full px-4 lg:px-6 max-w-6xl">
                {/* Main Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl"
                >
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative group"
                        >
                            <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                                <Image
                                    src={user.avatar || "/main-menu/menu1a.jpg"}
                                    alt={user.name}
                                    fill
                                    className="rounded-full object-cover border-4 border-white/30 shadow-xl"
                                />
                                {/* Camera Icon Overlay */}
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            {/* Member Badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                className="absolute -top-2 -right-2 bg-amber-500 text-white p-2 rounded-full shadow-lg"
                            >
                                <Award className="w-5 h-5" />
                            </motion.div>
                        </motion.div>

                        {/* User Info */}
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2">
                                    {user.name}
                                </h1>
                                <p className="font-sans text-base lg:text-lg text-amber-100 mb-1">
                                    {user.email}
                                </p>
                                {user.phone && (
                                    <p className="font-sans text-sm text-amber-200/80 mb-3">{user.phone}</p>
                                )}
                                <div className="flex items-center justify-center lg:justify-start gap-2 text-amber-100">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                                    <span className="font-sans text-sm">
                                        Member for {memberDuration} months
                                    </span>
                                </div>
                            </motion.div>

                            {/* Edit Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full text-white font-sans text-sm font-semibold transition-all shadow-lg mx-auto lg:mx-0"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </motion.button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        {/* Total Orders */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-500/20 rounded-lg">
                                    <ShoppingBag className="w-5 h-5 text-amber-200" />
                                </div>
                                <span className="font-sans text-sm text-amber-100">Total Orders</span>
                            </div>
                            <p className="font-display text-3xl font-bold text-white">
                                {user.totalOrders}
                            </p>
                        </motion.div>

                        {/* Points */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="bg-gradient-to-br from-amber-500/30 to-amber-600/30 backdrop-blur-sm rounded-2xl p-5 border border-amber-400/30 hover:from-amber-500/40 hover:to-amber-600/40 transition-all shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-400/30 rounded-lg">
                                    <Coins className="w-5 h-5 text-amber-100" />
                                </div>
                                <span className="font-sans text-sm text-amber-50 font-semibold">
                                    Reward Points
                                </span>
                            </div>
                            <p className="font-display text-4xl font-bold text-white">
                                {user.points.toLocaleString()}
                            </p>
                            <p className="font-sans text-xs text-amber-100 mt-1">
                                ≈ ₹{Math.floor(user.points / 10)} in rewards
                            </p>
                        </motion.div>

                        {/* Total Spent */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Award className="w-5 h-5 text-green-200" />
                                </div>
                                <span className="font-sans text-sm text-amber-100">Total Spent</span>
                            </div>
                            <p className="font-display text-3xl font-bold text-white">
                                ₹{user.totalSpent.toLocaleString()}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
