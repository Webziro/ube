'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRideStore } from '@/store/useRideStore';
import { User, Car, ShieldCheck, LogOut, RefreshCw, Star, ChevronDown, UserCheck } from 'lucide-react';

export default function ProfileMenu() {
    const { currentUser, isAuthenticated, logout, switchMockAccount, setAuthModalOpen } =
        useAuthStore();
    const { setRole } = useRideStore();
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
            <button
                onClick={() => setAuthModalOpen(true, 'login')}
                className="flex items-center gap-1.5 px-3 py-1 bg-white text-black font-mono text-xs font-bold hover:bg-zinc-200 transition-all border border-white"
            >
                <User className="w-3.5 h-3.5" />
                <span>SIGN IN</span>
            </button>
        );
    }

    const isDriver = currentUser.role === 'driver';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded transition-all text-left"
            >
                <div className="relative">
                    <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                    />
                    {currentUser.isVerified && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black flex items-center justify-center">
                            <span className="w-1 h-1 bg-white rounded-full" />
                        </span>
                    )}
                </div>

                <div className="hidden sm:block">
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white max-w-[90px] truncate leading-tight">
                            {currentUser.name}
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-zinc-800 text-zinc-300 px-1 py-0.2 rounded uppercase">
                            {isDriver ? 'DRV' : 'PAS'}
                        </span>
                    </div>
                </div>

                <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 text-white shadow-2xl z-50 p-2 font-mono">
                    {/* User Summary Header */}
                    <div className="p-2 bg-zinc-900 border-b border-zinc-800 mb-2">
                        <div className="flex items-center gap-2">
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                            />
                            <div>
                                <div className="text-xs font-bold text-white flex items-center gap-1">
                                    <span>{currentUser.name}</span>
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                </div>
                                <div className="text-[10px] text-zinc-400 truncate">{currentUser.email}</div>
                                <div className="flex items-center gap-2 text-[10px] text-amber-400 font-bold mt-0.5">
                                    <span className="flex items-center gap-0.5">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        {currentUser.rating.toFixed(2)}
                                    </span>
                                    <span className="text-zinc-500">•</span>
                                    <span className="text-zinc-400">{currentUser.totalTrips} Trips</span>
                                </div>
                            </div>
                        </div>

                        {/* Driver vehicle summary if driver */}
                        {isDriver && currentUser.vehicle && (
                            <div className="mt-2 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-300 flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <Car className="w-3 h-3 text-blue-400" />
                                    <span>{currentUser.vehicle.make} {currentUser.vehicle.model}</span>
                                </span>
                                <span className="bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded text-[9px]">
                                    {currentUser.vehicle.plate}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-1">
                        <button
                            onClick={() => {
                                const nextRole = isDriver ? 'passenger' : 'driver';
                                switchMockAccount(nextRole);
                                setRole(nextRole);
                                setDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between p-2 hover:bg-zinc-900 text-xs text-zinc-300 hover:text-white transition-colors text-left"
                        >
                            <span className="flex items-center gap-2">
                                <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                                <span>Switch to {isDriver ? 'Passenger' : 'Driver'} Demo</span>
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                setAuthModalOpen(true, 'register');
                                setDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between p-2 hover:bg-zinc-900 text-xs text-zinc-300 hover:text-white transition-colors text-left"
                        >
                            <span className="flex items-center gap-2">
                                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Register New Account</span>
                            </span>
                        </button>

                        <div className="border-t border-zinc-900 my-1" />

                        <button
                            onClick={() => {
                                logout();
                                setDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 p-2 hover:bg-red-950/40 text-xs text-red-400 transition-colors text-left font-bold"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out Session</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
