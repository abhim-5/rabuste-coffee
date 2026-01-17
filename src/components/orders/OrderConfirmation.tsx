"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Clock, Package } from "lucide-react";

interface OrderConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    orderNumber: string;
    orderType: string;
    scheduledTime?: string;
    total: number;
    itemCount: number;
}

export function OrderConfirmation({
    isOpen,
    onClose,
    orderNumber,
    orderType,
    scheduledTime,
    total,
    itemCount,
}: OrderConfirmationProps) {
    const getOrderTypeDisplay = () => {
        switch (orderType) {
            case 'dine-in':
                return { icon: Package, text: 'Dine-In Order', color: 'text-blue-600' };
            case 'takeaway-now':
                return { icon: Clock, text: 'Takeaway - Ready Now', color: 'text-orange-600' };
            case 'takeaway-scheduled':
                return { icon: Clock, text: 'Takeaway - Scheduled', color: 'text-green-600' };
            default:
                return { icon: Package, text: 'Order Placed', color: 'text-gray-600' };
        }
    };

    const orderTypeInfo = getOrderTypeDisplay();
    const Icon = orderTypeInfo.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>

                            {/* Success Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="font-serif text-2xl font-bold text-center text-gray-900 mb-2">
                                Order Placed Successfully!
                            </h2>

                            {/* Order Number */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 border-2 border-dashed border-gray-300">
                                <p className="text-sm text-gray-600 text-center mb-1">Your Order Number</p>
                                <p className="text-3xl font-bold text-center text-[#8B6F47] tracking-wider">
                                    {orderNumber}
                                </p>
                            </div>

                            {/* Order Details */}
                            <div className="space-y-4 mb-6">
                                {/* Order Type */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Icon className={`w-6 h-6 ${orderTypeInfo.color}`} />
                                    <div>
                                        <p className="text-sm text-gray-600">Order Type</p>
                                        <p className="font-semibold text-gray-900">{orderTypeInfo.text}</p>
                                    </div>
                                </div>

                                {/* Scheduled Time */}
                                {scheduledTime && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Pickup Time</p>
                                            <p className="font-semibold text-gray-900">{scheduledTime}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-xs text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                                    </div>
                                    <p className="text-2xl font-bold text-green-700">₹{total}</p>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-900 leading-relaxed">
                                    <strong>Next Steps:</strong><br />
                                    {orderType === 'dine-in'
                                        ? 'Show this order number to our staff at the counter.'
                                        : orderType === 'takeaway-now'
                                            ? 'Your order is being prepared now. Please come to the counter to collect.'
                                            : `Your order will be ready ${scheduledTime}. Please show this number when picking up.`
                                    }
                                </p>
                            </div>

                            {/* Action Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="w-full bg-[#8B6F47] hover:bg-[#6d5638] text-white font-semibold py-4 rounded-full transition-colors"
                            >
                                View Order History
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
