import { useRideStore } from '@/store/useRideStore';
import { useAuthStore } from '@/store/useAuthStore';
import { LocationPoint, VehicleTier, RideStatus } from '@/types/ride';

class ApiService {
    private sseSource: EventSource | null = null;

    public initRealtimeGateway() {
        if (typeof window === 'undefined' || this.sseSource) return;

        try {
            this.sseSource = new EventSource('/api/gateway');

            this.sseSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.event === 'CONNECTED' && data.activeRide) {
                        this.syncRideFromServer(data.activeRide);
                    } else if (data.event === 'RIDE_REQUESTED' && data.payload) {
                        this.syncRideFromServer(data.payload);
                    } else if (data.event === 'DISPATCH_ACCEPTED' && data.payload) {
                        this.syncRideFromServer(data.payload);
                    } else if (data.event === 'RIDE_STATUS_UPDATED' && data.payload) {
                        this.syncRideFromServer(data.payload);
                    } else if (data.event === 'RIDE_CANCELLED') {
                        useRideStore.getState().resetState();
                    }
                } catch (err) {
                    console.error('SSE Message parse error:', err);
                }
            };

            this.sseSource.onerror = (err) => {
                console.warn('SSE Gateway reconnecting...', err);
            };
        } catch (e) {
            console.error('Failed to initialize SSE Gateway:', e);
        }
    }

    private syncRideFromServer(ride: any) {
        if (!ride) return;
        const store = useRideStore.getState();

        store.syncFromBroadcast({
            status: ride.status as RideStatus,
            pickup: ride.pickup,
            dropoff: ride.dropoff,
            selectedTier: ride.selectedTier,
            estimatedFare: ride.estimatedFare,
            distanceKm: ride.distanceKm,
            durationMins: ride.durationMins,
            driverLocation: ride.driverLocation || store.driverLocation,
            pinCode: ride.pinCode || store.pinCode,
            lastReceipt: ride.receipt || store.lastReceipt,
            ratingModalOpen: ride.status === 'COMPLETED',
        });
    }

    public async requestRide(params: {
        pickup: LocationPoint;
        dropoff: LocationPoint;
        selectedTier: VehicleTier;
        estimatedFare: number;
        distanceKm: number;
    }) {
        const currentUser = useAuthStore.getState().currentUser;
        try {
            const res = await fetch('/api/rides/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useAuthStore.getState().token || ''}`,
                },
                body: JSON.stringify({
                    passengerId: currentUser?.id || 'usr_pass_001',
                    ...params,
                }),
            });
            return await res.json();
        } catch (e) {
            console.error('API requestRide fallback to local store action', e);
            useRideStore.getState().requestRide();
            return { success: true };
        }
    }

    public async acceptDispatch(rideId?: string) {
        const currentUser = useAuthStore.getState().currentUser;
        try {
            const res = await fetch(`/api/rides/${rideId || 'active'}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useAuthStore.getState().token || ''}`,
                },
                body: JSON.stringify({
                    driverId: currentUser?.id || 'usr_drv_002',
                }),
            });
            return await res.json();
        } catch (e) {
            useRideStore.getState().acceptDispatch();
            return { success: true };
        }
    }

    public async updateStatus(status: RideStatus, driverLocation?: { lat: number; lng: number }) {
        try {
            const res = await fetch('/api/rides/active/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useAuthStore.getState().token || ''}`,
                },
                body: JSON.stringify({ status, driverLocation }),
            });
            return await res.json();
        } catch (e) {
            // Local fallback based on status
            const store = useRideStore.getState();
            if (status === 'ARRIVED_AT_PICKUP') store.driverArrived();
            else if (status === 'IN_TRIP') store.startTrip();
            else if (status === 'COMPLETED') store.completeTrip();
            else if (status === 'IDLE' || status === 'CANCELLED') store.resetState();
            return { success: true };
        }
    }
}

export const apiService = new ApiService();
