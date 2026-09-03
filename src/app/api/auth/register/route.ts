import { NextResponse } from 'next/server';
import { UserProfile } from '@/types/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, role, vehicle } = body;

        if (!name || !email || !phone || !role) {
            return NextResponse.json(
                { success: false, message: 'Missing required registration fields' },
                { status: 400 }
            );
        }

        const newUser: UserProfile = {
            id: `usr_${role}_${Date.now()}`,
            name,
            email,
            phone,
            role,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
            rating: 5.0,
            totalTrips: 0,
            isVerified: true,
            createdAt: new Date().toISOString(),
            vehicle: role === 'driver' ? (vehicle || {
                make: 'Toyota',
                model: 'Corolla',
                color: 'Midnight Black',
                plate: 'LAG-100-AB',
                tier: 'Ube Go',
            }) : undefined,
            earnings: role === 'driver' ? 0 : undefined,
        };

        const token = `jwt_ube_${newUser.role}_${Date.now()}`;
        const expiresAt = new Date(Date.now() + 86400 * 1000).toISOString();

        return NextResponse.json({
            success: true,
            message: 'User account registered successfully',
            session: {
                user: newUser,
                token,
                expiresAt,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
