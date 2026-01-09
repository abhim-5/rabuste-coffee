// Stat Card Component for Admin Dashboard
'use client';

import { LucideIcon } from 'lucide-react';

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
        return 'text-gray-600';
    };

    const getTrendBg = () => {
        if (trend === 'up') return 'bg-green-50';
        if (trend === 'down') return 'bg-red-50';
        return 'bg-gray-50';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${getTrendBg()}`}>
                    <Icon className={`w-5 h-5 ${getTrendColor()}`} />
                </div>
            </div>

            {/* Value */}
            <div className="mb-2">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>

            {/* Change/Trend */}
            {change !== undefined && (
                <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${getTrendColor()}`}>
                        {change > 0 ? '+' : ''}{change}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                </div>
            )}
        </div>
    );
}
