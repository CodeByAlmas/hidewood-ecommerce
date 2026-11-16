import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

// 1. GET: Fetch all products from Neon DB (Public catalog view)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}

// 2. POST: Create a new product in Neon DB (Strictly Admin Authorized)
export async function POST(req: NextRequest) {
  try {
    if (!verifyAdminToken(req)) {
      return NextResponse.json({ error: 'Unauthorized Atelier Admin Access' }, { status: 401 });
    }

    const body = await req.json();

    const {
      name,
      category,
      subCategory,
      mrp,
      price,
      isNewArrival,
      coverPrimary,
      coverHover,
      images,
      sizes,
      hasColors,
      colors,
      description,
      spec,
    } = body;

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Name, category and price are required fields.' },
        { status: 400 }
      );
    }

    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newProduct = await prisma.product.create({
      data: {
        slug: uniqueSlug,
        name,
        category,
        subCategory: subCategory || 'General',
        mrp: mrp ? Number(mrp) : Number(price),
        price: Number(price),
        inStock: true,
        featuredSale: false,
        isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : true,
        coverPrimary: coverPrimary || null,
        coverHover: coverHover || null,
        images: images && images.length > 0 ? images : ['/belt-macro.png'],
        sizes: sizes && sizes.length > 0 ? sizes : ['Free Size'],
        hasColors: Boolean(hasColors),
        colors: hasColors && colors ? colors : [],
        description: description || '',
        spec: spec || '',
      },
    });

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}