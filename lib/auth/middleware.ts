<<<<<<< HEAD
import { NextRequest } from 'next/server';
import { getSession } from './session';
import { AppError } from '@/lib/utils/errors';

export async function requireAuth(_req: NextRequest) {
  const session = await getSession();
  if (!session) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  return session;
}

export async function requireAdmin(_req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }
  return session;
}
=======
import { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE, SessionPayload } from "./session";

export async function getSessionFromRequest(
  req: NextRequest
): Promise<SessionPayload | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAuth(req: NextRequest): Promise<SessionPayload> {
  const session = await getSessionFromRequest(req);
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function requireAdmin(req: NextRequest): Promise<SessionPayload> {
  const session = await requireAuth(req);
  if (session.role !== "admin") throw new Error("FORBIDDEN");
  return session;
}
>>>>>>> 33073f7 (Initial commit)
