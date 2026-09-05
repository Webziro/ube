'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/useAuthStore';
import { useRideStore } from '@/store/useRideStore';
import { useWalletStore } from '@/store/useWalletStore';
import {
    History,
    Car,
    MapPin,
    ArrowLeft,
    CheckCircle2,
    Calendar,
    Clock,
    DollarSign,
    Wallet,
    Download,
    ChevronRight,
    Star,
} from 'lucide-react';

export default function RiderHistoryPage() {
    const { currentUser, isAuthenticated } = useAuthStore();
    const { lastReceipt, pickup, dropoff, selectedTier } = useRideStore();
    const { balance, setWalletModalOpen } = useWalletStore();

    // Mock history items combined with real last receipt if available
    const tripHistory = [
        ...(lastReceipt
            ? [
                {
                    id: 'TRIP-REQ-9941',
                    date: 'Today, ' + lastReceipt.timestamp,
                    pickup: pickup.name,
                    dropoff: dropoff.name,
                    tier: selectedTier,
                    fare: lastReceipt.totalFare,
                    status: 'COMPLETED',
                    distanceKm: lastReceipt.distanceKm,
                    durationMins: lastReceipt.durationMins,
                    paymentMethod: 'UBE Digital Wallet',
                    driverName: 'Babatunde Lawal',
                    rating: 5.0,
                },
            ]
            : []),
        {
            id: 'TRIP-REQ-8820',
            date: 'Yesterday, 18:42',
            pickup: 'Victoria Island, Lagos',
            dropoff: 'Ikoyi Link Bridge, Lagos',
            tier: 'Ube Comfort',
            fare: 3800,
            status: 'COMPLETED',
            distanceKm: 5.4,
            durationMins: 18,
            paymentMethod: 'Paystack Debit Card',
            driverName: 'Emmanuel Chukwu',
            rating: 5.0,
        },
        {
            id: 'TRIP-REQ-7714',
            date: '2 Sep 2026, 09:15',
            pickup: 'Lekki Phase 1, Lagos',
            dropoff: 'Eko Atlantic City, Lagos',
            tier: 'Ube Exec',
            fare: 6200,
            status: 'COMPLETED',
            distanceKm: 8.2,
            durationMins: 25,
            paymentMethod: 'UBE Digital Wallet',
            driverName: 'Kemi Adebayo',
            rating: 4.9,
        },
        {
            id: 'TRIP-REQ-6602',
            date: '28 Aug 2026, 21:04',
            pickup: 'Murtala Muhammed Airport (LOS)',
            dropoff: 'Banana Island, Ikoyi',
            tier: 'Ube Exec',
            fare: 9500,
            status: 'COMPLETED',
            distanceKm: 24.1,
            durationMins: 42,
            paymentMethod: 'Paystack Card',
            driverName: 'Babatunde Lawal',
            rating: 5.0,
        },
    ];

    const totalSpent = tripHistory.reduce((sum, item) => sum + item.fare, 0);

    return (
        <main className="w-screen h-screen flex flex-col overflow-hidden bg-black text-white selection:bg-white selection:text-black">
            <Header />

            <div className="flex-1 w-full overflow-y-auto mt-16 p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Top Header & Breadcrumb */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                                <Link href="/rider" className="hover:text-white flex items-center gap-1 transition">
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back to Rider App</span>
                                </Link>
                                <span>/</span>
                                <span className="text-white font-bold">Trip History</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                                <span>Passenger Trip History</span>
                                <span className="text-xs font-mono bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full text-emerald-400 font-bold">
                                    {tripHistory.length} Trips
                                </span>
                            </h1>
                        </div>

                        {/* Wallet quick topup card */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                            <div>
                                <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                                    Wallet Balance
                                </div>
                                <div className="text-lg font-mono font-bold text-emerald-400">
                                    ₦{balance.toLocaleString()}
                                </div>
                            </div>
                            <button
                                onClick={() => setWalletModalOpen(true)}
                                className="px-4 py-2 bg-white text-black font-mono text-xs font-bold rounded-xl hover:bg-zinc-200 transition shadow"
                            >
                                Top Up
                            </button>
                        </div>
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-1">
                            <div className="text-xs font-mono text-zinc-400">Total Rides Taken</div>
                            <div className="text-2xl font-mono font-black text-white">{tripHistory.length}</div>
                        </div>
                        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-1">
                            <div className="text-xs font-mono text-zinc-400">Total Spent</div>
                            <div className="text-2xl font-mono font-black text-emerald-400">
                                ₦{totalSpent.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-1">
                            <div className="text-xs font-mono text-zinc-400">Passenger Rating</div>
                            <div className="text-2xl font-mono font-black text-amber-400 flex items-center gap-1.5">
                                <span>{currentUser?.rating || 4.96}</span>
                                <Star className="w-5 h-5 fill-amber-400" />
                            </div>
                        </div>
                    </div>

                    {/* Trip History List */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <History className="w-5 h-5 text-amber-400" />
                            <span>Recent Completed Trips</span>
                        </h2>

                        <div className="space-y-3">
                            {tripHistory.map((trip) => (
                                <div
                                    key={trip.id}
                                    className="bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition space-y-4 shadow-xl"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                            <span className="font-mono text-xs font-bold text-white">{trip.id}</span>
                                            <span className="text-xs text-zinc-500">•</span>
                                            <span className="text-xs font-mono text-zinc-400">{trip.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-mono text-xs">
                                            <span className="bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded text-zinc-300 font-bold">
                                                {trip.tier}
                                            </span>
                                            <span className="text-emerald-400 font-black text-sm">
                                                ₦{trip.fare.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Route & Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        <div className="md:col-span-8 space-y-2">
                                            <div className="flex items-start gap-3">
                                                <div className="flex flex-col items-center pt-1">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
                                                    <div className="w-0.5 h-6 bg-zinc-700 my-0.5" />
                                                    <div className="w-2.5 h-2.5 bg-white border border-black" />
                                                </div>
                                                <div className="space-y-1 text-xs">
                                                    <div className="font-semibold text-white">{trip.pickup}</div>
                                                    <div className="font-semibold text-zinc-300">{trip.dropoff}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-4 flex flex-col sm:items-end justify-center text-xs font-mono text-zinc-400 space-y-1">
                                            <div>Driver: <strong className="text-white">{trip.driverName}</strong></div>
                                            <div>Dist / Time: <strong className="text-white">{trip.distanceKm} km ({trip.durationMins} mins)</strong></div>
                                            <div className="text-emerald-400 font-bold">Paid via {trip.paymentMethod}</div>
                                        </div>
                                    </div>

                                    {/* Footer receipt download link */}
                                    <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono">
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                                            <span>Rated {trip.rating} Stars</span>
                                        </div>
                                        <button
                                            onClick={() => alert(`Receipt downloaded for ${trip.id}`)}
                                            className="text-zinc-400 hover:text-white flex items-center gap-1 transition"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Download PDF Receipt</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
