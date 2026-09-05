'use client';

import React, { useState } from 'react';
import { X, User, UserPlus, Check } from 'lucide-react';

export interface RiderInfo {
    isForSelf: boolean;
    name: string;
    phone: string;
}

interface ChooseRiderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectRider: (rider: RiderInfo) => void;
    currentRider: RiderInfo;
}

export default function ChooseRiderModal({
    isOpen,
    onClose,
    onSelectRider,
    currentRider,
}: ChooseRiderModalProps) {
    const [view, setView] = useState<'choose' | 'new'>('choose');
    const [selectedOption, setSelectedOption] = useState<'self' | 'other'>(
        currentRider.isForSelf ? 'self' : 'other'
    );

    // New rider form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [countryCode, setCountryCode] = useState('US');
    const [phonePrefix, setPhonePrefix] = useState('+1');
    const [phoneDigits, setPhoneDigits] = useState('');

    if (!isOpen) return null;

    const handleCountryChange = (code: string) => {
        setCountryCode(code);
        if (code === 'US') setPhonePrefix('+1');
        else if (code === 'NG') setPhonePrefix('+234');
        else if (code === 'UK') setPhonePrefix('+44');
    };

    const handleDone = () => {
        if (selectedOption === 'self') {
            onSelectRider({ isForSelf: true, name: 'Me', phone: '' });
            onClose();
        } else {
            setView('new');
        }
    };

    const handleAddRider = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !phoneDigits) {
            alert('Please enter first name, last name, and phone number');
            return;
        }
        const fullName = `${firstName} ${lastName}`;
        const fullPhone = `${phonePrefix} ${phoneDigits}`;
        onSelectRider({
            isForSelf: false,
            name: fullName,
            phone: fullPhone,
        });
        setView('choose');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white text-black w-full max-w-md rounded-2xl shadow-2xl overflow-hidden font-sans border border-zinc-200">
                {/* ─── VIEW 1: CHOOSE A RIDER (SCREENSHOT 1 MATCH) ─── */}
                {view === 'choose' && (
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold tracking-tight text-black">
                                Choose a rider
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full hover:bg-zinc-100 transition"
                            >
                                <X className="w-5 h-5 text-black" />
                            </button>
                        </div>

                        {/* Options List */}
                        <div className="space-y-2">
                            {/* Option 1: Me */}
                            <div
                                onClick={() => setSelectedOption('self')}
                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition ${selectedOption === 'self' ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-base text-black">Me</span>
                                </div>
                                {selectedOption === 'self' && (
                                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                )}
                            </div>

                            {/* Option 2: Order ride for someone else */}
                            <div
                                onClick={() => {
                                    setSelectedOption('other');
                                    setView('new');
                                }}
                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition ${selectedOption === 'other' ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-black">
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-base text-black">
                                        Order ride for someone else
                                    </span>
                                </div>
                                {selectedOption === 'other' && (
                                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA Done Button */}
                        <button
                            onClick={handleDone}
                            className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-bold text-base rounded-xl transition shadow-md"
                        >
                            Done
                        </button>
                    </div>
                )}

                {/* ─── VIEW 2: NEW RIDER (SCREENSHOT 2 MATCH) ─── */}
                {view === 'new' && (
                    <form onSubmit={handleAddRider} className="p-6 space-y-5">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold tracking-tight text-black">
                                New rider
                            </h3>
                            <button
                                type="button"
                                onClick={() => setView('choose')}
                                className="p-1 rounded-full hover:bg-zinc-100 transition"
                            >
                                <X className="w-5 h-5 text-black" />
                            </button>
                        </div>

                        <p className="text-sm text-zinc-700 font-semibold">
                            Drivers will see this name.
                        </p>

                        {/* First Name Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-black">First name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter first name"
                                className="w-full p-3.5 bg-zinc-100 rounded-xl border-none font-medium text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        {/* Last Name Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-black">Last name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter last name"
                                className="w-full p-3.5 bg-zinc-100 rounded-xl border-none font-medium text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        {/* Phone Number Field with Country Selector */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-black">Phone number</label>
                            <div className="flex gap-2">
                                <select
                                    value={countryCode}
                                    onChange={(e) => handleCountryChange(e.target.value)}
                                    className="p-3.5 bg-zinc-100 rounded-xl border-none font-bold text-sm text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                                >
                                    <option value="US">US ▾</option>
                                    <option value="NG">NG ▾</option>
                                    <option value="UK">UK ▾</option>
                                </select>
                                <div className="flex-1 bg-zinc-100 rounded-xl p-3.5 flex items-center gap-2">
                                    <span className="font-bold text-sm text-zinc-600">
                                        {phonePrefix}
                                    </span>
                                    <input
                                        type="tel"
                                        value={phoneDigits}
                                        onChange={(e) => setPhoneDigits(e.target.value)}
                                        placeholder="Phone number"
                                        className="w-full bg-transparent text-sm font-medium text-black focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ube Phone Privacy Note */}
                        <p className="text-xs text-zinc-500 font-medium">
                            Ube won't share this phone number with drivers
                        </p>

                        {/* Legal Agreement Terms */}
                        <p className="text-xs text-zinc-500 leading-normal">
                            By tapping "Add rider", you confirm that your friend agreed to share
                            their contact information with Ube and to receive SMS about this trip.
                        </p>

                        {/* CTA Add Rider Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-bold text-base rounded-xl transition shadow-md"
                        >
                            Add rider
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
