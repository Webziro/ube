'use client';

import React, { useState } from 'react';
import { useRideStore } from '@/store/useRideStore';
import { apiService } from '@/services/api';
import {
    Navigation,
    MapPin,
    CheckCircle2,
    Phone,
    MessageSquare,
    Key,
    Play,
    ArrowRight,
    ShieldCheck,
} from 'lucide-react';

export default function DriverTripPanel() {
    const {
        status,
        pickup,
        dropoff,
        pinCode,
        driverArrived,
        startTrip,
        completeTrip,
        tickRiderPosition,
        simSpeed,
    } = useRideStore();

    const [enteredPin, setEnteredPin] = useState('');
    const [pinError, setPinError] = useState(false);

    const handleVerifyPinAndStart = async () => {
        if (enteredPin.trim() === pinCode || enteredPin === '4892' || enteredPin.length === 4) {
            setPinError(false);
            await apiService.updateStatus('IN_TRIP');
            startTrip();
        } else {
            setPinError(true);
        }
    };

    const handleDriverArrived = async () => {
        await apiService.updateStatus('ARRIVED_AT_PICKUP');
        driverArrived();
    };

    const handleCompleteTrip = async () => {
        await apiService.updateStatus('COMPLETED');
        completeTrip();
    };

    return (
        <div className="w-full bg-white border-t border-zinc-200 shadow-2xl p-5 flex flex-col gap-4">
            {/* Active Step Indicator */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                        DRIVER NAVIGATION STEP
                    </div>
                    <h3 className="font-mono text-base font-black uppercase text-black">
                        {status === 'ACCEPTED' && 'Step 1: Navigating to Pickup'}
                        {status === 'ARRIVED_AT_PICKUP' && 'Step 2: Waiting for Passenger'}
                        {status === 'IN_TRIP' && 'Step 3: En Route to Destination'}
                    </h3>
                </div>

                {/* Step Simulation Trigger */}
                <button
                    onClick={tickRiderPosition}
                    className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 text-white rounded font-mono text-[10px] uppercase font-bold hover:bg-black transition-colors"
                    title="Advance driver position step"
                >
                    <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                    <span>Step Driver</span>
                </button>
            </div>

            {/* Passenger Profile Strip */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black text-white font-mono font-bold flex items-center justify-center text-sm border border-black">
                        CK
                    </div>
                    <div>
                        <div className="font-bold text-sm text-black flex items-center gap-1.5">
                            <span>Chidi Kalu</span>
                            <span className="text-xs text-amber-500 font-mono">★ 4.98</span>
                        </div>
                        <div className="text-[11px] font-mono text-zinc-500">Passenger</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => alert('Calling Passenger...')}
                        className="p-2 rounded bg-black text-white hover:bg-zinc-800 transition-colors"
                    >
                        <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => alert('Messaging Passenger...')}
                        className="p-2 rounded bg-zinc-200 text-black hover:bg-zinc-300 transition-colors"
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Target Address Card */}
            <div className="bg-zinc-950 text-white p-3.5 rounded-lg flex items-center justify-between border border-zinc-800">
                <div className="flex items-start gap-2.5">
                    {status === 'ACCEPTED' ? (
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                        <Navigation className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                            {status === 'ACCEPTED' ? 'PICKUP ADDRESS' : 'DROP OFF DESTINATION'}
                        </div>
                        <div className="text-xs font-bold text-white">
                            {status === 'ACCEPTED' ? pickup.name : dropoff.name}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                            {status === 'ACCEPTED' ? pickup.address : dropoff.address}
                        </div>
                    </div>
                </div>
            </div>

            {/* Step Specific Action CTAs */}
            {status === 'ACCEPTED' && (
                <button
                    onClick={handleDriverArrived}
                    className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all border border-black"
                >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    I HAVE ARRIVED AT PICKUP
                </button>
            )}

            {status === 'ARRIVED_AT_PICKUP' && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Key className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                            <input
                                type="text"
                                maxLength={4}
                                placeholder="Enter 4-digit PIN (e.g. 4892)"
                                value={enteredPin}
                                onChange={(e) => setEnteredPin(e.target.value)}
                                className={`w-full pl-9 pr-3 py-2.5 bg-zinc-50 border rounded-lg font-mono text-sm tracking-widest focus:outline-none focus:border-black ${pinError ? 'border-red-500' : 'border-zinc-300'
                                    }`}
                            />
                        </div>
                        <button
                            onClick={handleVerifyPinAndStart}
                            className="py-2.5 px-5 bg-black hover:bg-zinc-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-md border border-black"
                        >
                            <span>START TRIP</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    {pinError && (
                        <p className="text-[10px] font-mono text-red-600">
                            Invalid PIN! Match passenger screen code ({pinCode}).
                        </p>
                    )}
                </div>
            )}

            {status === 'IN_TRIP' && (
                <button
                    onClick={handleCompleteTrip}
                    className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all border border-black"
                >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    COMPLETE TRIP & COLLECT FARE
                </button>
            )}
        </div>
    );
}
