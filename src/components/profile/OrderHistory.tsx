"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronDown, RotateCcw, CheckCircle, Clock, XCircle } from "lucide-react";
import Image from "next/image";
import { Order } from "@/types/menu";

interface OrderHistoryProps {
    orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const getStatusConfig = (status: Order["status"]) => {
        switch (status) {
            case "delivered":
                return {
                    icon: CheckCircle,
                    color: "text-green-600",
                    bg: "bg-green-100",
                    label: "Delivered",
                };
            case "preparing":
                return {
                    icon: Clock,
                    color: "text-amber-600",
                    bg: "bg-amber-100",
                    label: "Preparing",
                };
            case "pending":
                return {
                    icon: Clock,
                    color: "text-blue-600",
                    bg: "bg-blue-100",
                    label: "Pending",
                };
            case "cancelled":
                return {
                    icon: XCircle,
                    color: "text-red-600",
                    bg: "bg-red-100",
                    label: "Cancelled",
                };
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(date);
    };

    return (
        <section className="w-full py-12 lg:py-16" style={{ backgroundColor: "#D8CBB8" }}>
            <div className="mx-auto w-full px-4 lg:px-6 max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="w-7 h-7 text-[#8B6F47]" />
                        <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#404040]">
                            Your Orders
                        </h2>
                    </div>
                    <p className="font-sans text-base text-[#78716c]">
                        Track and manage your order history
                    </p>
                </motion.div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.map((order, index) => {
                        const statusConfig = getStatusConfig(order.status);
                        const StatusIcon = statusConfig.icon;
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#8B6F47]/20"
                            >
                                {/* Order Header */}
                                <div
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                    className="p-5 cursor-pointer hover:bg-[#D8CBB8]/20 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            {/* Order ID and Date */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                                <h3 className="font-serif text-lg lg:text-xl font-semibold text-[#404040]">
                                                    Order #{order.id}
                                                </h3>
                                                <span className="font-sans text-sm text-[#78716c]">
                                                    {formatDate(order.date)}
                                                </span>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <div
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg}`}
                                                >
                                                    <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                                                    <span className={`font-sans text-sm font-semibold ${statusConfig.color}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-amber-600">
                                                    <span className="font-sans text-xs">+{order.pointsEarned} points</span>
                                                </div>
                                            </div>

                                            {/* Item Preview (Mobile) */}
                                            <div className="lg:hidden flex -space-x-2 mb-2">
                                                {order.items.slice(0, 3).map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                                                    >
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-[#8B6F47] flex items-center justify-center">
                                                        <span className="font-sans text-xs text-white font-bold">
                                                            +{order.items.length - 3}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Total and Items Count */}
                                            <div className="flex items-center justify-between">
                                                <p className="font-sans text-sm text-[#78716c]">
                                                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                                                </p>
                                                <p className="font-serif text-2xl font-bold text-[#262626]">
                                                    ₹{order.total}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Expand Icon */}
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown className="w-6 h-6 text-[#8B6F47]" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Expanded Order Details */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 pt-2 border-t border-[#8B6F47]/20 bg-[#D8CBB8]/10">
                                                {/* Items List */}
                                                <div className="space-y-3 mb-4">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-4">
                                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-serif text-base text-[#404040] line-clamp-1">
                                                                    {item.name}
                                                                </p>
                                                                <p className="font-sans text-sm text-[#78716c]">
                                                                    Qty: {item.quantity}
                                                                </p>
                                                            </div>
                                                            <p className="font-sans text-base font-semibold text-[#262626]">
                                                                ₹{item.price * item.quantity}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Reorder Button */}
                                                {order.status === "delivered" && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold rounded-full transition-colors shadow-md"
                                                    >
                                                        <RotateCcw className="w-5 h-5" />
                                                        Reorder
                                                    </motion.button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {orders.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center py-12"
                    >
                        <Package className="w-16 h-16 text-[#78716c] mx-auto mb-4" />
                        <p className="font-serif text-xl text-[#404040] mb-2">No orders yet</p>
                        <p className="font-sans text-sm text-[#78716c]">
                            Start exploring our menu to place your first order!
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
