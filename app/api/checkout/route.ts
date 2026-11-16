import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16' as any,
    });

    const body = await req.json();
    const { items, customerEmail, shippingDetails } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid customer email is required' }, { status: 400 });
    }

    const cleanEmail = customerEmail.trim().toLowerCase();

    // Validate quantities and structure
    for (const item of items) {
      const qty = Number(item.quantity);
      if (!item.productId || isNaN(qty) || qty <= 0 || qty > 20) {
        return NextResponse.json({ error: 'Invalid product quantity or selection' }, { status: 400 });
      }
    }

    // 1. Database Price & Stock Validation
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let calculatedTotal = 0;
    const lineItems: any[] = [];

    for (const item of items) {
      const product = dbProducts.find((p: any) => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found in atelier catalog` }, { status: 400 });
      }

      if (!product.inStock) {
        return NextResponse.json({ error: `Product "${product.name}" is currently sold out` }, { status: 400 });
      }

      const unitPrice = product.price;
      const qty = Number(item.quantity);
      calculatedTotal += unitPrice * qty;

      // Absolute image URL guarantee for Stripe
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hidewood.in';
      const rawImg = product.coverPrimary || product.images?.[0] || '/belt-macro.png';
      const absoluteImg = rawImg.startsWith('http') ? rawImg : `${baseUrl}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;

      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${product.name} (Size: ${item.size || '34'}")`,
            images: [absoluteImg],
          },
          unit_amount: Math.round(unitPrice * 100), // in paise
        },
        quantity: qty,
      });
    }

    // Add flat shipping fee if subtotal < 5000
    const shippingFee = calculatedTotal >= 5000 ? 0 : 450;
    if (shippingFee > 0) {
      calculatedTotal += shippingFee;
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Express Air Courier Shipping',
          },
          unit_amount: shippingFee * 100,
        },
        quantity: 1,
      });
    }

    // 2. Secure User Upsert (without wiping existing profile data)
    let existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: shippingDetails?.name?.trim() || null,
          phone: shippingDetails?.phone?.trim() || null,
        },
      });
    }

    // 3. Create Pending Order connected to User
    const order = await prisma.order.create({
      data: {
        userId: existingUser.id,
        customerName: shippingDetails?.name || 'Valued Customer',
        customerEmail: cleanEmail,
        customerPhone: shippingDetails?.phone || '',
        shippingAddr: shippingDetails || {},
        totalAmount: calculatedTotal,
        currency: 'INR',
        paymentGateway: 'STRIPE',
        status: 'PENDING',
        items: {
          create: items.map((i: any) => {
            const p = dbProducts.find((prod: any) => prod.id === i.productId);
            return {
              productId: p ? p.id : null,
              name: p ? p.name : 'Genuine Leather Piece',
              size: i.size || '34',
              price: p ? p.price : 5499,
              quantity: Number(i.quantity) || 1,
              image: p?.coverPrimary || '/belt-macro.png',
            };
          }),
        },
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hidewood.in';

    // 4. Initialize Stripe Checkout Session with Payment Intent Metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: cleanEmail,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/order/success?orderId=${order.id}`,
      cancel_url: `${baseUrl}/order/failed?orderId=${order.id}`,
      metadata: {
        orderId: order.id,
      },
      payment_intent_data: {
        metadata: {
          orderId: order.id,
        },
      },
    });

    return NextResponse.json({ sessionUrl: session.url, orderId: order.id });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}