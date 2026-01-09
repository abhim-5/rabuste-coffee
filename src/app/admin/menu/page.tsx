'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Coffee, TrendingUp, TrendingDown, ToggleLeft, ToggleRight, Tag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    available: boolean;
    is_deal_of_day: boolean;
    total_sales: number;
}

export default function MenuManagementPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [topSeller, setTopSeller] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const supabase = createClient();

            // Fetch all menu items
            const { data: items, error } = await supabase
                .from('menu_items')
                .select('*')
                .order('category', { ascending: true });

            if (error) throw error;

            // For each item, get sales count
            const itemsWithSales = await Promise.all(
                (items || []).map(async (item) => {
                    const { data: salesData } = await supabase
                        .from('order_items')
                        .select('quantity')
                        .eq('menu_item_id', item.id);

                    const totalSales = salesData?.reduce((sum, sale) => sum + sale.quantity, 0) || 0;

                    return {
                        ...item,
                        total_sales: totalSales
                    };
                })
            );

            setMenuItems(itemsWithSales);

            // Find top seller
            const sorted = [...itemsWithSales].sort((a, b) => b.total_sales - a.total_sales);
            setTopSeller(sorted[0] || null);

        } catch (error) {
            console.error('Error fetching menu data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async (item: MenuItem) => {
        try {
            const supabase = createClient();

            const { error } = await supabase
                .from('menu_items')
                .update({ available: !item.available })
                .eq('id', item.id);

            if (!error) {
                fetchData(); // Refresh data
            }
        } catch (error) {
            console.error('Error toggling availability:', error);
        }
    };

    const toggleDealOfDay = async (item: MenuItem) => {
        try {
            const supabase = createClient();

            const { error } = await supabase
                .from('menu_items')
                .update({ is_deal_of_day: !item.is_deal_of_day })
                .eq('id', item.id);

            if (!error) {
                fetchData();
            }
        } catch (error) {
            console.error('Error toggling deal of day:', error);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Item Name',
            sortable: true,
            render: (row: MenuItem) => (
                <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-[#8B6F47]" />
                    <span className="font-medium">{row.name}</span>
                </div>
            )
        },
        {
            key: 'category',
            label: 'Category',
            sortable: true,
            render: (row: MenuItem) => (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                    {row.category}
                </span>
            )
        },
        {
            key: 'price',
            label: 'Price',
            sortable: true,
            render: (row: MenuItem) => `₹${row.price}`
        },
        {
            key: 'total_sales',
            label: 'Total Sales',
            sortable: true,
            render: (row: MenuItem) => (
                <div className="flex items-center gap-1">
                    <span className="font-semibold">{row.total_sales}</span>
                    {row.total_sales > 50 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : row.total_sales < 10 ? (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                    ) : null}
                </div>
            )
        },
        {
            key: 'available',
            label: 'Status',
            render: (row: MenuItem) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleAvailability(row);
                    }}
                    className="flex items-center gap-2 px-3 py-1 rounded-full transition-colors hover:opacity-80"
                >
                    {row.available ? (
                        <>
                            <ToggleRight className="w-5 h-5 text-green-600" />
                            <span className="text-xs font-medium text-green-700">Available</span>
                        </>
                    ) : (
                        <>
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500">Out of Stock</span>
                        </>
                    )}
                </button>
            )
        },
        {
            key: 'is_deal_of_day',
            label: 'Deal of Day',
            render: (row: MenuItem) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleDealOfDay(row);
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${row.is_deal_of_day
                        ? 'bg-[#D4AF37] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Tag className="w-3 h-3" />
                    {row.is_deal_of_day ? 'Active' : 'Set'}
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
                <p className="text-gray-600 mt-1">Manage your products and view sales analytics</p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">Top Seller</h3>
                    {topSeller ? (
                        <div>
                            <p className="text-xl font-bold text-gray-900">{topSeller.name}</p>
                            <p className="text-sm text-gray-500 mt-1">{topSeller.total_sales} sold</p>
                        </div>
                    ) : (
                        <p className="text-gray-400">No data</p>
                    )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">Total Items</h3>
                    <p className="text-xl font-bold text-gray-900">{menuItems.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Active menu items</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">Total Sales</h3>
                    <p className="text-xl font-bold text-gray-900">
                        {menuItems.reduce((sum, item) => sum + item.total_sales, 0)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">All-time item sales</p>
                </div>
            </div>

            {/* Menu Items Table */}
            <DataTable
                data={menuItems}
                columns={columns}
                loading={loading}
                searchable
                searchPlaceholder="Search menu items..."
            />
        </div>
    );
}
