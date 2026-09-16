'use client';

import React, { useEffect } from 'react';
import { useRideStore } from '@/store/useRideStore';
import { apiService } from '@/services/api';
import { X, Radar, Shield } from 'lucide-react';

import { detectCityFromLocation } from '@/constants/pricing';

export default function SearchingOverlay() {
    const {
        pickup,
        dropoff,
        selectedTier,
        estimatedFare,
        cancelRide,
        status,
    } = useRideStore();

    const city = detectCityFromLocation(pickup);

    return (
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-xl flex flex-col items-center gap-6 w-full animate-in fade-in duration-300">
            {/* Radar Animation */}
            <div className="relative flex items-center justify-center w-28 h-28 my-2">
                <div className="absolute w-28 h-28 rounded-full bg-black/5 animate-ping" />
                <div className="absolute w-20 h-20 rounded-full bg-black/10 animate-pulse" />
                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-2xl z-10">
                    <Radar className="w-7 h-7 animate-spin text-white" />
                </div>
            </div>

            <div className="text-center space-y-1">
                <h3 className="text-xl font-black text-black tracking-tight">
                    Connecting to Nearby {selectedTier} Driver
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                    Dispatching request to nearest verified drivers in {city}...
                </p>
            </div>

            {/* Ride Summary Box */}
            <div className="w-full bg-zinc-50 border border-zinc-200/70 rounded-2xl p-4 text-xs flex flex-col gap-2.5">
                <div className="flex justify-between items-center border-b border-zinc-200/80 pb-2">
                    <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[11px]">Option</span>
                    <span className="font-bold text-black text-sm">{selectedTier}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-200/80 pb-2">
                    <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[11px]">Pickup</span>
                    <span className="font-bold text-black truncate max-w-[200px] text-right">{pickup.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-200/80 pb-2">
                    <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[11px]">Destination</span>
                    <span className="font-bold text-black truncate max-w-[200px] text-right">{dropoff.name}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[11px]">Estimated Fare</span>
                    <span className="font-black text-black text-base">₦{estimatedFare.toLocaleString()}</span>
                </div>
            </div>

            {/* Encrypted network security badge */}
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <Shield className="w-4 h-4 text-black shrink-0" />
                <span>End-to-end encrypted Ube dispatch network</span>
            </div>

            {/* Cancel Request Button */}
            <button
                onClick={async () => {
                    await apiService.cancelRide();
                }}
                className="w-full py-4 bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-300 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all mt-2 shadow-sm"
            >
                <X className="w-4 h-4" />
                <span>Cancel Request</span>
            </button>
        </div>
    );
}
