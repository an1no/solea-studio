import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
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

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: 'Member not found.' }, { status: 404 });
    }

    // Extend due date exactly 1 month from today
    const updatedDueDate = new Date();
    updatedDueDate.setMonth(updatedDueDate.getMonth() + 1);

    const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const payment = await tx.payment.create({
        data: {
          userId,
          amount: parsedAmount,
          notes: notes || null,
          paymentDate: new Date(),
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          nextPaymentDueDate: updatedDueDate,
          status: 'Active',
        },
      });

      return { payment, updatedUser };
    });

    return NextResponse.json(
      {
        message: 'Payment successfully logged!',
        payment: result.payment,
        nextPaymentDueDate: result.updatedUser.nextPaymentDueDate,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      {
        message: 'Internal server error.',
        error: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 }
    );
  }
}
