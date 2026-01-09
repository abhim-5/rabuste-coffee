import { useState, useEffect } from 'react';

export interface Workshop {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  start_date: string;
  start_time: string;
  duration?: string;
  price: number;
  max_spots?: number;
  available_spots?: number;
  image_url?: string;
  instructor?: string;
  level?: string;
  includes?: string[];
  available: boolean;
  is_upcoming: boolean;
  reviews?: Review[];
  attendees?: number;
  created_at?: string;
}

export interface Review {
  name: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}

export function useWorkshops() {
  const [upcomingWorkshops, setUpcomingWorkshops] = useState<Workshop[]>([]);
  const [previousWorkshops, setPreviousWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/workshops');
      
      if (!response.ok) {
        throw new Error('Failed to fetch workshops');
      }

      const data = await response.json();
      
      if (data.workshops) {
        // Split into upcoming and previous
        const upcoming = data.workshops.filter((w: Workshop) => w.is_upcoming);
        const previous = data.workshops.filter((w: Workshop) => !w.is_upcoming);

        setUpcomingWorkshops(upcoming);
        setPreviousWorkshops(previous);
      }
    } catch (err) {
      console.error('Error fetching workshops:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workshops');
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    fetchWorkshops();
  };

  return {
    upcomingWorkshops,
    previousWorkshops,
    loading,
    error,
    retry,
  };
}
