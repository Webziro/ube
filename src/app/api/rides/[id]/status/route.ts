import { NextResponse } from 'next/server';
import { rideServerManager } from '@/lib/rideStateServer';
import { RideStatus } from '@/types/ride';

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rideId } = await context.params;
        const body = await request.json();
        const { status, driverLocation } = body as { status: RideStatus; driverLocation?: { lat: number; lng: number } };

        if (!status) {
            return NextResponse.json(
                { success: false, message: 'Status field is required' },
                { status: 400 }
            );
        }

        const updatedRide = rideServerManager.updateRideStatus(rideId, status, driverLocation);

        if (!updatedRide) {
            return NextResponse.json(
                { success: false, message: 'Ride session not found' },
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
