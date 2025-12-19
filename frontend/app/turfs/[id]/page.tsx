'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, IndianRupee, Clock, Users, CheckCircle, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface Turf {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    images: string[];
    amenities: string[];
    sports: string[];
    pricePerHour: number;
    rating: number;
    totalReviews: number;
    contactEmail?: string;
    contactPhone?: string;
    availability: {
        [key: string]: {
            open: string;
            close: string;
        };
    };
}

export default function TurfDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [turf, setTurf] = useState<Turf | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (params.id) {
            fetchTurfDetails();
        }
    }, [params.id]);

    const fetchTurfDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/turfs/${params.id}`);
            const data = await response.json();

            if (data.success) {
                setTurf(data.data);
            }
        } catch (error) {
            console.error('Error fetching turf details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        router.push(`/book/${params.id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-96 bg-zinc-900 rounded-2xl mb-8"></div>
                        <div className="h-8 bg-zinc-900 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-zinc-900 rounded w-1/3"></div>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/turfs"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 animate-fade-in"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Turfs</span>
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Images and Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="animate-scale-in">
                            <div className="relative h-96 bg-zinc-900 rounded-2xl overflow-hidden mb-4">
                                {turf.images && turf.images[selectedImage] ? (
                                    <img
                                        src={turf.images[selectedImage]}
                                        alt={turf.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Users className="w-24 h-24 text-zinc-700" />
                                    </div>
                                )}
                                {/* Rating Badge */}
                                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white font-bold text-lg">{turf.rating}</span>
                                    <span className="text-gray-300">({turf.totalReviews} reviews)</span>
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            {turf.images && turf.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {turf.images.slice(0, 4).map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative h-24 rounded-xl overflow-hidden transition-all ${selectedImage === index
                                                    ? 'ring-2 ring-white'
                                                    : 'opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${turf.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Turf Info */}
                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 animate-slide-up">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                {turf.name}
                            </h1>

                            <div className="flex items-center gap-2 text-gray-400 mb-6">
                                <MapPin className="w-5 h-5" />
                                <span className="text-lg">{turf.address}, {turf.city}, {turf.state} - {turf.pincode}</span>
                            </div>

                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                {turf.description}
                            </p>

                            {/* Sports Available */}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-3">Sports Available</h3>
                                <div className="flex flex-wrap gap-3">
                                    {turf.sports.map((sport) => (
                                        <span
                                            key={sport}
                                            className="px-4 py-2 bg-zinc-800 text-white rounded-xl font-medium"
                                        >
                                            {sport}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">Amenities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {turf.amenities.map((amenity) => (
                                        <div
                                            key={amenity}
                                            className="flex items-center gap-2 text-gray-300"
                                        >
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Operating Hours */}
                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Clock className="w-6 h-6" />
                                Operating Hours
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(turf.availability).map(([day, hours]) => (
                                    <div key={day} className="flex justify-between text-gray-300">
                                        <span className="capitalize font-medium">{day}:</span>
                                        <span>{hours.open} - {hours.close}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 animate-slide-up glass">
                            <div className="mb-6">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <IndianRupee className="w-6 h-6 text-white" />
                                    <span className="text-4xl font-bold text-white">{turf.pricePerHour}</span>
                                    <span className="text-gray-400 text-lg">/hour</span>
                                </div>
                                <p className="text-gray-400 text-sm">Competitive pricing for premium facilities</p>
                            </div>

                            <Button
                                onClick={handleBookNow}
                                className="w-full h-14 text-lg rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-500 bg-white text-black hover:bg-gray-100 font-semibold mb-4"
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                Book Now
                            </Button>

                            {!isAuthenticated && (
                                <p className="text-center text-sm text-gray-400">
                                    Please <Link href="/login" className="text-white hover:underline">login</Link> to book
                                </p>
                            )}

                            {/* Contact Info */}
                            {(turf.contactPhone || turf.contactEmail) && (
                                <div className="mt-6 pt-6 border-t border-zinc-800">
                                    <h4 className="text-white font-semibold mb-3">Contact Information</h4>
                                    {turf.contactPhone && (
                                        <p className="text-gray-300 text-sm mb-2">
                                            📞 {turf.contactPhone}
                                        </p>
                                    )}
                                    {turf.contactEmail && (
                                        <p className="text-gray-300 text-sm">
                                            ✉️ {turf.contactEmail}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
