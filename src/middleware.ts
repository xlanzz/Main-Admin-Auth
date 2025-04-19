import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths accessible without authentication
  const isPublicPath = path === '/login';
  
  // Get token from cookies or Authorization header
  let token = request.cookies.get('adminToken')?.value;
  
  if (!token && request.headers.get('authorization')?.startsWith('Bearer ')) {
    token = request.headers.get('authorization')?.substring(7);
  }

  // Redirect logic
  if (isPublicPath && token) {
    // If user is on a public path and has a token, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicPath && !token) {
    // If user is on a protected path and has no token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Continue for API routes or authenticated routes
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/auth/me',
    '/login'
  ],
}; 