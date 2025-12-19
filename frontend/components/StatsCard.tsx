import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    className?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export default function StatsCard({
    title,
    value,
    icon,
    description,
    className,
    trend,
}: StatsCardProps) {
    return (
        <div
            className={cn(
                'group relative p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden',
                className
            )}>
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 group-hover:scale-110 transition-transform duration-300">
                        <div className="text-blue-600">{icon}</div>
                    </div>
                    {trend && (
                        <div
                            className={cn(
                                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                                trend.isPositive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            )}>
                            {trend.isPositive ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {Math.abs(trend.value)}%
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {value}
                    </p>
                    {description && (
                        <p className="text-xs text-gray-500 mt-2">{description}</p>
                    )}
                </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        </div>
    );
}
