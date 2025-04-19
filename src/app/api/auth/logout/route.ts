import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('Logout API called');
    
    // Create response
    const response = NextResponse.json({ success: true });
    
    // Clear the admin token cookie
    response.cookies.set({
      name: 'adminToken',
      value: '',
      expires: new Date(0), // Expires immediately
      path: '/',
    });
    
    console.log('Logout successful - Cookie cleared');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 