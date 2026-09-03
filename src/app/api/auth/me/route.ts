import { NextResponse } from 'next/server';
import { MOCK_PASSENGER } from '@/store/useAuthStore';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
            { success: false, message: 'Unauthorized, missing Bearer token' },
            { status: 401 }
        );
    }

    return NextResponse.json({
        success: true,
        user: MOCK_PASSENGER,
    });
}
