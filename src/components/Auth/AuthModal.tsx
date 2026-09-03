'use client';

import React, { useState } from 'react';
import { useAuthStore, MOCK_PASSENGER, MOCK_DRIVER_USER } from '@/store/useAuthStore';
import { UserRoleType, VehicleInfo } from '@/types/auth';
import { X, User, Car, ShieldCheck, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function AuthModal() {
    const {
        authModalOpen,
        authModalTab,
        authModalRole,
        setAuthModalOpen,
        login,
        register,
        switchMockAccount,
    } = useAuthStore();

    const [tab, setTab] = useState<'login' | 'register'>(authModalTab || 'login');
    const [role, setRole] = useState<UserRoleType>(authModalRole || 'passenger');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');

    // Driver vehicle details
    const [make, setMake] = useState('Toyota');
    const [model, setModel] = useState('Camry');
    const [color, setColor] = useState('Black');
    const [plate, setPlate] = useState('LAG-550-AB');
    const [tier, setTier] = useState<VehicleInfo['tier']>('Ube Comfort');

    if (!authModalOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (tab === 'login') {
            const res = await login({ phoneOrEmail: phone || email || 'alex@ube.ng', pin: pin || '1234' });
            setLoading(false);
            if (!res.success) setError(res.message || 'Authentication failed');
        } else {
            const vehicle: VehicleInfo | undefined =
                role === 'driver'
                    ? { make, model, color, plate, tier }
                    : undefined;

            const res = await register({
                name: name || (role === 'driver' ? 'Kemi Adebayo' : 'David Johnson'),
                email: email || `${role}@ube.ng`,
                phone: phone || '+234 800 000 1122',
                role,
                vehicle,
            });
            setLoading(false);
            if (!res.success) setError(res.message || 'Registration failed');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 text-white shadow-2xl rounded-none relative overflow-hidden">
                {/* Top monochrome strip */}
                <div className="h-1 bg-white" />

                {/* Header */}
                <div className="p-5 flex items-center justify-between border-b border-zinc-900">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-black bg-white text-black px-1.5 py-0.5">
                                UBE
                            </span>
                            <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider font-bold">
                                {tab === 'login' ? 'Account Access' : 'Create Account'}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                            {tab === 'login'
                                ? 'Enter credentials or pick a demo profile to continue'
                                : `Sign up as a ${role === 'driver' ? 'Partner Driver' : 'Rider'}`}
                        </p>
                    </div>

                    <button
                        onClick={() => setAuthModalOpen(false)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Quick Account Switcher for Instant Testing */}
                <div className="p-4 bg-zinc-900/60 border-b border-zinc-900">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2 font-bold">
                        ⚡ Quick Demo One-Click Sign In:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                switchMockAccount('passenger');
                                setAuthModalOpen(false);
                            }}
                            className="flex items-center gap-2 p-2 bg-zinc-900 border border-zinc-800 hover:border-white transition-all text-left group"
                        >
                            <User className="w-4 h-4 text-emerald-400" />
                            <div>
                                <div className="text-xs font-bold text-white group-hover:underline">
                                    Alex Morgan
                                </div>
                                <div className="text-[10px] text-zinc-400 font-mono">Passenger Demo</div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                switchMockAccount('driver');
                                setAuthModalOpen(false);
                            }}
                            className="flex items-center gap-2 p-2 bg-zinc-900 border border-zinc-800 hover:border-white transition-all text-left group"
                        >
                            <Car className="w-4 h-4 text-blue-400" />
                            <div>
                                <div className="text-xs font-bold text-white group-hover:underline">
                                    Babatunde L.
                                </div>
                                <div className="text-[10px] text-zinc-400 font-mono">Driver Demo</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-900">
                    <button
                        onClick={() => setTab('login')}
                        className={`flex-1 py-2.5 text-xs font-mono font-bold transition-all border-b-2 ${tab === 'login'
                            ? 'border-white text-white bg-zinc-900/40'
                            : 'border-transparent text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        LOGIN
                    </button>
                    <button
                        onClick={() => setTab('register')}
                        className={`flex-1 py-2.5 text-xs font-mono font-bold transition-all border-b-2 ${tab === 'register'
                            ? 'border-white text-white bg-zinc-900/40'
                            : 'border-transparent text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        REGISTER
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    {error && (
                        <div className="p-2.5 bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono">
                            {error}
                        </div>
                    )}

                    {/* Role Selection Segment if Register */}
                    {tab === 'register' && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                                Account Type
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRole('passenger')}
                                    className={`flex items-center justify-center gap-1.5 py-2 text-xs font-mono border transition-all ${role === 'passenger'
                                        ? 'bg-white text-black font-bold border-white'
                                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                                        }`}
                                >
                                    <User className="w-3.5 h-3.5" />
                                    <span>Passenger</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRole('driver')}
                                    className={`flex items-center justify-center gap-1.5 py-2 text-xs font-mono border transition-all ${role === 'driver'
                                        ? 'bg-white text-black font-bold border-white'
                                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                                        }`}
                                >
                                    <Car className="w-3.5 h-3.5" />
                                    <span>Partner Driver</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {tab === 'register' && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Alex Morgan"
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white font-mono"
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                            Phone Number or Email
                        </label>
                        <input
                            type="text"
                            value={phone || email}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setEmail(e.target.value);
                            }}
                            placeholder="+234 801 234 5678 or alex@ube.ng"
                            className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white font-mono"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold flex items-center justify-between">
                            <span>Security PIN</span>
                            <span className="text-[9px] text-zinc-500 font-normal">Default: 1234</span>
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="4-digit PIN"
                                maxLength={6}
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white font-mono"
                            />
                            <Lock className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-3" />
                        </div>
                    </div>

                    {/* Driver vehicle inputs if registering as Driver */}
                    {tab === 'register' && role === 'driver' && (
                        <div className="space-y-3 pt-2 border-t border-zinc-900">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                                Vehicle Details
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[9px] font-mono uppercase text-zinc-500">Make</label>
                                    <input
                                        type="text"
                                        value={make}
                                        onChange={(e) => setMake(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs text-white font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-mono uppercase text-zinc-500">Model</label>
                                    <input
                                        type="text"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs text-white font-mono"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[9px] font-mono uppercase text-zinc-500">Color</label>
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs text-white font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-mono uppercase text-zinc-500">License Plate</label>
                                    <input
                                        type="text"
                                        value={plate}
                                        onChange={(e) => setPlate(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs text-white font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <span>{tab === 'login' ? 'Sign In to Ube' : 'Complete Registration'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer security note */}
                <div className="p-3 bg-zinc-900/80 border-t border-zinc-900 text-center">
                    <span className="text-[10px] font-mono text-zinc-500 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Secured by Ube 256-bit Encryption & Instant OTP</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
