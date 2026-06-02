import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Branch = 'Khashuri' | 'Borjomi' | 'Akhaltsikhe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, email, branch } = body;

    if (!firstName || !lastName || !phone || !branch) {
      return NextResponse.json(
        { message: 'Missing required fields: firstName, lastName, phone, and branch are mandatory.' },
        { status: 400 }
      );
    }

    const validBranches: Branch[] = ['Khashuri', 'Borjomi', 'Akhaltsikhe'];
    if (!validBranches.includes(branch as Branch)) {
      return NextResponse.json(
        { message: `Invalid branch. Must be one of: ${validBranches.join(', ')}` },
        { status: 400 }
      );
    }

    const existingByPhone = await db.user.findUnique({ where: { phone } });
    if (existingByPhone) {
      return NextResponse.json(
        { message: 'A member with this phone number is already registered.' },
        { status: 409 }
      );
    }

    if (email) {
      const existingByEmail = await db.user.findUnique({ where: { email } });
      if (existingByEmail) {
        return NextResponse.json(
          { message: 'A member with this email address is already registered.' },
          { status: 409 }
        );
      }
    }

    const registrationDate = new Date();
    const nextPaymentDueDate = new Date();
    nextPaymentDueDate.setMonth(nextPaymentDueDate.getMonth() + 1);

    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        phone,
        email: email || null,
        branch: branch as Branch,
        status: 'Active',
        registrationDate,
        nextPaymentDueDate,
      },
    });

    return NextResponse.json(
      { message: 'Registration successful!', user: newUser },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      {
        message: 'Internal server error.',
        error: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 }
    );
  }
}
