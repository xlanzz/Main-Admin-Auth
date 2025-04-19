import { NextRequest, NextResponse } from 'next/server';
import { getJwtFromAuthHeader, verifyJwtToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import { JwtPayload } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const token = getJwtFromAuthHeader(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = await verifyJwtToken(token);
    console.log('Decoded token:', decoded);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Extract user ID from decoded token
    // JWT payload bisa berbentuk string atau object
    let userId;
    if (typeof decoded === 'string') {
      try {
        // Jika token adalah string, coba parse sebagai JSON
        const parsedToken = JSON.parse(decoded);
        userId = parsedToken.id;
      } catch {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid token format' },
          { status: 401 }
        );
      }
    } else {
      // Jika token adalah object (JwtPayload)
      const payload = decoded as JwtPayload;
      userId = payload.id || payload.sub; // sub adalah standard JWT claim untuk subject/user ID
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID not found in token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find admin by ID
    const admin = await Admin.findById(userId);
    console.log('Admin found:', admin ? 'Yes' : 'No');

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin not found or inactive' },
        { status: 401 }
      );
    }

    // Return admin info
    return NextResponse.json({
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 