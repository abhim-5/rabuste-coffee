// Workshops Management Page - WITH REAL DATABASE DATA
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import StatCard from '@/components/admin/StatCard';
import { GraduationCap, Users, TrendingUp, DollarSign } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface WorkshopData {
    workshop_id: string;
    title: string;
    instructor: string;
    start_date: string;
    price: number;
    capacity: number;
    bookings: number;
    booking_rate: number;
    revenue: number;
}

export default function WorkshopsPage() {
    const [workshops, setWorkshops] = useState<WorkshopData[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const supabase = createClient();

            // Get all workshops with registrations
            const { data: workshopsData } = await supabase
                .from('workshops')
                .select(`
          *,
          workshop_registrations (id)
        `)
                .order('start_date', { ascending: false });

            const workshopAnalytics = (workshopsData || []).map((workshop: any) => {
                const bookings = workshop.workshop_registrations?.length || 0;
                const bookingRate = workshop.capacity > 0 ? (bookings / workshop.capacity) * 100 : 0;
                const revenue = bookings * Number(workshop.price);

                return {
                    workshop_id: workshop.id,
                    title: workshop.title,
                    instructor: workshop.instructor,
                    start_date: workshop.start_date,
                    price: workshop.price,
                    capacity: workshop.capacity,
                    bookings,
                    booking_rate: Number(bookingRate.toFixed(2)),
                    revenue: Number(revenue.toFixed(2))
                };
            });

            setWorkshops(workshopAnalytics);

            // Calculate stats
            const totalBookings = workshopAnalytics.reduce((sum, w) => sum + w.bookings, 0);
            const totalRevenue = workshopAnalytics.reduce((sum, w) => sum + w.revenue, 0);
            const avgBookingRate = workshopAnalytics.length > 0
                ? workshopAnalytics.reduce((sum, w) => sum + w.booking_rate, 0) / workshopAnalytics.length
                : 0;

            setStats({
                total: workshopAnalytics.length,
                bookings: totalBookings,
                revenue: totalRevenue,
                avg_booking_rate: avgBookingRate
            });

        } catch (error) {
            console.error('Error fetching workshops:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'title',
            label: 'Workshop',
            sortable: true,
            render: (row: WorkshopData) => (
                <div>
                    <p className="font-medium">{row.title}</p>
                    <p className="text-xs text-gray-500">by {row.instructor}</p>
                </div>
            )
        },
        {
            key: 'start_date',
            label: 'Date',
            sortable: true,
            render: (row: WorkshopData) => new Date(row.start_date).toLocaleDateString()
        },
        {
            key: 'bookings',
            label: 'Bookings',
            sortable: true,
            render: (row: WorkshopData) => (
                <div>
                    <p className="font-semibold">{row.bookings}/{row.capacity}</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                            className="bg-[#D4AF37] h-1.5 rounded-full"
                            style={{ width: `${row.booking_rate}%` }}
                        ></div>
                    </div>
                </div>
            )
        },
        {
            key: 'booking_rate',
            label: 'Booking Rate',
            sortable: true,
            render: (row: WorkshopData) => (
                <span className={`font-medium ${row.booking_rate >= 80 ? 'text-green-600' :
                        row.booking_rate >= 50 ? 'text-yellow-600' :
                            'text-red-600'
                    }`}>
                    {row.booking_rate.toFixed(0)}%
                </span>
            )
        },
        {
            key: 'revenue',
            label: 'Revenue',
            sortable: true,
            render: (row: WorkshopData) => (
                <span className="font-semibold text-green-700">₹{row.revenue.toLocaleString()}</span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Workshop Management</h1>
                <p className="text-gray-600 mt-1">Manage workshops and view analytics</p>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Workshops"
                        value={stats.total}
                        icon={GraduationCap}
                        loading={loading}
                    />
                    <StatCard
                        title="Total Bookings"
                        value={stats.bookings}
                        icon={Users}
                        loading={loading}
                    />
                    <StatCard
                        title="Avg Booking Rate"
                        value={`${stats.avg_booking_rate?.toFixed(0) || 0}%`}
                        icon={TrendingUp}
                        loading={loading}
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`₹${stats.revenue?.toLocaleString() || 0}`}
                        icon={DollarSign}
                        loading={loading}
                    />
                </div>
            )}

            <DataTable
                data={workshops}
                columns={columns}
                loading={loading}
                searchable
                searchPlaceholder="Search workshops..."
            />
        </div>
    );
}
