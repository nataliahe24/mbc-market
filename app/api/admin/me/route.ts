import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasValidAdminSession } from '@/lib/admin-session';

export async function GET(req: NextRequest) {
  if (!hasValidAdminSession(req)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true }, { status: 200 });
}
