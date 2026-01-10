'use client';

import { useState, useEffect, useRef } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface RevenueChartProps {
    data: any[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Zoom Domain State
    const [domain, setDomain] = useState<{ start: number; end: number } | null>(null);
    const domainRef = useRef<{ start: number; end: number } | null>(null); // Ref to access state in listener without re-binding

    // Sync ref with state
    useEffect(() => {
        domainRef.current = domain;
    }, [domain]);
    
    // Pan State
    const [isDragging, setIsDragging] = useState(false);
    const [lastMouseX, setLastMouseX] = useState<number | null>(null);

    const [opacity, setOpacity] = useState({
        total: 1,
        orders: 1,
        art: 1,
        workshops: 1,
    });

    // Initialize domain
    useEffect(() => {
        if (data.length > 0) {
            const initDomain = { start: 0, end: data.length - 1 };
            setDomain(initDomain);
            domainRef.current = initDomain;
        }
    }, [data.length]);

    // Native Wheel Listener for robust scroll blocking (Active Listener)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleNativeWheel = (e: WheelEvent) => {
             // Check if target is inside the Legend, Tooltip, or Header
             const target = e.target as HTMLElement;
             if (target.closest('.recharts-legend-wrapper') || target.closest('.recharts-tooltip-wrapper') || target.closest('.chart-header')) {
                 return; // Allow page scroll
             }

             // CRITICAL: Always block page scroll if event happens inside this container
             e.preventDefault();
             e.stopImmediatePropagation(); // Ensure no other handlers see this

             const currentDomain = domainRef.current;
             if (!currentDomain || data.length === 0) return;

             // Dynamic speed: Scale with dataset size
             const VISIBLE_RANGE = currentDomain.end - currentDomain.start;
             const ZOOM_SPEED = Math.max(2, Math.ceil(VISIBLE_RANGE * 0.1)); // 10% of visible range per tick for snappier feel
             const direction = e.deltaY > 0 ? 1 : -1; // >0 Zoom Out, <0 Zoom In

             let newStart = currentDomain.start;
             let newEnd = currentDomain.end;

             if (direction < 0) {
                 // Zoom In
                 const minRange = 12; // Minimum 12 points (hours) visible
                 if (VISIBLE_RANGE <= minRange) return; // Prevent infinite zoom in

                 newStart = Math.min(currentDomain.start + ZOOM_SPEED, currentDomain.end - minRange); 
                 newEnd = Math.max(currentDomain.end - ZOOM_SPEED, currentDomain.start + minRange);
             } else {
                 // Zoom Out
                 if (newStart === 0 && newEnd === data.length - 1) return; // Already maxed out

                 newStart = Math.max(currentDomain.start - ZOOM_SPEED, 0);
                 newEnd = Math.min(currentDomain.end + ZOOM_SPEED, data.length - 1);
             }

             setDomain({ start: newStart, end: newEnd });
        };

        // { passive: false } is MANDATORY to allow preventDefault()
        container.addEventListener('wheel', handleNativeWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleNativeWheel);
        };
    }, [data.length]); // Only re-bind if data source changes entirely

    // Pan Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setLastMouseX(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !lastMouseX || !domain) return;
        
        const deltaX = e.clientX - lastMouseX;
        setLastMouseX(e.clientX);
        
        const PAN_SENSITIVITY = Math.max(1, Math.ceil((domain.end - domain.start) / 100)); // Dynamic sensitivity
        const shift = Math.round(deltaX * 0.5 * -1); // 0.5 factor

        if (shift === 0) return;

        let newStart = domain.start + shift;
        let newEnd = domain.end + shift;

        // Boundary Checks
        if (newStart < 0) {
            const diff = 0 - newStart;
            newStart += diff;
            newEnd += diff;
        }
        if (newEnd > data.length - 1) {
            const diff = newEnd - (data.length - 1);
            newStart -= diff;
            newEnd -= diff;
        }

        // Final safe clamp
        newStart = Math.max(0, newStart);
        newEnd = Math.min(data.length - 1, newEnd);
        
        setDomain({ start: newStart, end: newEnd });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setLastMouseX(null);
    };

    const toggleSeries = (dataKey: keyof typeof opacity) => {
        setOpacity(prev => ({ ...prev, [dataKey]: prev[dataKey] === 1 ? 0 : 1 }));
    };

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
            ref={containerRef}
            className={`bg-[#F9F5F1] rounded-2xl p-6 border border-[#4A3B28]/10 shadow-sm h-[500px] flex flex-col relative overflow-hidden group select-none transition-cursor duration-200 ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
            // React Events for Dragging
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="chart-header flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-display font-bold text-[#4A3B28]">Revenue Timeline</h3>
                    <p className="text-xs text-[#4A3B28]/60 font-sans mt-1">
                         <b>Zoom</b> out for Monthly view, zoom in for Hourly view.
                    </p>
                </div>
                {/* Scroll Indicator Icon */}
                <div className="flex items-center gap-1.5 text-[10px] text-[#4A3B28]/50 border border-[#4A3B28]/10 px-2 py-1 rounded-full bg-white/50">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
                    </svg>
                    <span>Scroll to Zoom</span>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={visibleData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#4A3B28" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#4A3B28" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B6F47" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8B6F47" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#4A3B28" strokeOpacity={0.05} vertical={false} />
                        
                        <XAxis 
                            dataKey="displayDate" 
                            stroke="#4A3B28" 
                            strokeOpacity={0.4} 
                            tick={{ fill: '#4A3B28', fontSize: 10, opacity: 0.6 }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={50}
                            tickFormatter={(value, index) => {
                                // Smart formatting based on VISIBLE RANGE
                                // value is "Jan 10, 5:00 PM"
                                
                                const rangeSize = visibleData.length; // How many hours are visible?

                                // 1. Deep Zoom (Hours/Minutes focus) - Less than 48 hours visible
                                if (rangeSize < 48) {
                                    return value.split(',')[1].trim(); // "5:00 PM"
                                }

                                // 2. Daily View - Less than 60 days (1440 hours) visible
                                if (rangeSize < 1440) {
                                    return value.split(',')[0]; // "Jan 10"
                                }

                                // 3. Monthly/Yearly View - Zoomed out maximally
                                const date = new Date(value);
                                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }); // "Jan '26"
                            }}
                        />
                        
                        <YAxis 
                            stroke="#4A3B28" 
                            strokeOpacity={0.4}
                            tick={{ fill: '#4A3B28', fontSize: 10, opacity: 0.6 }}
                            tickFormatter={(value) => `₹${value}`}
                            tickLine={false}
                            axisLine={false}
                        />
                        
                        {!isDragging && <Tooltip content={<CustomTooltip />} />}
                        
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
                            fill="url(#colorTotal)"
                            animationDuration={2500}
                             hide={!opacity.total}
                            isAnimationActive={false} // Disable inner re-animation on pan/zoom for performance
                        />
                        <Area
                            type="monotone"
                            dataKey="orders"
                            name="Orders"
                            stroke="#8B6F47"
                            strokeWidth={opacity.orders ? 2 : 0}
                            fillOpacity={1}
                            fill="url(#colorOrders)"
                            animationDuration={2500}
                             hide={!opacity.orders}
                            isAnimationActive={false}
                        />
                         <Area
                            type="monotone"
                            dataKey="art"
                            name="Art"
                            stroke="#D97706"
                            strokeWidth={opacity.art ? 2 : 0}
                            fill="none"
                            animationDuration={2500}
                             hide={!opacity.art}
                            isAnimationActive={false}
                        />
                         <Area
                            type="monotone"
                            dataKey="workshops"
                            name="Workshops"
                            stroke="#4B5563"
                            strokeWidth={opacity.workshops ? 2 : 0}
                            fill="none"
                            animationDuration={2500}
                             hide={!opacity.workshops}
                             isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
