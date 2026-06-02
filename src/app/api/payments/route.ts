import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, amount, notes } = body;

    if (!userId || amount === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields: userId and amount are mandatory.' },
        { status: 400 }
      );
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { message: 'Amount must be a positive number.' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Member not found.' },
        { status: 404 }
      );
    }

    // Update due date: exactly 1 month from current transaction date
    const updatedDueDate = new Date();
    updatedDueDate.setMonth(updatedDueDate.getMonth() + 1);

    // Execute in transaction to ensure both operations succeed together
    const result = await db.$transaction(async (tx) => {
      // 1. Create payment record
      const payment = await tx.payment.create({
        data: {
          userId,
          amount: parsedAmount,
          notes: notes || null,
          paymentDate: new Date()
        }
      });

      // 2. Update user's next payment due date
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          nextPaymentDueDate: updatedDueDate
        }
      });

      return { payment, updatedUser };
    });

    return NextResponse.json(
      {
        message: 'Payment successfully logged!',
        payment: result.payment,
        nextPaymentDueDate: result.updatedUser.nextPaymentDueDate
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error occurred.', error: error.message },
      { status: 500 }
    );
  }
}
