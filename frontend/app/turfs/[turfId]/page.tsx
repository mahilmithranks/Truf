'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Calendar, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Turf {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    images: string[];
    amenities: string[];
    sports: string[];
    pricePerHour: number;
    rating: number;
    totalReviews: number;
    contactEmail?: string;
    contactPhone?: string;
}

export default function TurfDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const turfId = params.turfId as string;

    const [turf, setTurf] = useState<Turf | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (turfId) {
            fetchTurfDetails();
        }
    }, [turfId]);

    const fetchTurfDetails = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/turfs/${turfId}`);
            const data = await response.json();

            if (data.success) {
                setTurf(data.data);
            } else {
                toast.error('Failed to load turf details');
            }
        } catch (error) {
            console.error('Error fetching turf:', error);
            toast.error('Failed to load turf details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-zinc-900 rounded w-1/3"></div>
                        <div className="h-96 bg-zinc-900 rounded-2xl"></div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="h-64 bg-zinc-900 rounded-2xl"></div>
                            <div className="h-64 bg-zinc-900 rounded-2xl"></div>
                        </div>
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
                    <Button onClick={() => router.push('/turfs')} className="bg-white text-black hover:bg-gray-100">
                        Browse Turfs
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => router.push('/turfs')}
                    className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors animate-fade-in"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Turfs
                </button>

                <div className="mb-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{turf.name}</h1>
                            <div className="flex items-center gap-4 text-gray-400">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{turf.address}, {turf.city}, {turf.state}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-white font-semibold">{turf.rating}</span>
                                    <span>({turf.totalReviews} reviews)</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                            <div className="text-3xl font-bold text-white">₹{turf.pricePerHour}/hr</div>
                            <Button
                                onClick={() => router.push(`/book/${turfId}`)}
                                className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300"
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                Book Slots for this Turf
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mb-8 animate-slide-up">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="md:col-span-3 rounded-2xl overflow-hidden h-96">
                            <img
                                src={turf.images[selectedImage] || 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2340'}
                                alt={turf.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex md:flex-col gap-4">
                            {turf.images.slice(0, 3).map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`rounded-xl overflow-hidden h-28 md:h-auto md:flex-1 transition-all ${selectedImage === index ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <img src={image} alt={`${turf.name} ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                            <h2 className="text-2xl font-bold text-white mb-4">About this Turf</h2>
                            <p className="text-gray-300 leading-relaxed">{turf.description}</p>
                        </div>

                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
                            <h2 className="text-2xl font-bold text-white mb-4">Sports Available</h2>
                            <div className="flex flex-wrap gap-3">
                                {turf.sports.map((sport) => (
                                    <span key={sport} className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-colors">
                                        {sport}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
                            <h2 className="text-2xl font-bold text-white mb-4">Amenities</h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {turf.amenities.map((amenity) => (
                                    <div key={amenity} className="flex items-center gap-2 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-green-400" />
                                        </div>
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="sticky top-24 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
                            <h3 className="text-xl font-bold text-white mb-4">Ready to Play?</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Price per hour</span>
                                    <span className="text-2xl font-bold text-white">₹{turf.pricePerHour}</span>
                                </div>
                                <div className="border-t border-zinc-700 pt-4">
                                    <p className="text-sm text-gray-400 mb-4">
                                        Select your preferred date and time slot to book this turf
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => router.push(`/book/${turfId}`)}
                                className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-6 text-lg rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300"
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                Book Now
                            </Button>
                        </div>

                        {(turf.contactEmail || turf.contactPhone) && (
                            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
                                <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                    {turf.contactPhone && (
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">Phone</p>
                                            <a href={`tel:${turf.contactPhone}`} className="text-white hover:text-gray-300 transition-colors">
                                                {turf.contactPhone}
                                            </a>
                                        </div>
                                    )}
                                    {turf.contactEmail && (
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">Email</p>
                                            <a href={`mailto:${turf.contactEmail}`} className="text-white hover:text-gray-300 transition-colors break-all">
                                                {turf.contactEmail}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
