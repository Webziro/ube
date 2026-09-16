import { NextResponse } from 'next/server';
import { rideServerManager } from '@/lib/rideStateServer';
import { RideStatus } from '@/types/ride';

// POST /api/rides/active/status — convenience alias for /api/rides/[id]/status when id='active'
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { status, driverLocation } = body as {
            status: RideStatus;
            driverLocation?: { lat: number; lng: number };
        };

        if (!status) {
            return NextResponse.json(
                { success: false, message: 'Status field is required' },
                { status: 400 }
            );
        }

        if (status === 'CANCELLED' || status === 'IDLE') {
            rideServerManager.cancelRide('active');
            return NextResponse.json({
                success: true,
                message: 'Ride cancelled and broadcast to all connected clients',
            });
        }

        const updatedRide = rideServerManager.updateRideStatus('active', status, driverLocation);

        if (!updatedRide) {
            return NextResponse.json(
                { success: false, message: 'No active ride session found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Ride status updated to ${status}`,
            ride: updatedRide,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Error updating status' },
            { status: 500 }
        );
    }
}
