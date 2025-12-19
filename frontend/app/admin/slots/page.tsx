'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { PageLoader } from '@/components/LoadingSpinner';
import { formatDate, formatTime } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Slot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    isBlocked: boolean;
    booking?: {
        id: string;
        user: {
            name: string;
            email: string;
        };
    };
}

export default function AdminSlotsPage() {
    const { isAdmin, isAuthenticated } = useAuth();
    const router = useRouter();
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState('');
    const [showGenerateModal, setShowGenerateModal] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (!isAdmin) {
            router.push('/');
            return;
        }
        fetchSlots();
    }, [isAuthenticated, isAdmin, router, filterDate]);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const params = filterDate ? `?date=${filterDate}` : '';
            const response = await api.get(`/slots${params}`);
            setSlots(response.data.data);
        } catch (err) {
            console.error('Error fetching slots:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockSlot = async (slotId: string, isBlocked: boolean) => {
        try {
            await api.patch(`/slots/${slotId}/block`, { isBlocked: !isBlocked });
            fetchSlots();
            alert(`Slot ${!isBlocked ? 'blocked' : 'unblocked'} successfully`);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update slot');
        }
    };

    const handleDeleteSlot = async (slotId: string) => {
        if (!confirm('Are you sure you want to delete this slot?')) return;

        try {
            await api.delete(`/slots/${slotId}`);
            fetchSlots();
            alert('Slot deleted successfully');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete slot');
        }
    };

    if (!isAuthenticated || !isAdmin) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Slot Management</h1>
                        <p className="text-gray-600 mt-2">Manage turf time slots</p>
                    </div>
                    <Button onClick={() => setShowGenerateModal(true)}>
                        Generate Slots
                    </Button>
                </div>

                {/* Filter */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Label htmlFor="filterDate">Filter by Date</Label>
                                <Input
                                    id="filterDate"
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" onClick={() => setFilterDate('')}>
                                Clear Filter
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Slots Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center">Loading...</td>
                                    </tr>
                                ) : slots.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                            No slots found
                                        </td>
                                    </tr>
                                ) : (
                                    slots.map((slot) => (
                                        <tr key={slot.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {formatDate(slot.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {slot.isBooked && (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                        Booked
                                                    </span>
                                                )}
                                                {slot.isBlocked && (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">
                                                        Blocked
                                                    </span>
                                                )}
                                                {!slot.isBooked && !slot.isBlocked && (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                        Available
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {slot.booking ? (
                                                    <div>
                                                        <div className="font-medium">{slot.booking.user.name}</div>
                                                        <div className="text-gray-500">{slot.booking.user.email}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                {!slot.isBooked && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant={slot.isBlocked ? 'default' : 'outline'}
                                                            onClick={() => handleBlockSlot(slot.id, slot.isBlocked)}
                                                        >
                                                            {slot.isBlocked ? 'Unblock' : 'Block'}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDeleteSlot(slot.id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Generate Slots Modal */}
                {showGenerateModal && (
                    <GenerateSlotsModal
                        onClose={() => setShowGenerateModal(false)}
                        onSuccess={() => {
                            setShowGenerateModal(false);
                            fetchSlots();
                        }}
                    />
                )}
            </div>
        </div>
    );
}

function GenerateSlotsModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        slots: [{ startTime: '09:00', endTime: '10:00' }],
    });
    const [loading, setLoading] = useState(false);

    const addTimeSlot = () => {
        setFormData({
            ...formData,
            slots: [...formData.slots, { startTime: '', endTime: '' }],
        });
    };

    const removeTimeSlot = (index: number) => {
        setFormData({
            ...formData,
            slots: formData.slots.filter((_, i) => i !== index),
        });
    };

    const updateTimeSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
        const newSlots = [...formData.slots];
        newSlots[index][field] = value;
        setFormData({ ...formData, slots: newSlots });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/slots/generate', {
                startDate: formData.startDate,
                endDate: formData.endDate,
                timeSlots: formData.slots,
            });
            alert('Slots generated successfully');
            onSuccess();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to generate slots');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <CardTitle>Generate Slots</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label>Time Slots</Label>
                                <Button type="button" size="sm" onClick={addTimeSlot}>
                                    Add Slot
                                </Button>
                            </div>
                            {formData.slots.map((slot, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        type="time"
                                        value={slot.startTime}
                                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                                        required
                                    />
                                    <Input
                                        type="time"
                                        value={slot.endTime}
                                        onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                                        required
                                    />
                                    {formData.slots.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeTimeSlot(index)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? 'Generating...' : 'Generate Slots'}
                            </Button>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
