'use client';

import React, { useEffect } from 'react';
import { useRideStore } from '@/store/useRideStore';
import { X, Radar, Shield } from 'lucide-react';

export default function SearchingOverlay() {
    const {
        pickup,
        dropoff,
        selectedTier,
        estimatedFare,
        cancelRide,
        searchTimer,
        status,
        acceptDispatch,
    } = useRideStore();

    // Auto dispatch simulation after 3 seconds if in SEARCHING state to automatically show driver matching flow
    useEffect(() => {
        if (status === 'SEARCHING') {
            const timer = setTimeout(() => {
                acceptDispatch();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [status, acceptDispatch]);

    return (
        <div className="w-full bg-white border-t border-zinc-200 shadow-2xl p-6 flex flex-col items-center gap-6">
            {/* Radar Animation */}
            <div className="relative flex items-center justify-center w-24 h-24 my-2">
                <div className="absolute w-24 h-24 rounded-full bg-black/5 animate-radar" />
                <div className="absolute w-16 h-16 rounded-full bg-black/10 animate-ping" />
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-xl z-10">
                    <Radar className="w-6 h-6 animate-spin text-white" />
                </div>
            </div>

            <div className="text-center">
                <h3 className="font-mono text-lg font-black uppercase tracking-tight text-black">
                    Connecting to Nearby {selectedTier} Driver
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                    Dispatching request to nearest verified drivers...
                </p>
            </div>

            {/* Ride Summary Box */}
            <div className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs font-mono flex flex-col gap-2">
                <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                    <span className="text-zinc-500">SERVICE:</span>
                    <span className="font-bold text-black">{selectedTier}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                    <span className="text-zinc-500">PICKUP:</span>
                    <span className="font-bold text-black truncate max-w-[200px]">{pickup.name}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-zinc-500">ESTIMATED FARE:</span>
                    <span className="font-bold text-black">₦{estimatedFare.toLocaleString()}</span>
                </div>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <Shield className="w-3.5 h-3.5 text-zinc-600" />
                <span>End-to-end encrypted dispatch network</span>
            </div>

            {/* Cancel Button */}
            <button
                onClick={cancelRide}
                className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-300 font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
                <X className="w-4 h-4" />
                Cancel Request
            </button>
        </div>
    );
}
