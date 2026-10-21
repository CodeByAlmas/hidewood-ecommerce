import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

function getStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_build_placeholder';
  return new Stripe(apiKey, {
    apiVersion: '2023-10-16' as any,
  });
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  const stripe = getStripeClient();
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // 1. Success Event: Payment complete ho gayi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await (prisma.order.update as any)({
          where: { id: orderId },
          data: {
            status: 'PAID',
            ...(session.payment_intent ? { transactionId: session.payment_intent as string } : {}),
          },
        });
      } catch (err) {
        console.error('Failed to update order to PAID:', err);
      }
    }
  }

  // 2. Failed Event: Payment reject ho gayi
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata?.orderId;

    if (orderId) {
      try {
        await (prisma.order.update as any)({
          where: { id: orderId },
          data: {
            status: 'FAILED',
          },
        });
      } catch {
        try {
          await (prisma.order.update as any)({
            where: { id: orderId },
            data: {
              status: 'CANCELLED',
            },
          });
        } catch (dbErr) {
          console.error('Failed to update order on payment failure:', dbErr);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}