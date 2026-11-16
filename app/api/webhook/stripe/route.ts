import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

function getStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('CRITICAL: STRIPE_SECRET_KEY is missing in environment variables.');
  }
  return new Stripe(apiKey, {
    apiVersion: '2023-10-16' as any,
  });
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error('CRITICAL: STRIPE_WEBHOOK_SECRET is missing.');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let stripe: Stripe;
  try {
    stripe = getStripeClient();
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    // 1. Success Event: Payment complete ho gayi
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        // Idempotency check: agar order pehle hi PAID hai toh dubara process mat karo
        const existingOrder = await prisma.order.findUnique({
          where: { id: orderId },
          select: { status: true, totalAmount: true },
        });

        if (existingOrder && existingOrder.status !== 'PAID') {
          // Verify amount match (Stripe amount is in paise)
          const expectedAmountInPaise = Math.round(existingOrder.totalAmount * 100);
          if (session.amount_total && session.amount_total !== expectedAmountInPaise) {
            console.error(`Amount mismatch for order ${orderId}: Expected ${expectedAmountInPaise}, got ${session.amount_total}`);
            return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
          }

          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'PAID',
              paymentId: (session.payment_intent as string) || session.id,
            },
          });
        }
      }
    }

    // 2. Failed / Expired Event
    if (
      event.type === 'payment_intent.payment_failed' ||
      event.type === 'checkout.session.expired'
    ) {
      const obj = event.data.object as any;
      const orderId = obj.metadata?.orderId;

      if (orderId) {
        const existingOrder = await prisma.order.findUnique({
          where: { id: orderId },
          select: { status: true },
        });

        if (existingOrder && existingOrder.status === 'PENDING') {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: event.type === 'checkout.session.expired' ? 'CANCELLED' : 'FAILED',
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (dbErr: any) {
    console.error('Webhook database handling error:', dbErr);
    // Return 500 so Stripe retries later if DB was temporarily down
    return NextResponse.json({ error: 'Database sync failure' }, { status: 500 });
  }
}