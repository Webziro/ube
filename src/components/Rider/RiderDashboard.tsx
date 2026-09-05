'use client';

import React, { useEffect } from 'react';
import { useRideStore } from '@/store/useRideStore';
import MapEngine from '@/components/Map/MapEngine';
import DispatchModal from './DispatchModal';
import DriverTripPanel from './DriverTripPanel';
import EarningsWidget from './EarningsWidget';
import TripCompletedModal from '@/components/User/TripCompletedModal';

export default function RiderDashboard() {
    const { status, ratingModalOpen, driverIsOnline, tickRiderPosition, simSpeed } = useRideStore();

    // Automatic driver movement simulation loop when trip is active
    useEffect(() => {
        if (status === 'ACCEPTED' || status === 'IN_TRIP') {
            const intervalTime = Math.max(300, 1000 / simSpeed);
            const timer = setInterval(() => {
                tickRiderPosition();
            }, intervalTime);
            return () => clearInterval(timer);
        }
    }, [status, tickRiderPosition, simSpeed]);

    return (
        <div className="relative w-full h-full flex flex-col flex-1 bg-zinc-100 overflow-hidden">
            {/* Full-Bleed Map Canvas */}
            <div className="absolute inset-0 z-0">
                <MapEngine interactive={true} />
            </div>

            {/* Floating Driver Status Banner */}
            <div className="absolute top-16 left-4 right-4 z-10 pointer-events-none flex justify-center">
                <div className="bg-black/90 backdrop-blur text-white text-xs font-mono px-4 py-2 rounded-full border border-zinc-700 shadow-xl flex items-center gap-2 pointer-events-auto">
                    <span
                        className={`w-2.5 h-2.5 rounded-full ${driverIsOnline ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
                            }`}
                    />
                    <span>DRIVER CONSOLE:</span>
                    <span className="font-bold">
                        {driverIsOnline ? 'ONLINE & READY FOR DISPATCH' : 'OFFLINE'}
                    </span>
                </div>
            </div>

            {/* Bottom Drawer Options */}
            <div className="absolute bottom-0 left-0 right-0 z-20 max-w-xl mx-auto">
                {status === 'IDLE' && <EarningsWidget />}
                {(status === 'ACCEPTED' || status === 'ARRIVED_AT_PICKUP' || status === 'IN_TRIP') && (
                    <DriverTripPanel />
                )}
            </div>

            {/* Dispatch Incoming Notification Modal */}
            {status === 'SEARCHING' && driverIsOnline && <DispatchModal />}

            {/* Ride Completed Notification & Summary Modal */}
            {ratingModalOpen && <TripCompletedModal />}
        </div>
    );
}
