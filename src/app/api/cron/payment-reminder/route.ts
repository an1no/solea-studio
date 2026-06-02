import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getNotifier } from '@/lib/notifier';
import { sendEmail, getBillingReminderTemplate, getOverdueNoticeTemplate } from '@/lib/email';

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
    const dueMembers = await db.user.findMany({
      where: {
        OR: [
          { nextPaymentDueDate: { gte: todayStart, lte: todayEnd } },
          { nextPaymentDueDate: { gte: threeDaysStart, lte: threeDaysEnd } },
        ],
      },
    });

    // Mark due members
    if (dueMembers.length > 0) {
      await db.user.updateMany({
        where: { id: { in: dueMembers.map((m: { id: string }) => m.id) } },
        data: { status: 'Due' },
      });
    }

    // Fetch overdue members
    const overdueMembers = await db.user.findMany({
      where: { status: 'Overdue' },
    });

    // Combine members for processing
    const members = [
      ...dueMembers.map((m) => ({ ...m, isOverdue: false })),
      ...overdueMembers.map((m) => ({ ...m, isOverdue: true })),
    ];

    const notifier = getNotifier();
    const report: unknown[] = [];

    for (const member of members) {
      const isOverdue = member.isOverdue;
      const isDueToday =
        !isOverdue &&
        member.nextPaymentDueDate >= todayStart &&
        member.nextPaymentDueDate <= todayEnd;

      const formattedDate = new Date(member.nextPaymentDueDate).toLocaleDateString(
        'ka-GE',
        { month: 'long', day: 'numeric', year: 'numeric' }
      );

      // Georgian-language SMS message
      let message = '';
      if (isOverdue) {
        message = `გამარჯობა, ${member.firstName}! სოლეა სტუდია (${member.branch}) შეგახსენებთ, რომ თქვენი წევრობის გადასახადის ვადა (${formattedDate}) გადაცილებულია. გთხოვთ განაახლოთ პორტალზე.`;
      } else if (isDueToday) {
        message = `გამარჯობა, ${member.firstName}! სოლეა სტუდია (${member.branch}) გაგახსენებთ, რომ დღეს არის თქვენი ყოველთვიური წევრობის გადასახადის ვადა. გმადლობთ, რომ პრაქტიკობთ ჩვენთან!`;
      } else {
        message = `გამარჯობა, ${member.firstName}! სოლეა სტუდია (${member.branch}) გაგახსენებთ, რომ 3 დღეში — ${formattedDate} — არის თქვენი ყოველთვიური წევრობის გადასახადის ვადა. გმადლობთ!`;
      }

      let status: 'SENT' | 'FAILED' = 'SENT';
      let errorMsg: string | null = null;

      try {
        await notifier.send(member.phone, message);
      } catch (err: unknown) {
        status = 'FAILED';
        errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Notification failed for ${member.phone}:`, err);
      }

      let emailStatus: 'SENT' | 'FAILED' | 'SKIPPED' = 'SKIPPED';
      let emailErrorMsg: string | null = null;

      if (member.email) {
        try {
          const emailData = isOverdue
            ? getOverdueNoticeTemplate({
                firstName: member.firstName,
                dueDate: member.nextPaymentDueDate.toISOString(),
                branchName: member.branch === 'Borjomi' ? 'Borjomi' : member.branch === 'Khashuri' ? 'Khashuri' : 'Akhaltsikhe',
                lang: 'ka',
              })
            : getBillingReminderTemplate({
                firstName: member.firstName,
                dueDate: member.nextPaymentDueDate.toISOString(),
                isDueToday,
                branchName: member.branch === 'Borjomi' ? 'Borjomi' : member.branch === 'Khashuri' ? 'Khashuri' : 'Akhaltsikhe',
                lang: 'ka',
              });

          const { html, text: emailText, subject } = emailData;

          await sendEmail({
            to: member.email,
            subject,
            html,
            text: emailText,
          });
          emailStatus = 'SENT';
        } catch (err: unknown) {
          emailStatus = 'FAILED';
          emailErrorMsg = err instanceof Error ? err.message : 'Unknown error';
          console.error(`Email notification failed for ${member.email}:`, err);
        }
      }

      report.push({
        memberId: member.id,
        name: `${member.firstName} ${member.lastName}`,
        phone: member.phone,
        email: member.email,
        type: isOverdue ? 'OVERDUE' : (isDueToday ? 'DUE_TODAY' : 'DUE_IN_3_DAYS'),
        smsStatus: status,
        smsError: errorMsg,
        emailStatus,
        emailError: emailErrorMsg,
      });
    }

    return NextResponse.json({
      processedCount: members.length,
      smsMode:
        process.env.USE_REAL_SMS === 'true' ? 'GEORGIAN_SMS' : 'CONSOLE',
      emailMode:
        process.env.USE_REAL_EMAIL === 'true' ? 'RESEND' : 'CONSOLE',
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
