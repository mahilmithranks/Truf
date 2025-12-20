```javascript
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone, Building2, Banknote, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

function PaymentPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo');

    const [bookingData, setBookingData] = useState<any>(null);
    const [processing, setProcessing] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);

    useEffect(() => {
        const data = sessionStorage.getItem('pendingBooking');
        if (data) {
            setBookingData(JSON.parse(data));
        } else {
            toast.error('No booking data found');
            router.push('/book');
        }
    }, [router]);

    const handlePaymentComplete = async () => {
        if (!bookingData) return;

        setProcessing(true);
        try {
            // Send booking confirmation to backend
            const response = await api.post('/bookings/confirm-payment', {
                turfId: bookingData.turfId,
                date: bookingData.date,
                slots: bookingData.slots,
                sport: bookingData.sport,
                players: bookingData.players,
                totalAmount: bookingData.totalAmount
            });

            if (response.data.success) {
                setPaymentComplete(true);
                sessionStorage.removeItem('pendingBooking');
                toast.success('Booking confirmed! Check your email for details.');

                // Redirect to bookings page after 2 seconds
                setTimeout(() => {
                    router.push('/bookings');
                }, 2000);
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (!bookingData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (paymentComplete) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                    <p className="text-gray-400 mb-4">
                        Your booking has been confirmed. A confirmation email has been sent to your registered email address.
                    </p>
                    <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href={returnUrl}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Booking</span>
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Payment Methods */}
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl font-bold mb-6">Complete Payment</h1>

                        <div className="space-y-4">
                            {/* UPI */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Smartphone className="w-6 h-6 text-white" />
                                    <h3 className="text-lg font-semibold">UPI</h3>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">Pay using Google Pay, PhonePe, Paytm, or any UPI app</p>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 bg-zinc-800 rounded text-xs">Google Pay</div>
                                    <div className="px-3 py-1 bg-zinc-800 rounded text-xs">PhonePe</div>
                                    <div className="px-3 py-1 bg-zinc-800 rounded text-xs">Paytm</div>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <CreditCard className="w-6 h-6 text-white" />
                                    <h3 className="text-lg font-semibold">Credit / Debit Cards</h3>
                                </div>
                                <p className="text-sm text-gray-400">Visa, Mastercard, RuPay, American Express</p>
                            </div>

                            {/* Net Banking */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Building2 className="w-6 h-6 text-white" />
                                    <h3 className="text-lg font-semibold">Net Banking</h3>
                                </div>
                                <p className="text-sm text-gray-400">All major banks supported</p>
                            </div>

                            {/* Cash */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Wallet className="w-6 h-6 text-white" />
                                    <h3 className="text-lg font-semibold">Cash on Arrival</h3>
                                </div>
                                <p className="text-sm text-gray-400">Pay at the turf when you arrive</p>
                            </div>
                        </div>

                        {/* Mock Payment Button */}
                        <div className="mt-8">
                            <Button
                                onClick={handlePaymentComplete}
                                disabled={processing}
                                className="w-full py-6 text-lg font-semibold rounded-xl bg-white text-black hover:bg-gray-100"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    'Payment Done'
                                )}
                            </Button>
                            <p className="text-xs text-gray-500 text-center mt-3">
                                This is a mock payment. Click to confirm your booking.
                            </p>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-4">Booking Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-400">Turf:</span>
                                    <p className="text-white font-medium">{bookingData.turfName}</p>
                                </div>

                                <div>
                                    <span className="text-gray-400">Date:</span>
                                    <p className="text-white font-medium">
                                        {new Date(bookingData.date).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-gray-400">Time Slots:</span>
                                    <div className="mt-1 space-y-1">
                                        {bookingData.slots.map((slot: any, index: number) => (
                                            <p key={index} className="text-white font-medium">
                                                {slot.startTime} - {slot.endTime}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-gray-400">Sport:</span>
                                    <p className="text-white font-medium">{bookingData.sport}</p>
                                </div>

                                <div>
                                    <span className="text-gray-400">Players:</span>
                                    <p className="text-white font-medium">{bookingData.players}</p>
                                </div>

                                <div className="pt-3 border-t border-zinc-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 font-semibold">Total Amount:</span>
                                        <span className="text-2xl font-bold text-white">₹{bookingData.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
