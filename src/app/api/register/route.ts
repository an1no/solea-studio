import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, email, branch } = body;

    // Server-side validation
    if (!firstName || !lastName || !phone || !branch) {
      return NextResponse.json(
        { message: 'Missing required fields: firstName, lastName, phone, and branch are mandatory.' },
        { status: 400 }
      );
    }

    const branches = ['Khashuri', 'Borjomi', 'Akhaltsikhe'];
    if (!branches.includes(branch)) {
      return NextResponse.json(
        { message: `Invalid branch location. Must be one of: ${branches.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if phone number already exists
    const existingUser = await db.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'A member with this phone number is already registered.' },
        { status: 409 }
      );
    }

    // Calculate dynamic next payment due date: exactly 1 month from today
    const registrationDate = new Date();
    const nextPaymentDueDate = new Date();
    nextPaymentDueDate.setMonth(nextPaymentDueDate.getMonth() + 1);

    // Create the member in the database
    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        phone,
        email: email || null,
        branch,
        registrationDate,
        nextPaymentDueDate
      }
    });

    return NextResponse.json(
      { message: 'Registration successful!', user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error occurred.', error: error.message },
      { status: 500 }
    );
  }
}
