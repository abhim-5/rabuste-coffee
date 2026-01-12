// Points System Admin Dashboard
'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import {
    Award, DollarSign, TrendingUp, AlertCircle, Users,
    CheckCircle, XCircle, Activity
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface DashboardStats {
    system_enabled: boolean;
    total_points_circulation: number;
    total_earned_alltime: number;
    total_redeemed_alltime: number;
    total_discount_given: number;
    active_users: number;
    redemption_rate: number;
    recent_transactions: any[];
}

export default function PointsDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const supabase = createClient();

            // Get config
            const { data: configData } = await supabase
                .from('points_config')
                .select('*')
                .eq('id', 1)
                .single();

            setConfig(configData);

            // Get total points in circulation
            const { data: userPoints } = await supabase
                .from('user_points')
                .select('total_points, total_earned, total_redeemed');

            const totalCirculation = userPoints?.reduce((sum, u) => sum + u.total_points, 0) || 0;
            const totalEarned = userPoints?.reduce((sum, u) => sum + u.total_earned, 0) || 0;
            const totalRedeemed = userPoints?.reduce((sum, u) => sum + u.total_redeemed, 0) || 0;
            const activeUsers = userPoints?.filter(u => u.total_points > 0).length || 0;

            // Calculate discount given (total redeemed / conversion ratio)
            const ratio = configData?.points_to_rupee_ratio || 10;
            const discountGiven = totalRedeemed / ratio;

            // Get recent transactions
            const { data: recentTx } = await supabase
                .from('points_transactions')
                .select(`
          *,
          profiles:user_id (email, full_name)
        `)
                .order('created_at', { ascending: false })
                .limit(10);

            setStats({
                system_enabled: configData?.system_enabled || false,
                total_points_circulation: totalCirculation,
                total_earned_alltime: totalEarned,
                total_redeemed_alltime: totalRedeemed,
                total_discount_given: discountGiven,
                active_users: activeUsers,
                redemption_rate: totalEarned > 0 ? (totalRedeemed / totalEarned) * 100 : 0,
                recent_transactions: recentTx || []
            });

        } catch (error) {
            console.error('Error fetching points dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Points System</h1>
                    <p className="text-gray-600 mt-1">Admin-controlled loyalty & rewards</p>
                </div>
                <Link href="/admin/points/settings">
                    <button className="px-4 py-2 bg-[#1a202c] text-white rounded-lg hover:bg-[#2d3748] transition">
                        System Settings
                    </button>
                </Link>
            </div>

            {/* System Status Alert */}
            {config && (
                <div className={`p-4 rounded-lg border flex items-center gap-3 ${config.system_enabled
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                    {config.system_enabled ? (
                        <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="font-semibold text-green-900">System Active</p>
                                <p className="text-sm text-green-700">
                                    Earning: {config.earning_enabled ? 'ON' : 'OFF'} |
                                    Redemption: {config.redemption_enabled ? 'ON' : 'OFF'} |
                                    Ratio: {config.points_to_rupee_ratio} points = ₹1
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <div>
                                <p className="font-semibold text-red-900">System Disabled</p>
                                <p className="text-sm text-red-700">Points earning and redemption are currently disabled</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Stats Cards */}
            {stats && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard
                            title="Points in Circulation"
                            value={stats.total_points_circulation.toLocaleString()}
                            icon={Award}
                            subtitle={`≈ ₹${(stats.total_points_circulation / (config?.points_to_rupee_ratio || 10)).toFixed(0)} value`}
                            loading={loading}
                        />
                        <StatCard
                            title="Total Earned (All-Time)"
                            value={stats.total_earned_alltime.toLocaleString()}
                            icon={TrendingUp}
                            loading={loading}
                        />
                        <StatCard
                            title="Total Redeemed"
                            value={stats.total_redeemed_alltime.toLocaleString()}
                            icon={DollarSign}
                            subtitle={`₹${stats.total_discount_given.toFixed(0)} discount given`}
                            loading={loading}
                        />
                        <StatCard
                            title="Active Users"
                            value={stats.active_users}
                            icon={Users}
                            subtitle={`${stats.redemption_rate.toFixed(1)}% redemption rate`}
                            loading={loading}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/admin/points/earning" className="block">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] hover:shadow-md transition cursor-pointer">
                                <h3 className="font-semibold text-gray-900 mb-2">⚙️ Earning Rules</h3>
                                <p className="text-sm text-gray-600">Configure which items earn points and how much</p>
                            </div>
                        </Link>
                        <Link href="/admin/points/redemption" className="block">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] hover:shadow-md transition cursor-pointer">
                                <h3 className="font-semibold text-gray-900 mb-2">💰 Redemption Rules</h3>
                                <p className="text-sm text-gray-600">Set which items accept points and discount caps</p>
                            </div>
                        </Link>
                        <Link href="/admin/points/users" className="block">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] hover:shadow-md transition cursor-pointer">
                                <h3 className="font-semibold text-gray-900 mb-2">👥 User Management</h3>
                                <p className="text-sm text-gray-600">View, grant, or adjust user points manually</p>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Recent Transactions</h3>
                            <Link href="/admin/points/analytics" className="text-sm text-[#D4AF37] hover:underline">
                                View Analytics →
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-gray-200">
                                    <tr className="text-left text-sm text-gray-600">
                                        <th className="pb-3">User</th>
                                        <th className="pb-3">Type</th>
                                        <th className="pb-3">Points</th>
                                        <th className="pb-3">Source</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {stats.recent_transactions.map((tx: any) => (
                                        <tr key={tx.id} className="border-b border-gray-100">
                                            <td className="py-3">
                                                <div>
                                                    <p className="font-medium">{tx.profiles?.full_name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">{tx.profiles?.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.transaction_type === 'earned'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {tx.transaction_type}
                                                </span>
                                            </td>
                                            <td className="py-3 font-semibold">{tx.points}</td>
                                            <td className="py-3 text-gray-600 capitalize">{tx.source.replace('_', ' ')}</td>
                                            <td className="py-3">
                                                <span className={`text-xs capitalize ${tx.status === 'confirmed' ? 'text-green-600' :
                                                        tx.status === 'pending' ? 'text-yellow-600' :
                                                            'text-red-600'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-gray-500 text-xs">
                                                {new Date(tx.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
