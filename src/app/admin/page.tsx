// Admin Dashboard Page - WITH REAL DATABASE DATA
'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import { DollarSign, ShoppingBag, Users, TrendingUp, Package, GraduationCap, Palette } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
    const [revenue, setRevenue] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const supabase = createClient();

            // Get ALL orders revenue
            const { data: orders } = await supabase
                .from('orders')
                .select('total, status, created_at')
                .in('status', ['completed', 'ready', 'preparing', 'pending']);

            const ordersRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
            const ordersToday = orders?.filter(o => {
                const orderDate = new Date(o.created_at).toDateString();
                const today = new Date().toDateString();
                return orderDate === today;
            }) || [];
            const todayRevenue = ordersToday.reduce((sum, order) => sum + Number(order.total), 0);

            // Get workshops revenue
            const { data: workshopRegs } = await supabase
                .from('workshop_registrations')
                .select(`
          workshops (price)
        `);

            const workshopsRevenue = workshopRegs?.reduce((sum: number, reg: any) =>
                sum + Number(reg.workshops?.price || 0), 0
            ) || 0;

            // Get art gallery revenue
            const { data: artPurchases } = await supabase
                .from('art_purchases')
                .select('purchase_price');

            const artRevenue = artPurchases?.reduce((sum, purchase) =>
                sum + Number(purchase.purchase_price), 0
            ) || 0;

            const totalRevenue = ordersRevenue + workshopsRevenue + artRevenue;

            setRevenue({
                total: totalRevenue,
                today: todayRevenue,
                orders: ordersRevenue,
                workshops: workshopsRevenue,
                art: artRevenue
            });

            // Get customer stats
            const { data: customers } = await supabase
                .from('profiles')
                .select('id, created_at, role')
                .eq('role', 'customer');

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const newCustomers7d = customers?.filter(c =>
                new Date(c.created_at) >= sevenDaysAgo
            ).length || 0;

            setStats({
                totalOrders: orders?.length || 0,
                ordersToday: ordersToday.length,
                totalCustomers: customers?.length || 0,
                newCustomers7d,
                totalWorkshops: workshopRegs?.length || 0,
                totalArtSales: artPurchases?.length || 0
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">Welcome! Here's what's happening with your business.</p>
            </div>

            {/* Revenue Breakdown */}
            {revenue && (
                <>
                    <div className="bg-gradient-to-r from-[#1a202c] to-[#2d3748] rounded-xl p-6 text-white">
                        <h2 className="text-lg font-semibold mb-4">Total Revenue</h2>
                        <p className="text-4xl font-bold mb-2">₹{revenue.total.toLocaleString()}</p>
                        <p className="text-sm opacity-80">Across all channels</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="Orders Revenue"
                            value={`₹${revenue.orders.toLocaleString()}`}
                            icon={ShoppingBag}
                            subtitle={`${((revenue.orders / revenue.total) * 100).toFixed(0)}% of total`}
                            loading={loading}
                        />
                        <StatCard
                            title="Workshops Revenue"
                            value={`₹${revenue.workshops.toLocaleString()}`}
                            icon={GraduationCap}
                            subtitle={`${((revenue.workshops / revenue.total) * 100).toFixed(0)}% of total`}
                            loading={loading}
                        />
                        <StatCard
                            title="Art Gallery Revenue"
                            value={`₹${revenue.art.toLocaleString()}`}
                            icon={Palette}
                            subtitle={`${((revenue.art / revenue.total) * 100).toFixed(0)}% of total`}
                            loading={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard
                            title="Today's Revenue"
                            value={`₹${revenue.today.toLocaleString()}`}
                            icon={DollarSign}
                            loading={loading}
                        />
                        <StatCard
                            title="Orders Today"
                            value={stats?.ordersToday || 0}
                            icon={Package}
                            loading={loading}
                        />
                    </div>
                </>
            )}

            {/* Customer & Order Stats */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={ShoppingBag}
                        loading={loading}
                    />
                    <StatCard
                        title="Total Customers"
                        value={stats.totalCustomers}
                        icon={Users}
                        loading={loading}
                    />
                    <StatCard
                        title="New Customers (7d)"
                        value={stats.newCustomers7d}
                        icon={TrendingUp}
                        loading={loading}
                    />
                    <StatCard
                        title="Workshop Bookings"
                        value={stats.totalWorkshops}
                        icon={GraduationCap}
                        loading={loading}
                    />
                </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalArtSales || 0}</p>
                        <p className="text-sm text-gray-600">Art Pieces Sold</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">
                            ₹{stats && revenue ? (revenue.total / stats.totalOrders).toFixed(0) : 0}
                        </p>
                        <p className="text-sm text-gray-600">Avg Order Value</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalWorkshops || 0}</p>
                        <p className="text-sm text-gray-600">Workshop Registrations</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
