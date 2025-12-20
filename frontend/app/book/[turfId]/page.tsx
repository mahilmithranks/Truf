'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Clock, IndianRupee, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Link from 'next/link';
import { Calendar } from '@/components/ui/calendar';

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
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [turf, setTurf] = useState<Turf | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
    const [selectedSport, setSelectedSport] = useState('');
    const [players, setPlayers] = useState(10);
    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        // Wait for auth to load before redirecting
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchTurfDetails();
    }, [isAuthenticated, authLoading]);

    useEffect(() => {
        if (selectedDate && turf) {
            fetchSlots();
        }
    }, [selectedDate, turf]);

    const fetchTurfDetails = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/turfs/${params.turfId}`);
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
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const dateStr = selectedDate.toISOString().split('T')[0];
            const response = await fetch(
                `${API_URL}/turfs/${params.turfId}/slots?date=${dateStr}`
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

    const handleSlotToggle = (slot: Slot) => {
        if (!slot.isAvailable) return;

        setSelectedSlots(prev => {
            const isSelected = prev.some(s => s.startTime === slot.startTime);
            if (isSelected) {
                return prev.filter(s => s.startTime !== slot.startTime);
            } else {
                return [...prev, slot];
            }
        });
    };

    const handleBooking = async () => {
        if (selectedSlots.length === 0 || !selectedSport) {
            toast.error('Please select at least one time slot and sport');
            return;
        }

        try {
            setBooking(true);

            // Calculate total amount
            const totalAmount = selectedSlots.reduce((sum, slot) => sum + (slot.price || turf?.pricePerHour || 0), 0);

            // Store booking data in session storage
            const bookingData = {
                turfId: params.turfId,
                turfName: turf?.name,
                date: selectedDate.toISOString().split('T')[0],
                slots: selectedSlots.map(slot => ({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    price: slot.price || turf?.pricePerHour
                })),
                sport: selectedSport,
                players: players,
                totalAmount: totalAmount
            };

            sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));

            // Redirect to payment page
            const currentPath = window.location.pathname;
            router.push(`/payment?returnTo=${encodeURIComponent(currentPath)}`);

        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Failed to proceed to payment');
        } finally {
            setBooking(false);
        }
    };

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
                                <CalendarIcon className="w-6 h-6" />
                                Select Date
                            </h3>
                            <div className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => date && setSelectedDate(date)}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    className="rounded-xl border border-zinc-800 bg-zinc-900"
                                    classNames={{
                                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                        month: "space-y-4",
                                        caption: "flex justify-center pt-1 relative items-center text-white",
                                        caption_label: "text-sm font-medium text-white",
                                        nav: "space-x-1 flex items-center",
                                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white border-zinc-700",
                                        nav_button_previous: "absolute left-1",
                                        nav_button_next: "absolute right-1",
                                        table: "w-full border-collapse space-y-1",
                                        head_row: "flex",
                                        head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                                        row: "flex w-full mt-2",
                                        cell: "h-9 w-9 text-center text-sm p-0 relative text-white",
                                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-zinc-800 rounded-lg transition-colors",
                                        day_selected: "bg-white text-black hover:bg-gray-100 font-semibold",
                                        day_today: "bg-zinc-800 text-white font-semibold",
                                        day_outside: "text-gray-600 opacity-50",
                                        day_disabled: "text-gray-600 opacity-30",
                                        day_hidden: "invisible",
                                    }}
                                />
                            </div>

                            {/* Selected Date Display */}
                            <div className="mt-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                                <div className="text-sm text-gray-400 mb-1">Selected Date:</div>
                                <div className="text-lg font-semibold text-white">
                                    {selectedDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
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
                                    {slots.map((slot) => {
                                        const isSelected = selectedSlots.some(s => s.startTime === slot.startTime);
                                        const canSelect = selectedSlots.length < 3 || isSelected;

                                        return (
                                            <button
                                                key={slot.startTime}
                                                onClick={() => {
                                                    if (!slot.isAvailable) return;
                                                    if (!canSelect && !isSelected) {
                                                        toast.error('Maximum 3 slots can be booked at once');
                                                        return;
                                                    }
                                                    handleSlotToggle(slot);
                                                }}
                                                disabled={!slot.isAvailable}
                                                className={`px-4 py-3 rounded-xl font-medium transition-all ${isSelected
                                                    ? 'bg-white text-black ring-2 ring-white'
                                                    : slot.isAvailable
                                                        ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                                                        : 'bg-zinc-900 text-gray-600 cursor-not-allowed'
                                                    }`}
                                            >
                                                <div className="text-sm">
                                                    {slot.startTime} - {slot.endTime}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-8">
                                    No slots available for this date
                                </p>
                            )}

                            {/* Warning for 3 slots */}
                            {selectedSlots.length === 3 && (
                                <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-yellow-500 mb-1">Maximum Slots Reached</p>
                                            <p className="text-xs text-yellow-200/80">
                                                You have selected 3 slots (maximum limit). Please note: <span className="font-semibold">No cancellation or refund</span> is available for bookings with 3 slots.
                                            </p>
                                        </div>
                                    </div>
                                </div>
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
                                        {selectedDate.toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="text-gray-300">
                                    <span className="block mb-2">Selected Slots:</span>
                                    {selectedSlots.length > 0 ? (
                                        <div className="space-y-1">
                                            {selectedSlots.map((slot, index) => (
                                                <div key={slot.startTime} className="text-white font-medium text-sm">
                                                    {index + 1}. {slot.startTime} - {slot.endTime}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-white font-medium">-</span>
                                    )}
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
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-300">Slots Selected:</span>
                                        <span className="text-white font-medium">{selectedSlots.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-300">Price per Slot:</span>
                                        <div className="flex items-center gap-1 text-white">
                                            <IndianRupee className="w-4 h-4" />
                                            <span className="font-medium">{turf?.pricePerHour || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-zinc-700">
                                        <span className="text-gray-300 font-semibold">Total Amount:</span>
                                        <div className="flex items-center gap-1 text-white">
                                            <IndianRupee className="w-5 h-5" />
                                            <span className="text-2xl font-bold">
                                                {selectedSlots.reduce((sum, slot) => sum + (slot.price || 0), 0) || (turf?.pricePerHour || 0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleBooking}
                                disabled={selectedSlots.length === 0 || !selectedSport || booking}
                                className="w-full py-6 text-base rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-500 bg-white text-black hover:bg-gray-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {booking ? 'Processing...' : `Confirm Booking (${selectedSlots.length} slot${selectedSlots.length !== 1 ? 's' : ''})`}
                            </Button>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                By booking, you agree to our{' '}
                                <Link
                                    href={`/terms?returnTo=${encodeURIComponent(window.location.pathname)}`}
                                    className="text-white hover:underline font-medium"
                                >
                                    terms and conditions
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
