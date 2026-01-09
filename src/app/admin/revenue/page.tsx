// Revenue Analytics Page  
'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import { DollarSign, TrendingUp, ShoppingBag, Palette, GraduationCap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RevenuePage() {
    const [revenue, setRevenue] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const supabase = createClient();

            // Get orders revenue
            const { data: orders } = await supabase
                .from('orders')
                .select('total, status')
                .in('status', ['completed', 'ready', 'preparing', 'pending']);

            const ordersRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

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

            const total = ordersRevenue + workshopsRevenue + artRevenue;

            setRevenue({
                total,
                orders: ordersRevenue,
                workshops: workshopsRevenue,
                art: artRevenue
            });

        } catch (error) {
            console.error('Error fetching revenue:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
                <p className="text-gray-600 mt-1">Complete revenue breakdown across all channels</p>
            </div>

            {revenue && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Revenue"
                            value={`₹${revenue.total?.toLocaleString() || 0}`}
                            icon={DollarSign}
                            loading={loading}
                        />
                        <StatCard
                            title="Orders Revenue"
                            value={`₹${revenue.orders?.toLocaleString() || 0}`}
                            icon={ShoppingBag}
                            subtitle={`${((revenue.orders / revenue.total) * 100).toFixed(0)}% of total`}
                            loading={loading}
                        />
                        <StatCard
                            title="Workshops Revenue"
                            value={`₹${revenue.workshops?.toLocaleString() || 0}`}
                            icon={GraduationCap}
                            subtitle={`${((revenue.workshops / revenue.total) * 100).toFixed(0)}% of total`}
                            loading={loading}
                        />
                        <StatCard
                            title="Art Gallery Revenue"
                            value={`₹${revenue.art?.toLocaleString() || 0}`}
                            icon={Palette}
                            subtitle={`${((revenue.art / revenue.total) * 100).toFixed(0)}% of total`}
                            loading={loading}
                        />
                    </div>

                    {/* Revenue Breakdown Chart */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-6">Revenue Distribution</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">Orders</span>
                                    <span className="text-sm text-gray-600">₹{revenue.orders.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all"
                                        style={{ width: `${(revenue.orders / revenue.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">Workshops</span>
                                    <span className="text-sm text-gray-600">₹{revenue.workshops.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-purple-600 h-3 rounded-full transition-all"
                                        style={{ width: `${(revenue.workshops / revenue.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">Art Gallery</span>
                                    <span className="text-sm text-gray-600">₹{revenue.art.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-amber-600 h-3 rounded-full transition-all"
                                        style={{ width: `${(revenue.art / revenue.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
