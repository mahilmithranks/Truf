'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import { PageLoader } from '@/components/LoadingSpinner';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';

interface Stats {
    totalBookings: number;
    monthlyBookings: number;
    totalRevenue: number;
    monthlyRevenue: number;
    upcomingBookings: number;
    cancelledBookings: number;
    pendingPayments: number;
}

interface RecentBooking {
    id: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    slot: {
        date: string;
        startTime: string;
        endTime: string;
    };
    user: {
        name: string;
        email: string;
    };
}

export default function AdminDashboardPage() {
    const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for auth to load before redirecting
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!isAdmin) {
            router.push('/');
            return;
        }

        fetchDashboardData();
    }, [isAuthenticated, isAdmin, authLoading, router]);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, bookingsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/bookings/recent?limit=5'),
            ]);

            setStats(statsRes.data.data);
            setRecentBookings(bookingsRes.data.data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !isAuthenticated || !isAdmin) {
        return <PageLoader />;
    }

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Overview of your turf booking system</p>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Total Bookings"
                            value={stats.totalBookings}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            }
                            description="All time bookings"
                        />
                        <StatsCard
                            title="Monthly Bookings"
                            value={stats.monthlyBookings}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                            description="This month"
                        />
                        <StatsCard
                            title="Total Revenue"
                            value={formatCurrency(stats.totalRevenue)}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            description="All time revenue"
                            className="bg-gradient-to-br from-green-50 to-green-100"
                        />
                        <StatsCard
                            title="Monthly Revenue"
                            value={formatCurrency(stats.monthlyRevenue)}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            }
                            description="This month"
                            className="bg-gradient-to-br from-blue-50 to-blue-100"
                        />
                        <StatsCard
                            title="Upcoming Bookings"
                            value={stats.upcomingBookings}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            description="Future bookings"
                        />
                        <StatsCard
                            title="Cancelled Bookings"
                            value={stats.cancelledBookings}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            description="All time cancellations"
                            className="bg-gradient-to-br from-red-50 to-red-100"
                        />
                        <StatsCard
                            title="Pending Payments"
                            value={stats.pendingPayments}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            description="Awaiting payment"
                            className="bg-gradient-to-br from-yellow-50 to-yellow-100"
                        />
                    </div>
                )}

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                            No recent bookings
                                        </td>
                                    </tr>
                                ) : (
                                    recentBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{booking.user.name}</div>
                                                    <div className="text-sm text-gray-500">{booking.user.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(booking.slot.date)}</div>
                                                <div className="text-sm text-gray-500">
                                                    {formatTime(booking.slot.startTime)} - {formatTime(booking.slot.endTime)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(booking.totalAmount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                    booking.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        booking.paymentStatus === 'REFUNDED' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {booking.paymentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
