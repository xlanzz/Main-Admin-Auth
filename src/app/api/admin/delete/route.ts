import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import { getJwtFromAuthHeader, verifyJwtToken } from '@/lib/jwt';

export async function DELETE(request: NextRequest) {
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
    const requesterId = decoded.id || decoded.sub;
    
    if (requesterRole !== 'superadmin') {
      return NextResponse.json(
        { error: 'Forbidden - Only superadmins can delete admin accounts' },
        { status: 403 }
      );
    }

    // Get admin ID from URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if admin exists
    const adminToDelete = await Admin.findById(id);
    if (!adminToDelete) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Prevent deletion of superadmin accounts
    if (adminToDelete.role === 'superadmin') {
      return NextResponse.json(
        { error: 'Cannot delete superadmin accounts' },
        { status: 403 }
      );
    }

    // Prevent admins from deleting themselves
    if (requesterId === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 403 }
      );
    }

    // Delete the admin
    await Admin.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 