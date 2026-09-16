'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import UserDashboard from '@/components/User/UserDashboard';
import RiderDashboard from '@/components/Rider/RiderDashboard';
import { useRideStore } from '@/store/useRideStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const { activeRole, setRole } = useRideStore();
  const { currentUser } = useAuthStore();
  const [isDriverHost, setIsDriverHost] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.startsWith('driver.')) {
        setIsDriverHost(true);
        setRole('driver');
      }
    }
  }, [setRole]);

  const isDriver = isDriverHost || currentUser?.role === 'driver' || activeRole === 'driver';

  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden bg-black text-black">
      {/* Universal Top Header */}
      <Header />

      {/* Viewport Area */}
      <div className="flex-1 w-full h-[calc(100vh-3.5rem)] mt-14 relative flex">
        {isDriver ? (
          <div className="w-full h-full">
            <RiderDashboard />
          </div>
        ) : (
          <div className="w-full h-full">
            <UserDashboard />
          </div>
        )}
      </div>
    </main>
  );
}
