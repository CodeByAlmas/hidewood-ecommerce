import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

// 1. PUT: Update existing product / stock / pricing (Strictly Admin Authorized)
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

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.category && { category: body.category }),
        ...(body.subCategory !== undefined && { subCategory: body.subCategory }),
        ...(body.mrp !== undefined && { mrp: Number(body.mrp) }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.inStock !== undefined && { inStock: Boolean(body.inStock) }),
        ...(body.featuredSale !== undefined && { featuredSale: Boolean(body.featuredSale) }),
        ...(body.isNewArrival !== undefined && { isNewArrival: Boolean(body.isNewArrival) }),
        ...(body.coverPrimary !== undefined && { coverPrimary: body.coverPrimary }),
        ...(body.coverHover !== undefined && { coverHover: body.coverHover }),
        ...(body.images && { images: body.images }),
        ...(body.sizes && { sizes: body.sizes }),
        ...(body.hasColors !== undefined && { hasColors: Boolean(body.hasColors) }),
        ...(body.colors !== undefined && { colors: body.colors }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.spec !== undefined && { spec: body.spec }),
      },
    });

    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// 2. DELETE: Remove product permanently (Strictly Admin Authorized)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!verifyAdminToken(req)) {
      return NextResponse.json({ error: 'Unauthorized Atelier Admin Access' }, { status: 401 });
    }

    const { id } = params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Product deleted permanently from database.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}