import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getNotifier } from '@/lib/notifier';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Bearer-token guard — set CRON_SECRET in Vercel env vars and pass it
  // as the Authorization header from the Vercel Cron configuration.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }
  }

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const threeDaysStart = new Date();
    threeDaysStart.setDate(threeDaysStart.getDate() + 3);
    threeDaysStart.setHours(0, 0, 0, 0);
    const threeDaysEnd = new Date();
    threeDaysEnd.setDate(threeDaysEnd.getDate() + 3);
    threeDaysEnd.setHours(23, 59, 59, 999);

    // Mark members whose payment passed as Overdue
    await db.user.updateMany({
      where: { nextPaymentDueDate: { lt: todayStart } },
      data: { status: 'Overdue' },
    });

    // Fetch members due today or in exactly 3 days
    const members = await db.user.findMany({
      where: {
        OR: [
          { nextPaymentDueDate: { gte: todayStart, lte: todayEnd } },
          { nextPaymentDueDate: { gte: threeDaysStart, lte: threeDaysEnd } },
        ],
      },
    });

    // Mark due members
    if (members.length > 0) {
      await db.user.updateMany({
        where: { id: { in: members.map((m: { id: string }) => m.id) } },
        data: { status: 'Due' },
      });
    }

    const notifier = getNotifier();
    const report: unknown[] = [];

    for (const member of members) {
      const isDueToday =
        member.nextPaymentDueDate >= todayStart &&
        member.nextPaymentDueDate <= todayEnd;

      const formattedDate = new Date(member.nextPaymentDueDate).toLocaleDateString(
        'ka-GE',
        { month: 'long', day: 'numeric', year: 'numeric' }
      );

      // Georgian-language reminder message
      const message = isDueToday
        ? `გამარჯობა, ${member.firstName}! სოლეა სტუდია (${member.branch}) გაგახსენებთ, რომ დღეს არის თქვენი ყოველთვიური წევრობის გადასახადის ვადა. გმადლობთ, რომ პრაქტიკობთ ჩვენთან!`
        : `გამარჯობა, ${member.firstName}! სოლეა სტუდია (${member.branch}) გაგახსენებთ, რომ 3 დღეში — ${formattedDate} — არის თქვენი ყოველთვიური წევრობის გადასახადის ვადა. გმადლობთ!`;

      let status: 'SENT' | 'FAILED' = 'SENT';
      let errorMsg: string | null = null;

      try {
        await notifier.send(member.phone, message);
      } catch (err: unknown) {
        status = 'FAILED';
        errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Notification failed for ${member.phone}:`, err);
      }

      report.push({
        memberId: member.id,
        name: `${member.firstName} ${member.lastName}`,
        phone: member.phone,
        type: isDueToday ? 'DUE_TODAY' : 'DUE_IN_3_DAYS',
        notificationStatus: status,
        error: errorMsg,
      });
    }

    return NextResponse.json({
      processedCount: members.length,
      notifierMode:
        process.env.USE_REAL_SMS === 'true' ? 'GEORGIAN_SMS' : 'CONSOLE',
      timestamp: new Date().toISOString(),
      dispatched: report,
    });
  } catch (error: unknown) {
    console.error('Cron reminder error:', error);
    return NextResponse.json(
      {
        message: 'Internal server error.',
        error: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 }
    );
  }
}
