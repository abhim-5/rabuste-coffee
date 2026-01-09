import { useState, useEffect } from 'react';

interface Order {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
  order_items: any[];
}

export function useProfileOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const response = await fetch('/api/profile/orders');
        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.error || 'Failed to load orders');
        }
      } catch (err) {
        setError('Failed to load order history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return { orders, loading, error };
}
