'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import StatCard from '@/components/admin/StatCard';
import { Palette, DollarSign, TrendingUp, Users, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ArtEditCard } from '@/components/admin/ArtEditCard';
import { AddArtModal } from '@/components/admin/AddArtModal';
import { ArtistManager } from '@/components/admin/ArtistManager';

interface ArtistData {
    artist: string;
    total_sales: number;
    total_revenue: number;
    avg_price: number;
}

const BookingsSection = ({ bookings, onUpdateStatus }: { bookings: any[], onUpdateStatus: (id: string, status: string) => void }) => {
    // ... same content as before ...
    // NOTE: To save context length, I am assuming the BookingsSection code is preserved exactly as it was.
    // Ideally I would replace the whole file or reference components, but since I am using replace_file_content:
    // I NEED TO INCLUDE THE BookingSection CODE or move it to a separate file.
    // It's safer to keep it inline as requested but I will just paste the whole file structure update.
    // Since I can't partially replace nicely because of dependencies, I'll rewrite the Page component logic.
    // BUT replace_file_content works on blocks.
    // I will replace the IMPORTS and the PAGE component. Leaving BookingsSection alone if possible?
    // BookingsSection is lines 17-118.
    // I will replace `export default function GalleryPage...` onwards.
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Art Piece</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">{new Date(booking.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4"><span className="font-mono text-xs">{booking.id.split('-')[0]}...</span></td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-sm">{booking.art_pieces?.name || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{booking.art_pieces?.artist}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><span className="text-xs truncate max-w-[100px]">{booking.user_id}</span></td>
                                <td className="px-6 py-4"><span className="font-bold text-[#8B6F47]">₹{booking.purchase_price}</span></td>
                                <td className="px-6 py-4">
                                    <div className="relative">
                                        <select
                                            value={booking.status || 'pending'}
                                            onChange={(e) => onUpdateStatus(booking.id, e.target.value)}
                                            className={`block w-[130px] pl-3 pr-8 py-2 text-sm font-semibold rounded-full border appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer transition shadow-sm ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200 focus:ring-green-500' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200 focus:ring-red-500' :
                                                    'bg-amber-100 text-amber-800 border-amber-200 focus:ring-amber-500'
                                                }`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Purchased</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                    No bookings found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function GalleryPage() {
    const [artists, setArtists] = useState<ArtistData[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [artPieces, setArtPieces] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showAllArt, setShowAllArt] = useState(false);

    const INITIAL_ART_DISPLAY_COUNT = 8;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const supabase = createClient();

            // 1. Fetch Purchases
            const { data: purchases, error: purchaseError } = await supabase
                .from('art_purchases')
                .select(`*, art_pieces (id, name, artist, price, image_url)`)
                .order('created_at', { ascending: false });

            if (purchaseError) throw purchaseError;
            setBookings(purchases || []);

            // 2. Fetch All Art Pieces (Inventory) via API to allow admin view
            // Using direct DB select for simplicity since we are on client with admin potential?
            // Actually, client uses RLS. To get "unavailable" items, I updated existing GET /api/gallery/items to accept admin=true.
            const artRes = await fetch('/api/gallery/items?admin=true');
            const artData = await artRes.json();
            if (artData.success) {
                setArtPieces(artData.items);
            }

            // Stats Logic
            const artistStats: Record<string, { sales: number; revenue: number }> = {};
            purchases?.forEach((purchase: any) => {
                if (purchase.status === 'cancelled') return;
                const artist = purchase.art_pieces?.artist || 'Unknown';
                const price = Number(purchase.purchase_price || purchase.art_pieces?.price || 0);
                if (!artistStats[artist]) artistStats[artist] = { sales: 0, revenue: 0 };
                artistStats[artist].sales += 1;
                artistStats[artist].revenue += price;
            });

            const artistAnalytics = Object.entries(artistStats).map(([artist, data]) => ({
                artist,
                total_sales: data.sales,
                total_revenue: Number(data.revenue.toFixed(2)),
                avg_price: data.sales > 0 ? Number((data.revenue / data.sales).toFixed(2)) : 0
            })).sort((a, b) => b.total_revenue - a.total_revenue);
            setArtists(artistAnalytics);

            const validPurchases = purchases?.filter(p => p.status !== 'cancelled') || [];
            const totalRevenue = validPurchases.reduce((sum, p) => sum + Number(p.purchase_price || 0), 0) || 0;
            const avgPrice = validPurchases.length > 0 ? totalRevenue / validPurchases.length : 0;

            setStats({
                total_sales: validPurchases.length,
                total_revenue: totalRevenue,
                unique_artists: Object.keys(artistStats).length,
                avg_price: avgPrice
            });

        } catch (error) {
            console.error('Error fetching gallery data:', JSON.stringify(error, null, 2));
            if (error instanceof Error) console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const supabase = createClient();
            await supabase.from('art_purchases').update({ status: newStatus }).eq('id', id);
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
            fetchData(); // Refresh stats
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleUpdateArt = async (id: string, updates: any) => {
        const res = await fetch('/api/gallery/items', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates })
        });
        if (!res.ok) throw new Error('Failed to update');
        return res.json();
    };

    const handleDeleteArt = async (id: string) => {
        const res = await fetch(`/api/gallery/items?id=${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        fetchData();
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
        { key: 'total_sales', label: 'Sales', sortable: true, render: (row: ArtistData) => row.total_sales },
        { key: 'total_revenue', label: 'Revenue', sortable: true, render: (row: ArtistData) => `₹${row.total_revenue.toLocaleString()}` },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Art Gallery Management</h1>
                    <p className="text-gray-600 mt-1">Manage art pieces and view sales analytics</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#8B6F47] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#725a39] transition shadow-sm font-medium"
                >
                    <Plus size={20} />
                    Add Artwork
                </button>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Sales" value={stats.total_sales} icon={TrendingUp} loading={loading} />
                    <StatCard title="Total Revenue" value={`₹${stats.total_revenue?.toLocaleString() || 0}`} icon={DollarSign} loading={loading} />
                    <StatCard title="Unique Artists" value={stats.unique_artists} icon={Users} loading={loading} />
                    <StatCard title="Avg Sale Price" value={`₹${stats.avg_price?.toFixed(0) || 0}`} icon={Palette} loading={loading} />
                </div>
            )}

            {/* Inventory Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Art Inventory</h2>
                    {artPieces.length > INITIAL_ART_DISPLAY_COUNT && (
                        <button
                            onClick={() => setShowAllArt(!showAllArt)}
                            className="text-sm font-medium text-[#8B6F47] hover:text-[#725a39] transition"
                        >
                            {showAllArt ? 'Show Less' : `Show All (${artPieces.length})`}
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(showAllArt ? artPieces : artPieces.slice(0, INITIAL_ART_DISPLAY_COUNT)).map(art => (
                        <ArtEditCard
                            key={art.id}
                            art={art}
                            onUpdate={handleUpdateArt}
                            onDelete={handleDeleteArt}
                            onRefresh={fetchData}
                        />
                    ))}
                    {artPieces.length === 0 && !loading && (
                        <div className="col-span-full text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            No art pieces found. Add one to get started.
                        </div>
                    )}
                </div>
            </div>

            {/* Artist Management Section */}
            <div className="space-y-4">
                <ArtistManager />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <BookingsSection bookings={bookings} onUpdateStatus={handleUpdateStatus} />
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-semibold text-gray-900">Artist Performance</h3>
                        </div>
                        <div className="p-0">
                            <DataTable data={artists} columns={columns} loading={loading} searchable={false} />
                        </div>
                    </div>
                </div>
            </div>

            <AddArtModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    );
}
