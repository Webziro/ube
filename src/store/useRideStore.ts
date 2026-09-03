import { create } from 'zustand';
import {
    RideStatus,
    LocationPoint,
    VehicleTier,
    RiderProfile,
    UserRole,
    TripReceipt,
} from '@/types/ride';
import { PRESET_LOCATIONS, VEHICLE_OPTIONS, MOCK_DRIVER } from '@/constants/locations';

// Helper to calculate distance in KM between two lat/lng points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}

// Helper to calculate heading angle (degrees) from point A to point B
export function calculateHeading(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
    const x =
        Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
        Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
    let brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360;
}

export function calculateFare(tierId: VehicleTier, distanceKm: number): number {
    const option = VEHICLE_OPTIONS.find((v) => v.id === tierId) || VEHICLE_OPTIONS[0];
    const total = option.baseFare + Math.max(1, distanceKm) * option.perKmRate;
    return Math.round(total / 100) * 100; // Round to nearest 100 NGN
}

interface RideStoreState {
    // Core state
    status: RideStatus;
    activeRole: UserRole;
    pickup: LocationPoint;
    dropoff: LocationPoint;
    selectedTier: VehicleTier;
    estimatedFare: number;
    distanceKm: number;
    durationMins: number;

    // Driver simulation state
    driverLocation: { lat: number; lng: number };
    driverHeading: number;
    driverIsOnline: boolean;
    driverProfile: RiderProfile;
    pinCode: string;
    driverEarnings: number;
    driverCompletedTrips: number;

    // Timers & modal state
    searchTimer: number;
    dispatchTimer: number;
    simSpeed: number; // 1, 2, 5, 10
    ratingModalOpen: boolean;
    lastReceipt: TripReceipt | null;

    // Actions
    setRole: (role: UserRole) => void;
    setPickup: (loc: LocationPoint) => void;
    setDropoff: (loc: LocationPoint) => void;
    setSelectedTier: (tier: VehicleTier) => void;
    requestRide: () => void;
    cancelRide: () => void;
    acceptDispatch: () => void;
    declineDispatch: () => void;
    driverArrived: () => void;
    startTrip: () => void;
    completeTrip: () => void;
    resetState: () => void;
    toggleDriverOnline: () => void;
    setSimSpeed: (speed: number) => void;
    tickRiderPosition: () => void;
    setRatingModalOpen: (open: boolean) => void;
    syncFromBroadcast: (partial: Partial<RideStoreState>) => void;
}

let syncChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
        syncChannel = new BroadcastChannel('ube_ride_sync');
    } catch (e) {
        console.error('BroadcastChannel failed to initialize:', e);
    }
}

// Generate random 4-digit PIN for pickup verification
function generatePin(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Initial driver location (offset from Victoria Island)
const INITIAL_DRIVER_LOC = {
    lat: 6.4385,
    lng: 3.4112,
};

const defaultPickup = PRESET_LOCATIONS[0]; // Victoria Island
const defaultDropoff = PRESET_LOCATIONS[1]; // Lekki Phase 1
const defaultDistance = calculateDistance(
    defaultPickup.lat,
    defaultPickup.lng,
    defaultDropoff.lat,
    defaultDropoff.lng
);
const defaultFare = calculateFare('Ube Go', defaultDistance);

export const useRideStore = create<RideStoreState>((set, get) => {
    // Broadcast helper to notify other open tabs
    const broadcastStateChange = (updates: Partial<RideStoreState>) => {
        if (syncChannel) {
            try {
                syncChannel.postMessage(updates);
            } catch (e) {
                console.error('Broadcast error:', e);
            }
        }
    };

    return {
        status: 'IDLE',
        activeRole: 'passenger',
        pickup: defaultPickup,
        dropoff: defaultDropoff,
        selectedTier: 'Ube Go',
        estimatedFare: defaultFare,
        distanceKm: defaultDistance,
        durationMins: Math.round(defaultDistance * 3.5),

        driverLocation: INITIAL_DRIVER_LOC,
        driverHeading: 45,
        driverIsOnline: true,
        driverProfile: MOCK_DRIVER,
        pinCode: '4892',
        driverEarnings: 24500,
        driverCompletedTrips: 8,

        searchTimer: 15,
        dispatchTimer: 15,
        simSpeed: 1,
        ratingModalOpen: false,
        lastReceipt: null,

        setRole: (role) => {
            set({ activeRole: role });
        },

        setPickup: (loc) => {
            const { dropoff, selectedTier } = get();
            const dist = calculateDistance(loc.lat, loc.lng, dropoff.lat, dropoff.lng);
            const fare = calculateFare(selectedTier, dist);
            const updates = {
                pickup: loc,
                distanceKm: dist,
                durationMins: Math.round(dist * 3.5),
                estimatedFare: fare,
            };
            set(updates);
            broadcastStateChange(updates);
        },

        setDropoff: (loc) => {
            const { pickup, selectedTier } = get();
            const dist = calculateDistance(pickup.lat, pickup.lng, loc.lat, loc.lng);
            const fare = calculateFare(selectedTier, dist);
            const updates = {
                dropoff: loc,
                distanceKm: dist,
                durationMins: Math.round(dist * 3.5),
                estimatedFare: fare,
            };
            set(updates);
            broadcastStateChange(updates);
        },

        setSelectedTier: (tier) => {
            const { distanceKm } = get();
            const fare = calculateFare(tier, distanceKm);
            const updates = { selectedTier: tier, estimatedFare: fare };
            set(updates);
            broadcastStateChange(updates);
        },

        requestRide: () => {
            const pin = generatePin();
            const updates = {
                status: 'SEARCHING' as RideStatus,
                searchTimer: 15,
                dispatchTimer: 15,
                pinCode: pin,
            };
            set(updates);
            broadcastStateChange(updates);
        },

        cancelRide: () => {
            const updates = {
                status: 'IDLE' as RideStatus,
                driverLocation: INITIAL_DRIVER_LOC,
            };
            set(updates);
            broadcastStateChange(updates);
        },

        acceptDispatch: () => {
            const updates = {
                status: 'ACCEPTED' as RideStatus,
            };
            set(updates);
            broadcastStateChange(updates);
        },

        declineDispatch: () => {
            const updates = {
                status: 'SEARCHING' as RideStatus,
                dispatchTimer: 15,
            };
            set(updates);
            broadcastStateChange(updates);
        },

        driverArrived: () => {
            const { pickup } = get();
            const updates = {
                status: 'ARRIVED_AT_PICKUP' as RideStatus,
                driverLocation: { lat: pickup.lat, lng: pickup.lng },
            };
            set(updates);
            broadcastStateChange(updates);
        },

        startTrip: () => {
            const updates = {
                status: 'IN_TRIP' as RideStatus,
            };
            set(updates);
            broadcastStateChange(updates);
        },

        completeTrip: () => {
            const { estimatedFare, distanceKm, durationMins, driverEarnings, driverCompletedTrips, dropoff } =
                get();
            const receipt: TripReceipt = {
                baseFare: 1500,
                distanceKm,
                durationMins,
                distanceFare: Math.max(0, estimatedFare - 1800),
                serviceFee: 300,
                totalFare: estimatedFare,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            const updates = {
                status: 'COMPLETED' as RideStatus,
                driverLocation: { lat: dropoff.lat, lng: dropoff.lng },
                driverEarnings: driverEarnings + estimatedFare,
                driverCompletedTrips: driverCompletedTrips + 1,
                ratingModalOpen: true,
                lastReceipt: receipt,
            };
            set(updates);
            broadcastStateChange(updates);
        },

        resetState: () => {
            const updates = {
                status: 'IDLE' as RideStatus,
                driverLocation: INITIAL_DRIVER_LOC,
                driverHeading: 45,
                ratingModalOpen: false,
                lastReceipt: null,
            };
            set(updates);
            broadcastStateChange(updates);
        },

        toggleDriverOnline: () => {
            const { driverIsOnline } = get();
            const updates = { driverIsOnline: !driverIsOnline };
            set(updates);
            broadcastStateChange(updates);
        },

        setSimSpeed: (speed) => {
            set({ simSpeed: speed });
        },

        setRatingModalOpen: (open) => {
            set({ ratingModalOpen: open });
        },

        // Step driver position towards target destination in real time
        tickRiderPosition: () => {
            const { status, driverLocation, pickup, dropoff, simSpeed } = get();
            if (status !== 'ACCEPTED' && status !== 'IN_TRIP') return;

            const target = status === 'ACCEPTED' ? pickup : dropoff;
            const stepFactor = 0.05 * simSpeed; // Interpolation speed per tick

            const dLat = target.lat - driverLocation.lat;
            const dLng = target.lng - driverLocation.lng;
            const distanceRemaining = Math.sqrt(dLat * dLat + dLng * dLng);

            // If extremely close, auto transition to next state
            if (distanceRemaining < 0.0005) {
                if (status === 'ACCEPTED') {
                    get().driverArrived();
                } else if (status === 'IN_TRIP') {
                    get().completeTrip();
                }
                return;
            }

            const heading = calculateHeading(
                driverLocation.lat,
                driverLocation.lng,
                target.lat,
                target.lng
            );

            const nextLat = driverLocation.lat + dLat * stepFactor;
            const nextLng = driverLocation.lng + dLng * stepFactor;

            const updates = {
                driverLocation: { lat: nextLat, lng: nextLng },
                driverHeading: Math.round(heading),
            };

            set(updates);
            broadcastStateChange(updates);
        },

        syncFromBroadcast: (partial) => {
            set((state) => ({ ...state, ...partial }));
        },
    };
});

// Setup broadcast listener on window load
if (syncChannel) {
    syncChannel.onmessage = (event) => {
        if (event.data) {
            useRideStore.getState().syncFromBroadcast(event.data);
        }
    };
}
