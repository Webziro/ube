export type RideStatus =
    | 'IDLE'
    | 'SEARCHING'
    | 'ACCEPTED'
    | 'ARRIVED_AT_PICKUP'
    | 'IN_TRIP'
    | 'COMPLETED'
    | 'CANCELLED';

export type UserRole = 'passenger' | 'driver' | 'split';

export interface LocationPoint {
    lat: number;
    lng: number;
    address: string;
    name: string;
}

export type VehicleTier = 'Ube Go' | 'Ube Comfort' | 'Ube Exec' | 'Ube XL';

export interface VehicleOption {
    id: VehicleTier;
    name: string;
    tag: string;
    baseFare: number;
    perKmRate: number;
    etaMinutes: number;
    capacity: number;
    description: string;
}

export interface RiderProfile {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    totalTrips: number;
    phone: string;
    vehicle: {
        make: string;
        model: string;
        color: string;
        plate: string;
    };
}

export interface TripReceipt {
    baseFare: number;
    distanceKm: number;
    durationMins: number;
    distanceFare: number;
    serviceFee: number;
    totalFare: number;
    timestamp: string;
}
