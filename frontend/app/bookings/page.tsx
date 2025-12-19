'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import BookingCard from '@/components/BookingCard';
import LoadingSpinner, { PageLoader } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';

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
}

export default function BookingsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        fetchBookings();
    }, [isAuthenticated, router]);

    const fetchBookings = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/bookings/my-bookings');
            setBookings(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await api.patch(`/bookings/${bookingId}/cancel`);
            // Refresh bookings
            fetchBookings();
            alert('Booking cancelled successfully');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (!isAuthenticated) {
        return <PageLoader />;
    }

    const filteredBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.slot.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (filter) {
            case 'upcoming':
                return bookingDate >= today && booking.status !== 'CANCELLED';
            case 'past':
                return bookingDate < today || booking.status === 'COMPLETED';
            case 'cancelled':
                return booking.status === 'CANCELLED';
            default:
                return true;
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                    <p className="text-gray-600 mt-2">View and manage your turf bookings</p>
                </div>

                {/* Filter Buttons */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                    >
                        All Bookings
                    </Button>
                    <Button
                        variant={filter === 'upcoming' ? 'default' : 'outline'}
                        onClick={() => setFilter('upcoming')}
                    >
                        Upcoming
                    </Button>
                    <Button
                        variant={filter === 'past' ? 'default' : 'outline'}
                        onClick={() => setFilter('past')}
                    >
                        Past
                    </Button>
                    <Button
                        variant={filter === 'cancelled' ? 'default' : 'outline'}
                        onClick={() => setFilter('cancelled')}
                    >
                        Cancelled
                    </Button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {loading ? (
                    <LoadingSpinner size="lg" className="py-12" />
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {filter === 'all'
                                ? 'You haven\'t made any bookings yet.'
                                : `No ${filter} bookings found.`}
                        </p>
                        <div className="mt-6">
                            <Button onClick={() => router.push('/book')}>Book a Slot</Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onCancel={handleCancelBooking}
                                showActions={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
