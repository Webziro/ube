import { RideStatus, LocationPoint, VehicleTier, RiderProfile, TripReceipt } from '@/types/ride';

export interface RideSessionServer {
    id: string;
    status: RideStatus;
    passengerId: string;
    driverId?: string;
    pickup: LocationPoint;
    dropoff: LocationPoint;
    selectedTier: VehicleTier;
    estimatedFare: number;
    distanceKm: number;
    durationMins: number;
    driverLocation: { lat: number; lng: number };
    driverHeading: number;
    pinCode: string;
    createdAt: string;
    updatedAt: string;
    receipt?: TripReceipt;
}

type SSEListener = (data: any) => void;

// In-memory singleton state on the server
class RideStateServerManager {
    private activeRide: RideSessionServer | null = null;
    private listeners: Set<SSEListener> = new Set();
    private driversNearby = [
        {
            id: 'drv_001',
            name: 'Babatunde Lawal',
            rating: 4.96,
            lat: 6.4385,
            lng: 3.4112,
            vehicle: 'Toyota Camry (LAG-849-XY)',
            tier: 'Ube Comfort',
            isOnline: true,
        },
        {
            id: 'drv_002',
            name: 'Chinedu Okafor',
            rating: 4.88,
            lat: 6.4291,
            lng: 3.4245,
            vehicle: 'Honda Accord (KJA-230-AA)',
            tier: 'Ube Go',
            isOnline: true,
        },
        {
            id: 'drv_003',
            name: 'Kemi Adebayo',
            rating: 4.98,
            lat: 6.4520,
            lng: 3.4710,
            vehicle: 'Lexus ES350 (VI-990-EX)',
            tier: 'Ube Exec',
            isOnline: true,
        },
    ];

    public getActiveRide(): RideSessionServer | null {
        return this.activeRide;
    }

    public getNearbyDrivers() {
        return this.driversNearby;
    }

    public subscribe(listener: SSEListener) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    public broadcast(event: string, payload: any) {
        const message = { event, payload, timestamp: new Date().toISOString() };
        this.listeners.forEach((listener) => listener(message));
    }

    public createRideRequest(data: {
        passengerId: string;
        pickup: LocationPoint;
        dropoff: LocationPoint;
        selectedTier: VehicleTier;
        estimatedFare: number;
        distanceKm: number;
    }): RideSessionServer {
        const pinCode = Math.floor(1000 + Math.random() * 9000).toString();
        const ride: RideSessionServer = {
            id: `ride_${Date.now()}`,
            status: 'SEARCHING',
            passengerId: data.passengerId,
            pickup: data.pickup,
            dropoff: data.dropoff,
            selectedTier: data.selectedTier,
            estimatedFare: data.estimatedFare,
            distanceKm: data.distanceKm,
            durationMins: Math.round(data.distanceKm * 3.5),
            driverLocation: { lat: 6.4385, lng: 3.4112 },
            driverHeading: 45,
            pinCode,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.activeRide = ride;
        this.broadcast('RIDE_REQUESTED', ride);

        // Async persistence to MongoDB if configured
        (async () => {
            try {
                const { connectToDatabase } = await import('@/lib/mongodb');
                const conn = await connectToDatabase();
                if (conn) {
                    const { RideModel } = await import('@/models/Ride');
                    await RideModel.create(ride);
                }
            } catch (err) {
                console.error('Failed to persist ride to MongoDB:', err);
            }
        })();

        return ride;
    }

    public acceptDispatch(rideId: string, driverId: string): RideSessionServer | null {
        if (!this.activeRide || this.activeRide.id !== rideId) return null;
        this.activeRide.status = 'ACCEPTED';
        this.activeRide.driverId = driverId;
        this.activeRide.updatedAt = new Date().toISOString();
        this.broadcast('DISPATCH_ACCEPTED', this.activeRide);

        // Async update in MongoDB
        (async () => {
            try {
                const { connectToDatabase } = await import('@/lib/mongodb');
                const conn = await connectToDatabase();
                if (conn) {
                    const { RideModel } = await import('@/models/Ride');
                    await RideModel.updateOne(
                        { id: rideId },
                        { $set: { status: 'ACCEPTED', driverId, updatedAt: new Date() } }
                    );
                }
            } catch (err) {
                console.error('Failed to update ride acceptance in MongoDB:', err);
            }
        })();

        return this.activeRide;
    }

    public updateRideStatus(rideId: string, status: RideStatus, driverLoc?: { lat: number; lng: number }): RideSessionServer | null {
        if (!this.activeRide || this.activeRide.id !== rideId) return null;
        this.activeRide.status = status;
        if (driverLoc) {
            this.activeRide.driverLocation = driverLoc;
        }
        this.activeRide.updatedAt = new Date().toISOString();

        if (status === 'COMPLETED') {
            this.activeRide.receipt = {
                baseFare: 1500,
                distanceKm: this.activeRide.distanceKm,
                durationMins: this.activeRide.durationMins,
                distanceFare: Math.max(0, this.activeRide.estimatedFare - 1800),
                serviceFee: 300,
                totalFare: this.activeRide.estimatedFare,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
        }

        this.broadcast('RIDE_STATUS_UPDATED', this.activeRide);

        // Async update in MongoDB
        (async () => {
            try {
                const { connectToDatabase } = await import('@/lib/mongodb');
                const conn = await connectToDatabase();
                if (conn) {
                    const { RideModel } = await import('@/models/Ride');
                    await RideModel.updateOne(
                        { id: rideId },
                        { $set: { status, driverLocation: this.activeRide?.driverLocation, receipt: this.activeRide?.receipt, updatedAt: new Date() } }
                    );
                }
            } catch (err) {
                console.error('Failed to update ride status in MongoDB:', err);
            }
        })();

        return this.activeRide;
    }

    public updateDriverLocation(rideId: string, lat: number, lng: number, heading: number) {
        if (this.activeRide && this.activeRide.id === rideId) {
            this.activeRide.driverLocation = { lat, lng };
            this.activeRide.driverHeading = heading;
            this.broadcast('DRIVER_LOCATION_TICK', { rideId, lat, lng, heading });
        }
    }

    public cancelRide(rideId: string) {
        if (this.activeRide && this.activeRide.id === rideId) {
            this.activeRide.status = 'CANCELLED';
            this.broadcast('RIDE_CANCELLED', { rideId });
            const currentId = this.activeRide.id;
            this.activeRide = null;

            (async () => {
                try {
                    const { connectToDatabase } = await import('@/lib/mongodb');
                    const conn = await connectToDatabase();
                    if (conn) {
                        const { RideModel } = await import('@/models/Ride');
                        await RideModel.updateOne(
                            { id: currentId },
                            { $set: { status: 'CANCELLED', updatedAt: new Date() } }
                        );
                    }
                } catch (err) {
                    console.error('Failed to cancel ride in MongoDB:', err);
                }
            })();
        }
    }
}

// Global server instance
const globalForServer = globalThis as unknown as { rideStateServerManager?: RideStateServerManager };
export const rideServerManager = globalForServer.rideStateServerManager ?? new RideStateServerManager();
if (process.env.NODE_ENV !== 'production') globalForServer.rideStateServerManager = rideServerManager;
