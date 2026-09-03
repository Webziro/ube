'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useRideStore } from '@/store/useRideStore';

// Custom Marker Icons using Leaflet L.divIcon for high-contrast stark styling

const createPickupIcon = () =>
    L.divIcon({
        className: 'custom-pickup-marker',
        html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="absolute w-8 h-8 rounded-full bg-black/10 animate-ping"></div>
        <div class="w-7 h-7 rounded-full bg-black border-2 border-white flex items-center justify-center shadow-lg">
          <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
        </div>
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });

const createDropoffIcon = () =>
    L.divIcon({
        className: 'custom-dropoff-marker',
        html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="w-7 h-7 bg-black border-2 border-white flex items-center justify-center shadow-lg">
          <div class="w-2.5 h-2.5 bg-white"></div>
        </div>
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });

const createDriverIcon = (heading: number) =>
    L.divIcon({
        className: 'custom-driver-marker',
        html: `
      <div class="transition-transform duration-300 ease-out flex items-center justify-center w-10 h-10" style="transform: rotate(${heading}deg);">
        <div class="w-9 h-9 bg-black border-2 border-white rounded-full flex items-center justify-center shadow-xl">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L19 21L12 17L5 21L12 2Z" fill="white" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });

// Component to handle map clicks to select pickup/dropoff
function MapClickHandler({ isSelectingPickup }: { isSelectingPickup: boolean }) {
    const { setPickup, setDropoff } = useRideStore();

    useMapEvents({
        click(e) {
            const newLoc = {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                name: isSelectingPickup ? 'Selected Pickup Point' : 'Selected Destination',
                address: `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`,
            };

            if (isSelectingPickup) {
                setPickup(newLoc);
            } else {
                setDropoff(newLoc);
            }
        },
    });

    return null;
}

// Component to auto fit map bounds whenever points change
function MapBoundsManager() {
    const map = useMap();
    const { pickup, dropoff, driverLocation, status } = useRideStore();

    useEffect(() => {
        const points: L.LatLngTuple[] = [
            [pickup.lat, pickup.lng],
            [dropoff.lat, dropoff.lng],
        ];

        if (status === 'ACCEPTED' || status === 'IN_TRIP') {
            points.push([driverLocation.lat, driverLocation.lng]);
        }

        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true });
    }, [map, pickup, dropoff, driverLocation.lat, driverLocation.lng, status]);

    return null;
}

interface MapEngineProps {
    interactive?: boolean;
    isSelectingPickup?: boolean;
}

export default function MapEngineInner({
    interactive = true,
    isSelectingPickup = false,
}: MapEngineProps) {
    const { pickup, dropoff, driverLocation, driverHeading, status } = useRideStore();

    const pickupIcon = useMemo(() => createPickupIcon(), []);
    const dropoffIcon = useMemo(() => createDropoffIcon(), []);
    const driverIcon = useMemo(() => createDriverIcon(driverHeading), [driverHeading]);

    // Coordinates for polyline paths
    const pickupDropoffRoute: L.LatLngTuple[] = [
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng],
    ];

    const driverToPickupRoute: L.LatLngTuple[] = [
        [driverLocation.lat, driverLocation.lng],
        [pickup.lat, pickup.lng],
    ];

    return (
        <MapContainer
            center={[pickup.lat, pickup.lng]}
            zoom={13}
            zoomControl={false}
            scrollWheelZoom={interactive}
            dragging={interactive}
            className="w-full h-full z-0 bg-white"
        >
            {/* High-contrast Monochrome Map Tiles (CartoDB Positron / Voyager Grayscale) */}
            <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a> & &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <MapBoundsManager />
            {interactive && <MapClickHandler isSelectingPickup={isSelectingPickup} />}

            {/* Pickup Marker */}
            <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
                <Popup className="custom-popup font-mono text-xs">
                    <strong>PICKUP:</strong> {pickup.name}
                </Popup>
            </Marker>

            {/* Dropoff Marker */}
            <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon}>
                <Popup className="custom-popup font-mono text-xs">
                    <strong>DESTINATION:</strong> {dropoff.name}
                </Popup>
            </Marker>

            {/* Driver Marker (Visible when online or during ride) */}
            <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
                <Popup className="custom-popup font-mono text-xs">
                    <strong>DRIVER:</strong> Tunde Bakare
                </Popup>
            </Marker>

            {/* Route lines */}
            {status === 'ACCEPTED' && (
                <Polyline
                    positions={driverToPickupRoute}
                    pathOptions={{
                        color: '#000000',
                        weight: 4,
                        dashArray: '8, 8',
                        opacity: 0.8,
                    }}
                />
            )}

            {(status === 'IN_TRIP' || status === 'IDLE' || status === 'SEARCHING') && (
                <Polyline
                    positions={pickupDropoffRoute}
                    pathOptions={{
                        color: '#000000',
                        weight: 5,
                        opacity: 0.9,
                        lineCap: 'round',
                    }}
                />
            )}
        </MapContainer>
    );
}
