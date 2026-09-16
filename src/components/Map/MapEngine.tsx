'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DynamicLeafletMap = dynamic(() => import('./MapEngineInner'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 border border-zinc-200 animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin mb-2" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                Loading Ube Map Engine...
            </span>
        </div>
    ),
});

const DynamicGoogleMap = dynamic(() => import('./GoogleMapEngineInner'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 border border-zinc-200 animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin mb-2" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                Loading Google Maps...
            </span>
        </div>
    ),
});

interface MapEngineProps {
    interactive?: boolean;
    isSelectingPickup?: boolean;
}

export default function MapEngine(props: MapEngineProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const [googleMapsError, setGoogleMapsError] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.gm_authFailure = () => {
                console.warn('Google Maps auth failure detected. Switching to Leaflet map engine fallback.');
                setGoogleMapsError(true);
            };
        }
    }, []);

    if (apiKey && apiKey.trim() !== '' && !apiKey.includes('YOUR_') && !googleMapsError) {
        return (
            <DynamicGoogleMap
                apiKey={apiKey}
                onError={() => setGoogleMapsError(true)}
                {...props}
            />
        );
    }

    return <DynamicLeafletMap {...props} />;
}
