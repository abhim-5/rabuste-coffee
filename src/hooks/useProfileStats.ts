import { useState, useEffect } from 'react';

interface ProfileStats {
  ordersCount: number;
  workshopsCount: number;
  artPurchasedCount: number;
  totalSpent: number;
  credits: number;
  memberDays: number;
}

export function useProfileStats() {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await fetch('/api/profile/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
        } else {
          setError(data.error || 'Failed to load stats');
        }
      } catch (err) {
        setError('Failed to load statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}
