import { NextRequest, NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectToDatabase from '@/lib/db';
import { signJwtToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find admin by email
    const admin = await Admin.findOne({ email }).select('+password');
    console.log('Admin found:', admin ? 'Yes' : 'No');

    if (!admin || !admin.isActive) {
      console.log('Login failed: Invalid credentials or inactive account');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    console.log('Password valid:', isPasswordValid ? 'Yes' : 'No');

    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = await signJwtToken({
      id: admin._id,
      email: admin.email,
      role: admin.role
    });
    console.log('JWT token generated successfully');

    // Create response with admin info
    const response = NextResponse.json({
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      },
      token
    });

    // Set cookie for token (will be used by middleware)
    response.cookies.set({
      name: 'adminToken',
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    console.log('Login successful for admin:', admin.username);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 