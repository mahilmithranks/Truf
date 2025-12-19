'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentFailurePage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-600">
                        Payment Failed
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-gray-600">
                        Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-left">
                        <p className="text-sm font-semibold text-yellow-800 mb-2">Common Issues:</p>
                        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                            <li>Insufficient balance</li>
                            <li>Card declined by bank</li>
                            <li>Network connectivity issues</li>
                            <li>Incorrect card details</li>
                        </ul>
                    </div>

                    <div className="pt-4 space-y-3">
                        <Link href="/book">
                            <Button className="w-full">Try Again</Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="w-full">
                                Back to Home
                            </Button>
                        </Link>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600">Need help?</p>
                        <p className="text-sm text-gray-500">
                            Contact us at{' '}
                            <a href="mailto:support@turfbook.com" className="text-blue-600 hover:underline">
                                support@turfbook.com
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
