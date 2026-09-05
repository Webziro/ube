'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRideStore } from '@/store/useRideStore';
import { useWalletStore } from '@/store/useWalletStore';
import {
    Car,
    MapPin,
    Navigation,
    Calendar,
    Clock,
    ArrowRight,
    ShieldCheck,
    Wallet,
    DollarSign,
    User,
    CheckCircle2,
    Sparkles,
    Smartphone,
    Globe,
    Star,
    Award,
    ChevronRight,
    ShoppingBag,
    Utensils,
    Briefcase,
} from 'lucide-react';

interface UberLandingPageProps {
    onStartBooking: () => void;
}

export default function UberLandingPage({ onStartBooking }: UberLandingPageProps) {
    const { setAuthModalOpen, isAuthenticated, currentUser } = useAuthStore();
    const { pickup, setPickup, dropoff, setDropoff } = useRideStore();
    const { balance, setWalletModalOpen } = useWalletStore();

    const [activeTab, setActiveTab] = useState<'ride' | 'drive' | 'package'>('ride');
    const [pickupInput, setPickupInput] = useState('Victoria Island, Lagos');
    const [dropoffInput, setDropoffInput] = useState('Lekki Phase 1, Lagos');

    const handleSearchRide = (e: React.FormEvent) => {
        e.preventDefault();
        setPickup({ name: pickupInput, address: pickupInput, lat: 6.4281, lng: 3.4219 });
        setDropoff({ name: dropoffInput, address: dropoffInput, lat: 6.4474, lng: 3.4723 });
        if (!isAuthenticated) {
            setAuthModalOpen(true, 'login', 'passenger');
            return;
        }
        onStartBooking();
    };

    return (
        <div className="w-full h-full overflow-y-auto bg-black text-white selection:bg-white selection:text-black">
            {/* 1. UBER-STYLE HERO SECTION */}
            <div className="relative min-h-[85vh] w-full bg-zinc-950 flex flex-col justify-between border-b border-zinc-800 pt-16">
                {/* Hero Background Glow & Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#333333_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-900/60 via-transparent to-transparent pointer-events-none" />

                {/* Hero Main Grid Container */}
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10 flex-1 flex flex-col justify-center">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* LEFT COLUMN: Uber Hero Booking Widget */}
                        <div className="lg:col-span-6 space-y-6">
                            {/* Service Tabs */}
                            <div className="inline-flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
                                <button
                                    onClick={() => setActiveTab('ride')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${activeTab === 'ride'
                                            ? 'bg-white text-black shadow-lg'
                                            : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    <Car className="w-4 h-4" />
                                    <span>Ride</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('drive')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${activeTab === 'drive'
                                            ? 'bg-white text-black shadow-lg'
                                            : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    <DollarSign className="w-4 h-4 text-emerald-400" />
                                    <span>Drive & Earn</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('package')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${activeTab === 'package'
                                            ? 'bg-white text-black shadow-lg'
                                            : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    <span>Courier</span>
                                </button>
                            </div>

                            {/* Hero Headline */}
                            <div className="space-y-3">
                                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight font-sans">
                                    Go anywhere with <span className="underline decoration-zinc-600">Ube</span>
                                </h1>
                                <p className="text-zinc-400 text-sm sm:text-base max-w-lg">
                                    Request a trip, hop in, and pay seamlessly with Paystack or UBE Digital Wallet. Premium rides at your fingertips 24/7.
                                </p>
                            </div>

                            {/* Hero Quick Booking Widget */}
                            <form
                                onSubmit={handleSearchRide}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4 max-w-lg"
                            >
                                <div className="space-y-2 relative">
                                    {/* Pickup Input */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3.5 top-3.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" />
                                        <input
                                            type="text"
                                            value={pickupInput}
                                            onChange={(e) => setPickupInput(e.target.value)}
                                            placeholder="Enter pickup location"
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white transition"
                                            required
                                        />
                                    </div>

                                    {/* Vertical Connector Line */}
                                    <div className="absolute left-5 top-9 bottom-9 w-0.5 bg-zinc-700 z-0" />

                                    {/* Dropoff Input */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3.5 top-3.5 w-3 h-3 bg-white border-2 border-black" />
                                        <input
                                            type="text"
                                            value={dropoffInput}
                                            onChange={(e) => setDropoffInput(e.target.value)}
                                            placeholder="Enter destination"
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white transition"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Date/Time & Options Strip */}
                                <div className="flex items-center justify-between gap-3 text-xs font-mono text-zinc-400 pt-1">
                                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg">
                                        <Clock className="w-4 h-4 text-emerald-400" />
                                        <span>Leave Now</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg">
                                        <Wallet className="w-4 h-4 text-amber-400" />
                                        <span>Paystack / Wallet</span>
                                    </div>
                                </div>

                                {/* PRIMARY ACTION BUTTON: BOOK A RIDE NOW */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    <button
                                        type="submit"
                                        className="py-4 bg-white hover:bg-zinc-200 text-black font-mono font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition flex items-center justify-center gap-2 group"
                                    >
                                        <span>BOOK A RIDE NOW</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    {!isAuthenticated ? (
                                        <button
                                            type="button"
                                            onClick={() => setAuthModalOpen(true, 'login', 'passenger')}
                                            className="py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-700 transition flex items-center justify-center gap-2"
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Sign In / Register</span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setWalletModalOpen(true)}
                                            className="py-4 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-700 transition flex items-center justify-center gap-2"
                                        >
                                            <Wallet className="w-4 h-4" />
                                            <span>Wallet (₦{balance.toLocaleString()})</span>
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* RIGHT COLUMN: Sleek Visual Tier Cards */}
                        <div className="lg:col-span-6 relative">
                            <div className="relative bg-gradient-to-tr from-zinc-900 via-zinc-900/90 to-black border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden group">
                                <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
                                            LIVE DISPATCH NETWORK
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono text-zinc-500">
                                        Avg Arrival: &lt; 3 mins
                                    </span>
                                </div>

                                {/* Vehicle Tier Teasers */}
                                <div className="space-y-4">
                                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-mono font-bold">
                                                <Car className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-mono text-sm font-bold text-white">Ube Go</div>
                                                <div className="text-xs text-zinc-400">Affordable daily rides</div>
                                            </div>
                                        </div>
                                        <div className="text-right font-mono">
                                            <div className="text-sm font-bold text-emerald-400">₦2,500</div>
                                            <div className="text-[10px] text-zinc-500">Upfront fare</div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-amber-400 flex items-center justify-center font-mono font-bold">
                                                <Star className="w-5 h-5 fill-amber-400" />
                                            </div>
                                            <div>
                                                <div className="font-mono text-sm font-bold text-white">Ube Comfort</div>
                                                <div className="text-xs text-zinc-400">Top drivers & newer cars</div>
                                            </div>
                                        </div>
                                        <div className="text-right font-mono">
                                            <div className="text-sm font-bold text-emerald-400">₦3,800</div>
                                            <div className="text-[10px] text-zinc-500">Upfront fare</div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center font-mono font-bold">
                                                <Award className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-mono text-sm font-bold text-white">Ube Exec</div>
                                                <div className="text-xs text-zinc-400">Luxury executive sedans</div>
                                            </div>
                                        </div>
                                        <div className="text-right font-mono">
                                            <div className="text-sm font-bold text-emerald-400">₦6,200</div>
                                            <div className="text-[10px] text-zinc-500">Upfront fare</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. EXPLORE WHAT YOU CAN DO WITH UBE (EXACT UBER SECTION FROM USER IMAGE) */}
            <div className="py-20 bg-zinc-950 border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="space-y-2">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                            Explore what you can do with Ube
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            Seamless mobility, delivery, and reservations designed for your everyday life.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Ride */}
                        <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition group">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Ride</h3>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Go anywhere with Ube. Request a ride, hop in, and go.
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <button
                                    onClick={onStartBooking}
                                    className="px-5 py-2.5 bg-zinc-800 group-hover:bg-white text-white group-hover:text-black text-xs font-bold rounded-full transition-all"
                                >
                                    Details
                                </button>
                                <div className="w-16 h-12 flex items-center justify-center rounded-xl bg-zinc-950 text-white border border-zinc-800">
                                    <Car className="w-8 h-8 text-zinc-200" />
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Reserve */}
                        <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition group">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Reserve</h3>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Reserve your ride in advance so you can relax on the day of your trip.
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <button
                                    onClick={onStartBooking}
                                    className="px-5 py-2.5 bg-zinc-800 group-hover:bg-white text-white group-hover:text-black text-xs font-bold rounded-full transition-all"
                                >
                                    Details
                                </button>
                                <div className="w-16 h-12 flex items-center justify-center rounded-xl bg-zinc-950 text-amber-400 border border-zinc-800">
                                    <Calendar className="w-8 h-8" />
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Intercity */}
                        <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition group">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Intercity</h3>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Get convenient, affordable outstation cabs anytime at your door.
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <button
                                    onClick={onStartBooking}
                                    className="px-5 py-2.5 bg-zinc-800 group-hover:bg-white text-white group-hover:text-black text-xs font-bold rounded-full transition-all"
                                >
                                    Details
                                </button>
                                <div className="w-16 h-12 flex items-center justify-center rounded-xl bg-zinc-950 text-blue-400 border border-zinc-800">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Hourly */}
                        <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition group">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Hourly</h3>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Request a trip for a block of time and make multiple stops.
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <button
                                    onClick={onStartBooking}
                                    className="px-5 py-2.5 bg-zinc-800 group-hover:bg-white text-white group-hover:text-black text-xs font-bold rounded-full transition-all"
                                >
                                    Details
                                </button>
                                <div className="w-16 h-12 flex items-center justify-center rounded-xl bg-zinc-950 text-emerald-400 border border-zinc-800">
                                    <Clock className="w-8 h-8" />
                                </div>
                            </div>
                        </div>

                        {/* Card 5: Food */}
                        <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition group">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Food</h3>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Order delivery from local restaurants with Ube Eats.
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <button
                                    onClick={() => alert('Ube Eats Food Delivery coming soon!')}
                                    className="px-5 py-2.5 bg-zinc-800 group-hover:bg-white text-white group-hover:text-black text-xs font-bold rounded-full transition-all"
                                >
                                    Details
                                </button>
                                <div className="w-16 h-12 flex items-center justify-center rounded-xl bg-zinc-950 text-amber-400 border border-zinc-800">
                                    <Utensils className="w-8 h-8" />
                                </div>
                            </div>
                        </div>

                        {/* Card 6: Grocery */}
                        <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition group">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Grocery</h3>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Get groceries delivered to your door with Ube Eats.
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <button
                                    onClick={() => alert('Ube Grocery Delivery coming soon!')}
                                    className="px-5 py-2.5 bg-zinc-800 group-hover:bg-white text-white group-hover:text-black text-xs font-bold rounded-full transition-all"
                                >
                                    Details
                                </button>
                                <div className="w-16 h-12 flex items-center justify-center rounded-xl bg-zinc-950 text-emerald-400 border border-zinc-800">
                                    <ShoppingBag className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. WHY RIDE WITH UBE FEATURE GRID */}
            <div className="py-20 bg-black border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <h2 className="text-3xl sm:text-4xl font-mono font-black uppercase text-white tracking-tight">
                            Built for modern movement
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            Everything you need for safe, reliable, and effortless urban transportation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1: Upfront Pricing */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-4 hover:border-zinc-700 transition">
                            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-mono">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-mono font-bold text-white uppercase">Upfront Pricing</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                See your exact fare breakdown before you hit book. No hidden surcharges or surprise billing at the end of your trip.
                            </p>
                        </div>

                        {/* Feature 2: Paystack & Wallet */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-4 hover:border-zinc-700 transition">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-black flex items-center justify-center font-mono">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-mono font-bold text-white uppercase">Paystack & Wallet</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Fund your digital UBE Wallet using Paystack debit cards, USSD, or direct bank transfer for instant 1-tap trip payments.
                            </p>
                        </div>

                        {/* Feature 3: Safety PIN Verification */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-4 hover:border-zinc-700 transition">
                            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-mono">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-mono font-bold text-white uppercase">4-Digit Safety PIN</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Every ride requires your driver to verify your unique 4-digit code before starting the trip, ensuring total safety.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. FOOTER */}
            <footer className="py-12 bg-black text-zinc-500 font-mono text-xs border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-white text-lg tracking-tighter bg-white/10 px-2 py-0.5 border border-white/20">
                            UBE
                        </span>
                        <span>© 2026 UBE Mobility Inc. All rights reserved.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button onClick={() => onStartBooking()} className="hover:text-white transition">
                            Book Ride
                        </button>
                        <button onClick={() => setWalletModalOpen(true)} className="hover:text-white transition">
                            Paystack Wallet
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
