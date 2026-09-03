import { NextResponse } from 'next/server';
import { MOCK_PASSENGER, MOCK_DRIVER_USER } from '@/store/useAuthStore';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phoneOrEmail, pin } = body;

        if (!phoneOrEmail) {
            return NextResponse.json(
                { success: false, message: 'Phone number or email is required' },
                { status: 400 }
            );
        }

        // Determine matching profile
        const isDriver = phoneOrEmail.toLowerCase().includes('driver') || phoneOrEmail.includes('809');
        const user = isDriver ? MOCK_DRIVER_USER : MOCK_PASSENGER;

        const token = `jwt_ube_${user.role}_${Date.now()}`;
        const expiresAt = new Date(Date.now() + 86400 * 1000).toISOString();

        return NextResponse.json({
            success: true,
            message: 'Authentication successful',
            session: {
                user,
                token,
                expiresAt,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
