'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!bookingId) {
            router.push('/');
            return;
        }

        // Countdown redirect
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/bookings');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [bookingId, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-600">
                        Payment Successful!
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-gray-600">
                        Your booking has been confirmed. A confirmation email has been sent to your registered email address.
                    </p>

                    {bookingId && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                            <p className="font-mono text-sm font-semibold">{bookingId}</p>
                        </div>
                    )}

                    <div className="pt-4 space-y-3">
                        <Link href="/bookings">
                            <Button className="w-full">View My Bookings</Button>
                        </Link>
                        <Link href="/book">
                            <Button variant="outline" className="w-full">
                                Book Another Slot
                            </Button>
                        </Link>
                    </div>

                    <p className="text-sm text-gray-500">
                        Redirecting to bookings in {countdown} seconds...
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
