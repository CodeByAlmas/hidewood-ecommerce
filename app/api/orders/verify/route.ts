import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ status: 'INVALID' }, { status: 400 });
    }

    const cleanId = orderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);

    const order = await prisma.order.findUnique({
      where: { id: cleanId },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        currency: true,
        createdAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ status: 'INVALID' }, { status: 404 });
    }

    return NextResponse.json({
      status: order.status, // 'PAID', 'PENDING', etc.
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        currency: order.currency,
        date: order.createdAt,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error('Order verification error:', error);
    return NextResponse.json({ status: 'ERROR', error: error.message }, { status: 500 });
  }
}