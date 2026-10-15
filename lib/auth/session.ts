import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
export interface SessionUser { id: string; email: string; role: 'user' | 'admin'; }
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET) as SessionUser; } catch (error) { return null; }
}
