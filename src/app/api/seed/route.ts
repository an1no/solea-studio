import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // 1. Clear existing mock users if needed
    // In production you wouldn't do this, but for developer staging it's great
    await db.payment.deleteMany({});
    await db.user.deleteMany({});

    // 2. Define standard offsets for mock payment dues
    const today = new Date();
    
    // Active member: due in 20 days
    const dateActive = new Date();
    dateActive.setDate(today.getDate() + 20);

    // Due member: due in 2 days
    const dateDue = new Date();
    dateDue.setDate(today.getDate() + 2);

    // Due today member: due today
    const dateDueToday = new Date();

    // Overdue member: due 5 days ago
    const dateOverdue = new Date();
    dateOverdue.setDate(today.getDate() - 5);

    // Active member 2: due in 15 days
    const dateActive2 = new Date();
    dateActive2.setDate(today.getDate() + 15);

    // 3. Create mock users
    const user1 = await db.user.create({
      data: {
        firstName: 'Elena',
        lastName: 'Kipiani',
        phone: '+995555112233',
        email: 'elena.kipiani@gmail.com',
        branch: 'Borjomi',
        registrationDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 10),
        nextPaymentDueDate: dateActive
      }
    });

    const user2 = await db.user.create({
      data: {
        firstName: 'George',
        lastName: 'Lomidze',
        phone: '+995555445566',
        email: 'george.l@outlook.com',
        branch: 'Khashuri',
        registrationDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 28),
        nextPaymentDueDate: dateDue
      }
    });

    const user3 = await db.user.create({
      data: {
        firstName: 'Nino',
        lastName: 'Abashidze',
        phone: '+995555778899',
        email: 'nino.abashidze@yahoo.com',
        branch: 'Akhaltsikhe',
        registrationDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 30),
        nextPaymentDueDate: dateDueToday
      }
    });

    const user4 = await db.user.create({
      data: {
        firstName: 'Davit',
        lastName: 'Shengelia',
        phone: '+995555990011',
        email: 'davit.sh@gmail.com',
        branch: 'Khashuri',
        registrationDate: new Date(today.getFullYear(), today.getMonth() - 2, today.getDate()),
        nextPaymentDueDate: dateOverdue
      }
    });

    const user5 = await db.user.create({
      data: {
        firstName: 'Mariam',
        lastName: 'Tsereteli',
        phone: '+995555223344',
        email: 'mariam.ts@gmail.com',
        branch: 'Akhaltsikhe',
        registrationDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 15),
        nextPaymentDueDate: dateActive2
      }
    });

    // 4. Seed some payment history
    await db.payment.createMany({
      data: [
        {
          userId: user1.id,
          amount: 80.0,
          paymentDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 10),
          notes: 'Initial Borjomi Branch Sign-up Fee'
        },
        {
          userId: user2.id,
          amount: 70.0,
          paymentDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 28),
          notes: 'Standard Khashuri Membership'
        },
        {
          userId: user3.id,
          amount: 75.0,
          paymentDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 30),
          notes: 'First Month Membership fee'
        },
        {
          userId: user4.id,
          amount: 70.0,
          paymentDate: new Date(today.getFullYear(), today.getMonth() - 2, today.getDate()),
          notes: 'March Khashuri Membership'
        },
        {
          userId: user5.id,
          amount: 75.0,
          paymentDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 15),
          notes: 'Akhaltsikhe Welcome Package'
        }
      ]
    });

    return NextResponse.json({
      message: 'Database seeded successfully with 5 members and payment records!',
      seededUsers: [user1.firstName, user2.firstName, user3.firstName, user4.firstName, user5.firstName]
    }, { status: 201 });
  } catch (error: any) {
    console.error('Seeding Error:', error);
    return NextResponse.json(
      { message: 'Database seeding failed.', error: error.message },
      { status: 500 }
    );
  }
}
