import { NextResponse } from 'next/server';
import { clearAuthCookie, getAuthSessionFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { SessionModel } from '@/models/Session';

export async function POST() {
    try {
        const sessionPayload = await getAuthSessionFromRequest();

        if (sessionPayload?.sessionId) {
            const conn = await connectToDatabase();
            if (conn) {
                await SessionModel.updateOne(
                    { sessionId: sessionPayload.sessionId },
                    { $set: { isActive: false } }
                );
            }
        }

        await clearAuthCookie();

        return NextResponse.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error: any) {
        await clearAuthCookie();
        return NextResponse.json({
            success: true,
            message: 'Logged out',
        });
    }
}
