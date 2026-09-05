'use client';

import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateTimePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectDateTime: (dateTimeString: string) => void;
}

export default function DateTimePickerModal({
    isOpen,
    onClose,
    onSelectDateTime,
}: DateTimePickerModalProps) {
    const [selectedDate, setSelectedDate] = useState<number>(6); // e.g. Sep 6
    const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
    const [isNow, setIsNow] = useState<boolean>(true);

    if (!isOpen) return null;

    const timeSlots = [
        '09:00 AM',
        '09:30 AM',
        '10:00 AM',
        '10:30 AM',
        '11:00 AM',
        '11:30 AM',
        '12:00 PM',
        '12:30 PM',
        '01:00 PM',
        '01:30 PM',
        '02:00 PM',
        '02:30 PM',
        '03:00 PM',
        '03:30 PM',
        '04:00 PM',
        '04:30 PM',
    ];

    const days = [
        { day: 'Su', date: 6, label: 'Today' },
        { day: 'Mo', date: 7, label: 'Tomorrow' },
        { day: 'Tu', date: 8, label: 'Tue' },
        { day: 'We', date: 9, label: 'Wed' },
        { day: 'Th', date: 10, label: 'Thu' },
        { day: 'Fr', date: 11, label: 'Fri' },
        { day: 'Sa', date: 12, label: 'Sat' },
    ];

    const handleConfirm = () => {
        if (isNow) {
            onSelectDateTime('Pickup now');
        } else {
            onSelectDateTime(`Sep ${selectedDate}, ${selectedTime}`);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white text-black w-full max-w-md rounded-2xl shadow-2xl overflow-hidden font-sans border border-zinc-200 p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <h3 className="text-xl font-bold tracking-tight text-black flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-black" />
                        <span>Date and time</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-zinc-100 transition"
                    >
                        <X className="w-5 h-5 text-black" />
                    </button>
                </div>

                {/* Pickup Now vs Schedule Toggle */}
                <div className="grid grid-cols-2 bg-zinc-100 p-1 rounded-xl font-bold text-xs">
                    <button
                        onClick={() => setIsNow(true)}
                        className={`py-2.5 rounded-lg transition ${isNow ? 'bg-black text-white shadow-sm' : 'text-zinc-600 hover:text-black'
                            }`}
                    >
                        Pickup now
                    </button>
                    <button
                        onClick={() => setIsNow(false)}
                        className={`py-2.5 rounded-lg transition ${!isNow ? 'bg-black text-white shadow-sm' : 'text-zinc-600 hover:text-black'
                            }`}
                    >
                        Reserve for later
                    </button>
                </div>

                {/* Calendar & Time Selection (when Reserve for later is selected) */}
                {!isNow && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                        {/* Month Header */}
                        <div className="flex items-center justify-between font-bold text-sm text-black px-1">
                            <span>September 2026</span>
                            <div className="flex items-center gap-1">
                                <button className="p-1 rounded hover:bg-zinc-100 text-zinc-600">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button className="p-1 rounded hover:bg-zinc-100 text-zinc-600">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1.5 text-center">
                            {days.map((item) => (
                                <button
                                    key={item.date}
                                    onClick={() => setSelectedDate(item.date)}
                                    className={`p-2 rounded-xl flex flex-col items-center justify-center transition ${selectedDate === item.date
                                            ? 'bg-black text-white font-bold'
                                            : 'bg-zinc-100 text-black hover:bg-zinc-200'
                                        }`}
                                >
                                    <span className="text-[10px] uppercase font-semibold text-zinc-400">
                                        {item.day}
                                    </span>
                                    <span className="text-sm font-bold">{item.date}</span>
                                </button>
                            ))}
                        </div>

                        {/* Time Select */}
                        <div className="space-y-1.5 pt-2">
                            <label className="text-xs font-bold text-black flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-black" />
                                <span>Select pickup time</span>
                            </label>
                            <select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full p-3.5 bg-zinc-100 rounded-xl border-none font-bold text-sm text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                            >
                                {timeSlots.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* CTA Button */}
                <button
                    onClick={handleConfirm}
                    className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-bold text-base rounded-xl transition shadow-md mt-2"
                >
                    Set pickup time
                </button>
            </div>
        </div>
    );
}
