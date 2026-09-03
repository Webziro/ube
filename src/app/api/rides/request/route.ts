import { NextResponse } from 'next/server';
import { rideServerManager } from '@/lib/rideStateServer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { passengerId, pickup, dropoff, selectedTier, estimatedFare, distanceKm } = body;

        if (!pickup || !dropoff || !selectedTier) {
            return NextResponse.json(
                { success: false, message: 'Invalid payload: Pickup, dropoff, and tier required.' },
                { status: 400 }
            );
        }

        const ride = rideServerManager.createRideRequest({
            passengerId: passengerId || 'usr_pass_001',
            pickup,
            dropoff,
            selectedTier,
            estimatedFare: estimatedFare || 2500,
            distanceKm: distanceKm || 5.2,
        });

        return NextResponse.json({
            success: true,
            message: 'Ride request created and dispatched to nearby drivers',
            ride,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to request ride' },
            { status: 500 }
        );
    }
}
