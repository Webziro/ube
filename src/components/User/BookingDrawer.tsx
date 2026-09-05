'use client';

import React, { useState } from 'react';
import { useRideStore } from '@/store/useRideStore';
import { useWalletStore } from '@/store/useWalletStore';
import { PRESET_LOCATIONS, VEHICLE_OPTIONS } from '@/constants/locations';
import { apiService } from '@/services/api';
import { MapPin, Navigation, ArrowRight, Wallet, CreditCard, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function BookingDrawer() {
    const {
        pickup,
        dropoff,
        setPickup,
        setDropoff,
        selectedTier,
        setSelectedTier,
        estimatedFare,
        distanceKm,
        durationMins,
        requestRide,
    } = useRideStore();

    const { balance, paymentMethod, setPaymentMethod, setWalletModalOpen } = useWalletStore();

    const handleRequestRide = async () => {
        const { isAuthenticated, setAuthModalOpen } = useAuthStore.getState();
        if (!isAuthenticated) {
            setAuthModalOpen(true, 'login', 'passenger');
            return;
        }

        // Trigger backend API request & broadcast to SSE gateway
        await apiService.requestRide({
            pickup,
            dropoff,
            selectedTier,
            estimatedFare,
            distanceKm,
        });
        requestRide();
    };

    const [showPickupList, setShowPickupList] = useState(false);
    const [showDropoffList, setShowDropoffList] = useState(false);

    return (
        <div className="w-full bg-white border-t border-zinc-200 shadow-2xl p-4 sm:p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            {/* Location Input Section */}
            <div className="flex flex-col gap-3 relative">
                {/* Pickup Input */}
                <div className="relative">
                    <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-lg hover:border-black transition-colors cursor-pointer">
                        <div className="w-3 h-3 rounded-full bg-black shrink-0" />
                        <div
                            className="flex-1 overflow-hidden"
                            onClick={() => {
                                setShowPickupList(!showPickupList);
                                setShowDropoffList(false);
                            }}
                        >
                            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                                Pickup Location
                            </div>
                            <div className="text-sm font-semibold text-black truncate">{pickup.name}</div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                    </div>

                    {/* Pickup Dropdown */}
                    {showPickupList && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-black z-30 shadow-xl rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                            <div className="p-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest border-b border-zinc-100 bg-zinc-50">
                                Select Pickup Point
                            </div>
                            {PRESET_LOCATIONS.map((loc) => (
                                <button
                                    key={loc.name}
                                    onClick={() => {
                                        setPickup(loc);
                                        setShowPickupList(false);
                                    }}
                                    className="w-full text-left p-3 hover:bg-zinc-100 border-b border-zinc-100 flex items-start gap-2.5 transition-colors"
                                >
                                    <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-bold text-black">{loc.name}</div>
                                        <div className="text-[11px] text-zinc-500 truncate">{loc.address}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Dropoff Input */}
                <div className="relative">
                    <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-lg hover:border-black transition-colors cursor-pointer">
                        <div className="w-3.5 h-3.5 bg-black shrink-0" />
                        <div
                            className="flex-1 overflow-hidden"
                            onClick={() => {
                                setShowDropoffList(!showDropoffList);
                                setShowPickupList(false);
                            }}
                        >
                            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                                Destination
                            </div>
                            <div className="text-sm font-semibold text-black truncate">{dropoff.name}</div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                    </div>

                    {/* Dropoff Dropdown */}
                    {showDropoffList && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-black z-30 shadow-xl rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                            <div className="p-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest border-b border-zinc-100 bg-zinc-50">
                                Select Destination
                            </div>
                            {PRESET_LOCATIONS.map((loc) => (
                                <button
                                    key={loc.name}
                                    onClick={() => {
                                        setDropoff(loc);
                                        setShowDropoffList(false);
                                    }}
                                    className="w-full text-left p-3 hover:bg-zinc-100 border-b border-zinc-100 flex items-start gap-2.5 transition-colors"
                                >
                                    <Navigation className="w-4 h-4 text-black shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-bold text-black">{loc.name}</div>
                                        <div className="text-[11px] text-zinc-500 truncate">{loc.address}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Trip Estimate Bar */}
            <div className="flex items-center justify-between text-xs font-mono bg-zinc-100 p-2.5 rounded border border-zinc-200 text-zinc-700">
                <div>
                    DISTANCE: <span className="font-bold text-black">{distanceKm} km</span>
                </div>
                <div>
                    EST. TIME: <span className="font-bold text-black">{durationMins} mins</span>
                </div>
            </div>

            {/* Vehicle Tier Options */}
            <div className="flex flex-col gap-2">
                <div className="text-[11px] font-mono uppercase font-bold text-zinc-500 tracking-wider">
                    Choose Ride Option
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {VEHICLE_OPTIONS.map((tier) => {
                        const isSelected = selectedTier === tier.id;
                        const fare = Math.round((tier.baseFare + distanceKm * tier.perKmRate) / 100) * 100;
                        return (
                            <button
                                key={tier.id}
                                onClick={() => setSelectedTier(tier.id)}
                                className={`p-3 text-left border rounded-lg transition-all flex flex-col justify-between ${isSelected
                                        ? 'border-2 border-black bg-black text-white shadow-md'
                                        : 'border-zinc-200 bg-zinc-50 hover:border-zinc-400 text-black'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-sm leading-none">{tier.name}</div>
                                        <div
                                            className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'
                                                }`}
                                        >
                                            {tier.tag}
                                        </div>
                                    </div>
                                    <span
                                        className={`font-mono text-sm font-black ${isSelected ? 'text-white' : 'text-black'
                                            }`}
                                    >
                                        ₦{fare.toLocaleString()}
                                    </span>
                                </div>
                                <div
                                    className={`text-[10px] mt-2 flex items-center justify-between border-t pt-1.5 ${isSelected
                                            ? 'border-zinc-800 text-zinc-400'
                                            : 'border-zinc-200 text-zinc-500'
                                        }`}
                                >
                                    <span>{tier.etaMinutes} mins away</span>
                                    <span>{tier.capacity} Seats</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Payment Selection & Confirm Button */}
            <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center bg-zinc-100 p-1 border border-zinc-200 rounded shrink-0 gap-1">
                    <button
                        onClick={() => setPaymentMethod('wallet')}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded transition-all text-xs font-mono font-bold ${paymentMethod === 'wallet' ? 'bg-black text-white' : 'text-zinc-600 hover:text-black'
                            }`}
                        title="UBE Wallet"
                    >
                        <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                        <span>₦{balance.toLocaleString()}</span>
                    </button>

                    <button
                        onClick={() => setPaymentMethod('paystack')}
                        className={`p-1.5 rounded transition-all ${paymentMethod === 'paystack' ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
                            }`}
                        title="Paystack Direct Card/Transfer"
                    >
                        <CreditCard className="w-4 h-4" />
                    </button>
                </div>

                <button
                    onClick={handleRequestRide}
                    className="flex-1 py-3.5 px-4 bg-black text-white hover:bg-zinc-800 font-mono font-bold uppercase text-xs sm:text-sm tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all border border-black active:scale-[0.99]"
                >
                    <span>Request {selectedTier}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-black">
                        ₦{estimatedFare.toLocaleString()}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
