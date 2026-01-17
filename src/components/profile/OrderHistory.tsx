"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronDown, RotateCcw, CheckCircle, Clock, XCircle, Download, Star, ChevronRight, CreditCard } from "lucide-react";
import Image from "next/image";
import { Order } from "@/types/menu";
import { RatingModal } from "@/components/orders/RatingModal";

interface OrderHistoryProps {
    orders: Order[];
    totalSpent: number;
    isDesktop?: boolean;
    onReorder?: (order: Order) => void;
}

export function OrderHistory({ orders, totalSpent, isDesktop = false, onReorder }: OrderHistoryProps) {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [selectedOrderForRating, setSelectedOrderForRating] = useState<Order | null>(null);
    const [orderRatings, setOrderRatings] = useState<Record<string, Record<string, number>>>({});
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);

    const getStatusConfig = (status: Order["status"]) => {
        switch (status) {
            case "completed":
            case "delivered":
                return {
                    icon: CheckCircle,
                    color: "text-green-600",
                    bg: "bg-green-100",
                    label: "Completed",
                };
            case "ready":
                return {
                    icon: Package,
                    color: "text-purple-600",
                    bg: "bg-purple-100",
                    label: "Ready",
                };
            case "confirmed":
                return {
                    icon: CheckCircle,
                    color: "text-blue-600",
                    bg: "bg-blue-100",
                    label: "Confirmed",
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
            default:
                // Fallback for unknown statuses
                return {
                    icon: Package,
                    color: "text-gray-600",
                    bg: "bg-gray-100",
                    label: status || "Unknown",
                };
        }
    };

    const formatDate = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(dateObj);
    };

    const displayedOrders = showAll ? orders : orders.slice(0, isDesktop ? 5 : 2);

    const handleDownloadBill = async (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        try {
            const { generateBillPDF } = await import('@/utils/billGenerator');

            // Use order_number if available, fallback to id
            const orderNumber = (order as any).order_number || order.id;
            const discount = (order as any).discount || 0;
            const subtotal = (order as any).subtotal || order.total;

            generateBillPDF({
                orderId: orderNumber,
                date: new Date(order.date).toLocaleDateString(),
                customerName: "Valued Customer", // You can pass user name via props if needed
                items: order.items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.price * item.quantity
                })),
                subtotal: subtotal,
                discount: discount,
                total: order.total,
                paymentMethod: 'Online / Paid'
            });
        } catch (error) {
            console.error('Error generating bill:', error);
            alert('Failed to generate bill');
        }
    };

    const handleReorder = (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        if (onReorder) {
            onReorder(order);
        } else {
            alert(`Reordering items from order #${(order as any).order_number || orderId}`);
        }
    };

    const handleRetryPayment = async (order: Order) => {
        try {
            setIsProcessingOrder(true);

            // Load Razorpay SDK
            const loadRazorpay = () => {
                return new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });
            };

            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert('Razorpay SDK failed to load');
                setIsProcessingOrder(false);
                return;
            }

            // Create new Razorpay order for this existing order
            const payload = {
                orderNumber: order.id,
                total: order.total,
                retryPayment: true
            };

            const orderRes = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await orderRes.json();

            if (!data.success) throw new Error(data.error || 'Failed to create payment order');

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "Rabuste Coffee",
                description: `Retry Payment for Order #${order.id}`,
                order_id: data.razorpayOrderId,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                order_id: (order as any).uuid || data.dbOrderId
                            })
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            alert('Payment successful! Your order is confirmed.');
                            window.location.reload(); // Refresh to update payment status
                        } else {
                            alert('Payment Verification Failed');
                        }
                    } catch (err) {
                        console.error('Payment Success Handler Error:', err);
                        alert('Payment processed but verification failed.');
                    }
                },
                theme: {
                    color: "#8B6F47"
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessingOrder(false);
                    }
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error('Error retrying payment:', error);
            alert((error as any).message || 'Failed to retry payment. Please try again.');
            setIsProcessingOrder(false);
        }
    };

    const handleRateOrder = (order: Order) => {
        console.log('Rate Order clicked!', order);
        setSelectedOrderForRating(order);
        setRatingModalOpen(true);
    };

    const handleRatingSuccess = () => {
        console.log('Rating submitted successfully!');
        // Reload ratings
        if (selectedOrderForRating) {
            window.location.reload(); // Simple reload to refresh all data
        }
    };

    // Fetch ratings for completed orders
    useEffect(() => {
        const fetchRatings = async () => {
            const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered');
            console.log('=== FETCHING RATINGS ===');
            console.log('Completed orders:', completedOrders.map(o => ({ id: o.id, uuid: (o as any).uuid, items: o.items.map(i => i.name) })));

            if (completedOrders.length === 0) return;

            try {
                const { createClient } = await import('@/lib/supabase/client');
                const supabase = createClient();

                // Use UUID for database lookup
                const orderUUIDs = completedOrders.map(o => (o as any).uuid).filter(Boolean);
                console.log('Fetching ratings for UUIDs:', orderUUIDs);

                const { data, error } = await supabase
                    .from('product_ratings')
                    .select('order_id, menu_item_name, rating')
                    .in('order_id', orderUUIDs);

                console.log('Ratings query error:', error);
                console.log('Ratings data received:', data);

                if (data && data.length > 0) {
                    const ratings: Record<string, Record<string, number>> = {};
                    data.forEach(rating => {
                        if (!ratings[rating.order_id]) {
                            ratings[rating.order_id] = {};
                        }
                        ratings[rating.order_id][rating.menu_item_name] = rating.rating;
                    });
                    console.log('Processed ratings structure (by UUID):', ratings);
                    setOrderRatings(ratings);
                } else {
                    console.log('No ratings found');
                    setOrderRatings({});
                }
            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        };

        fetchRatings();
    }, [orders]);

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
                                        onClick={(e) => {
                                            // Don't toggle if clicking on buttons
                                            const target = e.target as HTMLElement;
                                            if (target.closest('button')) {
                                                return;
                                            }
                                            setExpandedOrder(isExpanded ? null : order.id);
                                        }}
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
                                                            Order #{(order as any).order_number || order.id}
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
                                                                    <img
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-sans text-sm font-medium text-[#262626] line-clamp-1">
                                                                        {item.name}
                                                                    </p>
                                                                    <p className="font-sans text-xs text-[#78716c]">
                                                                        Qty: {item.quantity} • ₹{item.price * item.quantity}
                                                                    </p>
                                                                    {/* Show rating if exists */}
                                                                    {(() => {
                                                                        const orderUUID = (order as any).uuid;
                                                                        const itemRating = orderRatings[orderUUID]?.[item.name];
                                                                        console.log(`Item "${item.name}" in order ${order.id} (UUID: ${orderUUID}):`, {
                                                                            hasRating: !!itemRating,
                                                                            ratingValue: itemRating,
                                                                            availableRatings: orderRatings[orderUUID]
                                                                        });

                                                                        if (itemRating) {
                                                                            return (
                                                                                <div className="flex items-center gap-1 mt-1">
                                                                                    {[...Array(5)].map((_, i) => (
                                                                                        <Star
                                                                                            key={i}
                                                                                            className={`w-3 h-3 ${i < itemRating
                                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                                : 'text-gray-300'
                                                                                                }`}
                                                                                        />
                                                                                    ))}
                                                                                    <span className="text-xs text-gray-600 ml-1">
                                                                                        ({itemRating}/5)
                                                                                    </span>
                                                                                </div>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-3">
                                                        {/* Payment Status Check */}
                                                        {(() => {
                                                            const paymentStatus = (order as any).payment_status || 'paid';
                                                            const isPending = paymentStatus === 'pending' || paymentStatus === 'failed';

                                                            if (isPending) {
                                                                // Show Retry Payment button for pending/failed payments
                                                                return (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleRetryPayment(order);
                                                                        }}
                                                                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-sans font-semibold text-sm rounded-xl transition-colors"
                                                                    >
                                                                        <CreditCard className="w-4 h-4" />
                                                                        Retry Payment
                                                                    </button>
                                                                );
                                                            } else {
                                                                // Show Download Bill button for successful payments
                                                                return (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDownloadBill(order.id);
                                                                        }}
                                                                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-[#e7e5e4] text-[#404040] font-sans font-semibold text-sm rounded-xl transition-colors"
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                        Download Bill
                                                                    </button>
                                                                );
                                                            }
                                                        })()}
                                                        {(() => {
                                                            const orderUUID = (order as any).uuid;
                                                            const hasRatings = orderRatings[orderUUID] && Object.keys(orderRatings[orderUUID]).length > 0;
                                                            console.log(`Order ${order.id} (UUID: ${orderUUID}):`, {
                                                                status: order.status,
                                                                hasRatings,
                                                                ratings: orderRatings[orderUUID]
                                                            });

                                                            if (order.status === "completed") {
                                                                if (!hasRatings) {
                                                                    return (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                console.log('Rate button clicked for order:', order);
                                                                                handleRateOrder(order);
                                                                            }}
                                                                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold text-sm rounded-xl transition-colors"
                                                                        >
                                                                            <Star className="w-4 h-4" />
                                                                            Rate Order
                                                                        </button>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <div className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green-100 text-green-700 font-sans font-semibold text-sm rounded-xl">
                                                                            <Star className="w-4 h-4 fill-green-700" />
                                                                            Rated
                                                                        </div>
                                                                    );
                                                                }
                                                            }
                                                            return null;
                                                        })()}
                                                        {(order.status === "completed" || order.status === "delivered") && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleReorder(order.id);
                                                                }}
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

                {/* Rating Modal for Desktop */}
                {selectedOrderForRating && (
                    <RatingModal
                        isOpen={ratingModalOpen}
                        onClose={() => {
                            setRatingModalOpen(false);
                            setSelectedOrderForRating(null);
                        }}
                        orderId={(selectedOrderForRating as any).uuid || selectedOrderForRating.id}
                        orderNumber={selectedOrderForRating.id}
                        orderItems={selectedOrderForRating.items.map((item, idx) => ({
                            id: `${selectedOrderForRating.id}-item-${idx}`,
                            name: item.name,
                            menu_item_name: item.name, // Add this for API
                            image: item.image,
                            quantity: item.quantity,
                            price: item.price
                        }))}
                        onSubmitSuccess={handleRatingSuccess}
                    />
                )}
            </div>
        );
    }

    // Mobile version with rating modal

    return (
        <>
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
                                                            #{(order as any).order_number || order.id}
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
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            className="w-full h-full object-cover"
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
                                                                            {/* Show rating if exists */}
                                                                            {(() => {
                                                                                const orderUUID = (order as any).uuid;
                                                                                const itemRating = orderRatings[orderUUID]?.[item.name];

                                                                                if (itemRating) {
                                                                                    return (
                                                                                        <div className="flex items-center gap-1">
                                                                                            {[...Array(5)].map((_, i) => (
                                                                                                <Star
                                                                                                    key={i}
                                                                                                    className={`w-3.5 h-3.5 ${i < itemRating
                                                                                                        ? 'fill-amber-500 text-amber-500'
                                                                                                        : 'text-gray-300'
                                                                                                        }`}
                                                                                                />
                                                                                            ))}
                                                                                            <span className="text-xs text-gray-600 ml-1">
                                                                                                ({itemRating}/5)
                                                                                            </span>
                                                                                        </div>
                                                                                    );
                                                                                } else {
                                                                                    return (
                                                                                        <div className="flex items-center gap-1">
                                                                                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                                                                            <span className="font-sans text-xs text-[#78716c]">Rate this item</span>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            })()}
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
                                                            {/* Payment Status Check */}
                                                            {(() => {
                                                                const paymentStatus = (order as any).payment_status || 'paid';
                                                                const isPending = paymentStatus === 'pending' || paymentStatus === 'failed';

                                                                if (isPending) {
                                                                    // Show Retry Payment button
                                                                    return (
                                                                        <motion.button
                                                                            whileHover={{ scale: 1.02 }}
                                                                            whileTap={{ scale: 0.98 }}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleRetryPayment(order);
                                                                            }}
                                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-sans font-semibold rounded-full transition-colors shadow-md"
                                                                        >
                                                                            <CreditCard className="w-4 h-4" />
                                                                            Retry Payment
                                                                        </motion.button>
                                                                    );
                                                                } else {
                                                                    // Show Download Bill button
                                                                    return (
                                                                        <motion.button
                                                                            whileHover={{ scale: 1.02 }}
                                                                            whileTap={{ scale: 0.98 }}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDownloadBill(order.id);
                                                                            }}
                                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#8B6F47]/30 hover:bg-[#D8CBB8]/30 text-[#404040] font-sans font-semibold rounded-full transition-colors"
                                                                        >
                                                                            <Download className="w-4 h-4" />
                                                                            Download Bill
                                                                        </motion.button>
                                                                    );
                                                                }
                                                            })()}
                                                            {order.status === "completed" && !orderRatings[order.id] && (
                                                                <motion.button
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRateOrder(order);
                                                                    }}
                                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold rounded-full transition-colors shadow-md"
                                                                >
                                                                    <Star className="w-4 h-4" />
                                                                    Rate Order
                                                                </motion.button>
                                                            )}
                                                            {order.status === "completed" && orderRatings[order.id] && Object.keys(orderRatings[order.id] || {}).length > 0 && (
                                                                <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 font-sans font-semibold rounded-full">
                                                                    <Star className="w-4 h-4 fill-green-700" />
                                                                    Rated
                                                                </div>
                                                            )}
                                                            {(order.status === "completed" || order.status === "delivered") && (
                                                                <motion.button
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleReorder(order.id);
                                                                    }}
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

            {/* Global Rating Modal (works for both desktop and mobile) */}
            {selectedOrderForRating && (
                <RatingModal
                    isOpen={ratingModalOpen}
                    onClose={() => {
                        setRatingModalOpen(false);
                        setSelectedOrderForRating(null);
                    }}
                    orderId={(selectedOrderForRating as any).uuid || selectedOrderForRating.id}
                    orderNumber={selectedOrderForRating.id}
                    orderItems={selectedOrderForRating.items.map((item, index) => ({
                        id: `${selectedOrderForRating.id}-item-${index}`,
                        order_id: selectedOrderForRating.id,
                        menu_item_id: item.name,
                        menu_item_name: item.name, // Required by API
                        menu_item_image: item.image,
                        variation_name: undefined,
                        unit_price: item.price,
                        quantity: item.quantity,
                        subtotal: item.price * item.quantity,
                        created_at: new Date(selectedOrderForRating.date).toISOString()
                    }))}
                    onSubmitSuccess={handleRatingSuccess}
                />
            )}
        </>
    );
}
