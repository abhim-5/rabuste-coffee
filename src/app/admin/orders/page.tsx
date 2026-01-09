// Orders Management Page
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import StatCard from '@/components/admin/StatCard';
import { ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Order {
    id: string;
    user_email: string;
    user_name: string;
    total: number;
    status: string;
    created_at: string;
    items_count: number;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const supabase = createClient();

            // Fetch orders with user info
            const { data: ordersData, error } = await supabase
                .from('orders')
                .select(`
          id,
          total,
          status,
          created_at,
          profiles:user_id (
            email,
            full_name
          ),
          order_items (
            id
          )
        `)
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;

            const formattedOrders = ordersData?.map((order: any) => ({
                id: order.id,
                user_email: order.profiles?.email || 'Unknown',
                user_name: order.profiles?.full_name || 'Unknown',
                total: order.total,
                status: order.status,
                created_at: order.created_at,
                items_count: order.order_items?.length || 0
            })) || [];

            setOrders(formattedOrders);

            // Calculate stats
            const pending = formattedOrders.filter((o: Order) => o.status === 'pending').length;
            const completed = formattedOrders.filter((o: Order) => o.status === 'completed').length;
            const cancelled = formattedOrders.filter((o: Order) => o.status === 'cancelled').length;
            const totalRevenue = formattedOrders
                .filter((o: Order) => o.status === 'completed')
                .reduce((sum: number, o: Order) => sum + Number(o.total), 0);

            setStats({
                total: formattedOrders.length,
                pending,
                completed,
                cancelled,
                revenue: totalRevenue
            });

        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            preparing: 'bg-blue-100 text-blue-800',
            ready: 'bg-green-100 text-green-800',
            completed: 'bg-green-200 text-green-900',
            cancelled: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    const columns = [
        {
            key: 'id',
            label: 'Order ID',
            sortable: true,
            render: (row: Order) => `#${row.id.slice(-8)}`
        },
        {
            key: 'user_name',
            label: 'Customer',
            sortable: true,
            render: (row: Order) => (
                <div>
                    <p className="font-medium">{row.user_name}</p>
                    <p className="text-xs text-gray-500">{row.user_email}</p>
                </div>
            )
        },
        {
            key: 'items_count',
            label: 'Items',
            sortable: true
        },
        {
            key: 'total',
            label: 'Total',
            sortable: true,
            render: (row: Order) => (
                <span className="font-semibold text-green-700">₹{row.total.toLocaleString()}</span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (row: Order) => getStatusBadge(row.status)
        },
        {
            key: 'created_at',
            label: 'Date',
            sortable: true,
            render: (row: Order) => new Date(row.created_at).toLocaleDateString()
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-gray-600 mt-1">View and manage all orders</p>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Orders"
                        value={stats.total}
                        icon={ShoppingBag}
                        loading={loading}
                    />
                    <StatCard
                        title="Pending"
                        value={stats.pending}
                        icon={Clock}
                        loading={loading}
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completed}
                        icon={CheckCircle}
                        loading={loading}
                    />
                    <StatCard
                        title="Revenue"
                        value={`₹${stats.revenue?.toLocaleString() || 0}`}
                        icon={ShoppingBag}
                        loading={loading}
                    />
                </div>
            )}

            <DataTable
                data={orders}
                columns={columns}
                loading={loading}
                searchable
                searchPlaceholder="Search orders by customer or ID..."
            />
        </div>
    );
}
