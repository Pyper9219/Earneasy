import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
export const SESSION_COOKIE = 'auth_token';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
export interface SessionUser { id: string; email: string; role: 'user' | 'admin';
  userId: string;
}
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET) as SessionUser; } catch { return null; }
}
export function createSessionToken(user: { id: string; email: string; role: 'user' | 'admin' }): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: SESSION_MAX_AGE });
}
export function verifySessionToken(token: string): SessionUser | null {
  try { return jwt.verify(token, JWT_SECRET) as SessionUser; } catch { return null; }
}