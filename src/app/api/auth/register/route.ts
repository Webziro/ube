import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { SessionModel } from '@/models/Session';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { logSecurityEvent } from '@/lib/securityLogger';
import { UserProfile, VehicleInfo } from '@/types/auth';

export async function POST(request: Request) {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown Device';

    // 1. Rate Limiting Check
    const rateCheck = checkRateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
        return NextResponse.json(
            {
                success: false,
                message: `Too many registration attempts. Please retry after ${rateCheck.retryAfterSeconds} seconds.`,
            },
            { status: 429 }
        );
    }

    try {
        const body = await request.json();
        const { name, email, phone, password, pin, role, vehicle } = body;

        if (!name || !email || !role) {
            return NextResponse.json(
                { success: false, message: 'Please provide full name, email address, and account type.' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedPhone = phone && phone.trim().length > 3
            ? phone.trim()
            : `+234 8${Math.floor(100000000 + Math.random() * 900000000)}`;
        const rawPassword = password || pin || '1234';

        // 2. Connect to MongoDB
        const conn = await connectToDatabase();

        if (conn) {
            // Check if user already exists
            const existingUser = await UserModel.findOne({
                $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
            });

            if (existingUser) {
                return NextResponse.json(
                    { success: false, message: 'An account with this email or phone number already exists.' },
                    { status: 409 }
                );
            }

            // Hash password with bcrypt (12 rounds)
            const passwordHash = await hashPassword(rawPassword);

            const userId = `usr_${role}_${Date.now()}`;
            const newUserDoc = await UserModel.create({
                id: userId,
                fullName: name,
                email: normalizedEmail,
                phone: normalizedPhone,
                passwordHash,
                role: role === 'driver' ? 'driver' : 'passenger',
                rating: 5.0,
                totalTrips: 0,
                isVerified: true,
                avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
                vehicle: role === 'driver' ? (vehicle || {
                    make: 'Toyota',
                    model: 'Corolla',
                    color: 'Midnight Black',
                    plate: 'LAG-100-AB',
                    tier: 'Ube Go',
                }) : undefined,
            });

            const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            await SessionModel.create({
                sessionId,
                userId,
                deviceName: userAgent.split('(')[0] || 'Web Browser',
                ipAddress: ip,
                userAgent,
                isActive: true,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });

            // Sign JWT & set HTTP-Only Cookie
            const token = signToken({
                userId,
                email: normalizedEmail,
                role: newUserDoc.role,
                sessionId,
            });
            await setAuthCookie(token);

            // Audit log security event
            await logSecurityEvent({
                userId,
                eventType: 'LOGIN_SUCCESS',
                ipAddress: ip,
                userAgent,
                details: 'Account registered and logged in',
            });

            const userProfile: UserProfile = {
                id: newUserDoc.id,
                name: newUserDoc.fullName,
                email: newUserDoc.email,
                phone: newUserDoc.phone,
                role: newUserDoc.role as UserProfile['role'],
                avatar: newUserDoc.avatarUrl ?? '',
                rating: newUserDoc.rating,
                totalTrips: newUserDoc.totalTrips,
                isVerified: newUserDoc.isVerified,
                createdAt: newUserDoc.createdAt?.toISOString() ?? new Date().toISOString(),
                vehicle: newUserDoc.vehicle
                    ? {
                        ...newUserDoc.vehicle,
                        tier: newUserDoc.vehicle.tier as VehicleInfo['tier'],
                    }
                    : undefined,
                earnings: newUserDoc.earnings,
            };

            return NextResponse.json({
                success: true,
                message: 'Account created successfully',
                session: {
                    user: userProfile,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
            });
        } else {
            // Fallback for environment without MongoDB connection
            const passwordHash = await hashPassword(rawPassword);
            const userId = `usr_${role}_${Date.now()}`;
            const sessionId = `sess_${Date.now()}`;
            const token = signToken({
                userId,
                email: normalizedEmail,
                role,
                sessionId,
            });
            await setAuthCookie(token);

            const newUser: UserProfile = {
                id: userId,
                name,
                email: normalizedEmail,
                phone: normalizedPhone,
                role,
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
                rating: 5.0,
                totalTrips: 0,
                isVerified: true,
                createdAt: new Date().toISOString(),
                vehicle,
                earnings: role === 'driver' ? 0 : undefined,
            };

            return NextResponse.json({
                success: true,
                message: 'User registered successfully',
                session: {
                    user: newUser,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
            });
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Server error during registration' },
            { status: 500 }
        );
    }
}
