import { NextRequest, NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectToDatabase from '@/lib/db';
import { getJwtFromAuthHeader, verifyJwtToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    console.log('API - Create Admin - Request received');
    
    // Verify token and check if user is superadmin
    const token = getJwtFromAuthHeader(request);
    console.log('API - Create Admin - Token:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      console.log('API - Create Admin - Error: No token provided');
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }
    
    // Verikasi token JWT
    const decoded = await verifyJwtToken(token);
    console.log('API - Create Admin - Decoded token:', decoded ? 'Valid token' : 'Invalid token');
    
    if (!decoded) {
      console.log('API - Create Admin - Error: Invalid token');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
    
    // Periksa property role pada decoded token
    console.log('API - Create Admin - Token type:', typeof decoded);
    if (typeof decoded === 'object') {
      console.log('API - Create Admin - Decoded token properties:', Object.keys(decoded));
      console.log('API - Create Admin - User role from token:', decoded.role);
    }
    
    // Cek ketersediaan role property di token 
    if (!decoded || typeof decoded === 'string' || !decoded.role) {
      console.log('API - Create Admin - Error: Token does not contain role information');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token format' },
        { status: 401 }
      );
    }
    
    // Only superadmin can create new admins
    if (decoded.role !== 'superadmin') {
      console.log(`API - Create Admin - Error: User is not a superadmin (role: ${decoded.role})`);
      return NextResponse.json(
        { error: 'Forbidden - Only superadmins can create new admins' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const { username, email, password, role } = await request.json();
    console.log('API - Create Admin - Creating admin with username:', username);
    
    // Validate required fields
    if (!username || !email || !password) {
      console.log('API - Create Admin - Error: Missing required fields');
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Check if username or email already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingAdmin) {
      console.log('API - Create Admin - Error: Username or email already exists');
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }
    
    // Create new admin
    const newAdmin = new Admin({
      username,
      email,
      password, // Will be hashed by pre-save hook
      role: role || 'admin'
    });
    
    await newAdmin.save();
    console.log('API - Create Admin - Admin created successfully:', newAdmin.username);
    
    // Return success without password
    return NextResponse.json({
      success: true,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error('API - Create Admin - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 