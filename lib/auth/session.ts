import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
export const SESSION_COOKIE = 'auth_token';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not set. Refusing to sign or verify sessions.');
  }
  return 'dev-only-insecure-secret';
}
export interface SessionUser {
  userId: string;
  email: string;
  role: "user" | "admin";
  name?: string;
}
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try { return jwt.verify(token, jwtSecret()) as SessionUser; } catch { return null; }
}
export function createSessionToken(user: SessionUser): string {
  return jwt.sign(user, jwtSecret(), { expiresIn: SESSION_MAX_AGE });
}
export function verifySessionToken(token: string): SessionUser | null {
  try { return jwt.verify(token, jwtSecret()) as SessionUser; } catch { return null; }
}
