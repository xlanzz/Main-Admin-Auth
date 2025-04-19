import mongoose from 'mongoose';

// Define connection cache
interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Initialize global cache
const globalMongooseCache: ConnectionCache = {
  conn: null,
  promise: null
};

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalMongooseCache.conn) {
    return globalMongooseCache.conn;
  }

  if (!globalMongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    globalMongooseCache.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    globalMongooseCache.conn = await globalMongooseCache.promise;
  } catch (error) {
    globalMongooseCache.promise = null;
    throw error;
  }

  return globalMongooseCache.conn;
}

export default connectToDatabase; 