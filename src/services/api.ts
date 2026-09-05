import { useRideStore } from '@/store/useRideStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useWalletStore } from '@/store/useWalletStore';
import { LocationPoint, VehicleTier, RideStatus } from '@/types/ride';

class ApiService {
    private sseSource: EventSource | null = null;
    private pollingInterval: NodeJS.Timeout | null = null;

    public initRealtimeGateway() {
        if (typeof window === 'undefined') return;

        // 1. Initialize EventSource SSE Gateway
        if (!this.sseSource) {
            try {
                this.sseSource = new EventSource('/api/gateway');

                this.sseSource.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        if (data.event === 'CONNECTED') {
                            if (data.activeRide) {
                                // Only sync if there's a real active ride on the server
                                this.syncRideFromServer(data.activeRide);
                            }
                            // Do NOT reset client if server has no ride — client may have its own IDLE state
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

                this.sseSource.onerror = () => {
                    // Gateway reconnecting silently
                };
            } catch (e) {
                console.error('Failed to initialize SSE Gateway:', e);
            }
        }

        // 2. Start HTTP Polling Fallback — only sync when ride is actively in-progress
        if (!this.pollingInterval) {
            this.pollingInterval = setInterval(async () => {
                try {
                    const clientStatus = useRideStore.getState().status;
                    // Skip polling entirely when client is idle — avoids flicker for unauthenticated users
                    if (clientStatus === 'IDLE') return;

                    const res = await fetch('/api/rides/active');
                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.ride) {
                            this.syncRideFromServer(data.ride);
                        } else if (data.success && !data.ride && clientStatus === 'SEARCHING') {
                            // Only reset if client is stuck in SEARCHING and server has nothing
                            useRideStore.getState().resetState();
                        }
                    }
                } catch (e) {
                    // Ignore network polling glitches
                }
            }, 1500);
        }
    }

    private syncRideFromServer(ride: any) {
        if (!ride) return;
        const store = useRideStore.getState();

        const newStatus = ride.status as RideStatus;
        if (newStatus === 'CANCELLED' || newStatus === 'IDLE') {
            store.resetState();
            return;
        }

        const isNowCompleted = newStatus === 'COMPLETED' && store.status !== 'COMPLETED';

        store.syncFromBroadcast({
            status: newStatus,
            pickup: ride.pickup,
            dropoff: ride.dropoff,
            selectedTier: ride.selectedTier,
            estimatedFare: ride.estimatedFare,
            distanceKm: ride.distanceKm,
            durationMins: ride.durationMins,
            driverLocation: ride.driverLocation || store.driverLocation,
            pinCode: ride.pinCode || store.pinCode,
            lastReceipt: ride.receipt || store.lastReceipt,
            ratingModalOpen: newStatus === 'COMPLETED',
        });

        // Deduct fare from wallet if ride just completed
        if (isNowCompleted && ride.estimatedFare) {
            const walletStore = useWalletStore.getState();
            if (walletStore.paymentMethod === 'wallet') {
                walletStore.deductFunds(ride.estimatedFare, `Ride Fare (${ride.selectedTier})`);
            }
        }
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
            const data = await res.json();
            if (data.ride) {
                this.syncRideFromServer(data.ride);
            }
            return data;
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
            const data = await res.json();
            if (data.ride) {
                this.syncRideFromServer(data.ride);
            }
            return data;
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
            const data = await res.json();
            if (data.ride) {
                this.syncRideFromServer(data.ride);
            }
            return data;
        } catch (e) {
            const store = useRideStore.getState();
            if (status === 'ARRIVED_AT_PICKUP') store.driverArrived();
            else if (status === 'IN_TRIP') store.startTrip();
            else if (status === 'COMPLETED') store.completeTrip();
            else if (status === 'IDLE' || status === 'CANCELLED') store.resetState();
            return { success: true };
        }
    }

    public async cancelRide() {
        try {
            await fetch('/api/rides/active/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CANCELLED' }),
            });
        } catch (e) {
            console.error('Cancel ride API failed:', e);
        }
        useRideStore.getState().resetState();
    }
}

export const apiService = new ApiService();
