import { NextResponse } from 'next/server';
import { getAuthSessionFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { UserProfile, VehicleInfo } from '@/types/auth';

export async function GET(request: Request) {
    try {
        const sessionPayload = await getAuthSessionFromRequest();

        if (!sessionPayload) {
            return NextResponse.json(
                { success: false, message: 'Unauthenticated or session expired' },
                { status: 401 }
            );
        }

        const conn = await connectToDatabase();

        if (conn) {
            const userDoc = await UserModel.findOne({ id: sessionPayload.userId });

            if (!userDoc) {
                return NextResponse.json(
                    { success: false, message: 'User account not found' },
                    { status: 404 }
                );
            }

            const userProfile: UserProfile = {
                id: userDoc.id,
                name: userDoc.fullName,
                email: userDoc.email,
                phone: userDoc.phone,
                role: userDoc.role as UserProfile['role'],
                avatar: userDoc.avatarUrl ?? '',
                rating: userDoc.rating,
                totalTrips: userDoc.totalTrips,
                isVerified: userDoc.isVerified,
                createdAt: userDoc.createdAt?.toISOString() ?? new Date().toISOString(),
                vehicle: userDoc.vehicle
                    ? {
                        ...userDoc.vehicle,
                        tier: userDoc.vehicle.tier as VehicleInfo['tier'],
                    }
                    : undefined,
                earnings: userDoc.earnings,
            };

            return NextResponse.json({
                success: true,
                user: userProfile,
            });
        } else {
            // Fallback for environment without MongoDB connection
            const isDriver = sessionPayload.role === 'driver';
            const mockUser: UserProfile = {
                id: sessionPayload.userId,
                name: isDriver ? 'Babatunde Lawal' : 'Alex Morgan',
                email: sessionPayload.email,
                phone: isDriver ? '+234 809 876 5432' : '+234 801 234 5678',
                role: sessionPayload.role as UserProfile['role'],
                avatar: isDriver
                    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                rating: isDriver ? 4.96 : 4.92,
                totalTrips: isDriver ? 384 : 42,
                isVerified: true,
                createdAt: '2025-08-15T09:30:00Z',
                earnings: isDriver ? 245000 : undefined,
                vehicle: isDriver
                    ? {
                        make: 'Toyota',
                        model: 'Camry Hybrid',
                        color: 'Onyx Black',
                        plate: 'LAG-849-XY',
                        tier: 'Ube Comfort',
                    }
                    : undefined,
            };

            return NextResponse.json({
                success: true,
                user: mockUser,
            });
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
