'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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

    const API_URL = 'http://localhost:5000';

    useEffect(() => {
        fetchTurfs();
    }, [selectedSport]);

    const fetchTurfs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedSport) params.append('sport', selectedSport);

            const response = await fetch(`${API_URL}/api/turfs/list?${params}`);
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

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-4 animate-slide-up">
                    {/* Sport Filter */}
                    <select
                        value={selectedSport}
                        onChange={(e) => setSelectedSport(e.target.value)}
                        className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-white focus:ring-white/20 transition-colors font-medium"
                    >
                        <option value="">All Sports</option>
                        {sports.map((sport) => (
                            <option key={sport} value={sport}>{sport}</option>
                        ))}
                    </select>

                    {/* Results Count */}
                    {!loading && (
                        <div className="flex items-center px-4 py-3 text-gray-400">
                            <span className="font-medium text-white">{turfs.length}</span>
                            <span className="ml-2">turfs available</span>
                        </div>
                    )}

                    {/* Clear Filter */}
                    {selectedSport && (
                        <button
                            onClick={() => setSelectedSport('')}
                            className="px-6 py-3 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-colors font-medium"
                        >
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
                                href={`/turfs/${turf.id}`}
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
                                                View Details →
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
                            {selectedSport ? `No turfs available for ${selectedSport}` : 'Try selecting a different sport or check back later'}
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
        </div>
    );
}
