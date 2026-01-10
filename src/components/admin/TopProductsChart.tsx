'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TopProductsChartProps {
    data: {
        name: string;
        orders: number;
        revenue: number;
    }[];
}

export default function TopProductsChart({ data }: TopProductsChartProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Top Selling Products</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        width={90}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '12px'
                        }}
                        formatter={(value: any, name: string) => {
                            if (name === 'revenue') return [`₹${Number(value).toLocaleString()}`, 'Revenue'];
                            return [value, 'Orders'];
                        }}
                    />
                    <Bar dataKey="orders" fill="#8B6F47" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="revenue" fill="#4A3B28" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#8B6F47]"></div>
                    <span className="text-gray-600">Order Count</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4A3B28]"></div>
                    <span className="text-gray-600">Revenue</span>
                </div>
            </div>
        </div>
    );
}
