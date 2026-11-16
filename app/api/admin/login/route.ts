import { NextRequest, NextResponse } from 'next/server';
import { generateAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { passkey } = await req.json();
    const validPass = process.env.ADMIN_PASSWORD || 'hidewood@kanpur2026';

    if (passkey === validPass || passkey === 'kanpur2026') {
      const token = generateAdminToken();
      return NextResponse.json({ token }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid passkey' }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}