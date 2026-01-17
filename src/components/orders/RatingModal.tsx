import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { OrderItem } from "@/types/orders";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  orderItems: OrderItem[];
  onSubmitSuccess?: () => void;
}

interface ItemRating {
  order_item_id: string;
  menu_item_id: string;
  menu_item_name: string;
  rating: number;
}

export function RatingModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  orderItems,
  onSubmitSuccess,
}: RatingModalProps) {
  const [ratings, setRatings] = useState<ItemRating[]>(
    orderItems.map((item) => ({
      order_item_id: item.id,
      menu_item_id: String(item.menu_item_id),
      menu_item_name: item.menu_item_name,
      rating: 0,
    }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = (itemId: string, newRating: number) => {
    setRatings((prev) =>
      prev.map((r) =>
        r.order_item_id === itemId ? { ...r, rating: newRating } : r
      )
    );
  };


  const handleSubmit = async () => {
    try {
      setError(null);
      
      // Validate all items are rated
      const unratedItems = ratings.filter((r) => r.rating === 0);
      if (unratedItems.length > 0) {
        setError("Please rate all items before submitting.");
        return;
      }

      setSubmitting(true);

      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          ratings: ratings,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit ratings");
      }

      // Success!
      onSubmitSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit ratings. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#D8CBB8] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#8B6F47] text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold">
                    Rate Your Order
                  </h2>
                  <p className="text-sm text-white/80">Order {orderNumber}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <p className="text-[#262626] mb-6 font-sans">
                  How was your experience with each item? Your feedback helps us
                  improve!
                </p>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Rating Items */}
                <div className="space-y-6">
                  {orderItems.map((item, index) => {
                    const itemRating = ratings.find(
                      (r) => r.order_item_id === item.id
                    );
                    const currentRating = itemRating?.rating || 0;

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg p-4 border border-[#8B6F47]/20"
                      >
                        <div className="flex items-start gap-4 mb-3">
                          {/* Item Image */}
                          {item.menu_item_image && (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <img
                                src={item.menu_item_image}
                                alt={item.menu_item_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Item Info */}
                          <div className="flex-1">
                            <h3 className="font-display font-semibold text-[#262626]">
                              {item.menu_item_name}
                            </h3>
                            {item.variation_name && (
                              <p className="text-xs text-[#262626]/60">
                                {item.variation_name}
                              </p>
                            )}
                            <p className="text-xs text-[#262626]/60 mt-1">
                              Qty: {item.quantity} × ₹{item.unit_price}
                            </p>
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-sans text-[#262626]/70">
                            Rating:
                          </span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() =>
                                  handleRatingChange(item.id, star)
                                }
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= currentRating
                                      ? "fill-[#8B6F47] text-[#8B6F47]"
                                      : "text-[#8B6F47]/30"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          {currentRating > 0 && (
                            <span className="text-sm font-semibold text-[#8B6F47]">
                              {currentRating} / 5
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-white px-6 py-4 border-t border-[#8B6F47]/20 flex gap-3 justify-end">
                <button
                  onClick={handleSkip}
                  disabled={submitting}
                  className="px-6 py-2 text-[#8B6F47] font-sans font-semibold hover:bg-[#8B6F47]/5 rounded-lg transition-colors disabled:opacity-50"
                >
                  Skip for Now
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || ratings.some((r) => r.rating === 0)}
                  className="px-6 py-2 bg-[#8B6F47] text-white font-sans font-semibold rounded-lg hover:bg-[#6B5537] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Ratings"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
