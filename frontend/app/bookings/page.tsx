'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { PageLoader } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Trophy, IndianRupee, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
    id: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    sport?: string;
    players?: number;
    orderId?: string;
    slot: {
        date: string;
        startTime: string;
        endTime: string;
    };
    turf: {
        name: string;
        address: string;
        city: string;
    };
}

export default function BookingsPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (isAuthenticated) {
            fetchBookings();
        }
    }, [isAuthenticated, authLoading, router]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/bookings/my-bookings');
            setBookings(response.data.data.bookings || []);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const handleCancelBooking = async () => {
        if (!selectedBooking) return;

        setCancelling(true);
        try {
            const response = await api.delete(`/bookings/${selectedBooking.id}`);

            // Show refund message if available
            if (response.data.refundMessage) {
                toast.success('Booking cancelled successfully', {
                    description: response.data.refundMessage
                });
            } else {
                toast.success('Booking cancelled successfully');
            }

            setShowCancelModal(false);
            setSelectedBooking(null);
            fetchBookings(); // Refresh bookings
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setCancelling(false);
        }
    };

    if (authLoading || loading) {
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
        <div className="min-h-screen bg-black text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
                    <p className="text-gray-400">View and manage your turf bookings</p>
                </div>

                {/* Filter Buttons */}
                <div className="mb-8 flex flex-wrap gap-3">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        className={filter === 'all' ? 'bg-white text-black hover:bg-gray-100' : 'border-zinc-700 text-white hover:bg-zinc-800'}
                    >
                        All Bookings
                    </Button>
                    <Button
                        variant={filter === 'upcoming' ? 'default' : 'outline'}
                        onClick={() => setFilter('upcoming')}
                        className={filter === 'upcoming' ? 'bg-white text-black hover:bg-gray-100' : 'border-zinc-700 text-white hover:bg-zinc-800'}
                    >
                        Upcoming
                    </Button>
                    <Button
                        variant={filter === 'past' ? 'default' : 'outline'}
                        onClick={() => setFilter('past')}
                        className={filter === 'past' ? 'bg-white text-black hover:bg-gray-100' : 'border-zinc-700 text-white hover:bg-zinc-800'}
                    >
                        Past
                    </Button>
                    <Button
                        variant={filter === 'cancelled' ? 'default' : 'outline'}
                        onClick={() => setFilter('cancelled')}
                        className={filter === 'cancelled' ? 'bg-white text-black hover:bg-gray-100' : 'border-zinc-700 text-white hover:bg-zinc-800'}
                    >
                        Cancelled
                    </Button>
                </div>

                {/* Bookings Grid */}
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-2xl">
                        <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No bookings found</h3>
                        <p className="text-gray-400 mb-6">
                            {filter === 'all'
                                ? "You haven't made any bookings yet."
                                : `No ${filter} bookings found.`}
                        </p>
                        <Button
                            onClick={() => router.push('/turfs')}
                            className="bg-white text-black hover:bg-gray-100"
                        >
                            Book a Slot
                        </Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-white transition-all duration-200 cursor-pointer"
                                onClick={() => booking.status !== 'CANCELLED' && handleCancelClick(booking)}
                            >
                                {/* Status Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'CONFIRMED' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                                        booking.status === 'CANCELLED' ? 'bg-red-900/30 text-red-400 border border-red-800' :
                                            'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                                        }`}>
                                        {booking.status}
                                    </span>
                                    {booking.orderId && (
                                        <span className="text-xs text-gray-500">#{booking.orderId}</span>
                                    )}
                                </div>

                                {/* Turf Info */}
                                <h3 className="text-xl font-bold text-white mb-2">{booking.turf?.name || 'Turf'}</h3>
                                <div className="flex items-start gap-2 text-gray-400 text-sm mb-4">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{booking.turf?.address}, {booking.turf?.city}</span>
                                </div>

                                {/* Booking Details */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-white">
                                            {new Date(booking.slot.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-white">{booking.slot.startTime} - {booking.slot.endTime}</span>
                                    </div>
                                    {booking.sport && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Trophy className="w-4 h-4 text-gray-400" />
                                            <span className="text-white">{booking.sport}</span>
                                        </div>
                                    )}
                                    {booking.players && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="text-white">{booking.players} Players</span>
                                        </div>
                                    )}
                                </div>

                                {/* Amount */}
                                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Total Amount</span>
                                    <div className="flex items-center gap-1 text-white font-bold text-lg">
                                        <IndianRupee className="w-4 h-4" />
                                        <span>{booking.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Booking Modal */}
            {showCancelModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Cancel Booking</h3>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Warning */}
                        <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-yellow-500 mb-1">Cancellation Policy</p>
                                    <p className="text-xs text-yellow-200/80">
                                        Cancellations made within 2 hours of booking are eligible for a 100% refund.
                                        Cancellations made after 2 hours will not receive any refund.
                                        Refunds will be processed within 5-7 business days.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="bg-zinc-800/50 rounded-xl p-4 mb-6 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Turf:</span>
                                <span className="text-white font-medium">{selectedBooking.turf?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Date:</span>
                                <span className="text-white font-medium">
                                    {new Date(selectedBooking.slot.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Time:</span>
                                <span className="text-white font-medium">
                                    {selectedBooking.slot.startTime} - {selectedBooking.slot.endTime}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Amount:</span>
                                <span className="text-white font-medium">₹{selectedBooking.totalAmount}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setShowCancelModal(false)}
                                variant="outline"
                                className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                            >
                                Keep Booking
                            </Button>
                            <Button
                                onClick={handleCancelBooking}
                                disabled={cancelling}
                                className="flex-1 bg-red-600 text-white hover:bg-red-700"
                            >
                                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
