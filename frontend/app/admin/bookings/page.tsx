'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { PageLoader } from '@/components/LoadingSpinner';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Booking {
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
        phone: string;
    };
}

export default function AdminBookingsPage() {
    const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        paymentStatus: '',
        startDate: '',
        endDate: '',
    });

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
        fetchBookings();
    }, [isAuthenticated, isAdmin, authLoading, router]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/bookings');
            setBookings(response.data.data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking? The user will be notified.')) {
            return;
        }

        try {
            await api.patch(`/bookings/${bookingId}/cancel`);
            fetchBookings();
            alert('Booking cancelled successfully');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (authLoading || !isAuthenticated || !isAdmin) {
        return <PageLoader />;
    }

    const filteredBookings = bookings.filter((booking) => {
        if (filters.status && booking.status !== filters.status) return false;
        if (filters.paymentStatus && booking.paymentStatus !== filters.paymentStatus) return false;
        if (filters.startDate && new Date(booking.slot.date) < new Date(filters.startDate)) return false;
        if (filters.endDate && new Date(booking.slot.date) > new Date(filters.endDate)) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
                    <p className="text-gray-600 mt-2">View and manage all bookings</p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="paymentStatus">Payment Status</Label>
                                <select
                                    id="paymentStatus"
                                    value={filters.paymentStatus}
                                    onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="FAILED">Failed</option>
                                    <option value="REFUNDED">Refunded</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setFilters({ status: '', paymentStatus: '', startDate: '', endDate: '' })}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Bookings Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{booking.user.name}</div>
                                                    <div className="text-sm text-gray-500">{booking.user.email}</div>
                                                    <div className="text-sm text-gray-500">{booking.user.phone}</div>
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
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                            'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                    booking.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        booking.paymentStatus === 'REFUNDED' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {booking.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {booking.status === 'CONFIRMED' && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm text-gray-600">Total Bookings</div>
                            <div className="text-2xl font-bold">{filteredBookings.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm text-gray-600">Confirmed</div>
                            <div className="text-2xl font-bold text-green-600">
                                {filteredBookings.filter((b) => b.status === 'CONFIRMED').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm text-gray-600">Cancelled</div>
                            <div className="text-2xl font-bold text-red-600">
                                {filteredBookings.filter((b) => b.status === 'CANCELLED').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm text-gray-600">Total Revenue</div>
                            <div className="text-2xl font-bold text-blue-600">
                                {formatCurrency(
                                    filteredBookings
                                        .filter((b) => b.paymentStatus === 'COMPLETED')
                                        .reduce((sum, b) => sum + b.totalAmount, 0)
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
