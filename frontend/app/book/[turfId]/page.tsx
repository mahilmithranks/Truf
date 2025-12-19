'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, IndianRupee, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Link from 'next/link';

interface Turf {
    id: string;
    name: string;
    pricePerHour: number;
    city: string;
    sports: string[];
}

interface Slot {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    price: number;
}

export default function BookingPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [turf, setTurf] = useState<Turf | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [selectedSport, setSelectedSport] = useState('');
    const [players, setPlayers] = useState(10);
    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchTurfDetails();
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, [isAuthenticated]);

    useEffect(() => {
        if (selectedDate && turf) {
            fetchSlots();
        }
    }, [selectedDate, turf]);

    const fetchTurfDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/turfs/${params.turfId}`);
            const data = await response.json();

            if (data.success) {
                setTurf(data.data);
                if (data.data.sports.length > 0) {
                    setSelectedSport(data.data.sports[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching turf:', error);
            toast.error('Failed to load turf details');
        } finally {
            setLoading(false);
        }
    };

    const fetchSlots = async () => {
        try {
            setLoadingSlots(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/turfs/${params.turfId}/slots?date=${selectedDate}`
            );
            const data = await response.json();

            if (data.success) {
                setSlots(data.data.slots);
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            toast.error('Failed to load available slots');
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleBooking = async () => {
        if (!selectedSlot || !selectedSport) {
            toast.error('Please select a time slot and sport');
            return;
        }

        try {
            setBooking(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    turfId: params.turfId,
                    date: selectedDate,
                    startTime: selectedSlot.startTime,
                    endTime: selectedSlot.endTime,
                    sport: selectedSport,
                    players: players,
                    totalAmount: selectedSlot.price
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Booking created successfully!');
                router.push('/my-bookings');
            } else {
                toast.error(data.message || 'Booking failed');
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Failed to create booking');
        } finally {
            setBooking(false);
        }
    };

    // Get min date (today) and max date (30 days from now)
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (loading) {
        return (
            <div className="min-h-screen bg-black py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-zinc-900 rounded w-1/3"></div>
                        <div className="h-64 bg-zinc-900 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!turf) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Turf not found</h2>
                    <Link href="/turfs">
                        <Button className="bg-white text-black hover:bg-gray-100">
                            Browse Turfs
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href={`/turfs/${params.turfId}`}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 animate-fade-in"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Turf Details</span>
                </Link>

                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                        Book Your Slot
                    </h1>
                    <p className="text-xl text-gray-400">{turf.name}, {turf.city}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Booking Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Date Selection */}
                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 animate-slide-up">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-6 h-6" />
                                Select Date
                            </h3>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={today}
                                max={maxDate}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-white focus:ring-white/20 transition-colors"
                            />
                        </div>

                        {/* Sport Selection */}
                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Users className="w-6 h-6" />
                                Select Sport
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {turf.sports.map((sport) => (
                                    <button
                                        key={sport}
                                        onClick={() => setSelectedSport(sport)}
                                        className={`px-4 py-3 rounded-xl font-medium transition-all ${selectedSport === sport
                                                ? 'bg-white text-black'
                                                : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                            }`}
                                    >
                                        {sport}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Number of Players */}
                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Number of Players</h3>
                            <input
                                type="number"
                                value={players}
                                onChange={(e) => setPlayers(parseInt(e.target.value))}
                                min="1"
                                max="50"
                                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-white focus:ring-white/20 transition-colors"
                            />
                        </div>

                        {/* Time Slot Selection */}
                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Clock className="w-6 h-6" />
                                Select Time Slot
                            </h3>

                            {loadingSlots ? (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="h-16 bg-zinc-800 rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            ) : slots.length > 0 ? (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot.startTime}
                                            onClick={() => slot.isAvailable && setSelectedSlot(slot)}
                                            disabled={!slot.isAvailable}
                                            className={`px-4 py-3 rounded-xl font-medium transition-all ${selectedSlot?.startTime === slot.startTime
                                                    ? 'bg-white text-black ring-2 ring-white'
                                                    : slot.isAvailable
                                                        ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                                                        : 'bg-zinc-900 text-gray-600 cursor-not-allowed'
                                                }`}
                                        >
                                            {slot.startTime}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-8">
                                    No slots available for this date
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 glass">
                            <h3 className="text-xl font-bold text-white mb-4">Booking Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-300">
                                    <span>Turf:</span>
                                    <span className="text-white font-medium">{turf.name}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Date:</span>
                                    <span className="text-white font-medium">
                                        {selectedDate ? new Date(selectedDate).toLocaleDateString() : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Time:</span>
                                    <span className="text-white font-medium">
                                        {selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Sport:</span>
                                    <span className="text-white font-medium">{selectedSport || '-'}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Players:</span>
                                    <span className="text-white font-medium">{players}</span>
                                </div>
                            </div>

                            <div className="border-t border-zinc-800 pt-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300">Total Amount:</span>
                                    <div className="flex items-center gap-1 text-white">
                                        <IndianRupee className="w-5 h-5" />
                                        <span className="text-2xl font-bold">
                                            {selectedSlot ? selectedSlot.price : turf.pricePerHour}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleBooking}
                                disabled={!selectedSlot || !selectedSport || booking}
                                className="w-full h-12 text-lg rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-500 bg-white text-black hover:bg-gray-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {booking ? 'Processing...' : 'Confirm Booking'}
                            </Button>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                By booking, you agree to our terms and conditions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
