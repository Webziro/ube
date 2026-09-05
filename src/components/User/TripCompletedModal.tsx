'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRideStore } from '@/store/useRideStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CheckCircle2, Star, Receipt, ArrowRight, Heart, History } from 'lucide-react';

interface TripCompletedModalProps {
    onDismiss?: () => void;
}

export default function TripCompletedModal({ onDismiss }: TripCompletedModalProps) {
    const router = useRouter();
    const { lastReceipt, driverProfile, resetState, setRatingModalOpen, activeRole } = useRideStore();
    const { currentUser } = useAuthStore();
    const [rating, setRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [selectedTip, setSelectedTip] = useState<number>(500);

    if (!lastReceipt) return null;

    const isDriver = activeRole === 'driver' || currentUser?.role === 'driver';

    const handleFinish = () => {
        if (onDismiss) onDismiss();
        setRatingModalOpen(false);
        resetState();
        if (isDriver) {
            router.push('/driver/history');
        } else {
            router.push('/rider/history');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-2 border-black max-w-md w-full rounded-xl shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                {/* Animated Checkmark Header */}
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                    </div>
                    <h2 className="font-mono text-xl font-black uppercase text-black tracking-tight mt-1">
                        Trip Completed!
                    </h2>
                    <p className="text-xs font-mono text-zinc-500">
                        Thank you for riding with Ube • {lastReceipt.timestamp}
                    </p>
                </div>

                {/* Total Amount Badge */}
                <div className="bg-zinc-950 text-white p-4 rounded-lg flex items-center justify-between border border-zinc-800">
                    <div>
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                            Total Amount Paid
                        </div>
                        <div className="text-2xl font-mono font-black tracking-tight">
                            ₦{(lastReceipt.totalFare + selectedTip).toLocaleString()}
                        </div>
                    </div>
                    <div className="text-right font-mono text-xs text-zinc-400">
                        <div>Ube Pay Wallet</div>
                        <div className="text-[10px] text-emerald-400">Paid Successfully</div>
                    </div>
                </div>

                {/* Fare Receipt Breakdown */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 flex flex-col gap-2 font-mono text-xs">
                    <div className="flex items-center gap-1.5 font-bold border-b border-zinc-200 pb-2 text-black">
                        <Receipt className="w-4 h-4 text-zinc-500" />
                        <span>FARE BREAKDOWN</span>
                    </div>

                    <div className="flex justify-between text-zinc-600">
                        <span>Base Fare ({lastReceipt.distanceKm} km)</span>
                        <span>₦{lastReceipt.baseFare.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                        <span>Distance & Time ({lastReceipt.durationMins} mins)</span>
                        <span>₦{lastReceipt.distanceFare.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                        <span>Service & Safety Fee</span>
                        <span>₦{lastReceipt.serviceFee.toLocaleString()}</span>
                    </div>
                    {selectedTip > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                            <span>Driver Tip</span>
                            <span>+₦{selectedTip.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                {/* Rate Driver Section */}
                <div className="flex flex-col items-center gap-2 border-t border-zinc-200 pt-4">
                    <div className="text-xs font-mono font-bold text-black uppercase tracking-wider">
                        Rate your experience with {driverProfile.name}
                    </div>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="p-1 transition-transform hover:scale-125"
                            >
                                <Star
                                    className={`w-7 h-7 ${(hoverRating || rating) >= star
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-zinc-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Driver Tip Selection */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                        <span className="flex items-center gap-1 font-bold text-black">
                            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                            Add Driver Tip
                        </span>
                        <span>100% goes to {driverProfile.name}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {[0, 500, 1000, 2000].map((tip) => (
                            <button
                                key={tip}
                                onClick={() => setSelectedTip(tip)}
                                className={`py-2 text-xs font-mono font-bold rounded border transition-all ${selectedTip === tip
                                    ? 'bg-black text-white border-black'
                                    : 'bg-zinc-50 text-black border-zinc-200 hover:border-zinc-400'
                                    }`}
                            >
                                {tip === 0 ? 'No Tip' : `₦${tip}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Done CTA */}
                <button
                    onClick={handleFinish}
                    className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-mono font-bold uppercase text-xs tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all border border-black mt-2"
                >
                    <History className="w-4 h-4 text-emerald-400" />
                    <span>View Trip History & Receipt</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
