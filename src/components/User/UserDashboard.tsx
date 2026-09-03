'use client';

import React from 'react';
import { useRideStore } from '@/store/useRideStore';
import MapEngine from '@/components/Map/MapEngine';
import BookingDrawer from './BookingDrawer';
import SearchingOverlay from './SearchingOverlay';
import TripActiveDrawer from './TripActiveDrawer';
import TripCompletedModal from './TripCompletedModal';
import { MapPin, Navigation } from 'lucide-react';

export default function UserDashboard() {
    const { status, ratingModalOpen, pickup, dropoff } = useRideStore();

    return (
        <div className="relative w-full h-full flex flex-col flex-1 bg-zinc-100 overflow-hidden">
            {/* Full-Bleed Map Background */}
            <div className="absolute inset-0 z-0">
                <MapEngine interactive={true} />
            </div>

            {/* Floating Address Bar (Top Mobile Overlay) */}
            <div className="absolute top-16 left-4 right-4 z-10 pointer-events-none flex justify-center">
                <div className="bg-black/90 backdrop-blur text-white text-xs font-mono px-4 py-2 rounded-full border border-zinc-700 shadow-xl flex items-center gap-3 pointer-events-auto max-w-md w-full">
                    <div className="flex items-center gap-1.5 truncate flex-1">
                        <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                        <span className="truncate">{pickup.name}</span>
                    </div>
                    <span className="text-zinc-500 font-bold">→</span>
                    <div className="flex items-center gap-1.5 truncate flex-1 justify-end">
                        <span className="w-2 h-2 bg-white shrink-0" />
                        <span className="truncate">{dropoff.name}</span>
                    </div>
                </div>
            </div>

            {/* Contextual Bottom Sheet Drawer */}
            <div className="absolute bottom-0 left-0 right-0 z-20 max-w-xl mx-auto">
                {status === 'IDLE' && <BookingDrawer />}
                {status === 'SEARCHING' && <SearchingOverlay />}
                {(status === 'ACCEPTED' || status === 'ARRIVED_AT_PICKUP' || status === 'IN_TRIP') && (
                    <TripActiveDrawer />
                )}
            </div>

            {/* Rating & Receipt Modal */}
            {ratingModalOpen && <TripCompletedModal />}
        </div>
    );
}
