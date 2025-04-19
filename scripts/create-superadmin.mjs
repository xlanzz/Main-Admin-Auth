import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Load environment variables from multiple possible locations
try {
  // Try .env.local first (development)
  if (fs.existsSync(path.resolve('.env.local'))) {
    dotenv.config({ path: '.env.local' });
  } 
  // Then try .env (production)
  else if (fs.existsSync(path.resolve('.env'))) {
    dotenv.config();
  } 
  // Fallback to passed environment variables
  else {
    console.log('No .env file found, using environment variables');
  }
} catch (err) {
  console.warn('Error loading .env file, using environment variables:', err.message);
}

// Define Admin schema and model for this script
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to hash password
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

async function connectToDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Add timeout for server selection
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

async function createSuperAdmin() {
  let connection = null;
  
  try {
    await connectToDatabase();
    connection = mongoose.connection;
    
    // Check if a superadmin already exists
    const existingSuperadmin = await Admin.findOne({ role: 'superadmin' });
    
    if (existingSuperadmin) {
      console.log('A superadmin already exists with username:', existingSuperadmin.username);
      return;
    }
    
    // Create a new superadmin with configurable credentials
    const username = process.env.SUPERADMIN_USERNAME || 'superadmin';
    const email = process.env.SUPERADMIN_EMAIL || 'superadmin@example.com';
    const password = process.env.SUPERADMIN_PASSWORD || 'Admin123!';
    
    const superadmin = new Admin({
      username,
      email,
      password,  // This will be hashed by the pre-save hook
      role: 'superadmin',
      isActive: true
    });
    
    await superadmin.save();
    console.log('Superadmin created successfully');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log('Please change the password after first login!');
  } catch (error) {
    console.error('Error creating superadmin:', error.message);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
    process.exit(0);
  }
}

createSuperAdmin(); 