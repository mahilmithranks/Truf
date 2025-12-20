'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { MapPin, Star, IndianRupee, Users } from 'lucide-react';

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
}

export default function TurfsPage() {
    const [turfs, setTurfs] = useState<Turf[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSport, setSelectedSport] = useState<string>('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';


    useEffect(() => {
        fetchTurfs();
    }, [selectedSport]);

    const fetchTurfs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            // Always filter by Bangalore
            params.append('city', 'Bangalore');
            if (selectedSport) params.append('sport', selectedSport);

            const response = await fetch(`${API_URL}/turfs/list?${params}`);
            const data = await response.json();

            if (data.success) {
                setTurfs(data.data);
            }
        } catch (error) {
            console.error('Error fetching turfs:', error);
        } finally {
            setLoading(false);
        }
    };

    const sports = ['Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis', 'Volleyball'];

    return (
        <div className="min-h-screen bg-black py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                        Browse Turfs in Bangalore
                    </h1>
                    <p className="text-xl text-gray-400">
                        Find the perfect turf for your next game
                    </p>
                </div>

                {/* Coming Soon Banner */}
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                            <span className="text-lg font-semibold text-white">
                                Currently available in Bangalore only
                            </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-300">
                            Coming soon to Mumbai, Delhi, Chennai & more cities! 🚀
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-4 animate-slide-up">
                    {/* Sport Filter */}
                    <div className="relative group">
                        <select
                            value={selectedSport}
                            onChange={(e) => setSelectedSport(e.target.value)}
                            className="appearance-none px-6 py-3 pr-12 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-300 font-medium cursor-pointer hover:bg-zinc-800 hover:border-zinc-700 min-w-[200px]"
                        >
                            <option value="" className="bg-zinc-900">🏆 All Sports</option>
                            <option value="Cricket" className="bg-zinc-900">🏏 Cricket</option>
                            <option value="Football" className="bg-zinc-900">⚽ Football</option>
                            <option value="Basketball" className="bg-zinc-900">🏀 Basketball</option>
                            <option value="Badminton" className="bg-zinc-900">🏸 Badminton</option>
                            <option value="Tennis" className="bg-zinc-900">🎾 Tennis</option>
                            <option value="Volleyball" className="bg-zinc-900">🏐 Volleyball</option>
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Results Count */}
                    {!loading && (
                        <div className="flex items-center px-6 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-gray-400">
                            <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium text-white">{turfs.length}</span>
                            <span className="ml-2">turfs in Bangalore</span>
                        </div>
                    )}

                    {/* Clear Filter */}
                    {selectedSport && (
                        <button
                            onClick={() => setSelectedSport('')}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 font-medium group"
                        >
                            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear Filter
                        </button>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-zinc-900 rounded-2xl p-6 animate-pulse">
                                <div className="h-48 bg-zinc-800 rounded-xl mb-4"></div>
                                <div className="h-6 bg-zinc-800 rounded mb-2"></div>
                                <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Turfs Grid */}
                {!loading && turfs.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {turfs.map((turf, index) => (
                            <Link
                                key={turf.id}
                                href={`/book/${turf.id}`}
                                className="group animate-scale-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-white/10">
                                    {/* Image */}
                                    <div className="relative h-48 bg-zinc-800 overflow-hidden">
                                        {turf.images && turf.images[0] ? (
                                            <img
                                                src={turf.images[0]}
                                                alt={turf.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <img
                                                src="https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2340&auto=format&fit=crop"
                                                alt="Sports turf"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        )}
                                        {/* Rating Badge */}
                                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span className="text-white font-semibold">{turf.rating}</span>
                                            <span className="text-gray-400 text-sm">({turf.totalReviews})</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors">
                                            {turf.name}
                                        </h3>

                                        <div className="flex items-center gap-2 text-gray-400 mb-3">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm">{turf.city}, {turf.state}</span>
                                        </div>

                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {turf.description}
                                        </p>

                                        {/* Sports Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {turf.sports.slice(0, 3).map((sport) => (
                                                <span
                                                    key={sport}
                                                    className="px-3 py-1 bg-zinc-800 text-white text-xs rounded-full"
                                                >
                                                    {sport}
                                                </span>
                                            ))}
                                            {turf.sports.length > 3 && (
                                                <span className="px-3 py-1 bg-zinc-800 text-gray-400 text-xs rounded-full">
                                                    +{turf.sports.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                                            <div className="flex items-center gap-1 text-white font-bold text-lg">
                                                <IndianRupee className="w-5 h-5" />
                                                <span>{turf.pricePerHour}</span>
                                                <span className="text-gray-400 text-sm font-normal">/hour</span>
                                            </div>
                                            <span className="text-white font-medium group-hover:translate-x-1 transition-transform">
                                                Book Now →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && turfs.length === 0 && (
                    <div className="text-center py-16">
                        <Users className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No turfs found</h3>
                        <p className="text-gray-400 mb-6">
                            {selectedSport
                                ? `No turfs available in Bangalore for ${selectedSport}`
                                : 'No turfs available at the moment'}
                        </p>
                        {selectedSport && (
                            <button
                                onClick={() => setSelectedSport('')}
                                className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                            >
                                View All Turfs
                            </button>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
