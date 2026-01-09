// Art Gallery Management Page - WITH REAL DATABASE DATA
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import StatCard from '@/components/admin/StatCard';
import { Palette, DollarSign, TrendingUp, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ArtistData {
    artist: string;
    total_sales: number;
    total_revenue: number;
    avg_price: number;
}

export default function GalleryPage() {
    const [artists, setArtists] = useState<ArtistData[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const supabase = createClient();

            // Get all art purchases with art piece details
            const { data: purchases } = await supabase
                .from('art_purchases')
                .select(`
          *,
          art_pieces (
            id,
            name,
            artist,
            price
          )
        `);

            // Group by artist
            const artistStats: Record<string, { sales: number; revenue: number }> = {};

            purchases?.forEach((purchase: any) => {
                const artist = purchase.art_pieces?.artist || 'Unknown';
                const price = Number(purchase.purchase_price || purchase.art_pieces?.price || 0);

                if (!artistStats[artist]) {
                    artistStats[artist] = { sales: 0, revenue: 0 };
                }

                artistStats[artist].sales += 1;
                artistStats[artist].revenue += price;
            });

            // Convert to array
            const artistAnalytics = Object.entries(artistStats).map(([artist, data]) => ({
                artist,
                total_sales: data.sales,
                total_revenue: Number(data.revenue.toFixed(2)),
                avg_price: data.sales > 0 ? Number((data.revenue / data.sales).toFixed(2)) : 0
            })).sort((a, b) => b.total_revenue - a.total_revenue);

            setArtists(artistAnalytics);

            // Calculate stats
            const totalSales = purchases?.length || 0;
            const totalRevenue = purchases?.reduce((sum, p) =>
                sum + Number(p.purchase_price || 0), 0
            ) || 0;
            const avgPrice = totalSales > 0 ? totalRevenue / totalSales : 0;

            setStats({
                total_sales: totalSales,
                total_revenue: totalRevenue,
                unique_artists: Object.keys(artistStats).length,
                avg_price: avgPrice
            });

        } catch (error) {
            console.error('Error fetching gallery data:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'artist',
            label: 'Artist',
            sortable: true,
            render: (row: ArtistData) => (
                <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#8B6F47]" />
                    <span className="font-medium">{row.artist}</span>
                </div>
            )
        },
        {
            key: 'total_sales',
            label: 'Sales',
            sortable: true,
            render: (row: ArtistData) => (
                <span className="font-semibold">{row.total_sales}</span>
            )
        },
        {
            key: 'total_revenue',
            label: 'Revenue',
            sortable: true,
            render: (row: ArtistData) => (
                <span className="font-semibold text-green-700">₹{row.total_revenue.toLocaleString()}</span>
            )
        },
        {
            key: 'avg_price',
            label: 'Avg Price',
            sortable: true,
            render: (row: ArtistData) => `₹${row.avg_price.toLocaleString()}`
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Art Gallery Management</h1>
                <p className="text-gray-600 mt-1">Manage art pieces and view sales analytics</p>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Sales"
                        value={stats.total_sales}
                        icon={TrendingUp}
                        loading={loading}
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`₹${stats.total_revenue?.toLocaleString() || 0}`}
                        icon={DollarSign}
                        loading={loading}
                    />
                    <StatCard
                        title="Unique Artists"
                        value={stats.unique_artists}
                        icon={Users}
                        loading={loading}
                    />
                    <StatCard
                        title="Avg Sale Price"
                        value={`₹${stats.avg_price?.toFixed(0) || 0}`}
                        icon={Palette}
                        loading={loading}
                    />
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold mb-4">Artist Performance</h3>
                <DataTable
                    data={artists}
                    columns={columns}
                    loading={loading}
                    searchable
                    searchPlaceholder="Search artists..."
                />
            </div>
        </div>
    );
}
