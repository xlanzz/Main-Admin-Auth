import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Make sure JWT secret key is available and valid
const JWT_SECRET: Secret = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set in environment variables. Using an insecure fallback (not recommended for production).');
}

interface AdminPayload {
  id: string;
  email: string;
  role: string;
  [key: string]: string | number | boolean | Date | undefined;
}

export async function signJwtToken(payload: AdminPayload, expiresIn = '1d'): Promise<string> {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    const token = jwt.sign(
      payload, 
      JWT_SECRET, 
      { expiresIn, algorithm: 'HS256' } as SignOptions
    );
    return token;
  } catch (error) {
    console.error('JWT - Error signing JWT:', error);
    throw new Error('Failed to sign JWT');
  }
}

export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    if (!token || !JWT_SECRET) {
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET, { 
      algorithms: ['HS256']
    }) as JwtPayload;
    return decoded;
  } catch (error) {
    // Don't log sensitive information about token verification failures
    if (error instanceof jwt.TokenExpiredError) {
      console.warn('JWT - Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.warn('JWT - Invalid token');
    } else {
      console.error('JWT - Error verifying token:', error);
    }
    return null;
  }
}

export async function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length === 0) {
    throw new Error("JWT Secret key is not set in environment variables");
  }

  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: Record<string, string | number | boolean | null | undefined>) {
  try {
    const key = await getJwtSecretKey();
    
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(key);
  } catch (error) {
    console.error('Error encrypting payload:', error);
    throw new Error('Failed to encrypt payload');
  }
}

export async function decrypt(token: string) {
  try {
    const key = await getJwtSecretKey();
    
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    
    return payload;
  } catch (error) {
    console.error('Error decrypting token:', error);
    return null;
  }
}

export async function getJwtFromCookies() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;
    return token || null;
  } catch (error) {
    console.error('JWT - Error accessing cookies:', error);
    return null;
  }
}

export function getJwtFromAuthHeader(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    return token;
  } catch (error) {
    console.error('JWT - Error extracting token from header:', error);
    return null;
  }
} 