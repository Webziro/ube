'use client';

import React from 'react';
import { useRideStore } from '@/store/useRideStore';
import { Phone, MessageSquare, ShieldAlert, Star, Car, Key, MapPin, CheckCircle2 } from 'lucide-react';

export default function TripActiveDrawer() {
    const {
        status,
        driverProfile,
        pinCode,
        pickup,
        dropoff,
        estimatedFare,
        cancelRide,
    } = useRideStore();

    const getStatusText = () => {
        switch (status) {
            case 'ACCEPTED':
                return {
                    title: 'Driver is on the way',
                    subtitle: 'Driver accepted your ride request',
                    badge: 'ARRIVING IN 3 MINS',
                };
            case 'ARRIVED_AT_PICKUP':
                return {
                    title: 'Driver Has Arrived!',
                    subtitle: 'Please meet your driver at pickup point',
                    badge: 'DRIVER WAITING',
                };
            case 'IN_TRIP':
                return {
                    title: 'En Route to Destination',
                    subtitle: `Heading to ${dropoff.name}`,
                    badge: 'TRIP IN PROGRESS',
                };
            default:
                return {
                    title: 'Active Trip',
                    subtitle: 'Tracking your ride in real-time',
                    badge: 'LIVE',
                };
        }
    };

    const currentStatusInfo = getStatusText();

    return (
        <div className="w-full bg-white border-t border-zinc-200 shadow-2xl p-5 flex flex-col gap-4">
            {/* Header Banner */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="font-mono text-base font-black uppercase text-black">
                            {currentStatusInfo.title}
                        </h3>
                    </div>
                    <p className="text-xs font-mono text-zinc-500 mt-0.5">{currentStatusInfo.subtitle}</p>
                </div>
                <div className="bg-black text-white font-mono text-[10px] font-bold tracking-widest px-2.5 py-1 rounded">
                    {currentStatusInfo.badge}
                </div>
            </div>

            {/* Safety PIN Verification Card */}
            <div className="bg-zinc-950 text-white p-3.5 rounded-lg flex items-center justify-between border border-zinc-800 shadow-inner">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-white border border-zinc-700">
                        <Key className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                            Safety Verification PIN
                        </div>
                        <div className="text-xs text-zinc-300">Share PIN with driver before starting trip</div>
                    </div>
                </div>
                <div className="font-mono text-xl font-black tracking-widest bg-white text-black px-3 py-1 rounded border border-white">
                    {pinCode}
                </div>
            </div>

            {/* Driver & Vehicle Profile Card */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={driverProfile.avatar}
                            alt={driverProfile.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-black"
                        />
                        <div>
                            <div className="font-bold text-sm text-black flex items-center gap-1.5">
                                <span>{driverProfile.name}</span>
                                <span className="flex items-center gap-0.5 text-xs text-amber-500 font-mono">
                                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                                    {driverProfile.rating}
                                </span>
                            </div>
                            <div className="text-[11px] font-mono text-zinc-500">
                                {driverProfile.totalTrips} completed rides
                            </div>
                        </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => alert(`Calling driver at ${driverProfile.phone}...`)}
                            className="p-2.5 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors shadow"
                            title="Call Driver"
                        >
                            <Phone className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => alert('Opening messaging with driver...')}
                            className="p-2.5 rounded-full bg-zinc-200 text-black hover:bg-zinc-300 transition-colors"
                            title="Message Driver"
                        >
                            <MessageSquare className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Vehicle Badge Bar */}
                <div className="flex items-center justify-between bg-white border border-zinc-200 p-2.5 rounded font-mono text-xs">
                    <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-black" />
                        <span className="font-bold text-black">{driverProfile.vehicle.make} {driverProfile.vehicle.model}</span>
                        <span className="text-zinc-400">({driverProfile.vehicle.color})</span>
                    </div>
                    <div className="font-black bg-black text-white px-2 py-0.5 rounded tracking-wider">
                        {driverProfile.vehicle.plate}
                    </div>
                </div>
            </div>

            {/* Trip Details & Fare */}
            <div className="flex items-center justify-between text-xs font-mono bg-zinc-100 p-3 rounded border border-zinc-200 text-zinc-700">
                <div>
                    DESTINATION: <span className="font-bold text-black">{dropoff.name}</span>
                </div>
                <div>
                    TOTAL FARE: <span className="font-bold text-black">₦{estimatedFare.toLocaleString()}</span>
                </div>
            </div>

            {/* Safety & Cancel Options */}
            <div className="flex items-center gap-2 pt-1">
                <button
                    onClick={() => alert('Ube Safety Toolkit activated. Emergency services contacted.')}
                    className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-red-600 border border-zinc-200 rounded font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                    <ShieldAlert className="w-4 h-4" />
                    Safety Toolkit
                </button>

                {status === 'ACCEPTED' && (
                    <button
                        onClick={cancelRide}
                        className="flex-1 py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-200 rounded font-mono text-xs font-bold text-center transition-colors"
                    >
                        Cancel Trip
                    </button>
                )}
            </div>
        </div>
    );
}
