import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    await db.payment.deleteMany({});
    await db.user.deleteMany({});

    const today = new Date();

    const dateActive = new Date();
    dateActive.setDate(today.getDate() + 20);

    const dateDue = new Date();
    dateDue.setDate(today.getDate() + 2);

    const dateDueToday = new Date();

    const dateOverdue = new Date();
    dateOverdue.setDate(today.getDate() - 5);

    const dateActive2 = new Date();
    dateActive2.setDate(today.getDate() + 15);

    const user1 = await db.user.create({
      data: {
        firstName: 'Elena',
        lastName: 'Kipiani',
        phone: '+995555112233',
        email: 'elena.kipiani@gmail.com',
        branch: 'Borjomi',
        status: 'Active',
        registrationDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 10),
        nextPaymentDueDate: dateActive,
      },
    });

    const user2 = await db.user.create({
      data: {
        firstName: 'George',
        lastName: 'Lomidze',
        phone: '+995555445566',
        email: 'george.l@outlook.com',
        branch: 'Khashuri',
        status: 'Due',
        registrationDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 28),
        nextPaymentDueDate: dateDue,
      },
    });

    const user3 = await db.user.create({
      data: {
        firstName: 'Nino',
        lastName: 'Abashidze',
        phone: '+995555778899',
        email: 'nino.abashidze@yahoo.com',
        branch: 'Akhaltsikhe',
        status: 'Due',
        registrationDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 30),
        nextPaymentDueDate: dateDueToday,
      },
    });

    const user4 = await db.user.create({
      data: {
        firstName: 'Davit',
        lastName: 'Shengelia',
        phone: '+995555990011',
        email: 'davit.sh@gmail.com',
        branch: 'Khashuri',
        status: 'Overdue',
        registrationDate: new Date(today.getFullYear(), today.getMonth() - 2, today.getDate()),
        nextPaymentDueDate: dateOverdue,
      },
    });

    const user5 = await db.user.create({
      data: {
        firstName: 'Mariam',
        lastName: 'Tsereteli',
        phone: '+995555223344',
        email: 'mariam.ts@gmail.com',
        branch: 'Akhaltsikhe',
        status: 'Active',
        registrationDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 15),
        nextPaymentDueDate: dateActive2,
      },
    });

    await db.payment.createMany({
      data: [
        {
          userId: user1.id,
          amount: 80.0,
          paymentDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 10),
          notes: 'Initial Borjomi Branch Sign-up Fee',
        },
        {
          userId: user2.id,
          amount: 70.0,
          paymentDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 28),
          notes: 'Standard Khashuri Membership',
        },
        {
          userId: user3.id,
          amount: 75.0,
          paymentDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 30),
          notes: 'First Month Membership Fee',
        },
        {
          userId: user4.id,
          amount: 70.0,
          paymentDate: new Date(today.getFullYear(), today.getMonth() - 2, today.getDate()),
          notes: 'March Khashuri Membership',
        },
        {
          userId: user5.id,
          amount: 75.0,
          paymentDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 15),
          notes: 'Akhaltsikhe Welcome Package',
        },
      ],
    });

    return NextResponse.json(
      {
        message: 'Database seeded with 5 members and payment records!',
        seededUsers: [
          user1.firstName,
          user2.firstName,
          user3.firstName,
          user4.firstName,
          user5.firstName,
        ],
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Seeding Error:', error);
    return NextResponse.json(
      {
        message: 'Database seeding failed.',
        error: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 }
    );
  }
}
