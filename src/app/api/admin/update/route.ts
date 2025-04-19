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
        { error: 'Forbidden - Only superadmins can update admin information' },
        { status: 403 }
      );
    }

    // Get request body
    const { id, username, email } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if admin exists
    const adminExists = await Admin.findById(id);
    if (!adminExists) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Update admin information
    const updateData: { username?: string; email?: string } = {};
    
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    
    // Only perform update if there's data to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No data provided for update' },
        { status: 400 }
      );
    }

    // Update the admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      admin: {
        id: updatedAdmin._id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        isActive: updatedAdmin.isActive
      }
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 