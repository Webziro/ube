'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useRideStore } from '@/store/useRideStore';
import { useWalletStore } from '@/store/useWalletStore';
import {
    User,
    HelpCircle,
    Wallet as WalletIcon,
    ClipboardList,
    Tag,
    Info,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

export default function ProfileMenu() {
    const { currentUser, isAuthenticated, logout, setAuthModalOpen } = useAuthStore();
    const { activeRole } = useRideStore();
    const { balance, setWalletModalOpen } = useWalletStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isAuthenticated || !currentUser) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setAuthModalOpen(true, 'login')}
                    className="px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-100 rounded-full transition-colors"
                >
                    Log in
                </button>
                <button
                    onClick={() => setAuthModalOpen(true, 'register')}
                    className="px-4 py-2 text-xs font-bold bg-black text-white hover:bg-zinc-800 rounded-full transition-colors shadow-sm"
                >
                    Sign up
                </button>
            </div>
        );
    }

    const isDriver = activeRole === 'driver' || currentUser.role === 'driver';

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Header Avatar Button with Chevron (Matching Screenshot 1 top-right) */}
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-zinc-100 transition-all"
            >
                <div className="w-9 h-9 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center overflow-hidden border border-zinc-300">
                    {currentUser.avatar ? (
                        <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-5 h-5 text-zinc-500" />
                    )}
                </div>
                {dropdownOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-black font-bold" />
                ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-black font-bold" />
                )}
            </button>

            {/* Dropdown Menu Popup (Matching Screenshot 2 Pixel-Perfect) */}
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-[340px] bg-white border border-zinc-200 text-black shadow-2xl rounded-2xl p-5 z-50 font-sans animate-in fade-in zoom-in-95 duration-150">
                    {/* Top Row: User Name & Avatar */}
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                        <div className="space-y-0.5">
                            <h3 className="text-2xl font-bold text-black tracking-tight leading-tight">
                                {currentUser.name || 'Stanley Ama'}
                            </h3>
                            <span className="text-xs text-zinc-500 font-medium">
                                {isDriver ? 'Partner Driver' : 'Rider Account'}
                            </span>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-zinc-200 text-zinc-400 flex items-center justify-center overflow-hidden border border-zinc-300">
                            {currentUser.avatar ? (
                                <img
                                    src={currentUser.avatar}
                                    alt={currentUser.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-8 h-8 text-zinc-400" />
                            )}
                        </div>
                    </div>

                    {/* Quick Action Tiles (3 Column Grid matching Screenshot 2) */}
                    <div className="grid grid-cols-3 gap-2.5 my-4">
                        <button
                            onClick={() => {
                                setDropdownOpen(false);
                                alert('Uber Help Center');
                            }}
                            className="bg-zinc-100 hover:bg-zinc-200 rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 transition text-black font-bold text-xs"
                        >
                            <HelpCircle className="w-5 h-5 text-black" />
                            <span>Help</span>
                        </button>

                        <button
                            onClick={() => {
                                setDropdownOpen(false);
                                setWalletModalOpen(true);
                            }}
                            className="bg-zinc-100 hover:bg-zinc-200 rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 transition text-black font-bold text-xs"
                        >
                            <WalletIcon className="w-5 h-5 text-black" />
                            <span>Wallet</span>
                        </button>

                        <Link
                            href={isDriver ? '/driver/history' : '/rider/history'}
                            onClick={() => setDropdownOpen(false)}
                            className="bg-zinc-100 hover:bg-zinc-200 rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 transition text-black font-bold text-xs"
                        >
                            <ClipboardList className="w-5 h-5 text-black" />
                            <span>Activity</span>
                        </Link>
                    </div>

                    {/* Uber Cash Balance Card (Matching Screenshot 2) */}
                    <div
                        onClick={() => {
                            setDropdownOpen(false);
                            setWalletModalOpen(true);
                        }}
                        className="bg-zinc-100 hover:bg-zinc-200/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition my-3"
                    >
                        <span className="text-sm font-semibold text-black">Uber Cash</span>
                        <span className="text-base font-bold text-black">
                            NGN {balance.toFixed(2)}
                        </span>
                    </div>

                    {/* Navigation List Items (Matching Screenshot 2) */}
                    <div className="space-y-1 pt-1 border-t border-zinc-100">
                        <div
                            onClick={() => {
                                setDropdownOpen(false);
                                alert('Manage Account settings');
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-xl text-sm font-semibold text-black cursor-pointer transition"
                        >
                            <User className="w-4 h-4 text-black" />
                            <span>Manage account</span>
                        </div>

                        <div
                            onClick={() => {
                                setDropdownOpen(false);
                                alert('Promotions & Discounts');
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-xl text-sm font-semibold text-black cursor-pointer transition"
                        >
                            <Tag className="w-4 h-4 text-black" />
                            <span>Promotions</span>
                        </div>

                        <div
                            onClick={() => {
                                setDropdownOpen(false);
                                alert('Legal & Privacy Information');
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-xl text-sm font-semibold text-black cursor-pointer transition"
                        >
                            <Info className="w-4 h-4 text-black" />
                            <span>Legal</span>
                        </div>
                    </div>

                    {/* Sign out Button (Matching Screenshot 2) */}
                    <button
                        onClick={async () => {
                            try {
                                await fetch('/api/rides/active', { method: 'DELETE' });
                            } catch (e) { }
                            useRideStore.getState().resetState();
                            logout();
                            setDropdownOpen(false);
                        }}
                        className="w-full py-3 mt-3 bg-zinc-100 hover:bg-zinc-200 text-red-600 font-bold text-sm rounded-xl transition text-center"
                    >
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}
