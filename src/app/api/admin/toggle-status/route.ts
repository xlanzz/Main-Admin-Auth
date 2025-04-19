import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import { getJwtFromAuthHeader, verifyJwtToken } from '@/lib/jwt';

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const token = getJwtFromAuthHeader(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const decoded = await verifyJwtToken(token);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Verify that the user is a superadmin
    const requesterRole = decoded.role;
    if (requesterRole !== 'superadmin') {
      return NextResponse.json(
        { error: 'Forbidden - Only superadmins can toggle admin status' },
        { status: 403 }
      );
    }

    // Get request body
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find admin by ID
    const admin = await Admin.findById(id);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }
    
    // Prevent toggling status of superadmins for security reasons
    if (admin.role === 'superadmin') {
      return NextResponse.json(
        { error: 'Cannot toggle status of superadmin accounts' },
        { status: 403 }
      );
    }

    // Toggle isActive status
    admin.isActive = !admin.isActive;
    await admin.save();

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive
      },
      message: admin.isActive ? 'Admin activated successfully' : 'Admin deactivated successfully'
    });
  } catch (error) {
    console.error('Error toggling admin status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 