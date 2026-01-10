"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types/menu";
import { CreateOrderRequest } from "@/types/orders";
import { User } from "@supabase/supabase-js";

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    total: number;
    itemCount: number;
    onUpdateQuantity: (index: number, quantity: number) => void;
    onRemoveItem: (index: number) => void;
    onAddRecommendedItem: (itemId: string) => void;
    cartType: 'menu' | 'gallery';
    currentUser: User | null;
    onOrderComplete: (orderNumber: string) => void;
    onClearCart: () => void;
    onShowAuth?: () => void;
    onGalleryBookingComplete?: (bookingNumber: string, artPieceName: string, artist: string, price: number) => void;
}

type OrderType = "dine-in" | "takeaway-now" | "takeaway-scheduled";

export function Cart({
    isOpen,
    onClose,
    items,
    total,
    itemCount,
    onUpdateQuantity,
    onRemoveItem,
    onAddRecommendedItem,
    cartType,
    currentUser,
    onOrderComplete,
    onClearCart,
    onShowAuth,
    onGalleryBookingComplete,
}: CartProps) {
    const router = useRouter();
    const [orderType, setOrderType] = useState<OrderType>("takeaway-scheduled");
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

    // Filter items based on cart type
    const filteredItems = cartType === 'gallery'
        ? items.filter(item => String(item.menuItem.id).startsWith('gallery-'))
        : items.filter(item => !String(item.menuItem.id).startsWith('gallery-'));

    // Calculate filtered total
    const filteredTotal = filteredItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Check if cart contains any gallery items
    const hasGalleryItems = cartType === 'gallery';
    const hasMenuItems = cartType === 'menu';

    // Get gallery items not in cart
    const cartArtIds = filteredItems.map(item => {
        const match = String(item.menuItem.id).match(/gallery-(.+)/);
        return match ? match[1] : null;
    }).filter(id => id !== null);

    // Placeholder for recommendations
    const recommendedArtworks: any[] = []; 
    const cartMenuIds = filteredItems.map(item => String(item.menuItem.id)).filter(id => !id.startsWith('gallery-'));
    const recommendedMenuItems: any[] = []; 

    const handleConfirmBooking = async () => {
        if (!currentUser) {
            if (onShowAuth) {
                onClose();
                onShowAuth();
            } else {
                alert('Please login to book artwork');
            }
            return;
        }

        if (filteredItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setIsProcessingOrder(true);

        try {
            // Collect ALL art IDs from the cart
            const artPieceIds = filteredItems.map(item => String(item.menuItem.id).replace('gallery-', ''));

            const response = await fetch('/api/gallery/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ artPieceIds }) // Send array
            });

            const data = await response.json();

            if (data.success && onGalleryBookingComplete) {
                onClearCart();
                onClose();
                // Pass summary or first item for legacy callback, but user wants correct confirmation
                const firstPurchase = data.purchases[0];
                onGalleryBookingComplete(
                    data.bookingNumber,
                    data.count > 1 ? `${data.count} Artworks` : firstPurchase.artPieceName,
                    data.count > 1 ? 'Various Artists' : firstPurchase.artist,
                    data.purchases.reduce((acc: any, p: any) => acc + p.price, 0)
                );
            } else {
                alert(data.error || 'Failed to create booking. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Failed to create booking. Please check your connection and try again.');
        } finally {
            setIsProcessingOrder(false);
        }
    };

    const handlePayNow = async () => {
        if (!currentUser) {
            if (onShowAuth) {
                onClose();
                onShowAuth();
            } else {
                alert('Please login to place an order');
            }
            return;
        }

        if (filteredItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setIsProcessingOrder(true);

        try {
            const orderPayload: CreateOrderRequest = {
                orderType,
                scheduledTime: orderType === 'takeaway-scheduled'
                     ? document.querySelector<HTMLSelectElement>('select')?.value
                     : undefined,
                items: filteredItems.map(item => ({
                     menuItemId: item.menuItem.id,
                     menuItemName: item.menuItem.name,
                     menuItemImage: item.menuItem.image,
                     variationName: item.selectedVariation?.name,
                     unitPrice: item.selectedVariation?.price || item.menuItem.price,
                     quantity: item.quantity,
                     subtotal: item.subtotal
                })),
                subtotal: filteredTotal,
                tax: 0,
                total: filteredTotal,
                notes: ''
            };

            const orderRes = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });
            const data = await orderRes.json();

            if (!data.success) throw new Error(data.error || 'Failed to create order');

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

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "Rabuste Coffee",
                description: `Order #${data.orderNumber}`,
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
                                order_id: data.dbOrderId
                            })
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            // Generate Bill
                            const { generateBillPDF } = await import('@/utils/billGenerator');
                            generateBillPDF({
                                orderId: response.razorpay_payment_id,
                                date: new Date().toLocaleDateString(),
                                customerName: currentUser.email || 'Customer',
                                items: filteredItems.map(i => ({
                                    name: i.menuItem.name,
                                    quantity: i.quantity,
                                    price: i.selectedVariation?.price || i.menuItem.price,
                                    subtotal: i.subtotal
                                })),
                                subtotal: filteredTotal,
                                total: filteredTotal,
                                paymentMethod: 'Razorpay Online'
                            });

                            setIsPaymentSuccess(true);
                            onClearCart();
                            onOrderComplete(response.razorpay_payment_id);
                        } else {
                            alert('Payment Verification Failed');
                        }
                    } catch (err) {
                        console.error('Payment Success Handler Error:', err);
                        alert('Payment processed but verification failed.');
                    }
                },
                prefill: {
                    name: currentUser.user_metadata?.full_name || currentUser.email,
                    email: currentUser.email,
                    contact: currentUser.phone || ''
                },
                theme: {
                    color: "#4A3B28"
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
            console.error('Payment Error:', error);
            alert('Payment initialization failed. Please try again.');
            setIsProcessingOrder(false);
        }
    };

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
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full lg:w-[480px] shadow-2xl z-50 flex flex-col"
                        style={{ backgroundColor: "#D8CBB8" }}
                    >
                        {isPaymentSuccess ? (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#F9F5F1]">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="font-display text-3xl font-bold text-[#262626] mb-2">
                                    Order Placed!
                                </h2>
                                <p className="font-sans text-stone-600 mb-8 max-w-xs mx-auto">
                                    Your order has been confirmed. A receipt has been downloaded to your device.
                                </p>
                                
                                <div className="w-full space-y-3">
                                    <button
                                        onClick={() => {
                                            onClose();
                                            router.push('/profile');
                                        }}
                                        className="w-full bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95"
                                    >
                                        View Order Details
                                    </button>
                                    
                                    <button
                                        onClick={onClose}
                                        className="w-full bg-white border border-[#e7e5e4] text-[#78716c] font-sans font-semibold py-4 rounded-xl hover:bg-stone-50 transition-colors"
                                    >
                                        Back to Menu
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="px-6 py-5 flex items-center justify-between border-b-[0.5px] border-[#8B6F47]" style={{ backgroundColor: "#D8CBB8" }}>
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className="w-6 h-6 text-[#8B6F47]" />
                                        <div>
                                            <h2 className="font-display text-2xl font-bold text-[#262626]">
                                                Your Cart
                                            </h2>
                                            <p className="font-sans text-sm text-[#8B6F47]">
                                                {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 border-[0.5px] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">
                                    {filteredItems.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <ShoppingBag className="w-16 h-16 text-[#78716c] mb-4" />
                                            <p className="font-serif text-xl text-[#404040] mb-2">
                                                Your cart is empty
                                            </p>
                                            <p className="font-sans text-sm text-[#78716c]">
                                                Add some delicious items to get started!
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-4 mb-6">
                                                {filteredItems.map((cartItem, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        className="bg-white p-3 border-[0.5px] border-[#8B6F47] shadow-sm"
                                                    >
                                                        <div className="flex gap-3 items-center">
                                                            <div className="relative w-16 h-16 overflow-hidden flex-shrink-0 bg-gray-100">
                                                                <img
                                                                    src={cartItem.menuItem.image}
                                                                    alt={cartItem.menuItem.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-serif text-sm text-[#404040] mb-1 line-clamp-1">
                                                                    {cartItem.menuItem.name}
                                                                </h3>

                                                                {cartItem.selectedVariation && (
                                                                    <div className="mb-1">
                                                                        <span className="font-sans text-xs text-[#8B6F47] bg-[#D8CBB8]/50 px-2 py-0.5 border-[0.5px] border-[#8B6F47]">
                                                                            {cartItem.selectedVariation.name}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-sans text-base font-bold text-green-700">
                                                                        ₹{cartItem.subtotal}
                                                                    </span>

                                                                    <div className="flex items-center gap-2">
                                                                        {/* Quantity Controls - Only for Menu items */}
                                                                        {!hasGalleryItems ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        if (cartItem.quantity === 1) {
                                                                                            onRemoveItem(index);
                                                                                        } else {
                                                                                            onUpdateQuantity(index, cartItem.quantity - 1);
                                                                                        }
                                                                                    }}
                                                                                    className="w-6 h-6 border-[0.5px] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white flex items-center justify-center transition-colors"
                                                                                >
                                                                                    <Minus className="w-3 h-3 text-[#404040]" />
                                                                                </button>
                                                                                <span className="font-sans text-sm font-semibold text-[#404040] min-w-[20px] text-center">
                                                                                    {cartItem.quantity}
                                                                                </span>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        onUpdateQuantity(index, cartItem.quantity + 1)
                                                                                    }
                                                                                    className="w-6 h-6 border-[0.5px] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white flex items-center justify-center transition-colors"
                                                                                >
                                                                                    <Plus className="w-3 h-3 text-[#404040]" />
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            // Gallery Items: Show simple Remove button and Qty 1
                                                                            <>
                                                                                 <span className="font-sans text-sm text-[#404040] mr-2">Qty: 1</span>
                                                                                 <button
                                                                                    onClick={() => onRemoveItem(index)}
                                                                                    className="text-xs text-red-500 hover:text-red-700 underline"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {recommendedArtworks.length > 0 && (
                                                <div className="mb-6">
                                                    <h3 className="font-display text-lg font-bold text-[#404040] mb-3">
                                                        You Might Also Like
                                                    </h3>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {recommendedArtworks.map((art) => (
                                                            <div
                                                                key={art.id}
                                                                className="bg-white p-2 border-[0.5px] border-[#8B6F47]"
                                                            >
                                                                <div className="relative w-full aspect-square overflow-hidden mb-1 bg-gray-100">
                                                                    <img
                                                                        src={`/gallery/${art.id}.jpg`}
                                                                        alt={art.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <p className="font-sans text-xs text-[#404040] line-clamp-1">
                                                                    {art.name}
                                                                </p>
                                                                <p className="font-sans text-xs font-bold text-green-700">
                                                                    ₹{art.price.toLocaleString('en-IN')}
                                                                </p>
                                                                <button
                                                                    onClick={() => onAddRecommendedItem(`gallery-${art.id}`)}
                                                                    className="w-full mt-2 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans text-[10px] sm:text-xs px-2 py-1.5 transition-colors"
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {hasMenuItems && !hasGalleryItems && recommendedMenuItems.length > 0 && (
                                                <div className="mb-6">
                                                    <h3 className="font-display text-lg font-bold text-[#404040] mb-3">
                                                        You Might Also Like
                                                    </h3>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {recommendedMenuItems.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className="bg-white p-2 border-[0.5px] border-[#8B6F47]"
                                                            >
                                                                <div className="relative w-full aspect-square overflow-hidden mb-1 bg-gray-100">
                                                                    <img
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <p className="font-sans text-xs text-[#404040] line-clamp-1">
                                                                    {item.name}
                                                                </p>
                                                                <p className="font-sans text-xs font-bold text-green-700">
                                                                    ₹{item.price.toLocaleString('en-IN')}
                                                                </p>
                                                                <button
                                                                    onClick={() => onAddRecommendedItem(String(item.id))}
                                                                    className="w-full mt-2 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans text-[10px] sm:text-xs px-2 py-1.5 transition-colors"
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {hasMenuItems && !hasGalleryItems && (
                                                <div className="mb-6">
                                                    <label className="block font-sans text-sm font-semibold text-[#404040] mb-3">
                                                        How would you like to order?
                                                    </label>
                                                    <div className="space-y-3">
                                                        <label className={`flex items-start gap-3 p-4 border-[0.5px] cursor-pointer transition-colors ${orderType === "takeaway-scheduled"
                                                            ? "border-[#8B6F47] bg-white"
                                                            : "border-black bg-[#8B6F47]/5 hover:border-[#8B6F47]/50"
                                                            }`}>
                                                            <input
                                                                type="radio"
                                                                name="orderType"
                                                                checked={orderType === "takeaway-scheduled"}
                                                                onChange={() => setOrderType("takeaway-scheduled")}
                                                                className="mt-1"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-lg">🕐</span>
                                                                    <span className="font-sans text-sm font-semibold text-[#404040]">
                                                                        Takeaway - Schedule Pickup (Recommended)
                                                                    </span>
                                                                </div>
                                                                <p className="font-sans text-xs text-[#78716c] mb-2">
                                                                    I'll collect my order after some time
                                                                </p>
                                                                {orderType === "takeaway-scheduled" && (
                                                                    <select className="w-full p-2 border-[0.5px] border-[#8B6F47] font-sans text-sm bg-white text-black">
                                                                        <option>In 15 minutes</option>
                                                                        <option>In 30 minutes</option>
                                                                        <option>In 1 hour</option>
                                                                        <option>In 1.5 hours</option>
                                                                        <option>In 2 hours</option>
                                                                    </select>
                                                                )}
                                                            </div>
                                                        </label>

                                                        <label className={`flex items-start gap-3 p-4 border-[0.5px] cursor-pointer transition-colors ${orderType === "takeaway-now"
                                                            ? "border-[#8B6F47] bg-white"
                                                            : "border-black bg-[#8B6F47]/5 hover:border-[#8B6F47]/50"
                                                            }`}>
                                                            <input
                                                                type="radio"
                                                                name="orderType"
                                                                checked={orderType === "takeaway-now"}
                                                                onChange={() => setOrderType("takeaway-now")}
                                                                className="mt-1"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-lg">🚗</span>
                                                                    <span className="font-sans text-sm font-semibold text-[#404040]">
                                                                        Takeaway - Ready Now
                                                                    </span>
                                                                </div>
                                                                <p className="font-sans text-xs text-[#78716c]">
                                                                    I'm outside or nearby, prepare my order now
                                                                </p>
                                                            </div>
                                                        </label>

                                                        <label className={`flex items-start gap-3 p-4 border-[0.5px] cursor-pointer transition-colors ${orderType === "dine-in"
                                                            ? "border-[#8B6F47] bg-white"
                                                            : "border-black bg-[#8B6F47]/5 hover:border-[#8B6F47]/50"
                                                            }`}>
                                                            <input
                                                                type="radio"
                                                                name="orderType"
                                                                checked={orderType === "dine-in"}
                                                                onChange={() => setOrderType("dine-in")}
                                                                className="mt-1"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-lg">🏠</span>
                                                                    <span className="font-sans text-sm font-semibold text-[#404040]">
                                                                        Dine-In (Earn Points!)
                                                                    </span>
                                                                </div>
                                                                <p className="font-sans text-xs text-[#78716c]">
                                                                    Order from your table and earn reward points
                                                                </p>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {filteredItems.length > 0 && (
                                    <div className="border-t-[0.5px] border-[#8B6F47] px-6 py-5" style={{ backgroundColor: "#D8CBB8" }}>
                                        {hasMenuItems && (
                                            <>
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="font-serif text-xl text-[#404040]">Total</span>
                                                    <span className="font-serif text-2xl font-bold text-green-700">
                                                        ₹{filteredTotal}
                                                    </span>
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handlePayNow}
                                                    disabled={isProcessingOrder}
                                                    className="w-full mb-3 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold px-6 py-4 transition-colors shadow-lg border-[0.5px] border-[#8B6F47] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {isProcessingOrder ? (
                                                        <>
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        'Pay Now'
                                                    )}
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full bg-white hover:bg-gray-50 text-[#8B6F47] font-sans font-semibold px-6 py-4 transition-colors shadow-lg border-[0.5px] border-[#8B6F47] flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download Bill
                                                </motion.button>
                                            </>
                                        )}

                                        {hasGalleryItems && (
                                            <>
                                                <div className="mb-4 p-4 bg-white border-[0.5px] border-[#8B6F47]">
                                                    <p className="font-sans text-sm text-[#404040] mb-2">
                                                        <strong>Payment Method:</strong> Cash at Café
                                                    </p>
                                                    <p className="font-sans text-xs text-[#78716c]">
                                                        Visit Rabuste Coffee, show your booking number, pay in cash, and collect your artwork.
                                                    </p>
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleConfirmBooking}
                                                    className="w-full bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold px-6 py-4 transition-colors shadow-lg border-[0.5px] border-[#8B6F47]"
                                                >
                                                    Confirm Booking
                                                </motion.button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
