'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, Clock, CheckCircle, XCircle, Award } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Review {
    id: string;
    rating: number;
    review_text: string;
    status: 'pending' | 'approved' | 'rejected' | 'featured';
    created_at: string;
    admin_response?: string;
}

export function CafeReviewsSection() {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [myReviews, setMyReviews] = useState<Review[]>([]);
    const [submitMessage, setSubmitMessage] = useState('');
    const supabase = createClient();

    useEffect(() => {
        fetchMyReviews();
    }, []);

    const fetchMyReviews = async () => {
        try {
            const res = await fetch('/api/reviews');
            const data = await res.json();
            if (data.success) {
                setMyReviews(data.reviews);
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setSubmitMessage('❌ Please select a rating');
            setTimeout(() => setSubmitMessage(''), 3000);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, review_text: reviewText })
            });

            const data = await res.json();
            if (data.success) {
                setSubmitMessage('✅ Review submitted! Pending admin approval.');
                setRating(0);
                setReviewText('');
                fetchMyReviews();
            } else {
                setSubmitMessage('❌ ' + data.error);
            }
        } catch (error) {
            setSubmitMessage('❌ Failed to submit review');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(''), 5000);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
            approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
            featured: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Award }
        };
        const style = styles[status as keyof typeof styles] || styles.pending;
        const Icon = style.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                <Icon className="w-3.5 h-3.5" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Submit Review Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#e7e5e4]">
                <h3 className="text-xl font-bold text-[#292524] mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#8B6F47]" />
                    Rate Your Experience
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-medium text-[#78716c] mb-2">Your Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 ${(hoverRating || rating) >= star
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div>
                        <label className="block text-sm font-medium text-[#78716c] mb-2">Your Review (Optional)</label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Tell us about your experience at Rabuste..."
                            rows={4}
                            className="w-full px-4 py-3 border border-[#e7e5e4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:border-transparent resize-none text-black"
                        />
                    </div>

                    {/* Submit Message */}
                    {submitMessage && (
                        <div className={`p-3 rounded-lg text-sm ${submitMessage.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            {submitMessage}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8B6F47] hover:bg-[#6d5638] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all"
                    >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>

            {/* My Reviews */}
            {myReviews.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#e7e5e4]">
                    <h3 className="text-xl font-bold text-[#292524] mb-4">My Reviews</h3>
                    <div className="space-y-4">
                        {myReviews.map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border border-[#e7e5e4] rounded-xl p-4"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    {getStatusBadge(review.status)}
                                </div>
                                {review.review_text && (
                                    <p className="text-black text-sm mb-2">{review.review_text}</p>
                                )}
                                <p className="text-xs text-[#a8a29e]">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </p>
                                {review.admin_response && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs font-medium text-blue-900 mb-1">Admin Response:</p>
                                        <p className="text-sm text-blue-800">{review.admin_response}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
