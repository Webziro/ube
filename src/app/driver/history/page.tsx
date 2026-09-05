'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/useAuthStore';
import { useRideStore } from '@/store/useRideStore';
import {
    History,
    Car,
    ArrowLeft,
    DollarSign,
    Star,
    Award,
    TrendingUp,
    Calendar,
    Download,
    CheckCircle2,
    Wallet,
} from 'lucide-react';

export default function DriverHistoryPage() {
    const { currentUser } = useAuthStore();
    const { driverEarnings, driverCompletedTrips, lastReceipt, pickup, dropoff } = useRideStore();

    // Driver completed trip logs
    const driverTrips = [
        ...(lastReceipt
            ? [
                {
                    id: 'DISPATCH-REQ-9941',
                    date: 'Today, ' + lastReceipt.timestamp,
                    passengerName: 'Alex Morgan (4.96 ★)',
                    pickup: pickup.name,
                    dropoff: dropoff.name,
                    payout: lastReceipt.totalFare,
                    status: 'COMPLETED',
                    distanceKm: lastReceipt.distanceKm,
                    durationMins: lastReceipt.durationMins,
                    tip: 500,
                },
            ]
            : []),
        {
            id: 'DISPATCH-REQ-8812',
            date: 'Yesterday, 19:15',
            passengerName: 'David Johnson (5.0 ★)',
            pickup: 'Victoria Island, Lagos',
            dropoff: 'Ikoyi Link Bridge, Lagos',
            payout: 3800,
            status: 'COMPLETED',
            distanceKm: 5.4,
            durationMins: 18,
            tip: 0,
        },
        {
            id: 'DISPATCH-REQ-7705',
            date: '2 Sep 2026, 10:20',
            passengerName: 'Grace Omotola (4.9 ★)',
            pickup: 'Lekki Phase 1, Lagos',
            dropoff: 'Eko Atlantic City, Lagos',
            payout: 6200,
            status: 'COMPLETED',
            distanceKm: 8.2,
            durationMins: 25,
            tip: 1000,
        },
        {
            id: 'DISPATCH-REQ-6601',
            date: '28 Aug 2026, 22:30',
            passengerName: 'Bisi Akande (5.0 ★)',
            pickup: 'Murtala Muhammed Airport (LOS)',
            dropoff: 'Banana Island, Ikoyi',
            payout: 9500,
            status: 'COMPLETED',
            distanceKm: 24.1,
            durationMins: 42,
            tip: 1500,
        },
    ];

    const totalPayout = driverEarnings || driverTrips.reduce((sum, item) => sum + item.payout + item.tip, 0);

    return (
        <main className="w-screen h-screen flex flex-col overflow-hidden bg-black text-white selection:bg-white selection:text-black">
            <Header />

            <div className="flex-1 w-full overflow-y-auto mt-16 p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Top Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                                <Link href="/driver" className="hover:text-white flex items-center gap-1 transition">
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back to Driver Console</span>
                                </Link>
                                <span>/</span>
                                <span className="text-white font-bold">Driver History & Earnings</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                                <span>Driver Dispatch History</span>
                                <span className="text-xs font-mono bg-blue-950 border border-blue-800 px-2.5 py-1 rounded-full text-blue-400 font-bold">
                                    Partner Driver Log
                                </span>
                            </h1>
                        </div>

                        {/* Driver Earnings Summary Badge */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                            <div>
                                <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                                    Net Driver Payout
                                </div>
                                <div className="text-lg font-mono font-bold text-emerald-400">
                                    ₦{totalPayout.toLocaleString()}
                                </div>
                            </div>
                            <button
                                onClick={() => alert('Payout of ₦' + totalPayout.toLocaleString() + ' initiated to bank account!')}
                                className="px-4 py-2 bg-emerald-400 text-black font-mono text-xs font-bold rounded-xl hover:bg-emerald-300 transition shadow"
                            >
                                Cashout
                            </button>
                        </div>
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-1">
                            <div className="text-xs font-mono text-zinc-400">Completed Dispatches</div>
                            <div className="text-2xl font-mono font-black text-white">
                                {driverCompletedTrips || driverTrips.length}
                            </div>
                        </div>
                        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-1">
                            <div className="text-xs font-mono text-zinc-400">Total Driver Earnings</div>
                            <div className="text-2xl font-mono font-black text-emerald-400">
                                ₦{totalPayout.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-1">
                            <div className="text-xs font-mono text-zinc-400">Driver Star Rating</div>
                            <div className="text-2xl font-mono font-black text-amber-400 flex items-center gap-1.5">
                                <span>4.98</span>
                                <Star className="w-5 h-5 fill-amber-400" />
                            </div>
                        </div>
                        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-1">
                            <div className="text-xs font-mono text-zinc-400">Acceptance Rate</div>
                            <div className="text-2xl font-mono font-black text-blue-400">98%</div>
                        </div>
                    </div>

                    {/* Driver Trip Logs */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <History className="w-5 h-5 text-blue-400" />
                            <span>Completed Dispatch Logs & Payouts</span>
                        </h2>

                        <div className="space-y-3">
                            {driverTrips.map((trip) => (
                                <div
                                    key={trip.id}
                                    className="bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition space-y-4 shadow-xl"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                                            <span className="font-mono text-xs font-bold text-white">{trip.id}</span>
                                            <span className="text-xs text-zinc-500">•</span>
                                            <span className="text-xs font-mono text-zinc-400">{trip.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-mono text-xs">
                                            <span className="text-zinc-400 text-xs">Fare + Tip:</span>
                                            <span className="text-emerald-400 font-black text-sm">
                                                ₦{(trip.payout + trip.tip).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Route Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        <div className="md:col-span-8 space-y-2">
                                            <div className="text-xs text-zinc-400">
                                                Rider: <strong className="text-white">{trip.passengerName}</strong>
                                            </div>
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
                                            <div>Distance: <strong className="text-white">{trip.distanceKm} km</strong></div>
                                            <div>Duration: <strong className="text-white">{trip.durationMins} mins</strong></div>
                                            {trip.tip > 0 && (
                                                <div className="text-amber-400 font-bold">Includes ₦{trip.tip} Rider Tip</div>
                                            )}
                                        </div>
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
