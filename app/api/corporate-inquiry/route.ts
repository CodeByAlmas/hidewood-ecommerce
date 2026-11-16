import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, name, email, phone, quantity, budget, notes } = body;

    if (!companyName || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Company Name, Name, Email aur Phone mandatory hain.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Database ke CustomInquiry table me lead store karna
    const compiledNotes = `[Company: ${companyName}] [Quantity: ${quantity}] [Budget: ${budget}] - Notes: ${notes || 'None'}`;

    const inquiry = await prisma.customInquiry.create({
      data: {
        name: `${name} (${companyName})`,
        email: cleanEmail,
        notes: compiledNotes,
        services: ['CORPORATE_GIFTING', `QTY_${quantity}`, `BUDGET_${budget}`],
      },
    });

    // 2. Lead ko User/CRM table me register/connect karna taaki Admin CRM me dikhe
    await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        name: name,
        phone: phone,
      },
      create: {
        email: cleanEmail,
        name: `${name} (${companyName})`,
        phone: phone,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry saved successfully to Neon Database',
        inquiryId: inquiry.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Corporate inquiry submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to lodge corporate inquiry' },
      { status: 500 }
    );
  }
}