'use client';

import React from 'react';
import Header from '@/components/Header';
import UserDashboard from '@/components/User/UserDashboard';
import RiderDashboard from '@/components/Rider/RiderDashboard';
import { useRideStore } from '@/store/useRideStore';

export default function Home() {
  const { activeRole } = useRideStore();

  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden bg-black text-black">
      {/* Universal Top Header */}
      <Header />

      {/* Viewport Area */}
      <div className="flex-1 w-full h-[calc(100vh-3.5rem)] mt-14 relative flex">
        {activeRole === 'passenger' && (
          <div className="w-full h-full">
            <UserDashboard />
          </div>
        )}

        {activeRole === 'driver' && (
          <div className="w-full h-full">
            <RiderDashboard />
          </div>
        )}

        {activeRole === 'split' && (
          <div className="w-full h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            {/* Passenger View Column */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative flex flex-col">
              <div className="bg-black text-white text-[11px] font-mono px-3 py-1 border-b border-zinc-800 flex items-center justify-between z-10 shrink-0">
                <span className="font-bold uppercase tracking-wider text-emerald-400">
                  PASSENGER DASHBOARD (CUSTOMER APP)
                </span>
                <span className="text-zinc-500 text-[10px]">Real-time Sync Active</span>
              </div>
              <div className="flex-1 relative">
                <UserDashboard />
              </div>
            </div>

            {/* Driver View Column */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative flex flex-col">
              <div className="bg-black text-white text-[11px] font-mono px-3 py-1 border-b border-zinc-800 flex items-center justify-between z-10 shrink-0">
                <span className="font-bold uppercase tracking-wider text-amber-400">
                  DRIVER CONSOLE (RIDER APP)
                </span>
                <span className="text-zinc-500 text-[10px]">Broadcast Channel Ready</span>
              </div>
              <div className="flex-1 relative">
                <RiderDashboard />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
