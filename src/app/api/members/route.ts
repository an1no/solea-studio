import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If ID parameter is supplied, return single user details
    if (id) {
      const user = await db.user.findUnique({
        where: { id },
        include: {
          payments: {
            orderBy: {
              paymentDate: 'desc'
            }
          }
        }
      });
      
      if (!user) {
        return NextResponse.json({ success: false, message: 'Member not found.' }, { status: 404 });
      }

      return NextResponse.json({ success: true, user });
    }

    // Otherwise, return dashboard aggregated stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    threeDaysLater.setHours(23, 59, 59, 999);

    const totalCount = await db.user.count();
    
    const activeCount = await db.user.count({
      where: {
        nextPaymentDueDate: {
          gte: today
        }
      }
    });

    const dueCount = await db.user.count({
      where: {
        nextPaymentDueDate: {
          gte: today,
          lte: threeDaysLater
        }
      }
    });

    const overdueCount = await db.user.count({
      where: {
        nextPaymentDueDate: {
          lt: today
        }
      }
    });

    const allUsers = await db.user.findMany({
      orderBy: {
        firstName: 'asc'
      },
      include: {
        payments: {
          orderBy: {
            paymentDate: 'desc'
          }
        }
      }
    });

    // Branch breakdowns
    const borjomiCount = await db.user.count({ where: { branch: 'Borjomi' } });
    const khashuriCount = await db.user.count({ where: { branch: 'Khashuri' } });
    const akhaltsikheCount = await db.user.count({ where: { branch: 'Akhaltsikhe' } });

    return NextResponse.json({
      success: true,
      stats: {
        totalCount,
        activeCount,
        dueCount,
        overdueCount
      },
      branches: {
        Borjomi: borjomiCount,
        Khashuri: khashuriCount,
        Akhaltsikhe: akhaltsikheCount
      },
      users: allUsers
    });
  } catch (error: any) {
    console.error('Fetch Admin Data API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Could not fetch database records.', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ message: 'Missing member ID.' }, { status: 400 });
    }
    await db.user.delete({ where: { id } });
    return NextResponse.json({ message: 'Member successfully removed.' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Delete failed.', error: error.message }, { status: 500 });
  }
}
