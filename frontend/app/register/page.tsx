'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (formData.password.length < 6) {
            toast.error('Password too short', {
                description: 'Password must be at least 6 characters long.',
            });
            return;
        }

        if (!formData.email.includes('@')) {
            toast.error('Invalid email', {
                description: 'Please enter a valid email address.',
            });
            return;
        }

        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            };
            console.log('Registration payload:', payload);

            await register(payload);
            toast.success('Account created!', {
                description: 'Welcome to TurfBook. You can now start booking.',
            });
        } catch (err: any) {
            console.error('Registration error:', err);
            console.error('Error response:', err.response?.data);
            toast.error('Registration failed', {
                description: err.message || 'Please try again with different credentials.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Validation helpers
    const isPasswordValid = formData.password.length >= 6;
    const isEmailValid = formData.email.includes('@') && formData.email.includes('.');

    return (
        <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 animate-fade-in">
                {/* Logo */}
                <div className="text-center">
                    <Link href="/">
                        <img
                            src="/turfbook-logo-white.png"
                            alt="TurfBook"
                            className="h-25 mx-auto mb-8"
                        />
                    </Link>
                    <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400">Join thousands of players booking their favorite turfs</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <Label htmlFor="name" className="text-white">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-white/20"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="text-white">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-white/20"
                                placeholder="Enter your email"
                            />
                            {formData.email && !isEmailValid && (
                                <p className="text-red-400 text-sm mt-1">Please enter a valid email address</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <Label htmlFor="phone" className="text-white">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-white/20"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password" className="text-white">Password</Label>
                            <div className="relative mt-1">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-white/20 pr-10"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-1 flex-1 rounded ${formData.password.length >= 6 ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                    </div>
                                    <p className={`text-sm mt-1 ${isPasswordValid ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {isPasswordValid
                                            ? '✓ Password meets requirements'
                                            : `Password must be at least 6 characters (${formData.password.length}/6)`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 text-lg rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-500 bg-white text-black hover:bg-gray-100 font-semibold"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    {/* Login Link */}
                    <p className="text-center text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white hover:underline font-medium">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
