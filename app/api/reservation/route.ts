import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Yahan backend database ya waitlist ledger trigger hota hai
    // Database connect hone par: await prisma.reservation.create({ data: { email, passKey: `HW-P2-${Math.floor(1000 + Math.random() * 9000)}` } })

    return NextResponse.json({ success: true, message: 'Reservation confirmed' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}