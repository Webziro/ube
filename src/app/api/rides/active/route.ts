import { NextResponse } from 'next/server';
import { rideServerManager } from '@/lib/rideStateServer';

export async function GET() {
    const activeRide = rideServerManager.getActiveRide();
    return NextResponse.json({
        success: true,
        ride: activeRide,
    });
}
