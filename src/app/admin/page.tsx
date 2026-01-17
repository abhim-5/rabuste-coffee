// Admin Dashboard Page - WITH COMPREHENSIVE REAL DATABASE DATA & VISUALIZATIONS
'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import RevenueChart from '@/components/admin/RevenueChart';
import RevenuePieChart from '@/components/admin/RevenuePieChart';
import OrderStatusBarChart from '@/components/admin/OrderStatusBarChart';
import TopProductsChart from '@/components/admin/TopProductsChart';
import AOVChart from '@/components/admin/AOVChart';
import HourlyRevenueChart from '@/components/admin/HourlyRevenueChart';
import { DollarSign, ShoppingBag, Users, TrendingUp, Package, GraduationCap, Palette } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
    const [revenue, setRevenue] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [aovData, setAovData] = useState<any[]>([]);
    const [hourlyData, setHourlyData] = useState<any[]>([]);
    const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
    const [topProductsData, setTopProductsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        console.log('🚀 DASHBOARD: fetchData() started');
        try {
            const supabase = createClient();

            // ========== ORDERS DATA ==========
            const { data: orders } = await supabase
                .from('orders')
                .select('id, total, status, created_at, payment_status')
                .in('status', ['completed', 'confirmed', 'ready', 'preparing', 'pending', 'cancelled']);

            const ordersRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
            
            // Today's data
            const ordersToday = orders?.filter(o => {
                const orderDate = new Date(o.created_at).toDateString();
                const today = new Date().toDateString();
                return orderDate === today;
            }) || [];
            const todayRevenue = ordersToday.reduce((sum, order) => sum + Number(order.total), 0);

            // Order status breakdown
            const statusCounts = {
                pending: 0,
                confirmed: 0,
                preparing: 0,
                ready: 0,
                completed: 0,
                cancelled: 0
            };
            orders?.forEach(order => {
                if (order.status in statusCounts) {
                    statusCounts[order.status as keyof typeof statusCounts]++;
                }
            });

            const statusColors = {
                pending: '#F59E0B',
                confirmed: '#06B6D4',
                preparing: '#3B82F6',
                ready: '#8B5CF6',
                completed: '#10B981',
                cancelled: '#EF4444'
            };

            setOrderStatusData(
                Object.entries(statusCounts).map(([status, count]) => ({
                    status: status.charAt(0).toUpperCase() + status.slice(1),
                    count,
                    color: statusColors[status as keyof typeof statusColors]
                }))
            );

            // ========== ORDER ITEMS FOR TOP PRODUCTS ==========
            const { data: orderItems } = await supabase
                .from('order_items')
                .select('menu_item_name, quantity, unit_price');

            // Aggregate products
            const productMap = new Map<string, { orders: number; revenue: number }>();
            orderItems?.forEach(item => {
                const name = item.menu_item_name || 'Unknown';
                const existing = productMap.get(name) || { orders: 0, revenue: 0 };
                productMap.set(name, {
                    orders: existing.orders + (item.quantity || 0),
                    revenue: existing.revenue + (item.quantity * item.unit_price || 0)
                });
            });

            // Top 5 products by order count
            const topProducts = Array.from(productMap.entries())
                .map(([name, data]) => ({ name, ...data }))
                .sort((a, b) => b.orders - a.orders)
                .slice(0, 5);

            setTopProductsData(topProducts);

            // ========== WORKSHOPS DATA ==========
            const { data: workshopRegs } = await supabase
                .from('workshop_registrations')
                .select(`
                  created_at,
                  workshops (price)
                `);

            const workshopsRevenue = workshopRegs?.reduce((sum: number, reg: any) =>
                sum + Number(reg.workshops?.price || 0), 0
            ) || 0;

            // ========== ART GALLERY DATA ==========
            const { data: artPurchases } = await supabase
                .from('art_purchases')
                .select('purchase_price, created_at');

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

            // ========== TIME-SERIES CHART DATA (Hourly Granularity) ==========
            const timeSeriesAggregator: Record<string, any> = {};
            
            // 0. Generate full date range from Jan 1, 2026 to Today (Hourly steps)
            const startDate = new Date('2026-01-01T00:00:00'); 
            const endDate = new Date(); // Current Local Time

            // Helper: get local ISO-like string "YYYY-MM-DD HH:00"
            const getLocalHourKey = (date: Date) => {
                const offset = date.getTimezoneOffset() * 60000;
                const localDate = new Date(date.getTime() - offset);
                // ISO string is YYYY-MM-DDTHH:mm:ss.sssZ
                // We want YYYY-MM-DD HH
                return localDate.toISOString().slice(0, 13).replace('T', ' ') + ':00';
            };
            
            // Helper: init bucket
            const getInitBucket = (dateObj: Date) => ({
                 displayDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
                 timestamp: dateObj.getTime(),
                 total: 0, 
                 orders: 0, 
                 workshops: 0, 
                 art: 0, 
                 orderCount: 0
            });

            // Loop hour by hour
            // Copy start date
            let currentPointer = new Date(startDate);
            while (currentPointer <= endDate) {
                const key = getLocalHourKey(currentPointer);
                timeSeriesAggregator[key] = getInitBucket(currentPointer);
                // Add 1 hour
                currentPointer.setHours(currentPointer.getHours() + 1);
            }

            // 1. Process Orders
            orders?.forEach(o => {
                const d = new Date(o.created_at);
                if (d >= startDate) {
                    const key = getLocalHourKey(d);
                    if (timeSeriesAggregator[key]) {
                        timeSeriesAggregator[key].orders += Number(o.total);
                        timeSeriesAggregator[key].total += Number(o.total);
                        timeSeriesAggregator[key].orderCount += 1;
                    }
                }
            });

            // 2. Process Workshops
            workshopRegs?.forEach((w: any) => {
                const d = new Date(w.created_at);
                if (d >= startDate) {
                    const key = getLocalHourKey(d);
                    if (timeSeriesAggregator[key]) {
                        const amount = Number(w.workshops?.price || 0);
                        timeSeriesAggregator[key].workshops += amount;
                        timeSeriesAggregator[key].total += amount;
                    }
                }
            });

            // 3. Process Art
            artPurchases?.forEach(a => {
                const d = new Date(a.created_at);
                if (d >= startDate) {
                    const key = getLocalHourKey(d);
                    if (timeSeriesAggregator[key]) {
                        const amount = Number(a.purchase_price);
                        timeSeriesAggregator[key].art += amount;
                        timeSeriesAggregator[key].total += amount;
                    }
                }
            });

            const chartDataArray = Object.values(timeSeriesAggregator).sort((a: any, b: any) => a.timestamp - b.timestamp);
            setChartData(chartDataArray);

            // ========== CALCULATE AOV DATA (Daily Average for cleaner trend) ==========
            // We re-aggregate hourly data into daily for AOV chart to keep it readable, or just use hourly?
            // Let's use daily for AOV to avoid noise.
            const aovDailyMap: Record<string, { total: number, count: number, dateStr: string }> = {};
            
            chartDataArray.forEach((bucket: any) => {
                 const dayKey = new Date(bucket.timestamp).toLocaleDateString();
                 if (!aovDailyMap[dayKey]) aovDailyMap[dayKey] = { total: 0, count: 0, dateStr: bucket.displayDate.split(',')[0] }; // "Jan 10"
                 aovDailyMap[dayKey].total += bucket.orders;
                 aovDailyMap[dayKey].count += bucket.orderCount;
            });
            
            const aovSeries = Object.values(aovDailyMap).map((day: any) => ({
                dateStr: day.dateStr,
                aov: day.count > 0 ? day.total / day.count : 0
            }));
            setAovData(aovSeries);

            // ========== CALCULATE HOURLY DATA ==========
            const hours = Array(24).fill(0);
            orders?.forEach(o => {
                const h = new Date(o.created_at).getHours();
                hours[h] += Number(o.total);
            });
            
            const hourlySeries = hours.map((rev, i) => ({
                hour: i,
                hourLabel: i === 0 ? '12 AM' : i === 12 ? '12 PM' : i > 12 ? `${i-12} PM` : `${i} AM`,
                revenue: rev
            }));
            setHourlyData(hourlySeries);


            // ========== CUSTOMER STATS (via API) ==========
            console.log('🌐 Frontend: Calling dashboard-stats API...');
            const customerStatsResponse = await fetch('/api/admin/dashboard-stats');
            const customerStatsData = await customerStatsResponse.json();
            
            const totalCustomers = customerStatsData.success ? customerStatsData.totalCustomers : 0;
            const newCustomers7d = customerStatsData.success ? customerStatsData.newCustomers7d : 0;

            setStats({
                totalOrders: orders?.length || 0,
                ordersToday: ordersToday.length,
                totalCustomers,
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

    // Prepare pie chart data
    const pieChartData = revenue ? [
        { name: 'Orders', value: revenue.orders, color: '#8B6F47' },
        { name: 'Workshops', value: revenue.workshops, color: '#4A3B28' },
        { name: 'Art Gallery', value: revenue.art, color: '#D8CBB8' }
    ].filter(item => item.value > 0) : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">Welcome! Here's what's happening with your business.</p>
            </div>

            {/* Total Revenue Hero Card */}
            {revenue && (
                <div className="bg-gradient-to-r from-[#1a202c] to-[#2d3748] rounded-xl p-6 text-white">
                    <h2 className="text-lg font-semibold mb-4">Total Revenue</h2>
                    <p className="text-4xl font-bold mb-2">₹{revenue.total.toLocaleString()}</p>
                    <p className="text-sm opacity-80">Across all channels</p>
                </div>
            )}

            {/* Revenue Time Series Chart (Scroll Zoom) */}
            {chartData.length > 0 && (
                <div className="mt-2">
                    <RevenueChart data={chartData} />
                </div>
            )}

            {/* Additional Analytics Grid (New) */}
            {aovData.length > 0 && hourlyData.length > 0 && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AOVChart data={aovData} />
                    <HourlyRevenueChart data={hourlyData} />
                </div>
            )}

            {/* Revenue Breakdown Cards */}
            {revenue && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Orders Revenue"
                        value={`₹${revenue.orders.toLocaleString()}`}
                        icon={ShoppingBag}
                        subtitle={`${revenue.total > 0 ? ((revenue.orders / revenue.total) * 100).toFixed(0) : 0}% of total`}
                        loading={loading}
                    />
                    <StatCard
                        title="Workshops Revenue"
                        value={`₹${revenue.workshops.toLocaleString()}`}
                        icon={GraduationCap}
                        subtitle={`${revenue.total > 0 ? ((revenue.workshops / revenue.total) * 100).toFixed(0) : 0}% of total`}
                        loading={loading}
                    />
                    <StatCard
                        title="Art Gallery Revenue"
                        value={`₹${revenue.art.toLocaleString()}`}
                        icon={Palette}
                        subtitle={`${revenue.total > 0 ? ((revenue.art / revenue.total) * 100).toFixed(0) : 0}% of total`}
                        loading={loading}
                    />
                </div>
            )}

            {/* Pie Chart & Bar Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pieChartData.length > 0 && <RevenuePieChart data={pieChartData} />}
                {orderStatusData.length > 0 && <OrderStatusBarChart data={orderStatusData} />}
            </div>

            {/* Top Products Chart */}
            {topProductsData.length > 0 && (
                <TopProductsChart data={topProductsData} />
            )}

            {/* Today's Stats */}
            {revenue && stats && (
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

            {/* Quick Stats Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalArtSales || 0}</p>
                        <p className="text-sm text-gray-600">Art Pieces Sold</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">
                            ₹{stats && revenue && stats.totalOrders > 0 ? (revenue.total / stats.totalOrders).toFixed(0) : 0}
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
