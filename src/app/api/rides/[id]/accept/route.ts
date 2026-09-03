import { NextResponse } from 'next/server';
import { rideServerManager } from '@/lib/rideStateServer';

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rideId } = await context.params;
        const body = await request.json().catch(() => ({}));
        const driverId = body.driverId || 'usr_drv_002';

        const updatedRide = rideServerManager.acceptDispatch(rideId, driverId);

        if (!updatedRide) {
            return NextResponse.json(
                { success: false, message: 'Ride not found or already accepted' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Dispatch accepted by driver',
            ride: updatedRide,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Error accepting dispatch' },
            { status: 500 }
        );
    }
}
