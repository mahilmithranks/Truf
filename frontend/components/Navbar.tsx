'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, LayoutDashboard, Calendar, Settings, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const userNavLinks = [
        { href: '/turfs', label: 'Browse Turfs', icon: Calendar },
        { href: '/bookings', label: 'My Bookings', icon: FileText },
    ];

    const adminNavLinks = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/slots', label: 'Slots', icon: Calendar },
        { href: '/admin/bookings', label: 'Bookings', icon: FileText },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    const navLinks = isAdmin ? adminNavLinks : userNavLinks;

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-zinc-800/50 shadow-2xl shadow-black/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                href={isAuthenticated ? '/dashboard' : '/'}
                                className="flex items-center group transition-transform duration-300 hover:scale-105"
                            >
                                <img src="/turfbook-logo-white.png" alt="TurfBook" className="h-25 w-auto" />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-2">
                            {/* About Link - Always visible */}
                            <Link
                                href="/about"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/about')
                                    ? 'bg-white text-black shadow-md'
                                    : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                                    }`}
                            >
                                About
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    {navLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.href)
                                                    ? 'bg-white text-black shadow-md'
                                                    : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {link.label}
                                            </Link>
                                        );
                                    })}

                                    {/* User Menu */}
                                    <div className="ml-4 flex items-center gap-3 pl-4 border-l border-zinc-800">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-medium text-white">{user?.name}</span>
                                            <span className="text-xs text-gray-400">{user?.email}</span>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-200 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-md">
                    <div className="px-4 py-4 space-y-2">
                        {/* About Link - Always visible */}
                        <Link
                            href="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive('/about')
                                ? 'bg-white text-black'
                                : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                                }`}
                        >
                            About
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {/* User Info */}
                                <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg mb-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-semibold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{user?.name}</div>
                                        <div className="text-xs text-gray-400">{user?.email}</div>
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(link.href)
                                                ? 'bg-white text-black'
                                                : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {link.label}
                                        </Link>
                                    );
                                })}

                                {/* Logout Button */}
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors mt-4"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-sm font-medium bg-white text-black text-center shadow-md hover:bg-gray-200 transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
