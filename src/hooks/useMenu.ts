"use client";

import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '@/types/menu';

interface MenuResponse {
  success: boolean;
  items: MenuItem[];
  count: number;
}

interface CategoriesResponse {
  success: boolean;
  categories: Array<{
    id: string;
    name: string;
    itemCount: number;
  }>;
  count: number;
}

export function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Array<{id: string; name: string; itemCount: number}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all menu items
  const fetchMenuItems = useCallback(async (category?: string) => {
    try {
      setLoading(true);
      setError(null);

      const url = category 
        ? `/api/menu/items?category=${category}`
        : '/api/menu/items';

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }

      const data: MenuResponse = await response.json();
      
      if (data.success) {
        setMenuItems(data.items);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError(err instanceof Error ? err.message : 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch featured items
  const fetchFeaturedItems = useCallback(async () => {
    try {
      const response = await fetch('/api/menu/featured');
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured items');
      }

      const data: MenuResponse = await response.json();
      
      if (data.success) {
        setFeaturedItems(data.items);
      }
    } catch (err) {
      console.error('Error fetching featured items:', err);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/menu/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data: CategoriesResponse = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    Promise.all([
      fetchMenuItems(),
      fetchFeaturedItems(),
      fetchCategories()
    ]);
  }, [fetchMenuItems, fetchFeaturedItems, fetchCategories]);

  // Retry function
  const retry = useCallback(() => {
    fetchMenuItems();
    fetchFeaturedItems();
    fetchCategories();
  }, [fetchMenuItems, fetchFeaturedItems, fetchCategories]);

  return {
    menuItems,
    featuredItems,
    categories,
    loading,
    error,
    retry,
    refreshMenu: fetchMenuItems,
    refreshFeatured: fetchFeaturedItems,
  };
}
