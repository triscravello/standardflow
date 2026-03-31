import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyTokenEdge } from './services/authService.edge';

const PUBLIC_PATHS = new Set(['/login', '/signup']);

function isPublicApiRoute(pathname: string): boolean {
    return pathname.startsWith('/api/');
}

function isProtectedPage(pathname: string): boolean {
    return (
        pathname === '/planner' ||
        pathname.startsWith('/planner/') ||
        pathname === '/lessons' ||
        pathname.startsWith('/lessons/') ||
        pathname === '/units' ||
        pathname.startsWith('/units/') ||
        pathname === '/standards' ||
        pathname.startsWith('/standards/')
    );
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (PUBLIC_PATHS.has(pathname) || isPublicApiRoute(pathname)) {
        return NextResponse.next();
    }

    const isApiRoute = pathname.startsWith('/api/');
    const requiresAuth = isApiRoute || isProtectedPage(pathname);

    if (!requiresAuth) {
        return NextResponse.next();
    }

    const token = req.cookies.get('auth_token')?.value;

    if (!token || !verifyTokenEdge(token)) {
        if (isApiRoute) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/planner/:path*', '/lessons/:path*', '/units/:path*', '/standards/:path*', '/api/:path*'],
};