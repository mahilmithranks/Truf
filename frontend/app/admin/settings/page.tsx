'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { PageLoader } from '@/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TurfSettings {
    id: string;
    name: string;
    description: string;
    location: string;
    pricePerHour: number;
    contactEmail: string;
    contactPhone: string;
    openTime: string;
    closeTime: string;
    slotDuration: number;
    amenities: string[];
}

export default function AdminSettingsPage() {
    const { isAdmin, isAuthenticated } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<TurfSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newAmenity, setNewAmenity] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (!isAdmin) {
            router.push('/');
            return;
        }
        fetchSettings();
    }, [isAuthenticated, isAdmin, router]);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/turf');
            setSettings(response.data.data);
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        try {
            await api.put('/turf', settings);
            alert('Settings updated successfully');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof TurfSettings, value: any) => {
        if (!settings) return;
        setSettings({ ...settings, [field]: value });
    };

    const addAmenity = () => {
        if (!settings || !newAmenity.trim()) return;
        setSettings({
            ...settings,
            amenities: [...settings.amenities, newAmenity.trim()],
        });
        setNewAmenity('');
    };

    const removeAmenity = (index: number) => {
        if (!settings) return;
        setSettings({
            ...settings,
            amenities: settings.amenities.filter((_, i) => i !== index),
        });
    };

    if (!isAuthenticated || !isAdmin) {
        return <PageLoader />;
    }

    if (loading || !settings) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Turf Settings</h1>
                    <p className="text-gray-600 mt-2">Configure your turf details and pricing</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Turf Name</Label>
                                <Input
                                    id="name"
                                    value={settings.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={settings.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={settings.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing & Timing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Operating Hours</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="pricePerHour">Price per Hour (₹)</Label>
                                <Input
                                    id="pricePerHour"
                                    type="number"
                                    value={settings.pricePerHour}
                                    onChange={(e) => handleChange('pricePerHour', parseFloat(e.target.value))}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="openTime">Opening Time</Label>
                                    <Input
                                        id="openTime"
                                        type="time"
                                        value={settings.openTime}
                                        onChange={(e) => handleChange('openTime', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="closeTime">Closing Time</Label>
                                    <Input
                                        id="closeTime"
                                        type="time"
                                        value={settings.closeTime}
                                        onChange={(e) => handleChange('closeTime', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="slotDuration">Slot Duration (minutes)</Label>
                                <Input
                                    id="slotDuration"
                                    type="number"
                                    value={settings.slotDuration}
                                    onChange={(e) => handleChange('slotDuration', parseInt(e.target.value))}
                                    required
                                    min="15"
                                    step="15"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="contactEmail">Contact Email</Label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="contactPhone">Contact Phone</Label>
                                <Input
                                    id="contactPhone"
                                    type="tel"
                                    value={settings.contactPhone}
                                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Amenities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add amenity (e.g., Parking, Changing Room)"
                                    value={newAmenity}
                                    onChange={(e) => setNewAmenity(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                                />
                                <Button type="button" onClick={addAmenity}>
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {settings.amenities.map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                                    >
                                        <span>{amenity}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeAmenity(index)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving} size="lg">
                            {saving ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
