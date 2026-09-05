'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRideStore } from '@/store/useRideStore';
import { useAuthStore } from '@/store/useAuthStore';
import { apiService } from '@/services/api';
import ProfileMenu from '@/components/Auth/ProfileMenu';
import AuthModal from '@/components/Auth/AuthModal';
import WalletModal from '@/components/Wallet/WalletModal';
import { Car, Globe, HelpCircle, ClipboardList, ChevronDown } from 'lucide-react';

export default function Header() {
    const router = useRouter();
    const { activeRole, setRole, resetState } = useRideStore();
    const { isAuthenticated, setAuthModalOpen } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
            fetch('/api/rides/active', { method: 'DELETE' }).catch(() => { });
            useRideStore.getState().resetState();
        }
        apiService.initRealtimeGateway();
    }, []);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white text-black px-4 lg:px-8 flex items-center justify-between border-b border-zinc-200 shadow-sm font-sans">
                {/* LEFT: Uber Brand & Standard Navigation Links */}
                <div className="flex items-center gap-8 h-full">
                    {/* Brand Logo */}
                    <Link
                        href="/"
                        onClick={() => {
                            if (!isAuthenticated) {
                                resetState();
                            }
                        }}
                        className="text-2xl font-black tracking-tight text-black hover:opacity-80 transition"
                    >
                        Uber
                    </Link>

                    {/* Navbar Links for Unauthenticated vs Authenticated */}
                    {!isAuthenticated ? (
                        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-800">
                            <Link href="/rider" className="hover:text-black transition-colors">
                                Ride
                            </Link>
                            <Link href="/driver" className="hover:text-black transition-colors">
                                Earn
                            </Link>
                            <a href="#business" className="hover:text-black transition-colors">
                                Business
                            </a>
                            <a href="#eats" className="hover:text-black transition-colors">
                                Uber Eats
                            </a>
                            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-black transition-colors">
                                <span>About</span>
                                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                            </div>
                        </nav>
                    ) : (
                        /* Authenticated Active Tabs (Matching Screenshot 1) */
                        <nav className="flex items-center gap-6 h-full">
                            <button
                                onClick={() => {
                                    setRole('passenger');
                                    router.push('/rider');
                                }}
                                className={`flex items-center gap-2 h-full border-b-2 font-bold text-sm transition-all px-1 ${activeRole === 'passenger'
                                        ? 'border-black text-black'
                                        : 'border-transparent text-zinc-500 hover:text-black'
                                    }`}
                            >
                                <Car className="w-4 h-4" />
                                <span>Ride</span>
                            </button>

                            <button
                                onClick={() => {
                                    setRole('driver');
                                    router.push('/driver');
                                }}
                                className={`flex items-center gap-2 h-full border-b-2 font-bold text-sm transition-all px-1 ${activeRole === 'driver'
                                        ? 'border-black text-black'
                                        : 'border-transparent text-zinc-500 hover:text-black'
                                    }`}
                            >
                                <span>Earn / Driver</span>
                            </button>
                        </nav>
                    )}
                </div>

                {/* RIGHT: EN, Help, Activity & Auth Profile */}
                <div className="flex items-center gap-3">
                    {!isAuthenticated ? (
                        <>
                            {/* Language Selector */}
                            <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 rounded-full transition">
                                <Globe className="w-4 h-4 text-zinc-500" />
                                <span>EN</span>
                            </button>

                            {/* Help Link */}
                            <button className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 rounded-full transition">
                                <HelpCircle className="w-4 h-4 text-zinc-500" />
                                <span>Help</span>
                            </button>

                            {/* Log in Button */}
                            <button
                                onClick={() => setAuthModalOpen(true, 'login', 'passenger')}
                                className="px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-100 rounded-full transition-colors"
                            >
                                Log in
                            </button>

                            {/* Sign up Button */}
                            <button
                                onClick={() => setAuthModalOpen(true, 'register', 'passenger')}
                                className="px-4 py-2 text-xs font-bold bg-black text-white hover:bg-zinc-800 rounded-full transition-colors shadow-sm"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        /* Authenticated Right Actions (Matching Screenshot 1) */
                        <div className="flex items-center gap-3">
                            {/* Activity Pill Button (Matching Screenshot 1 top-right) */}
                            <Link
                                href={activeRole === 'driver' ? '/driver/history' : '/rider/history'}
                                className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-black px-4 py-2 rounded-full text-xs font-bold transition-all"
                            >
                                <ClipboardList className="w-4 h-4 text-black" />
                                <span>Activity</span>
                            </Link>

                            {/* Profile Dropdown Menu */}
                            {mounted && <ProfileMenu />}
                        </div>
                    )}
                </div>
            </header>

            {/* Global Modals */}
            <AuthModal />
            <WalletModal />
        </>
    );
}
