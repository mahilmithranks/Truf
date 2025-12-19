'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { mockPayment } from '@/lib/payment';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import SlotCard from '@/components/SlotCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { CalendarIcon, Clock, IndianRupee } from 'lucide-react';

interface Slot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    isBlocked: boolean;
}

interface TurfSettings {
    name: string;
    pricePerHour: number;
}

export default function BookPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [turfSettings, setTurfSettings] = useState<TurfSettings | null>(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        fetchTurfSettings();
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (selectedDate) {
            fetchSlots();
        }
    }, [selectedDate]);

    const fetchTurfSettings = async () => {
        try {
            const response = await api.get('/turf');
            setTurfSettings(response.data.data);
        } catch (err) {
            console.error('Error fetching turf settings:', err);
            toast.error('Failed to load turf settings');
        }
    };

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const response = await api.get(`/slots/available?date=${dateStr}`);
            setSlots(response.data.data);
            setSelectedSlot(null); // Reset selection when date changes
        } catch (err: any) {
            toast.error('Failed to fetch slots', {
                description: err.response?.data?.message || 'Please try again',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSlotSelect = (slotId: string) => {
        setSelectedSlot(slotId);
    };

    const handleBooking = async () => {
        if (!selectedSlot || !turfSettings) return;

        setProcessing(true);

        try {
            // Step 1: Create booking order
            const orderResponse = await api.post('/payment/create-order', {
                slotId: selectedSlot,
            });

            const { amount, bookingId } = orderResponse.data.data;

            // Step 2: Mock payment confirmation
            await mockPayment(
                amount,
                `Turf Booking - ${formatDate(selectedDate.toISOString().split('T')[0])}`,
                async (paymentId) => {
                    // Step 3: Verify payment
                    try {
                        await api.post('/payment/verify', {
                            paymentId: paymentId,
                            bookingId: bookingId,
                        });

                        toast.success('Booking confirmed!', {
                            description: 'Your slot has been successfully booked.',
                        });

                        // Redirect to success page
                        router.push('/payment/success?bookingId=' + bookingId);
                    } catch (err: any) {
                        toast.error('Payment verification failed', {
                            description: err.response?.data?.message || 'Please contact support',
                        });
                        setProcessing(false);
                    }
                },
                (error) => {
                    toast.error('Payment cancelled', {
                        description: error,
                    });
                    setProcessing(false);
                }
            );
        } catch (err: any) {
            toast.error('Booking failed', {
                description: err.response?.data?.message || 'Please try again',
            });
            setProcessing(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const selectedSlotData = slots.find((s) => s.id === selectedSlot);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Book Your Slot
                    </h1>
                    <p className="text-gray-600 text-lg">Select a date and available time slot to continue</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Date and Slots */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Calendar */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                                    Select Date
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => date && setSelectedDate(date)}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    className="rounded-md border-0"
                                />
                            </CardContent>
                        </Card>

                        {/* Available Slots */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    Available Slots - {formatDate(selectedDate.toISOString().split('T')[0])}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {loading ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {[...Array(6)].map((_, i) => (
                                            <Skeleton key={i} className="h-24 rounded-xl" />
                                        ))}
                                    </div>
                                ) : slots.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Clock className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 text-lg font-medium mb-2">No slots available</p>
                                        <p className="text-gray-500 text-sm">Please select a different date</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {slots.map((slot) => (
                                            <SlotCard
                                                key={slot.id}
                                                slot={slot}
                                                selected={selectedSlot === slot.id}
                                                onSelect={handleSlotSelect}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                            <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <CardTitle>Booking Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {selectedSlotData ? (
                                    <>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <CalendarIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-600 font-medium">Date</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {formatDate(selectedDate.toISOString().split('T')[0])}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-600 font-medium">Time</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {formatTime(selectedSlotData.startTime)} -{' '}
                                                        {formatTime(selectedSlotData.endTime)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Price per hour</span>
                                                <span className="font-semibold text-gray-900">
                                                    {turfSettings && formatCurrency(turfSettings.pricePerHour)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                                                <span>Total Amount</span>
                                                <span className="text-green-600 flex items-center gap-1">
                                                    <IndianRupee className="w-5 h-5" />
                                                    {turfSettings && turfSettings.pricePerHour}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleBooking}
                                            disabled={processing}
                                            className="w-full py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                                            {processing ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    <span>Processing...</span>
                                                </div>
                                            ) : (
                                                'Proceed to Payment'
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Clock className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 font-medium mb-2">No slot selected</p>
                                        <p className="text-gray-500 text-sm">Select a slot to continue</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
