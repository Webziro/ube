'use client';

import React from 'react';
import { useRideStore } from '@/store/useRideStore';
import { DollarSign, Power, CheckCircle, ShieldCheck, Activity } from 'lucide-react';

export default function EarningsWidget() {
    const { driverIsOnline, toggleDriverOnline, driverEarnings, driverCompletedTrips, status } =
        useRideStore();

    return (
        <div className="w-full bg-white border-t border-zinc-200 shadow-2xl p-5 flex flex-col gap-4">
            {/* Online Duty Switch Bar */}
            <div className="flex items-center justify-between bg-zinc-950 text-white p-4 rounded-xl border border-zinc-800 shadow-lg">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-3.5 h-3.5 rounded-full ${driverIsOnline ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
                            }`}
                    />
                    <div>
                        <div className="font-mono text-sm font-bold tracking-tight">
                            {driverIsOnline ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE'}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">
                            {driverIsOnline ? 'Receiving trip dispatches nearby' : 'Go online to accept rides'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={toggleDriverOnline}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all border ${driverIsOnline
                            ? 'bg-emerald-500 text-black border-emerald-400 hover:bg-emerald-400'
                            : 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700'
                        }`}
                >
                    <Power className="w-4 h-4" />
                    <span>{driverIsOnline ? 'GO OFFLINE' : 'GO ONLINE'}</span>
                </button>
            </div>

            {/* Driver Performance Ticker Grid */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex flex-col justify-between">
                    <div className="text-[10px] font-mono text-zinc-400 font-bold uppercase">
                        Today's Earnings
                    </div>
                    <div className="text-base font-mono font-black text-black mt-1">
                        ₦{driverEarnings.toLocaleString()}
                    </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex flex-col justify-between">
                    <div className="text-[10px] font-mono text-zinc-400 font-bold uppercase">
                        Completed Trips
                    </div>
                    <div className="text-base font-mono font-black text-black mt-1">
                        {driverCompletedTrips} Rides
                    </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex flex-col justify-between">
                    <div className="text-[10px] font-mono text-zinc-400 font-bold uppercase">
                        Acceptance Rate
                    </div>
                    <div className="text-base font-mono font-black text-emerald-600 mt-1">
                        98.4%
                    </div>
                </div>
            </div>
        </div>
    );
}
