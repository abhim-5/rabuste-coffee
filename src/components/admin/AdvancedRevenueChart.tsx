'use client';

import { useState, useRef, useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine
} from 'recharts';

interface AdvancedRevenueChartProps {
    data: any[];
}

export default function AdvancedRevenueChart({ data }: AdvancedRevenueChartProps) {
    // State for zoom domain (startIndex, endIndex)
    // Initialize with full range
    const [domain, setDomain] = useState<{ start: number; end: number } | null>(null);
    const [opacity, setOpacity] = useState({
        total: 1,
        orders: 1,
        art: 1,
        workshops: 1,
    });

    // Initialize domain once data is loaded
    useEffect(() => {
        if (data.length > 0) {
            setDomain({ start: 0, end: data.length - 1 });
        }
    }, [data.length]); // Only update if data length changes drastically (e.g. initial load)

    const handleWheel = (e: React.WheelEvent) => {
        if (!domain || data.length === 0) return;

        e.preventDefault();
        e.stopPropagation();

        const ZOOM_SPEED = 2; // items to add/remove per scroll tick
        const direction = e.deltaY > 0 ? 1 : -1; // >0 is zoom out (scroll down), <0 is zoom in (scroll up)

        // Calculate new domain
        let newStart = domain.start;
        let newEnd = domain.end;

        if (direction < 0) {
            // Zoom In: Remove items from edges
            newStart = Math.min(domain.start + ZOOM_SPEED, domain.end - 5); // Keep at least 5 pts
            newEnd = Math.max(domain.end - ZOOM_SPEED, domain.start + 5);
        } else {
            // Zoom Out: Add items to edges
            newStart = Math.max(domain.start - ZOOM_SPEED, 0);
            newEnd = Math.min(domain.end + ZOOM_SPEED, data.length - 1);
        }

        setDomain({ start: newStart, end: newEnd });
    };

    const toggleSeries = (dataKey: keyof typeof opacity) => {
        setOpacity(prev => ({
            ...prev,
            [dataKey]: prev[dataKey] === 1 ? 0 : 1
        }));
    };

    // Slice data based on current zoom domain
    const visibleData = data && domain ? data.slice(domain.start, domain.end + 1) : data;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#F9F5F1] p-4 border border-[#8B6F47]/20 rounded-xl shadow-lg backdrop-blur-md bg-opacity-95 z-50">
                    <p className="font-serif font-bold text-[#4A3B28] mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        entry.value > 0 && (
                            <div key={index} className="flex items-center gap-2 text-xs mb-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="font-medium text-[#4A3B28]/70 capitalize">
                                    {entry.name === 'total' ? 'Total' : entry.name}:
                                </span>
                                <span className="font-bold text-[#4A3B28]">
                                    ₹{entry.value.toLocaleString()}
                                </span>
                            </div>
                        )
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div 
            className="bg-[#F9F5F1] rounded-2xl p-6 border border-[#4A3B28]/10 shadow-sm h-[500px] flex flex-col relative overflow-hidden group"
            onWheel={handleWheel} // Capture wheel events for zooming
        >
            <div className="flex items-center justify-between mb-4 pointer-events-none">
                <div>
                    <h3 className="text-xl font-display font-bold text-[#4A3B28]">Detailed Revenue Trends</h3>
                    <p className="text-xs text-[#4A3B28]/60 font-sans mt-1">
                        Use your mouse wheel to zoom in/out for detailed daily or monthly views.
                    </p>
                </div>
            </div>

            {/* Instruction Overlay */}
            <div className="absolute top-6 right-6 text-[10px] text-[#8B6F47] border border-[#8B6F47]/20 px-2 py-1 rounded bg-white/50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Try scrolling over chart 🖱️
            </div>

            <div className="flex-1 w-full min-h-0 cursor-crosshair">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={visibleData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="advColorTotal" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#4A3B28" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#4A3B28" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="advColorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B6F47" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8B6F47" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#4A3B28" strokeOpacity={0.05} vertical={false} />
                        
                        <XAxis 
                            dataKey="dateStr" 
                            stroke="#4A3B28" 
                            strokeOpacity={0.4} 
                            tick={{ fill: '#4A3B28', fontSize: 10, opacity: 0.6 }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        
                        <YAxis 
                            stroke="#4A3B28" 
                            strokeOpacity={0.4}
                            tick={{ fill: '#4A3B28', fontSize: 10, opacity: 0.6 }}
                            tickFormatter={(value) => `₹${value}`}
                            tickLine={false}
                            axisLine={false}
                        />
                        
                        <Tooltip content={<CustomTooltip />} />
                        
                        <Legend 
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="circle"
                            onClick={(e) => toggleSeries(e.dataKey as any)}
                        />

                        <Area
                            type="monotone"
                            dataKey="total"
                            name="Total"
                            stroke="#4A3B28"
                            strokeWidth={opacity.total ? 2 : 0}
                            fillOpacity={1}
                            fill="url(#advColorTotal)"
                            animationDuration={2500}
                            animationEasing="ease-in-out"
                            hide={!opacity.total}
                        />
                        <Area
                            type="monotone"
                            dataKey="orders"
                            name="Orders"
                            stroke="#8B6F47"
                            strokeWidth={opacity.orders ? 2 : 0}
                            fillOpacity={1}
                            fill="url(#advColorOrders)"
                            animationDuration={2500}
                            animationEasing="ease-in-out"
                            hide={!opacity.orders}
                        />
                         <Area
                            type="monotone"
                            dataKey="art"
                            name="Art"
                            stroke="#D97706"
                            strokeWidth={opacity.art ? 2 : 0}
                            fill="none"
                            animationDuration={2500}
                            animationEasing="ease-in-out"
                            hide={!opacity.art}
                        />
                         <Area
                            type="monotone"
                            dataKey="workshops"
                            name="Workshops"
                            stroke="#4B5563"
                            strokeWidth={opacity.workshops ? 2 : 0}
                            fill="none"
                            animationDuration={2500}
                            animationEasing="ease-in-out"
                            hide={!opacity.workshops}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
