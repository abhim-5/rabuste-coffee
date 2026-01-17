// Stat Card Component for Admin Dashboard
'use client';

import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number; // percentage change
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    subtitle?: string;
    loading?: boolean;
}

export default function StatCard({
    title,
    value,
    change,
    icon: Icon,
    trend = 'neutral',
    subtitle,
    loading = false,
}: StatCardProps) {
    const getTrendColor = () => {
        if (trend === 'up') return 'text-green-600';
        if (trend === 'down') return 'text-red-600';
        return 'text-[#8B6F47]';
    };

    const getTrendBg = () => {
        if (trend === 'up') return 'bg-green-50';
        if (trend === 'down') return 'bg-red-50';
        return 'bg-[#FFF9EB]';
    };

    if (loading) {
        return (
            <div className="bg-[#FFF9EB] rounded-xl p-6 shadow-sm border border-[#8B6F47]/10">
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-8 w-3/4" />
            </div>
        );
    }

    return (
        <div className="bg-[#FFF9EB] rounded-xl p-6 shadow-sm border border-[#8B6F47]/10 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-[#8B6F47]">{title}</p>
                    {subtitle && (
                        <p className="text-xs text-[#8B6F47]/70 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${getTrendBg()}`}>
                    <Icon className={`w-5 h-5 ${getTrendColor()}`} />
                </div>
            </div>

            {/* Value */}
            <div className="mb-2">
                <p className="text-3xl font-bold text-[#7f3b2d]">{value}</p>
            </div>

            {/* Change/Trend */}
            {change !== undefined && (
                <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${getTrendColor()}`}>
                        {change > 0 ? '+' : ''}{change}%
                    </span>
                    <span className="text-sm text-[#8B6F47]/70">vs last period</span>
                </div>
            )}
        </div>
    );
}
