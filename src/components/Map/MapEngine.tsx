'use client';

import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./MapEngineInner'), {
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

interface MapEngineProps {
    interactive?: boolean;
    isSelectingPickup?: boolean;
}

export default function MapEngine(props: MapEngineProps) {
    return <DynamicMap {...props} />;
}
