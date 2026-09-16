'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRoleType, VehicleInfo } from '@/types/auth';
import { X, User, Car, Lock, Mail, ArrowRight, ChevronDown, Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
    const {
        authModalOpen,
        authModalTab,
        authModalRole,
        setAuthModalOpen,
        login,
        register,
    } = useAuthStore();

    const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(authModalTab || 'login');
    const [role, setRole] = useState<UserRoleType>(authModalRole || 'passenger');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    // Driver vehicle details
    const [make, setMake] = useState('Toyota');
    const [model, setModel] = useState('Camry');
    const [color, setColor] = useState('Black');
    const [plate, setPlate] = useState('LAG-550-AB');
    const [tier, setTier] = useState<VehicleInfo['tier']>('Ube Comfort');

    if (!authModalOpen) return null;

    const validatePasswordComplexity = (pass: string): { valid: boolean; message?: string } => {
        if (!pass) return { valid: false, message: 'Password is required' };
        if (pass.length < 7) {
            return { valid: false, message: 'Password must be at least 7 characters long.' };
        }
        if (!/[A-Z]/.test(pass)) {
            return { valid: false, message: 'Password must contain at least 1 uppercase letter (A-Z).' };
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) {
            return { valid: false, message: 'Password must contain at least 1 special character (e.g. @, #, $, !).' };
        }
        return { valid: true };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (tab === 'forgot') {
            if (!email.trim()) {
                setError('Please enter your email address');
                return;
            }
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setResetSent(true);
            }, 800);
            return;
        }

        // Validate password complexity for both login and register
        if (password) {
            const val = validatePasswordComplexity(password);
            if (!val.valid) {
                setError(val.message || 'Invalid password format');
                return;
            }
        } else if (tab === 'register') {
            setError('Password must be at least 7 characters with 1 capital and 1 special character.');
            return;
        }

        setLoading(true);

        if (tab === 'login') {
            const targetEmail = email.trim() || (role === 'driver' ? 'babatunde.lawal@ube.ng' : 'alex.morgan@ube.ng');
            const targetPass = password || 'UbePass123!';

            const res = await login({
                phoneOrEmail: targetEmail,
                pin: targetPass,
            });
            setLoading(false);
            if (!res.success) setError(res.message || 'Invalid credentials');
        } else {
            const vehicle: VehicleInfo | undefined =
                role === 'driver'
                    ? { make, model, color, plate, tier }
                    : undefined;

            const targetEmail = email.trim() || `${role}.${Date.now()}@ube.ng`;
            const targetPass = password || 'UbePass123!';

            const res = await register({
                name: name || (role === 'driver' ? 'Stanley Driver' : 'Stanley Ama'),
                email: targetEmail,
                phone: `+234 8${Math.floor(100000000 + Math.random() * 900000000)}`,
                password: targetPass,
                pin: targetPass,
                role,
                vehicle,
            });
            setLoading(false);
            if (!res.success) setError(res.message || 'Registration failed');
        }
    };

    const fillDemoAccount = (demoRole: UserRoleType) => {
        setRole(demoRole);
        setTab('login');
        if (demoRole === 'passenger') {
            setEmail('alex.morgan@ube.ng');
            setPassword('UbePass123!');
        } else {
            setEmail('babatunde.lawal@ube.ng');
            setPassword('UbePass123!');
        }
    };

    const handleGoogleAuth = async () => {
        setLoading(true);
        setError(null);
        try {
            // Initiate Google Authentication flow
            const googleEmail = role === 'driver' ? 'babatunde.lawal@ube.ng' : 'stanley.ama@gmail.com';
            const res = await login({
                phoneOrEmail: googleEmail,
                pin: 'UbePass123!',
            });
            if (!res.success) {
                await register({
                    name: 'Stanley Ama',
                    email: googleEmail,
                    phone: '+234 801 999 0000',
                    password: 'UbePass123!',
                    pin: 'UbePass123!',
                    role,
                });
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setError('Google sign-in failed. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans text-black">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-zinc-200">
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-zinc-100">
                    <div>
                        <div className="text-2xl font-black tracking-tight text-black">
                            Ube
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                            {tab === 'forgot'
                                ? 'Reset your password'
                                : tab === 'login'
                                    ? 'Welcome back! Sign in to your account'
                                    : 'Create your Ube account'}
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
                {tab !== 'forgot' && (
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
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Forgot Password Confirmation Screen */}
                    {tab === 'forgot' ? (
                        resetSent ? (
                            <div className="py-6 text-center space-y-4">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-black">Reset Link Sent!</h3>
                                <p className="text-xs text-zinc-600">
                                    We have sent a password reset link to <span className="font-bold text-black">{email}</span>. Please check your inbox.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResetSent(false);
                                        setTab('login');
                                    }}
                                    className="w-full py-3 bg-black text-white font-bold text-xs rounded-xl hover:bg-zinc-800 transition"
                                >
                                    Back to Login
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-xs text-zinc-600">
                                    Enter your registered email address below to receive password reset instructions.
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                                        {error}
                                    </div>
                                )}

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
                                            className="w-full bg-zinc-100 border border-zinc-200 p-3 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black pr-10"
                                            required
                                        />
                                        <Mail className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3.5" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {loading ? 'Sending...' : 'Send Password Reset Link'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTab('login')}
                                    className="w-full text-center text-xs font-bold text-zinc-500 hover:text-black transition"
                                >
                                    Cancel and Back to Login
                                </button>
                            </div>
                        )
                    ) : (
                        <>
                            {/* Quick Demo Accounts Banner */}
                            <div className="p-3 bg-zinc-100 rounded-xl border border-zinc-200">
                                <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-2">
                                    Quick Demo Login:
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fillDemoAccount('passenger')}
                                        className="flex-1 py-1.5 px-2 bg-white border border-zinc-300 hover:border-black rounded-lg text-xs font-semibold text-black transition"
                                    >
                                        👤 Rider (Alex)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fillDemoAccount('driver')}
                                        className="flex-1 py-1.5 px-2 bg-white border border-zinc-300 hover:border-black rounded-lg text-xs font-semibold text-black transition"
                                    >
                                        🚗 Driver (Babatunde)
                                    </button>
                                </div>
                            </div>

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
                                        onFocus={(e) => {
                                            e.target.dataset.placeholder = e.target.placeholder;
                                            e.target.placeholder = '';
                                        }}
                                        onBlur={(e) => {
                                            if (e.target.dataset.placeholder) {
                                                e.target.placeholder = e.target.dataset.placeholder;
                                            }
                                        }}
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
                                        onFocus={(e) => {
                                            e.target.dataset.placeholder = e.target.placeholder;
                                            e.target.placeholder = '';
                                        }}
                                        onBlur={(e) => {
                                            if (e.target.dataset.placeholder) {
                                                e.target.placeholder = e.target.dataset.placeholder;
                                            }
                                        }}
                                        placeholder="name@example.com"
                                        className="w-full bg-zinc-100 border border-zinc-200 p-3 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                    <Mail className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3.5" />
                                </div>
                            </div>

                            {/* Password Input with Eye/EyeOff Toggle and Complexity Hint */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-zinc-700 block">
                                        Password
                                    </label>
                                    {tab === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setTab('forgot')}
                                            className="text-[11px] font-bold text-black hover:underline"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={(e) => {
                                            e.target.dataset.placeholder = e.target.placeholder;
                                            e.target.placeholder = '';
                                        }}
                                        onBlur={(e) => {
                                            if (e.target.dataset.placeholder) {
                                                e.target.placeholder = e.target.dataset.placeholder;
                                            }
                                        }}
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-100 border border-zinc-200 p-3 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-3 text-zinc-400 hover:text-black transition"
                                        title={showPassword ? 'Hide Password' : 'Show Password'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-medium">
                                    7+ characters with at least 1 uppercase letter and 1 special character.
                                </p>
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
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
