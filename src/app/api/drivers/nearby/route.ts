import { NextResponse } from 'next/server';
import { rideServerManager } from '@/lib/rideStateServer';

export async function GET() {
    const drivers = rideServerManager.getNearbyDrivers();
    return NextResponse.json({
        success: true,
        count: drivers.length,
        drivers,
    });
}
