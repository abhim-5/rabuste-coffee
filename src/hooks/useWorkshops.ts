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
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Start of today

        // Separate upcoming and past workshops based on current date
        const upcoming: Workshop[] = [];
        const previous: Workshop[] = [];

        data.workshops.forEach((workshop: Workshop) => {
          const workshopDate = new Date(workshop.start_date);
          workshopDate.setHours(0, 0, 0, 0);

          if (workshopDate >= now) {
            // Future or today = upcoming
            upcoming.push(workshop);
          } else {
            // Past date = previous
            previous.push(workshop);
          }
        });

        // Sort upcoming: soonest date first (chronological)
        upcoming.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

        // Sort previous: most recent past workshop first (reverse chronological)
        previous.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

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
