'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LocationPoint } from '@/types/ride';
import { MapPin, Navigation, Loader2, Search, X, Compass } from 'lucide-react';

// Comprehensive Lagos & Abuja Nigerian Location Dataset for instant autocomplete
export const POPULAR_LOCATIONS: LocationPoint[] = [
    // --- LAGOS LOCATIONS ---
    {
        name: 'Victoria Island (Eko Atlantic)',
        address: 'Ahmadu Bello Way, Victoria Island, Lagos',
        lat: 6.4281,
        lng: 3.4219,
    },
    {
        name: 'Lekki Phase 1 (Admiralty Way)',
        address: 'Admiralty Way, Lekki Phase 1, Lagos',
        lat: 6.4474,
        lng: 3.4723,
    },
    {
        name: 'Landmark Beach & Event Centre',
        address: 'Water Corporation Drive, Oniru, Victoria Island, Lagos',
        lat: 6.4237,
        lng: 3.4462,
    },
    {
        name: 'Eko Hotels & Suites',
        address: 'Plot 1415 Adetokunbo Ademola St, Victoria Island, Lagos',
        lat: 6.4255,
        lng: 3.4282,
    },
    {
        name: 'Banana Island',
        address: 'Ikoyi, Lagos',
        lat: 6.4632,
        lng: 3.4441,
    },
    {
        name: 'Ikoyi Golf Club',
        address: '19 Golf Course Rd, Ikoyi, Lagos',
        lat: 6.4523,
        lng: 3.4358,
    },
    {
        name: 'Ikeja City Mall (ICM)',
        address: 'Obafemi Awolowo Way, Alausa, Ikeja, Lagos',
        lat: 6.6133,
        lng: 3.3581,
    },
    {
        name: 'Ikeja GRA (Isaac John)',
        address: 'Isaac John Street, Ikeja GRA, Lagos',
        lat: 6.5898,
        lng: 3.3582,
    },
    {
        name: 'Murtala Muhammed Airport (MM2)',
        address: 'Local Airport Rd, Ikeja, Lagos',
        lat: 6.5774,
        lng: 3.3332,
    },
    {
        name: 'Yaba Tech Hub & Sabo',
        address: 'Herbert Macaulay Way, Yaba, Lagos',
        lat: 6.5095,
        lng: 3.3711,
    },
    {
        name: 'Unilag (University of Lagos)',
        address: 'University Road, Akoka, Yaba, Lagos',
        lat: 6.5177,
        lng: 3.397,
    },
    {
        name: 'Maryland Mall',
        address: '350-360 Ikorodu Road, Maryland, Lagos',
        lat: 6.5645,
        lng: 3.3672,
    },
    {
        name: 'Surulere Shopping Plaza',
        address: 'Adeniran Ogunsanya St, Surulere, Lagos',
        lat: 6.4952,
        lng: 3.3588,
    },
    {
        name: 'Chevron Drive',
        address: 'Lekki-Epe Expressway, Chevron, Lekki, Lagos',
        lat: 6.4389,
        lng: 3.5381,
    },
    {
        name: 'Victoria Garden City (VGC)',
        address: 'Lekki-Epe Expressway, VGC, Lagos',
        lat: 6.4665,
        lng: 3.5684,
    },
    {
        name: 'Ajah Jubilee Bridge',
        address: 'Ajah Roundabout, Lekki-Epe Expressway, Lagos',
        lat: 6.4674,
        lng: 3.5701,
    },

    // --- ABUJA LOCATIONS ---
    {
        name: 'Maitama District',
        address: 'Transcorp Hilton / Aguiyi Ironsi St, Maitama, Abuja',
        lat: 9.0765,
        lng: 7.4942,
    },
    {
        name: 'Wuse 2 (Aminu Kano Crescent)',
        address: 'Aminu Kano Crescent, Wuse 2, Abuja',
        lat: 9.0712,
        lng: 7.4721,
    },
    {
        name: 'Jabi Lake Mall',
        address: 'Bala Sokoto Way, Jabi, Abuja',
        lat: 9.0784,
        lng: 7.4241,
    },
    {
        name: 'Asokoro District',
        address: 'Asokoro, Abuja FCT',
        lat: 9.0435,
        lng: 7.521,
    },
    {
        name: 'Nnamdi Azikiwe International Airport',
        address: 'Airport Road, Abuja FCT',
        lat: 9.0065,
        lng: 7.2631,
    },
    {
        name: 'Central Business District (CBD)',
        address: 'Central Area, Abuja FCT',
        lat: 9.0579,
        lng: 7.4951,
    },
    {
        name: 'Gwarinpa Estate',
        address: '1st Avenue, Gwarinpa, Abuja',
        lat: 9.1102,
        lng: 7.4045,
    },
    {
        name: 'Utako Market & Park',
        address: 'Utako District, Abuja',
        lat: 9.0621,
        lng: 7.4421,
    },
    {
        name: 'Garki Area 11',
        address: 'Garki, Abuja FCT',
        lat: 9.0341,
        lng: 7.4892,
    },
    {
        name: 'Banex Plaza Wuse',
        address: 'Duala Street, Wuse 2, Abuja',
        lat: 9.0792,
        lng: 7.4651,
    },
];

interface LocationAutocompleteInputProps {
    value: string;
    onChange: (value: string) => void;
    onSelectLocation: (loc: LocationPoint) => void;
    placeholder: string;
    iconType: 'pickup' | 'dropoff';
    rightAction?: React.ReactNode;
}

export default function LocationAutocompleteInput({
    value,
    onChange,
    onSelectLocation,
    placeholder,
    iconType,
    rightAction,
}: LocationAutocompleteInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<LocationPoint[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter local suggestions & fetch online geocoded results when typing
    useEffect(() => {
        if (!value.trim() || value.length < 2) {
            setSuggestions(POPULAR_LOCATIONS.slice(0, 6));
            return;
        }

        const query = value.toLowerCase();

        // 1. Instant match from preset database (Lagos + Abuja)
        const localMatches = POPULAR_LOCATIONS.filter(
            (item) =>
                item.name.toLowerCase().includes(query) ||
                item.address.toLowerCase().includes(query)
        );

        setSuggestions(localMatches);

        // 2. Fetch live geocoding results via OpenStreetMap Nominatim restricted strictly to Nigeria (Lagos & Abuja bounds)
        const timer = setTimeout(async () => {
            try {
                setIsLoading(true);
                const searchParam = encodeURIComponent(`${value}, Nigeria`);
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${searchParam}&countrycodes=ng&addressdetails=1&limit=8`,
                    {
                        headers: {
                            'Accept-Language': 'en',
                        },
                    }
                );
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const fetched: LocationPoint[] = data.map((item: any) => ({
                            name: item.display_name.split(',')[0] || item.name || 'Selected Location',
                            address: item.display_name,
                            lat: parseFloat(item.lat),
                            lng: parseFloat(item.lon),
                        }));

                        // Merge fetched results with local matches avoiding exact duplicates
                        const combined = [...localMatches];
                        fetched.forEach((f) => {
                            if (!combined.some((c) => Math.abs(c.lat - f.lat) < 0.001 && Math.abs(c.lng - f.lng) < 0.001)) {
                                combined.push(f);
                            }
                        });
                        setSuggestions(combined);
                    }
                }
            } catch (err) {
                // Silently fallback to local matches
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle selecting a location item
    const handleSelect = (loc: LocationPoint) => {
        onChange(loc.name);
        onSelectLocation(loc);
        setIsOpen(false);
    };

    // Use current GPS location
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const currentLocation: LocationPoint = {
                    name: 'Current Location',
                    address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                onChange(currentLocation.name);
                onSelectLocation(currentLocation);
                setIsLocating(false);
                setIsOpen(false);
            },
            () => {
                // Default fallback to Victoria Island center if GPS denied
                const fallbackLocation: LocationPoint = POPULAR_LOCATIONS[0];
                onChange(fallbackLocation.name);
                onSelectLocation(fallbackLocation);
                setIsLocating(false);
                setIsOpen(false);
            },
            { timeout: 8000 }
        );
    };

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Input Pill Container */}
            <div className="bg-zinc-100 hover:bg-zinc-200/70 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition border border-transparent focus-within:border-black focus-within:bg-white focus-within:shadow-md">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Icon Indicator */}
                    {iconType === 'pickup' ? (
                        <div className="w-3 h-3 rounded-full bg-black shrink-0" />
                    ) : (
                        <div className="w-3 h-3 bg-black shrink-0" />
                    )}

                    <input
                        type="text"
                        value={value}
                        onFocus={(e) => {
                            setIsOpen(true);
                            onChange('');
                            e.target.dataset.placeholder = e.target.placeholder;
                            e.target.placeholder = '';
                        }}
                        onClick={() => {
                            if (value) {
                                onChange('');
                            }
                        }}
                        onBlur={(e) => {
                            if (e.target.dataset.placeholder) {
                                e.target.placeholder = e.target.dataset.placeholder;
                            }
                        }}
                        onChange={(e) => {
                            onChange(e.target.value);
                            setIsOpen(true);
                        }}
                        placeholder={placeholder}
                        className="w-full bg-transparent text-sm font-semibold text-black placeholder-zinc-500 focus:outline-none truncate"
                    />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    {isLoading && <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />}

                    {value && (
                        <button
                            type="button"
                            onClick={() => {
                                onChange('');
                                setIsOpen(true);
                            }}
                            className="p-1 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-200 transition"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}

                    {rightAction}
                </div>
            </div>

            {/* Autocomplete Suggestions Dropdown Popup */}
            {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-zinc-200 rounded-2xl shadow-2xl z-50 max-h-72 overflow-y-auto divide-y divide-zinc-100 animate-in fade-in duration-200">
                    {/* Use Current Location Button (Only for Pickup) */}
                    {iconType === 'pickup' && (
                        <button
                            type="button"
                            onClick={handleUseCurrentLocation}
                            className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-zinc-100 transition group"
                        >
                            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                                {isLocating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Navigation className="w-4 h-4" />
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-black">Use current location</div>
                                <div className="text-xs text-zinc-500 font-medium">Using GPS / Device location</div>
                            </div>
                        </button>
                    )}

                    {/* Suggestions List */}
                    {suggestions.length > 0 ? (
                        suggestions.map((item, index) => (
                            <button
                                key={`${item.name}-${index}`}
                                type="button"
                                onClick={() => handleSelect(item)}
                                className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-zinc-50 transition group"
                            >
                                <div className="w-8 h-8 rounded-xl bg-zinc-100 text-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-bold text-sm text-black truncate">{item.name}</div>
                                    <div className="text-xs text-zinc-500 font-medium truncate">{item.address}</div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="p-4 text-center text-xs text-zinc-500 font-medium flex items-center justify-center gap-2">
                            <Compass className="w-4 h-4 text-zinc-400" />
                            <span>No exact matching places found. Type address in Lagos or Abuja...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
