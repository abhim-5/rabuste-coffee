import { useState, useEffect } from 'react';

interface Workshop {
  id: string;
  title: string;
  instructor: string;
  date: string;
  price: number;
  status: string;
  image: string;
}

export function useProfileWorkshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkshops() {
      try {
        setLoading(true);
        const response = await fetch('/api/profile/workshops');
        const data = await response.json();

        if (data.success) {
          setWorkshops(data.workshops);
        } else {
          setError(data.error || 'Failed to load workshops');
        }
      } catch (err) {
        setError('Failed to load workshop registrations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkshops();
  }, []);

  return { workshops, loading, error };
}
