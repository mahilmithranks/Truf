'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            toast.success('Welcome back!', {
                description: 'You have successfully logged in.',
            });
        } catch (err: any) {
            toast.error('Login failed', {
                description: err.message || 'Please check your credentials and try again.',
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="animate-fade-in text-center">
                        <Link href="/" className="inline-block mb-6">
                            <img src="/turfbook-logo-white.png" alt="TurfBook" className="h-30 w-auto mx-auto" />
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Sign in to your account to continue booking
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-5 animate-slide-up" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div>
                            <Label htmlFor="email" className="text-white font-medium">
                                Email Address
                            </Label>
                            <div className="mt-2">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                    className="h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500 focus:border-white focus:ring-white/20"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <Label htmlFor="password" className="text-white font-medium">
                                Password
                            </Label>
                            <div className="mt-2 relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                    className="h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500 focus:border-white focus:ring-white/20 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 text-base font-semibold bg-white text-black hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <p className="text-center text-sm text-gray-400 mt-4">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-white hover:underline font-medium">
                                Create one
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
