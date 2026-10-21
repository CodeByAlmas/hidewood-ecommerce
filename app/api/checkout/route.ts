import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_build';
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16' as any,
    });

    const { items, customerEmail, shippingDetails } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!customerEmail || !customerEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid customer email is required' }, { status: 400 });
    }

    // 1. Re-validate prices from Database (Tamper Protection)
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let calculatedTotal = 0;
    const lineItems: any[] = [];

    for (const item of items) {
      const product = dbProducts.find((p: any) => p.id === item.productId);
      if (!product || !product.inStock) {
        return NextResponse.json(
          { error: `Item ${item.productId} is unavailable or out of stock` },
          { status: 400 }
        );
      }

      calculatedTotal += product.price * item.quantity;

      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${product.name} (Width: ${item.width || '38mm'}, Size: ${item.size || 'Standard'}")`,
            images: Array.isArray(product.images) && product.images.length > 0 ? [product.images[0]] : [],
          },
          // Stripe requires amounts in the smallest currency unit (paise for INR)
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    // 2. Create pending order in database
    const order = await prisma.order.create({
      data: {
        customerEmail: customerEmail.trim().toLowerCase(),
        shippingAddr: shippingDetails || {},
        totalAmount: calculatedTotal,
        paymentGateway: 'STRIPE',
        status: 'PENDING',
        items: {
          create: items.map((i: any) => ({
            productId: i.productId,
            variantInfo: {
              size: i.size || '34',
              width: i.width || '38mm',
              buckle: i.buckle || 'Solid Cast Brass',
            },
            quantity: i.quantity,
            unitPrice: dbProducts.find((p: any) => p.id === i.productId)!.price,
          })),
        },
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 3. Initialize Stripe Checkout Session with full Edge-Case recovery URLs
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail.trim().toLowerCase(),
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
      { error: error.message || 'Internal server payment failure' },
      { status: 500 }
    );
  }
}