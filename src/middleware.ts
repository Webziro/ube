import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const host = request.headers.get('host') || '';

    // Detect driver subdomain (e.g., driver.ube-eta.vercel.app, driver.localhost:3000, driver.localhost)
    const isDriverSubdomain = host.startsWith('driver.');

    // If accessing root '/' on driver subdomain, rewrite internally to /driver page
    if (isDriverSubdomain && url.pathname === '/') {
        url.pathname = '/driver';
        return NextResponse.rewrite(url);
    }

    const response = NextResponse.next();
    if (isDriverSubdomain) {
        response.headers.set('x-driver-subdomain', 'true');
    }
    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
