import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!verifyAdminToken(req)) {
      return NextResponse.json({ error: 'Unauthorized Atelier Admin Access' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status, courier, trackingNumber } = body;

    const validStatuses = ['PENDING', 'PAID', 'CRAFTING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status value' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(courier !== undefined && { courier }),
        ...(trackingNumber !== undefined && { trackingNumber }),
      },
    });

    return NextResponse.json({ order: updatedOrder }, { status: 200 });
  } catch (error: any) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order status' },
      { status: 500 }
    );
  }
}