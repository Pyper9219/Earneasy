import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './session';
export async function requireAuth(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return session;
}
export async function requireAdmin(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return session;
}
