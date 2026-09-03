'use client';

import React, { useEffect } from 'react';
import { useRideStore } from '@/store/useRideStore';
import { apiService } from '@/services/api';
import ProfileMenu from '@/components/Auth/ProfileMenu';
import AuthModal from '@/components/Auth/AuthModal';
import { User, Car, Columns, RotateCcw, FastForward, Radio } from 'lucide-react';

export default function Header() {
    const { activeRole, setRole, status, resetState, simSpeed, setSimSpeed, driverIsOnline } =
        useRideStore();

    useEffect(() => {
        // Initialize Real-Time SSE Gateway for cross-client stream syncing
        apiService.initRealtimeGateway();
    }, []);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-black text-white px-3 sm:px-4 flex items-center justify-between shadow-md border-b border-zinc-800">
                {/* Brand logo & role indicator */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <span className="font-mono text-xl font-black tracking-tighter text-white bg-white/10 px-2 py-0.5 border border-white/20">
                            UBE
                        </span>
                        <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 hidden lg:inline-block border-l border-zinc-700 pl-2">
                            Seamless Mobility
                        </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-xs">
                        <span
                            className={`w-2 h-2 rounded-full ${status === 'IDLE'
                                ? 'bg-emerald-500'
                                : status === 'SEARCHING'
                                    ? 'bg-amber-400 animate-ping'
                                    : status === 'COMPLETED'
                                        ? 'bg-blue-400'
                                        : 'bg-emerald-400 animate-pulse'
                                }`}
                        />
                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-300">
                            {status}
                        </span>
                    </div>

                    {/* Real-time Gateway Active Indicator */}
                    <div className="hidden xl:flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                        <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                        <span>STAGE 7 GATEWAY LIVE</span>
                    </div>
                </div>

                {/* Role, Profile & Controls */}
                <div className="flex items-center gap-2">
                    {/* Sim Speed Toggle */}
                    <div className="hidden md:flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5">
                        <FastForward className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-[10px] font-mono text-zinc-400">SPEED:</span>
                        {[1, 3, 5].map((speed) => (
                            <button
                                key={speed}
                                onClick={() => setSimSpeed(speed)}
                                className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${simSpeed === speed
                                    ? 'bg-white text-black font-bold'
                                    : 'text-zinc-400 hover:text-white'
                                    }`}
                            >
                                {speed}x
                            </button>
                        ))}
                    </div>

                    {/* View mode switcher tabs */}
                    <div className="flex bg-zinc-900 border border-zinc-800 rounded p-0.5">
                        <button
                            onClick={() => setRole('passenger')}
                            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-all ${activeRole === 'passenger'
                                ? 'bg-white text-black font-bold shadow-sm'
                                : 'text-zinc-400 hover:text-white'
                                }`}
                            title="Passenger Booking Screen"
                        >
                            <User className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Passenger</span>
                        </button>

                        <button
                            onClick={() => setRole('driver')}
                            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-all ${activeRole === 'driver'
                                ? 'bg-white text-black font-bold shadow-sm'
                                : 'text-zinc-400 hover:text-white'
                                }`}
                            title="Driver Dispatch App"
                        >
                            <Car className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Driver</span>
                            {driverIsOnline && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            )}
                        </button>

                        <button
                            onClick={() => setRole('split')}
                            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-all ${activeRole === 'split'
                                ? 'bg-white text-black font-bold shadow-sm'
                                : 'text-zinc-400 hover:text-white'
                                }`}
                            title="Dual View (Side-by-side simulation)"
                        >
                            <Columns className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Dual View</span>
                        </button>
                    </div>

                    {/* Profile & Auth Menu */}
                    <ProfileMenu />

                    {/* Reset State button */}
                    <button
                        onClick={resetState}
                        className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Reset Simulation State"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Global Auth Modal */}
            <AuthModal />
        </>
    );
}
