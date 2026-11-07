<<<<<<< HEAD
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
export const SESSION_COOKIE = 'auth_token';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
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
  try { return jwt.verify(token, JWT_SECRET) as SessionUser; } catch { return null; }
}
export function createSessionToken(user: SessionUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: SESSION_MAX_AGE });
}
export function verifySessionToken(token: string): SessionUser | null {
  try { return jwt.verify(token, JWT_SECRET) as SessionUser; } catch { return null; }
}
=======
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me"
);

export interface SessionPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
  name: string;
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
>>>>>>> 33073f7 (Initial commit)
