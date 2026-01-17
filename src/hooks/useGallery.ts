"use client";

import { useState, useEffect, useCallback } from 'react';

export interface GalleryItem {
  id: string; // UUID from database
  name: string;
  description: string;
  price: number; // numeric in DB
  artist: string;
  artist_pov: string; // artist_pov in DB
  image_url: string;
  available: boolean;
  sort_order: number;
}

interface GalleryResponse {
  success: boolean;
  items: GalleryItem[];
  count: number;
}

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/gallery/items');
      
      if (!response.ok) {
        throw new Error('Failed to fetch gallery items');
      }

      const data: GalleryResponse = await response.json();
      
      if (data.success) {
        setItems(data.items);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    refresh: fetchItems
  };
}
