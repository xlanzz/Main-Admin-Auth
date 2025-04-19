import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

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
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

async function createSuperAdmin() {
  try {
    await connectToDatabase();
    
    // Check if a superadmin already exists
    const existingSuperadmin = await Admin.findOne({ role: 'superadmin' });
    
    if (existingSuperadmin) {
      console.log('A superadmin already exists with username:', existingSuperadmin.username);
      process.exit(0);
    }
    
    // Create a new superadmin
    const superadmin = new Admin({
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: 'Admin123!',  // This will be hashed by the pre-save hook
      role: 'superadmin',
      isActive: true
    });
    
    await superadmin.save();
    console.log('Superadmin created successfully');
    console.log('Username: superadmin');
    console.log('Password: Admin123!');
    console.log('Please change this password after first login!');
  } catch (error) {
    console.error('Error creating superadmin:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createSuperAdmin(); 