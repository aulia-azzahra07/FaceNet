import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if ('error' in auth) {
    return auth.error;
  }

  return NextResponse.json({
    success: true,
    user: auth.user,
  });
}
