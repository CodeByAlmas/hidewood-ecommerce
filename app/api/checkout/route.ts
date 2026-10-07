import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const { items, customerEmail, shippingDetails } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 1. Re-validate prices from Database (Prevents Price Tampering)
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let calculatedTotal = 0;
    const lineItems: any[] = [];

    for (const item of items) {
      const product = dbProducts.find((p) => p.id === item.productId);
      if (!product || !product.inStock) {
        return NextResponse.json(
          { error: `Item ${item.productId} is unavailable` },
          { status: 400 }
        );
      }

      calculatedTotal += product.price * item.quantity;
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${product.name} (Width: ${item.width}, Waist: ${item.size}")`,
            images: product.images,
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      });
    }

    // 2. Create pending order in database
    const order = await prisma.order.create({
      data: {
        customerEmail,
        shippingAddr: shippingDetails,
        totalAmount: calculatedTotal,
        paymentGateway: 'STRIPE',
        status: 'PENDING',
        items: {
          create: items.map((i: any) => ({
            productId: i.productId,
            variantInfo: { size: i.size, width: i.width, buckle: i.buckle },
            quantity: i.quantity,
            unitPrice: dbProducts.find((p) => p.id === i.productId)!.price,
          })),
        },
      },
    });

    // 3. Initialize Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ sessionUrl: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server payment failure' },
      { status: 500 }
    );
  }
}