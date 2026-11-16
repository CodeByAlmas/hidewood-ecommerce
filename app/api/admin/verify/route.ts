import { NextRequest, NextResponse } from 'next/server';
import { generateAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (token && token === generateAdminToken()) {
      return NextResponse.json({ valid: true }, { status: 200 });
    }
    return NextResponse.json({ valid: false }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}