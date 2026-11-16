import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES: string[] = [
  'Full-Grain Belts',
  'Wallets & Carry',
  'Outerwear Atelier',
  'Welted Footwear',
];

// 1. GET: Public access for storefront navigation
export async function GET() {
  try {
    const allProducts = await prisma.product.findMany({
      select: { category: true, subCategory: true },
    });

    let list = await prisma.categoryTaxonomy.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (!list || list.length === 0) {
      for (const name of DEFAULT_CATEGORIES) {
        await prisma.categoryTaxonomy.upsert({
          where: { name },
          update: {},
          create: { name, subCategories: [] },
        });
      }
      list = await prisma.categoryTaxonomy.findMany({
        orderBy: { createdAt: 'asc' },
      });
    }

    const categoriesMap: Record<string, string[]> = {};
    list.forEach((item) => {
      categoriesMap[item.name] = item.subCategories || [];
    });

    for (const prod of allProducts) {
      const cat = prod.category?.trim();
      const sub = prod.subCategory?.trim();

      if (cat && sub && sub !== 'General') {
        if (!categoriesMap[cat]) {
          categoriesMap[cat] = [sub];
          await prisma.categoryTaxonomy.create({
            data: { name: cat, subCategories: [sub] },
          }).catch(() => {});
        } else if (!categoriesMap[cat].includes(sub)) {
          categoriesMap[cat].push(sub);
          await prisma.categoryTaxonomy.update({
            where: { name: cat },
            data: { subCategories: categoriesMap[cat] },
          }).catch(() => {});
        }
      }
    }

    return NextResponse.json({ categories: categoriesMap }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ categories: {} }, { status: 200 });
  }
}

// 2. POST: Secure Admin Only Mutation
export async function POST(req: NextRequest) {
  try {
    if (!verifyAdminToken(req)) {
      return NextResponse.json({ error: 'Unauthorized Atelier Admin Access' }, { status: 401 });
    }

    const body = await req.json();
    const { action, category, subCategory } = body;

    const trimmedCategory = (category || '').trim();
    const trimmedSub = (subCategory || '').trim();

    if (!trimmedCategory) {
      return NextResponse.json({ error: 'Valid category name is required.' }, { status: 400 });
    }

    if (action === 'ADD_CATEGORY') {
      const created = await prisma.categoryTaxonomy.upsert({
        where: { name: trimmedCategory },
        update: {},
        create: { name: trimmedCategory, subCategories: [] },
      });
      return NextResponse.json({ success: true, item: created }, { status: 200 });
    }

    if (action === 'ADD_SUB') {
      if (!trimmedSub) {
        return NextResponse.json({ error: 'Sub-category name is required.' }, { status: 400 });
      }

      const existing = await prisma.categoryTaxonomy.findUnique({
        where: { name: trimmedCategory },
      });

      if (!existing) {
        await prisma.categoryTaxonomy.create({
          data: { name: trimmedCategory, subCategories: [trimmedSub] },
        });
      } else {
        const currentSubs = existing.subCategories || [];
        const exists = currentSubs.some((s) => s.trim().toLowerCase() === trimmedSub.toLowerCase());

        if (!exists) {
          await prisma.categoryTaxonomy.update({
            where: { name: trimmedCategory },
            data: { subCategories: [...currentSubs, trimmedSub] },
          });
        }
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (action === 'DELETE_SUB') {
      if (!trimmedSub) {
        return NextResponse.json({ error: 'Sub-category name is required.' }, { status: 400 });
      }

      const existing = await prisma.categoryTaxonomy.findUnique({
        where: { name: trimmedCategory },
      });

      if (!existing) {
        return NextResponse.json({ error: `Category "${trimmedCategory}" not found in database.` }, { status: 404 });
      }

      const currentSubs = existing.subCategories || [];
      const filtered = currentSubs.filter(
        (s) => s.trim().toLowerCase() !== trimmedSub.toLowerCase()
      );

      await prisma.categoryTaxonomy.update({
        where: { name: trimmedCategory },
        data: { subCategories: filtered },
      });

      return NextResponse.json({ success: true, remaining: filtered }, { status: 200 });
    }

    if (action === 'DELETE_CATEGORY') {
      await prisma.categoryTaxonomy.deleteMany({
        where: { name: trimmedCategory },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });
  } catch (error: any) {
    console.error('Save category error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal database sync failure' },
      { status: 500 }
    );
  }
}