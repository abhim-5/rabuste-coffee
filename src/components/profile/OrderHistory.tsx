"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronDown, RotateCcw, CheckCircle, Clock, XCircle, Download, Star, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Order } from "@/types/menu";

interface OrderHistoryProps {
    orders: Order[];
    totalSpent: number;
    isDesktop?: boolean;
}

export function OrderHistory({ orders, totalSpent, isDesktop = false }: OrderHistoryProps) {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

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

    const displayedOrders = showAll ? orders : orders.slice(0, isDesktop ? 5 : 2);

    const handleDownloadBill = (orderId: string) => {
        alert(`Downloading bill for order ${orderId}`);
    };

    const handleReorder = (orderId: string) => {
        alert(`Reordering items from order ${orderId}`);
    };

    // Desktop version - clean card layout without section wrapper
    if (isDesktop) {
        return (
            <div className="space-y-4">
                {orders.length > 0 ? (
                    <>
                        {displayedOrders.map((order, index) => {
                            const statusConfig = getStatusConfig(order.status);
                            const StatusIcon = statusConfig.icon;
                            const isExpanded = expandedOrder === order.id;

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[#F5F0EB] rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        className="p-5 cursor-pointer hover:bg-[#ebe5de] transition-colors"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                                                    <Package className="w-6 h-6 text-[#8B6F47]" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="font-sans text-base font-semibold text-[#262626]">
                                                            Order #{order.id}
                                                        </h3>
                                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bg}`}>
                                                            <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                                                            <span className={`font-sans text-xs font-semibold ${statusConfig.color}`}>
                                                                {statusConfig.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="font-sans text-sm text-[#78716c]">
                                                        {formatDate(order.date)} • {order.items.length} items • +{order.pointsEarned} pts
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-display text-xl font-bold text-[#262626]">
                                                    ₹{order.total}
                                                </p>
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
                                                >
                                                    <ChevronDown className="w-5 h-5 text-[#8B6F47]" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 pt-3 border-t border-[#e7e5e4]">
                                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl">
                                                                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                                                    <Image
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-sans text-sm font-medium text-[#262626] line-clamp-1">
                                                                        {item.name}
                                                                    </p>
                                                                    <p className="font-sans text-xs text-[#78716c]">
                                                                        Qty: {item.quantity} • ₹{item.price * item.quantity}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleDownloadBill(order.id)}
                                                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-[#e7e5e4] text-[#404040] font-sans font-semibold text-sm rounded-xl transition-colors"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download Bill
                                                        </button>
                                                        {order.status === "delivered" && (
                                                            <button
                                                                onClick={() => handleReorder(order.id)}
                                                                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold text-sm rounded-xl transition-colors"
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                                Reorder
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}

                        {orders.length > 5 && !showAll && (
                            <button
                                onClick={() => setShowAll(true)}
                                className="w-full flex items-center justify-center gap-2 py-3 text-[#8B6F47] hover:text-[#6d5638] font-sans font-semibold text-sm transition-colors"
                            >
                                View all {orders.length} orders
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}

                        {showAll && orders.length > 5 && (
                            <button
                                onClick={() => setShowAll(false)}
                                className="w-full flex items-center justify-center gap-2 py-3 text-[#78716c] hover:text-[#404040] font-sans font-semibold text-sm transition-colors"
                            >
                                Show less
                            </button>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-[#d6d3d1] mx-auto mb-4" />
                        <p className="font-display text-xl text-[#404040] mb-2">No orders yet</p>
                        <p className="font-sans text-sm text-[#78716c]">
                            Start exploring our menu to place your first order!
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <section className="w-full py-8 lg:py-10" style={{ backgroundColor: "#D8CBB8" }}>
            <div className="mx-auto w-full px-4 lg:px-6 max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-8"
                >
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#404040] mb-3 text-center">
                        Your Orders
                    </h2>
                    <div className="relative w-24 h-6 mb-3">
                        <Image
                            src="/title-separator.png"
                            fill
                            alt=""
                            className="object-contain"
                        />
                    </div>
                    <p className="font-sans text-sm text-[#78716c] text-center">
                        {orders.length} orders • <span className="font-semibold text-[#8B6F47]">₹{totalSpent.toLocaleString()} spent</span>
                    </p>
                </motion.div>

                {/* Orders List with Gradient Fade Effect */}
                <div className="relative">
                    <div className="space-y-3">
                        {displayedOrders.map((order, index) => {
                            const statusConfig = getStatusConfig(order.status);
                            const StatusIcon = statusConfig.icon;
                            const isExpanded = expandedOrder === order.id;
                            const isSecondItem = index === 1 && !showAll;

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`bg-white rounded-xl shadow-sm overflow-hidden ${isSecondItem ? 'relative border-0' : 'border border-[#8B6F47]/10'}`}
                                >
                                    {/* Gradient overlay for second item */}
                                    {isSecondItem && (
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-[#D8CBB8] z-10 pointer-events-none" />
                                    )}

                                    {/* Order Header */}
                                    <div
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        className="p-4 cursor-pointer hover:bg-[#D8CBB8]/10 transition-colors"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-sans text-sm font-semibold text-[#404040]">
                                                        #{order.id}
                                                    </h3>
                                                    <span className="text-xs text-[#a8a29e]">•</span>
                                                    <span className="font-sans text-xs text-[#78716c]">
                                                        {formatDate(order.date)}
                                                    </span>
                                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${statusConfig.bg}`}>
                                                        <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                                                        <span className={`font-sans text-[10px] font-semibold ${statusConfig.color}`}>
                                                            {statusConfig.label}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="font-sans text-xs text-[#78716c]">
                                                        {order.items.length} items • +{order.pointsEarned} pts
                                                    </p>
                                                    <p className="font-sans text-base font-bold text-[#262626]">
                                                        ₹{order.total}
                                                    </p>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <ChevronDown className="w-5 h-5 text-[#8B6F47]" />
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
                                                    {/* Items List with Ratings */}
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
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="font-sans text-sm text-[#78716c]">
                                                                            Qty: {item.quantity}
                                                                        </p>
                                                                        <span className="text-[#d6d3d1]">•</span>
                                                                        <div className="flex items-center gap-1">
                                                                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                                                            <span className="font-sans text-xs text-[#78716c]">Rate this item</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <p className="font-sans text-base font-semibold text-[#262626]">
                                                                    ₹{item.price * item.quantity}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-3">
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleDownloadBill(order.id)}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#8B6F47]/30 hover:bg-[#D8CBB8]/30 text-[#404040] font-sans font-semibold rounded-full transition-colors"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download Bill
                                                        </motion.button>
                                                        {order.status === "delivered" && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={() => handleReorder(order.id)}
                                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold rounded-full transition-colors shadow-md"
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                                Reorder
                                                            </motion.button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* View More Button */}
                    {orders.length > 2 && !showAll && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setShowAll(true)}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-[#D8CBB8]/30 text-[#8B6F47] font-sans font-semibold rounded-full transition-colors border border-[#8B6F47]/30"
                        >
                            View all {orders.length} orders
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    )}

                    {showAll && orders.length > 2 && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setShowAll(false)}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-[#D8CBB8]/30 text-[#78716c] font-sans font-semibold rounded-full transition-colors border border-[#8B6F47]/30"
                        >
                            Show less
                        </motion.button>
                    )}
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
