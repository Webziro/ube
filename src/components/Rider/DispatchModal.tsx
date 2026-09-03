'use client';

import React, { useEffect, useState } from 'react';
import { useRideStore } from '@/store/useRideStore';
import { apiService } from '@/services/api';
import { Navigation, MapPin, DollarSign, Check, X, Bell } from 'lucide-react';

export default function DispatchModal() {
    const {
        pickup,
        dropoff,
        estimatedFare,
        distanceKm,
        acceptDispatch,
        declineDispatch,
        selectedTier,
    } = useRideStore();

    const [timeLeft, setTimeLeft] = useState(15);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    declineDispatch();
                    return 15;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [declineDispatch]);

    const driverPayout = Math.round(estimatedFare * 0.85); // 85% driver payout

    return (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-2 border-black max-w-md w-full rounded-xl shadow-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
                {/* Audio/Visual Chime Header */}
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center animate-bounce">
                            <Bell className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-mono text-base font-black uppercase text-black">
                                INCOMING DISPATCH REQUEST
                            </h3>
                            <p className="text-xs font-mono text-zinc-500">Service Tier: {selectedTier}</p>
                        </div>
                    </div>
                    {/* Countdown Ring */}
                    <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-mono font-black text-sm bg-zinc-100 text-black shadow-inner">
                        {timeLeft}s
                    </div>
                </div>

                {/* Big Payout Display */}
                <div className="bg-black text-white p-4 rounded-lg flex items-center justify-between shadow-md">
                    <div>
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                            Estimated Earnings
                        </div>
                        <div className="text-3xl font-mono font-black text-emerald-400 tracking-tight">
                            ₦{driverPayout.toLocaleString()}
                        </div>
                    </div>
                    <div className="text-right font-mono text-xs text-zinc-400">
                        <div>{distanceKm} km trip</div>
                        <div className="text-[10px] text-zinc-400">Fare: ₦{estimatedFare.toLocaleString()}</div>
                    </div>
                </div>

                {/* Route Details Box */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 flex flex-col gap-3 font-mono text-xs">
                    <div className="flex items-start gap-3 border-b border-zinc-200 pb-2">
                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <div className="text-[10px] text-zinc-400 font-bold uppercase">Pickup Location</div>
                            <div className="font-bold text-black">{pickup.name}</div>
                            <div className="text-[11px] text-zinc-500">{pickup.address}</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Navigation className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <div className="text-[10px] text-zinc-400 font-bold uppercase">Destination</div>
                            <div className="font-bold text-black">{dropoff.name}</div>
                            <div className="text-[11px] text-zinc-500">{dropoff.address}</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        onClick={declineDispatch}
                        className="py-3.5 bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-300 font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                    >
                        <X className="w-4 h-4" />
                        Decline
                    </button>
                    <button
                        onClick={async () => {
                            await apiService.acceptDispatch();
                            acceptDispatch();
                        }}
                        className="py-3.5 bg-black hover:bg-zinc-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 shadow-xl transition-all border border-black active:scale-[0.98]"
                    >
                        <Check className="w-4 h-4 text-emerald-400" />
                        ACCEPT DISPATCH
                    </button>
                </div>
            </div>
        </div>
    );
}
