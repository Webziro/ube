'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRoleType, VehicleInfo } from '@/types/auth';
import { X, User, Car, Lock, Mail, ArrowRight, ChevronDown } from 'lucide-react';

export default function AuthModal() {
    const {
        authModalOpen,
        authModalTab,
        authModalRole,
        setAuthModalOpen,
        login,
        register,
    } = useAuthStore();

    const [tab, setTab] = useState<'login' | 'register'>(authModalTab || 'login');
    const [role, setRole] = useState<UserRoleType>(authModalRole || 'passenger');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            const res = await login({
                phoneOrEmail: email || 'user@ube.com',
                pin: password || '1234',
            });
            setLoading(false);
            if (!res.success) setError(res.message || 'Invalid credentials');
        } else {
            const vehicle: VehicleInfo | undefined =
                role === 'driver'
                    ? { make, model, color, plate, tier }
                    : undefined;

            const res = await register({
                name: name || (role === 'driver' ? 'Stanley Driver' : 'Stanley Ama'),
                email: email || `${role}@ube.com`,
                phone: '+234 800 000 0000',
                role,
                vehicle,
            });
            setLoading(false);
            if (!res.success) setError(res.message || 'Registration failed');
        }
    };

    const handleGoogleAuth = () => {
        setLoading(true);
        setTimeout(async () => {
            const res = await login({
                phoneOrEmail: 'google.user@ube.com',
                pin: '1234',
            });
            setLoading(false);
            if (!res.success) {
                // If account doesn't exist, register via Google
                await register({
                    name: 'Stanley Ama',
                    email: 'stanley.ama@gmail.com',
                    phone: '+234 801 999 0000',
                    role,
                });
            }
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans text-black">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-zinc-200">
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-zinc-100">
                    <div>
                        <div className="text-2xl font-black tracking-tight text-black">
                            Uber
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                            {tab === 'login'
                                ? 'Welcome back! Sign in to your account'
                                : 'Create your Uber account'}
                        </p>
                    </div>

                    <button
                        onClick={() => setAuthModalOpen(false)}
                        className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-full transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Login / Sign Up Tabs */}
                <div className="flex border-b border-zinc-100 bg-zinc-50/50">
                    <button
                        onClick={() => setTab('login')}
                        className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 ${tab === 'login'
                                ? 'border-black text-black bg-white'
                                : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => setTab('register')}
                        className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 ${tab === 'register'
                                ? 'border-black text-black bg-white'
                                : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                    >
                        Sign up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                            {error}
                        </div>
                    )}

                    {/* Account Type Dropdown Selector */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-700 block">
                            Account Type
                        </label>
                        <div className="relative">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as UserRoleType)}
                                className="w-full bg-zinc-100 border border-zinc-200 p-3 rounded-xl text-sm font-semibold text-black appearance-none focus:outline-none focus:ring-2 focus:ring-black pr-10 cursor-pointer"
                            >
                                <option value="passenger">User / Rider (Get a ride)</option>
                                <option value="driver">Partner Driver (Drive & Earn)</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3.5 pointer-events-none" />
                        </div>
                    </div>

                    {/* Google OAuth Button */}
                    <button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        className="w-full py-3 bg-white border border-zinc-300 hover:bg-zinc-50 text-black font-semibold text-xs rounded-xl transition flex items-center justify-center gap-3 shadow-sm"
                    >
                        {/* Google Icon SVG */}
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    <div className="flex items-center my-3 text-zinc-400 text-xs">
                        <div className="flex-1 border-t border-zinc-200" />
                        <span className="px-3 font-medium">or continue with email</span>
                        <div className="flex-1 border-t border-zinc-200" />
                    </div>

                    {/* Name input if Register */}
                    {tab === 'register' && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-700 block">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Stanley Ama"
                                className="w-full bg-zinc-100 border border-zinc-200 p-3 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-700 block">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-zinc-100 border border-zinc-200 p-3 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                            <Mail className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3.5" />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-700 block">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-zinc-100 border border-zinc-200 p-3 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                            <Lock className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3.5" />
                        </div>
                    </div>

                    {/* Driver details if registering as driver */}
                    {tab === 'register' && role === 'driver' && (
                        <div className="space-y-3 pt-3 border-t border-zinc-100">
                            <span className="text-xs font-bold text-zinc-800 block">
                                Vehicle Information
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500">Make</label>
                                    <input
                                        type="text"
                                        value={make}
                                        onChange={(e) => setMake(e.target.value)}
                                        className="w-full bg-zinc-100 border border-zinc-200 p-2.5 text-xs text-black rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500">Model</label>
                                    <input
                                        type="text"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="w-full bg-zinc-100 border border-zinc-200 p-2.5 text-xs text-black rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500">Color</label>
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-full bg-zinc-100 border border-zinc-200 p-2.5 text-xs text-black rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500">Plate Number</label>
                                    <input
                                        type="text"
                                        value={plate}
                                        onChange={(e) => setPlate(e.target.value)}
                                        className="w-full bg-zinc-100 border border-zinc-200 p-2.5 text-xs text-black rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 mt-4 shadow-lg"
                    >
                        {loading ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <span>{tab === 'login' ? 'Log in' : 'Sign up'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
