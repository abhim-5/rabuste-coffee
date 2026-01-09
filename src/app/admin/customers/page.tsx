// Customers Management Page - WITH REAL DATABASE DATA
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import StatCard from '@/components/admin/StatCard';
import { Users, TrendingUp, Award, DollarSign } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Customer {
    user_id: string;
    email: string;
    full_name: string | null;
    total_orders: number;
    total_spent: number;
    points_balance: number;
    created_at: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const supabase = createClient();

            // Get all customer profiles
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, email, full_name, created_at, credits')
                .eq('role', 'customer');

            // For each customer, calculate their metrics
            const customerData = await Promise.all(
                (profiles || []).map(async (profile) => {
                    // Get orders
                    const { data: orders } = await supabase
                        .from('orders')
                        .select('total')
                        .eq('user_id', profile.id);

                    const totalOrders = orders?.length || 0;
                    const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

                    // Get points
                    const { data: pointsData } = await supabase
                        .from('points_transactions')
                        .select('points, transaction_type')
                        .eq('user_id', profile.id);

                    const pointsEarned = pointsData?.filter(t => t.transaction_type === 'earned')
                        .reduce((sum, t) => sum + t.points, 0) || 0;
                    const pointsRedeemed = pointsData?.filter(t => t.transaction_type === 'redeemed')
                        .reduce((sum, t) => sum + Math.abs(t.points), 0) || 0;

                    return {
                        user_id: profile.id,
                        email: profile.email,
                        full_name: profile.full_name,
                        total_orders: totalOrders,
                        total_spent: totalSpent,
                        points_balance: pointsEarned - pointsRedeemed,
                        created_at: profile.created_at
                    };
                })
            );

            // Sort by total spent
            customerData.sort((a, b) => b.total_spent - a.total_spent);
            setCustomers(customerData);

            // Calculate stats
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const newCustomers = customerData.filter(c =>
                new Date(c.created_at) >= sevenDaysAgo
            ).length;

            const totalPoints = customerData.reduce((sum, c) => sum + c.points_balance, 0);
            const avgSpent = customerData.length > 0
                ? customerData.reduce((sum, c) => sum + c.total_spent, 0) / customerData.length
                : 0;

            setStats({
                total: customerData.length,
                new_7d: newCustomers,
                total_points: totalPoints,
                avg_spent: avgSpent
            });

        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'full_name',
            label: 'Customer',
            sortable: true,
            render: (row: Customer) => (
                <div>
                    <p className="font-medium">{row.full_name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{row.email}</p>
                </div>
            )
        },
        {
            key: 'total_orders',
            label: 'Orders',
            sortable: true
        },
        {
            key: 'total_spent',
            label: 'Total Spent',
            sortable: true,
            render: (row: Customer) => (
                <span className="font-semibold text-green-700">₹{row.total_spent.toLocaleString()}</span>
            )
        },
        {
            key: 'points_balance',
            label: 'Points',
            sortable: true,
            render: (row: Customer) => (
                <span className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-[#D4AF37]" />
                    {row.points_balance}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Customer Analytics</h1>
                <p className="text-gray-600 mt-1">View and manage your customer base</p>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Customers"
                        value={stats.total}
                        icon={Users}
                        loading={loading}
                    />
                    <StatCard
                        title="New (7 days)"
                        value={stats.new_7d}
                        icon={TrendingUp}
                        loading={loading}
                    />
                    <StatCard
                        title="Avg Spent"
                        value={`₹${stats.avg_spent?.toFixed(0) || 0}`}
                        icon={DollarSign}
                        loading={loading}
                    />
                    <StatCard
                        title="Total Points"
                        value={stats.total_points}
                        icon={Award}
                        loading={loading}
                    />
                </div>
            )}

            <DataTable
                data={customers}
                columns={columns}
                loading={loading}
                searchable
                searchPlaceholder="Search customers by name or email..."
            />
        </div>
    );
}
