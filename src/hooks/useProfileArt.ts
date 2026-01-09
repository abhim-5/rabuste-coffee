import { useState, useEffect } from 'react';

interface ArtPiece {
  id: string;
  name: string;
  artist: string;
  purchaseDate: string;
  price: number;
  image: string;
  status: string;
}

export function useProfileArt() {
  const [artPieces, setArtPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArt() {
      try {
        setLoading(true);
        const response = await fetch('/api/profile/art');
        const data = await response.json();

        if (data.success) {
          setArtPieces(data.artPieces);
        } else {
          setError(data.error || 'Failed to load art collection');
        }
      } catch (err) {
        setError('Failed to load art purchases');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchArt();
  }, []);

  return { artPieces, loading, error };
}
