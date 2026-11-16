import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    if (!verifyAdminToken(req)) {
      return NextResponse.json({ error: 'Unauthorized Atelier Admin Access' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch all admin orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch admin orders' },
      { status: 500 }
    );
  }
}