"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

interface WorkshopReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshopId: string;
  workshopTitle: string;
  onSuccess: () => void;
}

export function WorkshopReviewModal({
  isOpen,
  onClose,
  workshopId,
  workshopTitle,
  onSuccess,
}: WorkshopReviewModalProps) {
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewText.trim()) {
      setError("Please write a review before submitting");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/workshops/${workshopId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_text: reviewText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setReviewText("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-bold text-[#262626]">
                  Write a Review
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="font-sans text-sm text-gray-600 mb-4">
                Share your experience with <strong>{workshopTitle}</strong>
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you think of this workshop? Share your thoughts..."
                  className="w-full h-40 px-4 py-3 border border-gray-300 rounded-xl font-sans text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:border-transparent"
                  disabled={isSubmitting}
                />

                {error && (
                  <p className="mt-2 text-sm text-red-600 font-sans">{error}</p>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans font-semibold rounded-xl transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !reviewText.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
