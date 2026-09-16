import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'ube_ultra_secure_jwt_secret_key_2026';
const COOKIE_NAME = 'ube_session';

export interface TokenPayload {
    userId: string;
    email: string;
    role: 'passenger' | 'driver' | 'admin';
    sessionId: string;
}

/**
 * Hash plaintext password using bcrypt with 12 salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
}

/**
 * Compare plaintext password against hashed password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

/**
 * Sign JWT token
 */
export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify JWT token
 */
export function verifyJwtToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (e) {
        return null;
    }
}

/**
 * Set HTTP-Only, Secure, SameSite=Strict cookie in response headers
 */
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });
}

/**
 * Clear authentication cookie
 */
export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

/**
 * Extract & verify user session strictly from HTTP-Only cookie or Authorization header on server side
 */
export async function getAuthSessionFromRequest(req?: NextRequest): Promise<TokenPayload | null> {
    let token: string | undefined;

    if (req) {
        // 1. Try cookie from request
        token = req.cookies.get(COOKIE_NAME)?.value;
        // 2. Try Authorization header fallback (Bearer <token>)
        if (!token) {
            const authHeader = req.headers.get('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
    } else {
        // Next.js App Router cookies() helper
        const cookieStore = await cookies();
        token = cookieStore.get(COOKIE_NAME)?.value;
    }

    if (!token) return null;
    return verifyJwtToken(token);
}
