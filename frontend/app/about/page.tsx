'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Footer } from '@/components/Footer';
import { CheckCircle, Clock, Shield, Zap, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleBrowseTurfs = () => {
        if (isAuthenticated) {
            router.push('/turfs');
        } else {
            router.push('/login');
        }
    };

    const features = [
        {
            icon: Clock,
            title: 'Instant Booking',
            description: 'Book your favorite turf in seconds with real-time availability and instant confirmation.',
        },
        {
            icon: Shield,
            title: 'Secure Payments',
            description: 'Safe and encrypted payment processing with multiple payment options for your convenience.',
        },
        {
            icon: CheckCircle,
            title: 'Email Confirmation',
            description: 'Receive instant booking confirmations and reminders directly to your email.',
        },
        {
            icon: Zap,
            title: '24/7 Support',
            description: 'Our dedicated support team is always ready to help you with any queries or issues.',
        },
    ];

    const steps = [
        {
            number: '01',
            title: 'Create Your Account',
            description: 'Sign up in seconds with just your email and start your journey with TurfBook.',
        },
        {
            number: '02',
            title: 'Browse & Select',
            description: 'Explore available turfs, filter by location and sport, and choose your perfect slot.',
        },
        {
            number: '03',
            title: 'Book & Play',
            description: 'Complete secure payment, get instant confirmation, and you\'re ready to play!',
        },
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6 animate-fade-in">
                        <Star className="w-4 h-4 fill-white text-white" />
                        <span>India's Premier Turf Booking Platform</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
                        About{' '}
                        <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                            TurfBook
                        </span>
                    </h1>

                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        We're revolutionizing the way sports enthusiasts book and play on premium turfs across India.
                        Simple, fast, and reliable - that's the TurfBook promise.
                    </p>
                </div>
            </section>

            {/* What is TurfBook */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                What is TurfBook?
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                TurfBook is your one-stop solution for booking sports turfs online. We connect sports
                                enthusiasts with premium turf facilities, making it easier than ever to organize your
                                game, whether it's cricket, football, basketball, or any other sport.
                            </p>
                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                Our platform eliminates the hassle of phone calls, waiting times, and uncertainty.
                                With real-time availability, instant confirmations, and secure payments, booking your
                                favorite turf has never been this simple.
                            </p>
                            <Button
                                onClick={handleBrowseTurfs}
                                className="group px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-500 bg-white text-black hover:bg-gray-100 font-semibold"
                            >
                                Explore Turfs
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 p-8 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl font-bold text-white mb-4">1000+</div>
                                    <div className="text-gray-400 text-xl">Happy Players</div>
                                    <div className="mt-8 text-6xl font-bold text-white mb-4">5000+</div>
                                    <div className="text-gray-400 text-xl">Bookings Made</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connection Lines */}
                        <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700"></div>

                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
                                    <div className="w-16 h-16 rounded-2xl bg-white text-black text-2xl font-bold flex items-center justify-center mb-6 shadow-lg">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                    <p className="text-gray-400">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Why Choose TurfBook?
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Experience the best turf booking platform with premium features
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-zinc-800 shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
                            <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                To make sports accessible to everyone by providing a seamless, reliable, and
                                user-friendly platform for booking sports turfs. We believe that playing sports
                                should be easy, fun, and hassle-free.
                            </p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
                            <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                To become India's most trusted and comprehensive sports booking platform, connecting
                                millions of sports enthusiasts with world-class facilities and creating a vibrant
                                community of players across the nation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_100%)]" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="glass p-12 rounded-3xl animate-scale-in">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Ready to Start Playing?
                        </h2>
                        <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Join thousands of players who trust TurfBook for their turf booking needs
                        </p>
                        <Button
                            onClick={handleBrowseTurfs}
                            size="lg"
                            className="group px-10 py-7 text-lg rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-500 bg-white text-black hover:bg-gray-100 font-semibold"
                        >
                            Browse Turfs
                            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
