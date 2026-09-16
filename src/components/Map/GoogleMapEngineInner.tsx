'use client';

import React, { useEffect } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { useRideStore } from '@/store/useRideStore';

declare global {
    interface Window {
        gm_authFailure?: () => void;
    }
}

// Silver/High-contrast Dark-monochrome Google Maps Styling matching Ube PWA design
const MONOCHROME_MAP_STYLE: google.maps.MapTypeStyle[] = [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
    {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#bdbdbd' }],
    },
    {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#eeeeee' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#757575' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }],
    },
    {
        featureType: 'road.arterial',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#757575' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#dadada' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#616161' }],
    },
    {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9e9e9e' }],
    },
    {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{ color: '#e5e5e5' }],
    },
    {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{ color: '#eeeeee' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#c9c9c9' }],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9e9e9e' }],
    },
];

interface MapContentProps {
    interactive: boolean;
}

function GoogleMapContent({ interactive }: MapContentProps) {
    const map = useMap();
    const { pickup, dropoff, driverLocation, driverHeading, status } = useRideStore();

    // Auto fit map bounds when pickup/dropoff/driver locations update
    useEffect(() => {
        if (!map || typeof google === 'undefined' || !google.maps) return;

        const bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: pickup.lat, lng: pickup.lng });
        bounds.extend({ lat: dropoff.lat, lng: dropoff.lng });

        if (status === 'ACCEPTED' || status === 'IN_TRIP') {
            bounds.extend({ lat: driverLocation.lat, lng: driverLocation.lng });
        }

        map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
    }, [map, pickup.lat, pickup.lng, dropoff.lat, dropoff.lng, status]);

    // Manage Markers (Pickup, Dropoff, Driver) & Polylines using AdvancedMarkerElement when available
    useEffect(() => {
        if (!map || typeof google === 'undefined' || !google.maps) return;

        const createMarkerInstance = (
            position: { lat: number; lng: number },
            title: string,
            svgMarkup: string,
            size = 32
        ) => {
            const hasAdvanced =
                google.maps.marker && typeof google.maps.marker.AdvancedMarkerElement === 'function';

            if (hasAdvanced) {
                const el = document.createElement('div');
                el.innerHTML = svgMarkup;
                return new google.maps.marker.AdvancedMarkerElement({
                    position,
                    map,
                    title,
                    content: el,
                });
            } else {
                const icon: google.maps.Icon = {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgMarkup),
                    scaledSize: new google.maps.Size(size, size),
                    anchor: new google.maps.Point(size / 2, size / 2),
                };
                return new google.maps.Marker({
                    position,
                    map,
                    title,
                    icon,
                });
            }
        };

        // 1. Pickup Marker (Black Circle Pin)
        const pickupSvg = `
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="black" stroke="white" stroke-width="3"/>
                <circle cx="16" cy="16" r="5" fill="white"/>
            </svg>
        `;
        const pickupMarker = createMarkerInstance(
            { lat: pickup.lat, lng: pickup.lng },
            `Pickup: ${pickup.name}`,
            pickupSvg,
            32
        );

        // 2. Dropoff Marker (Black Square Pin)
        const dropoffSvg = `
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="28" height="28" rx="4" fill="black" stroke="white" stroke-width="3"/>
                <rect x="11" y="11" width="10" height="10" fill="white"/>
            </svg>
        `;
        const dropoffMarker = createMarkerInstance(
            { lat: dropoff.lat, lng: dropoff.lng },
            `Destination: ${dropoff.name}`,
            dropoffSvg,
            32
        );

        // 3. Driver Marker (Rotated Arrow Pin)
        const driverSvg = `
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${driverHeading}deg);">
                <circle cx="20" cy="20" r="18" fill="black" stroke="white" stroke-width="3"/>
                <path d="M20 8L29 29L20 24L11 29L20 8Z" fill="white"/>
            </svg>
        `;
        const driverMarker = createMarkerInstance(
            { lat: driverLocation.lat, lng: driverLocation.lng },
            'Driver: Tunde Bakare',
            driverSvg,
            40
        );

        // 4. Polyline Route Line
        let pathCoords: google.maps.LatLngLiteral[] = [];
        if (status === 'ACCEPTED') {
            pathCoords = [
                { lat: driverLocation.lat, lng: driverLocation.lng },
                { lat: pickup.lat, lng: pickup.lng },
            ];
        } else {
            pathCoords = [
                { lat: pickup.lat, lng: pickup.lng },
                { lat: dropoff.lat, lng: dropoff.lng },
            ];
        }

        const polyline = new google.maps.Polyline({
            path: pathCoords,
            geodesic: true,
            strokeColor: '#000000',
            strokeOpacity: 0.9,
            strokeWeight: 5,
            map,
        });

        return () => {
            if ('map' in pickupMarker) (pickupMarker as any).map = null;
            if ('setMap' in pickupMarker) (pickupMarker as any).setMap(null);

            if ('map' in dropoffMarker) (dropoffMarker as any).map = null;
            if ('setMap' in dropoffMarker) (dropoffMarker as any).setMap(null);

            if ('map' in driverMarker) (driverMarker as any).map = null;
            if ('setMap' in driverMarker) (driverMarker as any).setMap(null);

            polyline.setMap(null);
        };
    }, [
        map,
        pickup.lat,
        pickup.lng,
        pickup.name,
        dropoff.lat,
        dropoff.lng,
        dropoff.name,
        driverLocation.lat,
        driverLocation.lng,
        driverHeading,
        status,
    ]);

    return null;
}

interface GoogleMapEngineInnerProps {
    apiKey: string;
    interactive?: boolean;
    onError?: () => void;
}

export default function GoogleMapEngineInner({ apiKey, interactive = true, onError }: GoogleMapEngineInnerProps) {
    const { pickup } = useRideStore();

    useEffect(() => {
        window.gm_authFailure = () => {
            console.warn('Google Maps authentication failed (invalid API key, missing billing, or restricted domain). Triggering Leaflet fallback.');
            if (onError) onError();
        };
    }, [onError]);

    return (
        <APIProvider apiKey={apiKey}>
            <Map
                style={{ width: '100%', height: '100%' }}
                defaultCenter={{ lat: pickup.lat, lng: pickup.lng }}
                defaultZoom={13}
                mapId="ube_map_style"
                gestureHandling={interactive ? 'greedy' : 'none'}
                disableDefaultUI={true}
                styles={MONOCHROME_MAP_STYLE}
            >
                <GoogleMapContent interactive={interactive} />
            </Map>
        </APIProvider>
    );
}
