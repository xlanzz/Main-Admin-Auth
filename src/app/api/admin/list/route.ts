import { NextRequest, NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectToDatabase from '@/lib/db';
import { getJwtFromAuthHeader, verifyJwtToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('API - Admin List - Request received');
    
    // Verify token for authentication
    const token = getJwtFromAuthHeader(request);
    console.log('API - Admin List - Token:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      console.log('API - Admin List - Error: No token provided');
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = await verifyJwtToken(token);
    console.log('API - Admin List - Decoded token:', decoded ? 'Valid token' : 'Invalid token');
    
    if (!decoded) {
      console.log('API - Admin List - Error: Invalid token');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Get all admin users (without the password field)
    const admins = await Admin.find({}, { password: 0 }).sort({ createdAt: -1 });
    console.log(`API - Admin List - Found ${admins.length} admins`);
    
    // Transform for client-friendly format
    const adminList = admins.map(admin => ({
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt
    }));
    
    return NextResponse.json({ admins: adminList });
  } catch (error) {
    console.error('API - Admin List - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 