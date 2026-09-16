import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { RideModel } from '@/models/Ride';

export async function GET() {
    try {
        const startTime = Date.now();
        const conn = await connectToDatabase();

        if (!conn) {
            return NextResponse.json(
                {
                    status: 'degraded',
                    database: 'disconnected',
                    message: 'Running in offline/fallback mode (MONGODB_URI not configured)',
                    timestamp: new Date().toISOString(),
                },
                { status: 200 }
            );
        }

        const dbLatencyMs = Date.now() - startTime;
        const [userCount, rideCount] = await Promise.all([
            UserModel.countDocuments(),
            RideModel.countDocuments(),
        ]);

        return NextResponse.json({
            status: 'healthy',
            database: 'connected',
            metrics: {
                latencyMs: dbLatencyMs,
                totalUsers: userCount,
                totalRides: rideCount,
                connectionState: conn.connection.readyState === 1 ? 'connected' : 'connecting',
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                database: 'error',
                message: error.message || 'Database connection error',
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
