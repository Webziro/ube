import { NextResponse } from 'next/server';
import { rideServerManager } from '@/lib/rideStateServer';

// GET: Return the current active ride session
export async function GET() {
    const activeRide = rideServerManager.getActiveRide();
    return NextResponse.json({
        success: true,
        ride: activeRide, // null when no ride is active
    });
}

// DELETE: Force-clear the active server ride session (used by Reset button)
export async function DELETE() {
    rideServerManager.forceReset();
    return NextResponse.json({ success: true, message: 'Server ride state cleared' });
}
