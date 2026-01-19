"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, User, GraduationCap, ChevronRight, MessageSquare, Star, Trash2 } from "lucide-react";
import { Workshop } from "@/types/menu";
import { WorkshopReviewModal } from "@/components/workshops/WorkshopReviewModal";

interface WorkshopsSectionProps {
    workshops: Workshop[];
    totalSpent: number;
    isDesktop?: boolean;
}

export function WorkshopsSection({ workshops, totalSpent, isDesktop = false }: WorkshopsSectionProps) {
    const [showAll, setShowAll] = useState(false);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

    const canReview = (workshop: Workshop) => {
        if (workshop.status !== 'confirmed') return false;
        const workshopDate = new Date(workshop.date);
        return workshopDate < new Date();
    };

    const hasReviewed = (workshop: Workshop) => {
        // Check if reviews array includes current user's review
        // This will be populated by the useProfileWorkshops hook
        return (workshop as any).hasReviewed || false;
    };

    const handleReviewClick = (workshop: Workshop) => {
        setSelectedWorkshop(workshop);
        setReviewModalOpen(true);
    };

    const handleReviewSuccess = () => {
        window.location.reload(); // Reload to show updated review
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete your review?')) return;

        try {
            const response = await fetch(`/api/workshops/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete review');
            }

            window.location.reload();
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review');
        }
    };

    const handleRetryPayment = async (workshop: Workshop) => {
        try {
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
                alert('Failed to load payment gateway');
                return;
            }

            // Create NEW order for retry payment
            const orderRes = await fetch('/api/workshops/retry-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    registration_id: workshop.id
                })
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || 'Failed to create payment order');
            }

            // Open Razorpay with fresh order
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Rabuste Coffee Workshops",
                description: `Workshop: ${workshop.title}`,
                order_id: orderData.razorpayOrderId,
                handler: async function (razorpayResponse: any) {
                    try {
                        const verifyRes = await fetch('/api/workshops/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: razorpayResponse.razorpay_order_id,
                                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                                razorpay_signature: razorpayResponse.razorpay_signature,
                                registration_id: workshop.id
                            })
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            alert('Payment successful! Your workshop is confirmed.');
                            window.location.reload();
                        } else {
                            alert('Payment verification failed');
                        }
                    } catch (err) {
                        console.error('Payment verification error:', err);
                        alert('Payment processed but verification failed. Please contact support.');
                    }
                },
                theme: {
                    color: "#8B6F47"
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error('Retry payment error:', error);
            alert((error as any).message || 'Failed to initiate payment. Please try again.');
        }
    };

    if (workshops.length === 0 && !isDesktop) return null;

    const displayedWorkshops = showAll ? workshops : workshops.slice(0, isDesktop ? 4 : 2);

    // Desktop version
    if (isDesktop) {
        return (
            <div className="space-y-4">
                {workshops.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            {displayedWorkshops.map((workshop, index) => (
                                <motion.div
                                    key={workshop.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[#F5F0EB] rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                                >
                                    <div className="flex gap-4 p-4">
                                        <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden">
                                            <Image
                                                src={workshop.image && workshop.image.startsWith('http') ? workshop.image : '/workshops/1.jpg'}
                                                alt={workshop.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="96px"
                                                unoptimized
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/workshops/1.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-sans text-base font-semibold text-[#262626] mb-1 line-clamp-1">
                                                    {workshop.title}
                                                </h3>
                                                <p className="font-sans text-sm text-[#78716c] mb-2">
                                                    Host: {workshop.host}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        (workshop as any).payment_status === 'paid' 
                                                        ? "bg-green-100 text-green-700" 
                                                        : (workshop as any).payment_status === 'failed'
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                        {(workshop as any).payment_status === 'paid' ? "Paid & Confirmed" : 
                                                         (workshop as any).payment_status === 'failed' ? "Payment Failed" : 
                                                         "Payment Pending"}
                                                    </span>
                                                    <span className="font-display text-lg font-bold text-[#8B6F47]">
                                                        ₹{workshop.price || 500}
                                                    </span>
                                                </div>
                                                
                                                {/* Retry Payment Button */}
                                                {((workshop as any).payment_status === 'pending' || (workshop as any).payment_status === 'failed') && (
                                                    <button
                                                        onClick={() => handleRetryPayment(workshop)}
                                                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        Retry Payment
                                                    </button>
                                                )}
                                                
                                                {/* Review Button */}
                                                {canReview(workshop) && !hasReviewed(workshop) && (workshop as any).payment_status === 'paid' && (
                                                    <button
                                                        onClick={() => handleReviewClick(workshop)}
                                                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#8B6F47] hover:bg-[#6d5638] text-white text-xs font-semibold rounded-lg transition-colors"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                        Write Review
                                                    </button>
                                                )}
                                                {hasReviewed(workshop) && (
                                                    <div className="bg-white/50 p-3 rounded-lg border border-[#8B6F47]/10">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-[10px] uppercase tracking-wider font-bold text-[#8B6F47]">Your Review</span>
                                                            <button
                                                                onClick={() => handleDeleteReview((workshop as any).reviewId)}
                                                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                                title="Delete Review"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                        <p className="text-xs text-[#404040] italic line-clamp-2 mt-1">
                                                            {(workshop as any).reviewText}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {workshops.length > 4 && !showAll && (
                            <button
                                onClick={() => setShowAll(true)}
                                className="w-full flex items-center justify-center gap-2 py-3 text-[#8B6F47] hover:text-[#6d5638] font-sans font-semibold text-sm transition-colors"
                            >
                                View all {workshops.length} workshops
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}

                        {showAll && workshops.length > 4 && (
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
                        <GraduationCap className="w-16 h-16 text-[#d6d3d1] mx-auto mb-4" />
                        <p className="font-display text-xl text-[#404040] mb-2">No workshops yet</p>
                        <p className="font-sans text-sm text-[#78716c]">
                            Check out our upcoming workshops!
                        </p>
                    </div>
                )}
                
                {/* Review Modal for Desktop */}
                {selectedWorkshop && (
                    <WorkshopReviewModal
                        isOpen={reviewModalOpen}
                        onClose={() => setReviewModalOpen(false)}
                        workshopId={(selectedWorkshop as any).workshopId}
                        workshopTitle={selectedWorkshop.title}
                        onSuccess={handleReviewSuccess}
                    />
                )}
            </div>
        );
    }

    return (
        <section className="w-full py-8 lg:py-10" style={{ backgroundColor: "#D8CBB8" }}>
            <div className="mx-auto w-full px-4 lg:px-6 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center mb-8"
                >
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#404040] mb-3 text-center">
                        My Workshops
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
                        {workshops.length} workshops • <span className="font-semibold text-[#8B6F47]">₹{totalSpent.toLocaleString()} spent</span>
                    </p>
                </motion.div>

                <div className="relative">
                    <div className="space-y-3">
                        {displayedWorkshops.map((workshop, index) => {
                            const isSecondItem = index === 1 && !showAll && workshops.length > 2;

                            return (
                                <motion.div
                                    key={workshop.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isSecondItem ? 'relative border-0' : 'border border-[#8B6F47]/10'}`}
                                >
                                    {/* Gradient overlay for second item */}
                                    {isSecondItem && (
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-[#D8CBB8] z-10 pointer-events-none" />
                                    )}

                                    <div className="flex items-center gap-4 p-4">
                                        <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden">
                                            <img
                                                src={workshop.image}
                                                alt={workshop.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-sans text-sm font-semibold text-[#262626] mb-1 line-clamp-1">
                                                {workshop.title}
                                            </h3>
                                            <p className="font-sans text-xs text-[#78716c] mb-2">
                                                Host: {workshop.host}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    workshop.status === 'confirmed' 
                                                    ? "bg-green-100 text-green-700" 
                                                    : workshop.status === 'pending'
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}>
                                                    {workshop.status === 'confirmed' ? "Confirmed" : 
                                                     workshop.status === 'pending' ? "Pending" : 
                                                     workshop.status || 'Pending'}
                                                </span>
                                                <span className="text-xs text-[#a8a29e]">•</span>
                                                <span className="font-sans text-xs text-[#78716c]">
                                                    {new Date(workshop.date).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 text-right">
                                            <span className="font-sans text-sm font-bold text-[#8B6F47]">
                                                ₹{workshop.price || 500}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Mobile: Retry Payment & Review Buttons */}
                                    <div className="px-4 pb-3 space-y-2">
                                        {((workshop as any).payment_status === 'pending' || (workshop as any).payment_status === 'failed') && (
                                            <button
                                                onClick={() => handleRetryPayment(workshop)}
                                                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Retry Payment
                                            </button>
                                        )}
                                        
                                        {canReview(workshop) && !hasReviewed(workshop) && (workshop as any).payment_status === 'paid' && (
                                            <button
                                                onClick={() => handleReviewClick(workshop)}
                                                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#8B6F47] hover:bg-[#6d5638] text-white text-xs font-semibold rounded-lg transition-colors"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                Write Review
                                            </button>
                                        )}
                                        {hasReviewed(workshop) && (
                                            <div className="mt-2 text-left bg-[#F5F0EB] p-3 rounded-lg border border-[#8B6F47]/10">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#8B6F47]">Your Review</span>
                                                    <button
                                                        onClick={() => handleDeleteReview((workshop as any).reviewId)}
                                                        className="text-red-500 hover:text-red-700 transition-colors bg-white p-1 rounded-full shadow-sm"
                                                        title="Delete Review"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-[#404040] font-serif italic">
                                                    {(workshop as any).reviewText}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* View More Button */}
                    {workshops.length > 2 && !showAll && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setShowAll(true)}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/60 hover:bg-white/80 text-[#8B6F47] font-sans text-sm font-medium rounded-full transition-colors"
                        >
                            View all {workshops.length} workshops
                            <ChevronRight className="w-3 h-3" />
                        </motion.button>
                    )}

                    {showAll && workshops.length > 2 && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setShowAll(false)}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/60 hover:bg-white/80 text-[#78716c] font-sans text-sm font-medium rounded-full transition-colors"
                        >
                            Show less
                        </motion.button>
                    )}
                </div>
            </div>
            
            {/* Review Modal */}
            {selectedWorkshop && (
                <WorkshopReviewModal
                    isOpen={reviewModalOpen}
                    onClose={() => setReviewModalOpen(false)}
                    workshopId={(selectedWorkshop as any).workshopId}
                    workshopTitle={selectedWorkshop.title}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </section>
    );
}
