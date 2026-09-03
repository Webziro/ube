'use client';

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import RiderDashboard from '@/components/Rider/RiderDashboard';
import { useRideStore } from '@/store/useRideStore';

export default function RiderPage() {
    const { setRole } = useRideStore();

    useEffect(() => {
        setRole('driver');
    }, [setRole]);

    return (
        <main className="w-screen h-screen flex flex-col overflow-hidden bg-black text-black">
            <Header />
            <div className="flex-1 w-full h-[calc(100vh-3.5rem)] mt-14 relative">
                <RiderDashboard />
            </div>
        </main>
    );
}
