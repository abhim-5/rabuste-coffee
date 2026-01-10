// Orders Management Page - ENHANCED WITH FULL ORDER DETAILS
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import StatCard from '@/components/admin/StatCard';
import { ShoppingBag, Clock, CheckCircle, XCircle, Package, CreditCard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface OrderItem {
    id: string;
    menu_item_name: string;
    menu_item_image: string;
    variation_name: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

interface Order {
    id: string;
    order_number: string;
    user_email: string;
    user_name: string;
    customer_name: string | null;
    customer_email: string | null;
    total: number;
    subtotal: number;
    tax: number;
    status: string;
    payment_status: string;
    order_type: string;
    scheduled_time: string | null;
    created_at: string;
    items: OrderItem[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const supabase = createClient();

            // Fetch orders with all details and items
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select(`
                  id,
                  order_number,
                  user_id,
                  customer_name,
                  customer_email,
                  total,
                  subtotal,
                  tax,
                  status,
                  payment_status,
                  order_type,
                  scheduled_time,
                  notes,
                  created_at,
                  order_items (
                    id,
                    menu_item_name,
                    menu_item_image,
                    variation_name,
                    quantity,
                    unit_price,
                    subtotal
                  )
                `)
                .order('created_at', { ascending: false })
                .limit(100);

            if (ordersError) {
                console.error('Orders fetch error:', ordersError);
                throw ordersError;
            }

            // Fetch profiles for user information
            const userIds = Array.from(new Set(ordersData?.map(o => o.user_id).filter(Boolean)));
            
            let profilesMap: Record<string, any> = {};
            
            if (userIds.length > 0) {
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, email, full_name')
                    .in('id', userIds);
                
                if (!profilesError && profilesData) {
                    profilesMap = profilesData.reduce((acc: any, profile: any) => {
                        acc[profile.id] = profile;
                        return acc;
                    }, {});
                }
            }

            const formattedOrders = ordersData?.map((order: any) => ({
                id: order.id,
                order_number: order.order_number || `#${order.id.slice(-8)}`,
                user_email: profilesMap[order.user_id]?.email || order.customer_email || 'Unknown',
                user_name: profilesMap[order.user_id]?.full_name || order.customer_name || 'Unknown Customer',
                customer_name: order.customer_name,
                customer_email: order.customer_email,
                total: Number(order.total) || 0,
                subtotal: Number(order.subtotal) || 0,
                tax: Number(order.tax) || 0,
                status: order.status || 'pending',
                payment_status: order.payment_status || 'pending',
                order_type: order.order_type || 'dine-in',
                scheduled_time: order.scheduled_time,
                created_at: order.created_at,
                items: order.order_items || []
            })) || [];

            setOrders(formattedOrders);

            // Calculate comprehensive stats
            const pending = formattedOrders.filter((o: Order) => o.status === 'pending').length;
            const preparing = formattedOrders.filter((o: Order) => o.status === 'preparing').length;
            const ready = formattedOrders.filter((o: Order) => o.status === 'ready').length;
            const completed = formattedOrders.filter((o: Order) => o.status === 'completed').length;
            const cancelled = formattedOrders.filter((o: Order) => o.status === 'cancelled').length;
            
            const paidOrders = formattedOrders.filter((o: Order) => o.payment_status === 'paid');
            const totalRevenue = paidOrders.reduce((sum: number, o: Order) => sum + Number(o.total), 0);
            
            const pendingPayment = formattedOrders.filter((o: Order) => o.payment_status === 'pending').length;

            setStats({
                total: formattedOrders.length,
                pending,
                preparing,
                ready,
                completed,
                cancelled,
                revenue: totalRevenue,
                paidOrders: paidOrders.length,
                pendingPayment
            });

        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/admin/update-order-status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    status: newStatus
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to update status');
            }

            // Update local state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );

            // Refetch to update stats
            fetchData();

        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status. Please try again.');
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            preparing: 'bg-blue-100 text-blue-800',
            ready: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    const getPaymentBadge = (paymentStatus: string) => {
        const colors: Record<string, string> = {
            paid: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[paymentStatus] || 'bg-gray-100 text-gray-800'}`}>
                {paymentStatus.toUpperCase()}
            </span>
        );
    };

    const columns = [
        {
            key: 'order_number',
            label: 'Order #',
            sortable: true,
            render: (row: Order) => (
                <span className="font-mono font-medium text-[#8B6F47]">{row.order_number}</span>
            )
        },
        {
            key: 'user_name',
            label: 'Customer',
            sortable: true,
            render: (row: Order) => (
                <div>
                    <p className="font-medium text-gray-900">{row.user_name}</p>
                    <p className="text-xs text-gray-500">{row.user_email}</p>
                </div>
            )
        },
        {
            key: 'items',
            label: 'Items',
            sortable: false,
            render: (row: Order) => (
                <div className="text-sm">
                    <p className="font-medium">{row.items.length} item{row.items.length !== 1 ? 's' : ''}</p>
                    <button
                        onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                        className="text-xs text-[#8B6F47] hover:underline"
                    >
                        {expandedRow === row.id ? 'Hide' : 'View'} details
                    </button>
                </div>
            )
        },
        {
            key: 'order_type',
            label: 'Type',
            sortable: true,
            render: (row: Order) => (
                <div className="text-sm">
                    <p className="font-medium capitalize">{row.order_type.replace('-', ' ')}</p>
                    {row.scheduled_time && (
                        <p className="text-xs text-gray-500">{row.scheduled_time}</p>
                    )}
                </div>
            )
        },
        {
            key: 'total',
            label: 'Total',
            sortable: true,
            render: (row: Order) => (
                <div className="text-sm">
                    <p className="font-bold text-green-700">₹{row.total.toLocaleString()}</p>
                    {row.tax > 0 && (
                        <p className="text-xs text-gray-500">Tax: ₹{row.tax.toFixed(2)}</p>
                    )}
                </div>
            )
        },
        {
            key: 'payment_status',
            label: 'Payment',
            sortable: true,
            render: (row: Order) => getPaymentBadge(row.payment_status)
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (row: Order) => (
                <select
                    value={row.status}
                    onChange={(e) => updateOrderStatus(row.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold border-none cursor-pointer 
                        ${row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${row.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : ''}
                        ${row.status === 'preparing' ? 'bg-blue-100 text-blue-800' : ''}
                        ${row.status === 'ready' ? 'bg-purple-100 text-purple-800' : ''}
                        ${row.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        ${row.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}
                >
                    <option value="pending">PENDING</option>
                    <option value="confirmed">CONFIRMED</option>
                    <option value="preparing">PREPARING</option>
                    <option value="ready">READY</option>
                    <option value="completed">COMPLETED</option>
                    <option value="cancelled">CANCELLED</option>
                </select>
            )
        },
        {
            key: 'created_at',
            label: 'Date & Time',
            sortable: true,
            render: (row: Order) => {
                const date = new Date(row.created_at);
                return (
                    <div className="text-sm">
                        <p className="font-medium">{date.toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{date.toLocaleTimeString()}</p>
                    </div>
                );
            }
        }
    ];

    const renderExpandedRow = (order: Order) => {
        if (expandedRow !== order.id) return null;

        return (
            <div className="bg-gray-50 p-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Order Items:</h4>
                <div className="space-y-2">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.menu_item_name}</p>
                                {item.variation_name && (
                                    <p className="text-xs text-gray-500">Variation: {item.variation_name}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                <p className="text-sm font-medium">₹{item.unit_price} each</p>
                            </div>
                            <div className="text-right min-w-[80px]">
                                <p className="font-bold text-green-700">₹{item.subtotal.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-300 text-right">
                    <p className="text-sm text-gray-600">Subtotal: ₹{order.subtotal.toLocaleString()}</p>
                    {order.tax > 0 && <p className="text-sm text-gray-600">Tax: ₹{order.tax.toFixed(2)}</p>}
                    <p className="text-lg font-bold text-gray-900 mt-1">Total: ₹{order.total.toLocaleString()}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-gray-600 mt-1">View and manage all customer orders with detailed breakdowns</p>
            </div>

            {stats && (
                <>
                    {/* Primary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Orders"
                            value={stats.total}
                            icon={ShoppingBag}
                            subtitle={`${stats.paidOrders} paid`}
                            loading={loading}
                        />
                        <StatCard
                            title="Total Revenue"
                            value={`₹${stats.revenue?.toLocaleString() || 0}`}
                            icon={CreditCard}
                            subtitle="From paid orders"
                            loading={loading}
                        />
                        <StatCard
                            title="Pending Orders"
                            value={stats.pending + stats.preparing}
                            icon={Clock}
                            subtitle={`${stats.preparing} preparing`}
                            loading={loading}
                        />
                        <StatCard
                            title="Completed"
                            value={stats.completed}
                            icon={CheckCircle}
                            loading={loading}
                        />
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                            <p className="text-xs text-gray-600">Pending</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                            <p className="text-2xl font-bold text-blue-600">{stats.preparing}</p>
                            <p className="text-xs text-gray-600">Preparing</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                            <p className="text-2xl font-bold text-purple-600">{stats.ready}</p>
                            <p className="text-xs text-gray-600">Ready</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                            <p className="text-xs text-gray-600">Completed</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                            <p className="text-xs text-gray-600">Cancelled</p>
                        </div>
                    </div>
                </>
            )}

            <DataTable
                data={orders}
                columns={columns}
                loading={loading}
                searchable
                searchPlaceholder="Search by order number, customer name, or email..."
                renderExpandedRow={renderExpandedRow}
            />
        </div>
    );
}
