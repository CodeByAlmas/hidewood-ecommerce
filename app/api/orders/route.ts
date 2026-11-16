import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid customer email required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const orders = await prisma.order.findMany({
      where: { customerEmail: cleanEmail },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch customer orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customer orders' },
      { status: 500 }
    );
  }
}