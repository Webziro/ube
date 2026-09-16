import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { SessionModel } from '@/models/Session';
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth';
import { checkRateLimit, clearRateLimit } from '@/lib/rateLimit';
import { logSecurityEvent } from '@/lib/securityLogger';
import { UserProfile, VehicleInfo } from '@/types/auth';

export async function POST(request: Request) {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown Device';

    try {
        const body = await request.json();
        const { phoneOrEmail, pin, password } = body;
        const inputCred = (phoneOrEmail || '').trim().toLowerCase();
        const rawSecret = password || pin || '';

        if (!inputCred) {
            return NextResponse.json(
                { success: false, message: 'Phone number or email is required' },
                { status: 400 }
            );
        }

        // 1. Check Rate Limits (per IP and credential)
        const rateCheckIp = checkRateLimit(`login_ip:${ip}`, 10, 15 * 60 * 1000);
        const rateCheckCred = checkRateLimit(`login_cred:${inputCred}`, 5, 15 * 60 * 1000);

        if (!rateCheckIp.allowed || !rateCheckCred.allowed) {
            const retrySec = Math.max(rateCheckIp.retryAfterSeconds, rateCheckCred.retryAfterSeconds);
            return NextResponse.json(
                {
                    success: false,
                    message: `Too many login attempts. Account temporarily locked for ${Math.ceil(retrySec / 60)} minutes.`,
                },
                { status: 429 }
            );
        }

        const conn = await connectToDatabase();

        if (conn) {
            // Find user by email or phone, including hidden passwordHash field
            const userDoc = await UserModel.findOne({
                $or: [{ email: inputCred }, { phone: inputCred }],
            }).select('+passwordHash');

            if (!userDoc) {
                await logSecurityEvent({
                    userId: 'anonymous',
                    eventType: 'LOGIN_FAILED',
                    ipAddress: ip,
                    userAgent,
                    details: `Failed login attempt for non-existent credential: ${inputCred}`,
                });
                return NextResponse.json(
                    { success: false, message: 'Invalid email/phone or security passcode' },
                    { status: 401 }
                );
            }

            // Check database lockout timer
            if (userDoc.lockoutUntil && userDoc.lockoutUntil > new Date()) {
                const remainingMins = Math.ceil((userDoc.lockoutUntil.getTime() - Date.now()) / 60000);
                return NextResponse.json(
                    {
                        success: false,
                        message: `Account is temporarily locked due to failed attempts. Retry in ${remainingMins} minutes.`,
                    },
                    { status: 429 }
                );
            }

            // Verify password / pin using bcrypt
            const isValid = await verifyPassword(rawSecret, userDoc.passwordHash);

            if (!isValid) {
                const failedCount = (userDoc.failedLoginAttempts || 0) + 1;
                let lockoutUntil: Date | null = null;

                if (failedCount >= 5) {
                    lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute temporary lockout
                    await logSecurityEvent({
                        userId: userDoc.id,
                        eventType: 'LOCKOUT_TRIGGERED',
                        ipAddress: ip,
                        userAgent,
                        details: `Temporary 15-minute lockout triggered after ${failedCount} failed attempts`,
                    });
                }

                await UserModel.updateOne(
                    { _id: userDoc._id },
                    {
                        $set: {
                            failedLoginAttempts: failedCount,
                            lockoutUntil,
                        },
                    }
                );

                await logSecurityEvent({
                    userId: userDoc.id,
                    eventType: 'LOGIN_FAILED',
                    ipAddress: ip,
                    userAgent,
                    details: `Failed password verification (Attempt ${failedCount})`,
                });

                return NextResponse.json(
                    { success: false, message: 'Invalid email/phone or security passcode' },
                    { status: 401 }
                );
            }

            // Reset failed login counters on successful authentication
            await UserModel.updateOne(
                { _id: userDoc._id },
                {
                    $set: {
                        failedLoginAttempts: 0,
                        lockoutUntil: null,
                    },
                }
            );

            clearRateLimit(`login_cred:${inputCred}`);

            const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            await SessionModel.create({
                sessionId,
                userId: userDoc.id,
                deviceName: userAgent.split('(')[0] || 'Web Browser',
                ipAddress: ip,
                userAgent,
                isActive: true,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });

            // Sign JWT token & set HTTP-Only Cookie
            const token = signToken({
                userId: userDoc.id,
                email: userDoc.email,
                role: userDoc.role,
                sessionId,
            });
            await setAuthCookie(token);

            await logSecurityEvent({
                userId: userDoc.id,
                eventType: 'LOGIN_SUCCESS',
                ipAddress: ip,
                userAgent,
                details: 'User authenticated successfully',
            });

            const userProfile: UserProfile = {
                id: userDoc.id,
                name: userDoc.fullName,
                email: userDoc.email ?? '',
                phone: userDoc.phone ?? '',
                role: (userDoc.role as UserProfile['role']) ?? 'passenger',
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
                message: 'Authentication successful',
                session: {
                    user: userProfile,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
            });
        } else {
            // Fallback for environment without MongoDB connection
            const isDriver = inputCred.includes('driver') || inputCred.includes('809');
            const role = isDriver ? 'driver' : 'passenger';
            const userId = isDriver ? 'usr_drv_002' : 'usr_pass_001';
            const sessionId = `sess_${Date.now()}`;

            const token = signToken({
                userId,
                email: inputCred.includes('@') ? inputCred : `${inputCred}@ube.ng`,
                role,
                sessionId,
            });
            await setAuthCookie(token);

            const mockUser: UserProfile = {
                id: userId,
                name: isDriver ? 'Babatunde Lawal' : 'Alex Morgan',
                email: isDriver ? 'babatunde.lawal@ube.ng' : 'alex.morgan@ube.ng',
                phone: isDriver ? '+234 809 876 5432' : '+234 801 234 5678',
                role,
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
                        tier: 'Ube Comfort' as VehicleInfo['tier'],
                    }
                    : undefined,
            };

            return NextResponse.json({
                success: true,
                message: 'Authentication successful',
                session: {
                    user: mockUser,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
            });
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
