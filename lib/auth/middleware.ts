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
