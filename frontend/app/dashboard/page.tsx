'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Calendar, FileText, MapPin, TrendingUp, Clock, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { CalendarBooking } from '@/components/ui/calendar-booking';

interface DashboardStats {
    totalBookings: number;
    upcomingBookings: number;
    completedBookings: number;
}

export default function DashboardPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalBookings: 0,
        upcomingBookings: 0,
        completedBookings: 0,
    });
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        // Wait for auth to load before redirecting
        if (loading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        fetchDashboardStats();
    }, [isAuthenticated, loading, router]);

    const fetchDashboardStats = async () => {
        try {
            const response = await api.get('/bookings/my-bookings');
            // The API returns { success, count, data: { bookings, turfInfo } }
            const bookingsData = response.data.data.bookings || [];

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcoming = bookingsData.filter((b: any) => {
                const bookingDate = new Date(b.slot.date);
                return bookingDate >= today && b.status !== 'CANCELLED';
            }).length;

            const completed = bookingsData.filter((b: any) => b.status === 'COMPLETED').length;

            setStats({
                totalBookings: bookingsData.length,
                upcomingBookings: upcoming,
                completedBookings: completed,
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    if (loading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    const quickActions = [
        {
            icon: MapPin,
            title: 'Browse Turfs',
            description: 'Explore available turfs in your area',
            href: '/turfs',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: Calendar,
            title: 'Book a Slot',
            description: 'Reserve your favorite time slot',
            href: '/book',
            color: 'from-purple-500 to-purple-600',
        },
        {
            icon: FileText,
            title: 'My Bookings',
            description: 'View and manage your bookings',
            href: '/bookings',
            color: 'from-pink-500 to-pink-600',
        },
    ];

    const slogans = [
        "Your Game, Your Time, Your Turf",
        "Play More, Worry Less",
        "Book Smart, Play Hard",
        "Where Champions Book Their Game",
    ];

    const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-16">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
                            <Star className="w-4 h-4 fill-white text-white" />
                            <span>Welcome Back!</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-slide-up">
                            Hey, {user?.name?.split(' ')[0] || 'Champion'}! 👋
                        </h1>

                        <p className="text-2xl md:text-3xl text-gray-300 font-medium mb-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
                            {randomSlogan}
                        </p>

                        <p className="text-lg text-gray-400 animate-slide-up" style={{ animationDelay: '200ms' }}>
                            Ready to book your next game?
                        </p>
                    </div>

                    {/* Stats Cards */}
                    {!statsLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-scale-in" style={{ animationDelay: '300ms' }}>
                            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm font-medium">Total Bookings</span>
                                    <TrendingUp className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="text-4xl font-bold text-white">{stats.totalBookings}</div>
                                <p className="text-gray-500 text-sm mt-1">All time</p>
                            </div>

                            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm font-medium">Upcoming Games</span>
                                    <Clock className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="text-4xl font-bold text-white">{stats.upcomingBookings}</div>
                                <p className="text-gray-500 text-sm mt-1">Get ready to play!</p>
                            </div>

                            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm font-medium">Games Played</span>
                                    <Star className="w-5 h-5 text-pink-400" />
                                </div>
                                <div className="text-4xl font-bold text-white">{stats.completedBookings}</div>
                                <p className="text-gray-500 text-sm mt-1">Keep it up!</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-16 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Quick Actions
                        </h2>
                        <p className="text-xl text-gray-400">
                            What would you like to do today?
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className="group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 cursor-pointer h-full">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <action.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-gray-400 mb-4">{action.description}</p>
                                    <div className="flex items-center text-white font-medium group-hover:translate-x-2 transition-transform">
                                        Get Started
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Calendar Booking Widget */}
            <section className="py-16 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Quick Slot Booking
                        </h2>
                        <p className="text-xl text-gray-400">
                            Check availability and book your perfect time slot
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <CalendarBooking />
                    </div>
                </div>
            </section>

            {/* Motivational Section */}
            <section className="py-20 bg-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-12">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            "The only way to prove you're a good sport is to lose."
                        </h3>
                        <p className="text-gray-400 text-lg mb-8">
                            But with TurfBook, you'll have more chances to win! Book your next game and show them what you've got.
                        </p>
                        <Link href="/turfs">
                            <Button className="group px-10 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-500 bg-white text-black hover:bg-gray-100 font-semibold">
                                Book Your Next Game
                                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
