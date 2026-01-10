'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface HourlyRevenueChartProps {
    data: any[];
}

export default function HourlyRevenueChart({ data }: HourlyRevenueChartProps) {
  // data needs: hour (0-23), revenue
  
  // Find max for color scaling
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-[350px] flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Peak Hours</h3>
        <p className="text-xs text-gray-500 mb-4">Revenue distribution by time of day</p>
        <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                        dataKey="hourLabel" 
                        tick={{fontSize: 10, fill: '#6B7280'}} 
                        axisLine={false} 
                        tickLine={false} 
                    />
                    <YAxis 
                        tick={{fontSize: 10, fill: '#6B7280'}} 
                        axisLine={false} 
                        tickLine={false}
                        tickFormatter={(value) => `₹${value}`} // Shorten large numbers if needed
                    />
                    <Tooltip 
                        cursor={{fill: '#F3F4F6'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]} animationDuration={1500}>
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.revenue > maxRevenue * 0.7 ? '#8B6F47' : '#D1D5DB'} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
