'use client';

import React, { useState, useEffect } from 'react';
import { useRideStore } from '@/store/useRideStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useAuthStore } from '@/store/useAuthStore';
import { apiService } from '@/services/api';
import { VehicleTier } from '@/types/ride';
import MapEngine from '@/components/Map/MapEngine';
import UberLandingPage from '@/components/Landing/UberLandingPage';
import BookingDrawer from './BookingDrawer';
import SearchingOverlay from './SearchingOverlay';
import TripActiveDrawer from './TripActiveDrawer';
import TripCompletedModal from './TripCompletedModal';
import ChooseRiderModal, { RiderInfo } from './ChooseRiderModal';
import DateTimePickerModal from './DateTimePickerModal';
import {
    Clock,
    User as UserIcon,
    Plus,
    ChevronDown,
    Search as SearchIcon,
    Key,
    Sparkles,
    Car,
    Star,
    Award,
    Plus as PlusIcon,
    Minus as MinusIcon,
} from 'lucide-react';

export default function UserDashboard() {
    const {
        status,
        ratingModalOpen,
        pickup,
        setPickup,
        dropoff,
        setDropoff,
        selectedTier,
        setSelectedTier,
        pinCode,
        requestRide,
    } = useRideStore();
    const { isAuthenticated, setAuthModalOpen } = useAuthStore();

    // Local form state for "Get a ride" widget
    const [pickupQuery, setPickupQuery] = useState(pickup.name || 'Victoria Island (Eko Atlantic)');
    const [dropoffQuery, setDropoffQuery] = useState(dropoff.name || 'Lekki Phase 1');
    const [showOptions, setShowOptions] = useState(false);

    // Pickers modal state
    const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [riderInfo, setRiderInfo] = useState<RiderInfo>({
        isForSelf: true,
        name: 'Me',
        phone: '',
    });
    const [pickupTimeLabel, setPickupTimeLabel] = useState('Pickup now');

    // Auto update inputs when store changes
    useEffect(() => {
        if (pickup.name) setPickupQuery(pickup.name);
    }, [pickup.name]);

    useEffect(() => {
        if (dropoff.name) setDropoffQuery(dropoff.name);
    }, [dropoff.name]);

    // Available Ride Options matching exact user prompt
    const rideTiers: {
        id: VehicleTier;
        name: string;
        tag: string;
        price: string;
        eta: string;
        seats: string;
        icon: React.ElementType;
    }[] = [
            {
                id: 'Ube Go',
                name: 'Ube Go',
                tag: 'Popular & Fast',
                price: '₦3,000',
                eta: '3 mins away',
                seats: '4 Seats',
                icon: Car,
            },
            {
                id: 'Ube Comfort',
                name: 'Ube Comfort',
                tag: 'Top Rated Drivers',
                price: '₦4,600',
                eta: '2 mins away',
                seats: '4 Seats',
                icon: Star,
            },
            {
                id: 'Ube Exec',
                name: 'Ube Exec',
                tag: 'Luxury Sedans',
                price: '₦6,500',
                eta: '5 mins away',
                seats: '4 Seats',
                icon: Award,
            },
        ];

    // Handle search action & start ride dispatch
    const handleSearchRide = async () => {
        if (!isAuthenticated) {
            setAuthModalOpen(true, 'login', 'passenger');
            return;
        }

        if (!dropoffQuery) {
            alert('Please enter a dropoff destination');
            return;
        }

        setPickup({
            lat: 6.4281,
            lng: 3.4219,
            name: pickupQuery,
            address: pickupQuery,
        });

        setDropoff({
            lat: 6.4474,
            lng: 3.4723,
            name: dropoffQuery,
            address: dropoffQuery,
        });

        setShowOptions(true);

        // Start backend ride dispatch simulation
        await apiService.requestRide({
            pickup: { lat: 6.4281, lng: 3.4219, name: pickupQuery, address: pickupQuery },
            dropoff: { lat: 6.4474, lng: 3.4723, name: dropoffQuery, address: dropoffQuery },
            selectedTier,
            estimatedFare: selectedTier === 'Ube Comfort' ? 4600 : selectedTier === 'Ube Exec' ? 6500 : 3000,
            distanceKm: 5.2,
        });
        requestRide();
    };

    // ─── 1. WHEN LOGGED OUT: SHOW FULL LANDING PAGE ───
    if (!isAuthenticated) {
        return (
            <UberLandingPage
                onStartBooking={() => setAuthModalOpen(true, 'login', 'passenger')}
            />
        );
    }

    // ─── 2. WHEN LOGGED IN: SHOW BOOKING PAGE ───
    return (
        <div className="w-full h-[calc(100vh-4rem)] bg-white overflow-hidden font-sans text-black flex flex-col p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-stretch">
                {/* LEFT: "Get a ride" Card */}
                <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4 z-10 overflow-y-auto">
                    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
                        <h2 className="text-3xl font-black text-black tracking-tight">
                            Get a ride
                        </h2>

                        {/* Pickup Input Pill */}
                        <div className="bg-zinc-100 hover:bg-zinc-200/70 p-3.5 rounded-2xl flex items-center gap-3 transition">
                            <div className="w-3 h-3 rounded-full bg-black shrink-0" />
                            <input
                                type="text"
                                value={pickupQuery}
                                onChange={(e) => {
                                    setPickupQuery(e.target.value);
                                    setPickup({
                                        ...pickup,
                                        name: e.target.value,
                                    });
                                }}
                                placeholder="Pickup location"
                                className="w-full bg-transparent text-sm font-semibold text-black placeholder-zinc-500 focus:outline-none"
                            />
                        </div>

                        {/* Dropoff Input Pill with Add Stop + button */}
                        <div className="bg-zinc-100 hover:bg-zinc-200/70 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-3 h-3 bg-black shrink-0" />
                                <input
                                    type="text"
                                    value={dropoffQuery}
                                    onChange={(e) => setDropoffQuery(e.target.value)}
                                    placeholder="Dropoff location"
                                    className="w-full bg-transparent text-sm font-semibold text-black placeholder-zinc-500 focus:outline-none"
                                />
                            </div>
                            <button
                                onClick={() => alert('Add extra stop feature')}
                                className="p-1 rounded-full bg-black text-white hover:bg-zinc-800 transition"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Selectors Row (Pickup now ▾ & For me ▾) */}
                        <div className="flex items-center gap-2 pt-1">
                            {/* Date/Time Picker Modal Trigger */}
                            <button
                                onClick={() => setIsDateModalOpen(true)}
                                className="bg-zinc-100 hover:bg-zinc-200 px-4 py-2.5 rounded-2xl text-xs font-bold text-black flex items-center gap-2 transition"
                            >
                                <Clock className="w-3.5 h-3.5 text-black" />
                                <span>{pickupTimeLabel}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                            </button>

                            {/* Choose Rider Modal Trigger (Matching Screenshot 1 & 2) */}
                            <button
                                onClick={() => setIsRiderModalOpen(true)}
                                className="bg-zinc-100 hover:bg-zinc-200 px-4 py-2.5 rounded-2xl text-xs font-bold text-black flex items-center gap-2 transition"
                            >
                                <UserIcon className="w-3.5 h-3.5 text-black" />
                                <span>
                                    {riderInfo.isForSelf ? 'For me' : `For ${riderInfo.name.split(' ')[0]}`}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                            </button>
                        </div>

                        {/* ─── CHOOSE RIDE OPTION TIERS INSIDE FORM ─── */}
                        <div className="space-y-2 pt-2 border-t border-zinc-100">
                            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                Choose Ride Option
                            </div>
                            <div className="space-y-2">
                                {rideTiers.map((tier) => {
                                    const isSelected = selectedTier === tier.id;
                                    const IconComp = tier.icon;
                                    return (
                                        <div
                                            key={tier.id}
                                            onClick={() => setSelectedTier(tier.id)}
                                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${isSelected
                                                    ? 'border-2 border-black bg-black text-white shadow-md'
                                                    : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-black'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isSelected
                                                            ? 'bg-zinc-800 text-white'
                                                            : 'bg-zinc-200 text-black'
                                                        }`}
                                                >
                                                    <IconComp className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm leading-tight">
                                                        {tier.name}
                                                    </div>
                                                    <div
                                                        className={`text-xs font-medium ${isSelected ? 'text-zinc-300' : 'text-zinc-500'
                                                            }`}
                                                    >
                                                        {tier.tag} • {tier.eta} • {tier.seats}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="font-bold text-base">{tier.price}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Search / Request Ube CTA Button */}
                        <button
                            onClick={handleSearchRide}
                            className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-bold text-base rounded-2xl transition shadow-lg mt-2 flex items-center justify-center gap-2"
                        >
                            <SearchIcon className="w-4 h-4" />
                            <span>Request {selectedTier}</span>
                        </button>
                    </div>

                    {/* Active Trip Overlays */}
                    {status !== 'IDLE' && (
                        <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-xl space-y-4">
                            {status === 'SEARCHING' && <SearchingOverlay />}
                            {(status === 'ACCEPTED' ||
                                status === 'ARRIVED_AT_PICKUP' ||
                                status === 'IN_TRIP') && <TripActiveDrawer />}
                        </div>
                    )}
                </div>

                {/* RIGHT: Map Canvas with Rounded Corners */}
                <div className="md:col-span-7 lg:col-span-8 relative rounded-3xl overflow-hidden border border-zinc-200/80 shadow-lg min-h-[400px] h-full">
                    <div className="absolute inset-0 z-0">
                        <MapEngine interactive={true} />
                    </div>

                    {/* Floating PIN notification badge if driver arrived */}
                    {status === 'ARRIVED_AT_PICKUP' && (
                        <div className="absolute top-4 left-4 right-4 z-10 flex justify-center pointer-events-none">
                            <div className="bg-amber-400 text-black font-mono text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-black animate-bounce pointer-events-auto">
                                <Key className="w-4 h-4 shrink-0" />
                                <span>Driver Arrived! Share PIN with Driver: </span>
                                <span className="bg-black text-amber-400 px-2.5 py-0.5 rounded tracking-widest text-sm font-bold">
                                    {pinCode}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Floating In-Trip Notification Badge */}
                    {status === 'IN_TRIP' && (
                        <div className="absolute top-4 left-4 right-4 z-10 flex justify-center pointer-events-none">
                            <div className="bg-black text-white font-mono text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-zinc-700 animate-pulse pointer-events-auto">
                                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Trip in Progress to {dropoff.name}</span>
                            </div>
                        </div>
                    )}

                    {/* Stacked Floating Zoom Controls (+) (-) bottom-right */}
                    <div className="absolute bottom-6 right-6 z-10 flex flex-col bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden font-bold">
                        <button
                            onClick={() => alert('Zoom in')}
                            className="p-3 text-black hover:bg-zinc-100 border-b border-zinc-200 transition"
                        >
                            <PlusIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => alert('Zoom out')}
                            className="p-3 text-black hover:bg-zinc-100 transition"
                        >
                            <MinusIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ChooseRiderModal
                isOpen={isRiderModalOpen}
                onClose={() => setIsRiderModalOpen(false)}
                onSelectRider={(rider) => setRiderInfo(rider)}
                currentRider={riderInfo}
            />

            <DateTimePickerModal
                isOpen={isDateModalOpen}
                onClose={() => setIsDateModalOpen(false)}
                onSelectDateTime={(label) => setPickupTimeLabel(label)}
            />

            {/* Trip Completed Modal */}
            {ratingModalOpen && <TripCompletedModal />}
        </div>
    );
}
