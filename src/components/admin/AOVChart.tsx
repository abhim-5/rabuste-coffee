'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart
} from 'recharts';

interface AOVChartProps {
    data: any[];
}

export default function AOVChart({ data }: AOVChartProps) {
  // data needs: dateStr, aov (total revenue / count)
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-[350px] flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Average Order Value Trend</h3>
        <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorAov" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B6F47" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#8B6F47" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                        dataKey="dateStr" 
                        tick={{fontSize: 10, fill: '#6B7280'}} 
                        axisLine={false} 
                        tickLine={false} 
                    />
                    <YAxis 
                        tick={{fontSize: 10, fill: '#6B7280'}} 
                        axisLine={false} 
                        tickLine={false}
                        tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`₹${Number(value).toFixed(0)}`, 'Avg. Order']}
                    />
                    <Area type="monotone" dataKey="aov" fill="url(#colorAov)" stroke="none" />
                    <Line 
                        type="monotone" 
                        dataKey="aov" 
                        stroke="#8B6F47" 
                        strokeWidth={2} 
                        dot={{ r: 3, fill: "#8B6F47", strokeWidth: 0 }} 
                        activeDot={{ r: 6 }}
                        animationDuration={2000}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
