import React from 'react';
import { formatDate, formatTime, formatCurrency, getStatusColor, getPaymentStatusColor } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface BookingCardProps {
    booking: Booking;
    onCancel?: (bookingId: string) => void;
    showActions?: boolean;
}

export default function BookingCard({ booking, onCancel, showActions = true }: BookingCardProps) {
    const canCancel = booking.status === 'CONFIRMED' && booking.paymentStatus === 'COMPLETED';
    const slotDate = new Date(booking.slot.date);
    const isPast = slotDate < new Date();

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                        {formatDate(booking.slot.date)}
                    </CardTitle>
                    <div className="flex flex-col gap-1 items-end">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Time</span>
                        <span className="font-medium">
                            {formatTime(booking.slot.startTime)} - {formatTime(booking.slot.endTime)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Amount</span>
                        <span className="font-semibold text-green-600">
                            {formatCurrency(booking.totalAmount)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Booking ID</span>
                        <span className="text-xs font-mono text-gray-500">
                            {booking.id.slice(0, 8)}...
                        </span>
                    </div>

                    {showActions && canCancel && !isPast && (
                        <div className="pt-3 border-t mt-3">
                            <button
                                onClick={() => onCancel?.(booking.id)}
                                className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                            >
                                Cancel Booking
                            </button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
