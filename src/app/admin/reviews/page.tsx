'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { MessageSquare, Trash2, Star, Calendar, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function WorkshopReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews/workshops', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch('/api/admin/reviews/workshops', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId }),
      });

      if (!response.ok) throw new Error('Failed to delete');

      setReviews(prev => prev.filter(r => r.id !== reviewId));
      alert('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'User',
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
            {row.profiles?.avatar_url ? (
              <Image 
                src={row.profiles.avatar_url} 
                alt={row.profiles.full_name || 'User'} 
                fill 
                className="object-cover"
              />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-amber-100 text-amber-700 font-bold text-xs">
                    {(row.profiles?.full_name || 'U').charAt(0).toUpperCase()}
                </div>
            )}
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">{row.profiles?.full_name || 'Anonymous'}</p>
            <p className="text-xs text-gray-500">{row.profiles?.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'workshop',
      label: 'Workshop',
      sortable: true,
      render: (row: any) => (
        <div>
          <p className="font-medium text-sm text-gray-900 line-clamp-1">{row.workshops?.title}</p>
        </div>
      )
    },

    {
      key: 'review',
      label: 'Review',
      render: (row: any) => (
        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs" title={row.review_text}>
          {row.review_text}
        </p>
      )
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-500">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
          title="Delete Review"
        >
          <Trash2 size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workshop Reviews</h1>
          <p className="text-gray-600">Manage reviews from workshop participants</p>
        </div>
      </div>

      <DataTable
        data={reviews}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Search reviews..."
      />
    </div>
  );
}
