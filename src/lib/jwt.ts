import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Pastikan secret key tersedia
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';

interface AdminPayload {
  id: string;
  email: string;
  role: string;
  [key: string]: string | number | boolean | Date | undefined;
}

export async function signJwtToken(payload: AdminPayload, expiresIn = '1d'): Promise<string> {
  try {
    console.log('JWT - Signing token with payload:', JSON.stringify(payload));
    const token = jwt.sign(
      payload, 
      JWT_SECRET, 
      { expiresIn } as SignOptions
    );
    console.log('JWT - Token signed successfully');
    return token;
  } catch (error) {
    console.error('JWT - Error signing JWT:', error);
    throw new Error('Failed to sign JWT');
  }
}

export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    console.log('JWT - Verifying token');
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log('JWT - Token verified successfully');
    return decoded;
  } catch (error) {
    console.error('JWT - Error verifying JWT:', error);
    return null;
  }
}

export async function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT Secret key is not set in .env file");
  }

  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: Record<string, string | number | boolean | null | undefined>) {
  const key = await getJwtSecretKey();
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function decrypt(token: string) {
  const key = await getJwtSecretKey();
  
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });
  
  return payload;
}

export async function getJwtFromCookies() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;
    return token;
  } catch (error) {
    console.error('JWT - Error accessing cookies:', error);
    return null;
  }
}

export function getJwtFromAuthHeader(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  console.log('JWT - Authorization header:', authHeader ? 'Present' : 'Not present');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('JWT - No valid Bearer token in Authorization header');
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  console.log('JWT - Token extracted from Authorization header');
  return token;
} 