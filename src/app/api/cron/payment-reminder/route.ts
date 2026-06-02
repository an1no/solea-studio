import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import twilio from 'twilio';

// Initialize Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

export async function GET(request: Request) {
  try {
    // Check security token if passed via header (prevents unauthorized access in production)
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && secret !== cronSecret) {
      return NextResponse.json({ message: 'Unauthorized access.' }, { status: 401 });
    }

    // Define Date bounds for Today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Define Date bounds for 3 Days from now
    const threeDaysStart = new Date();
    threeDaysStart.setDate(threeDaysStart.getDate() + 3);
    threeDaysStart.setHours(0, 0, 0, 0);
    const threeDaysEnd = new Date();
    threeDaysEnd.setDate(threeDaysEnd.getDate() + 3);
    threeDaysEnd.setHours(23, 59, 59, 999);

    // Query members whose next payment is due today or in exactly 3 days
    const members = await db.user.findMany({
      where: {
        OR: [
          {
            nextPaymentDueDate: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
          {
            nextPaymentDueDate: {
              gte: threeDaysStart,
              lte: threeDaysEnd,
            },
          },
        ],
      },
    });

    const isTwilioConfigured = !!(accountSid && authToken && twilioPhone);
    let twilioClient: any = null;

    if (isTwilioConfigured) {
      twilioClient = twilio(accountSid, authToken);
    }

    const report: any[] = [];

    for (const member of members) {
      const isDueToday = member.nextPaymentDueDate >= todayStart && member.nextPaymentDueDate <= todayEnd;
      const formattedDate = new Date(member.nextPaymentDueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      let messageText = '';
      if (isDueToday) {
        messageText = `Namaste ${member.firstName}. This is a gentle reminder from Solea Studio (${member.branch} branch). Your monthly membership is due today. We look forward to practicing with you soon!`;
      } else {
        messageText = `Namaste ${member.firstName}. This is a friendly reminder from Solea Studio (${member.branch} branch). Your monthly membership is due in 3 days (on ${formattedDate}). Thank you for practicing with us!`;
      }

      let status = 'SIMULATED';
      let messageId = null;
      let twilioError = null;

      if (isTwilioConfigured && twilioClient) {
        try {
          const message = await twilioClient.messages.create({
            body: messageText,
            from: twilioPhone,
            to: member.phone
          });
          status = 'SENT';
          messageId = message.sid;
        } catch (err: any) {
          status = 'FAILED';
          twilioError = err.message;
          console.error(`Twilio dispatch failure for ${member.phone}:`, err);
        }
      } else {
        // Log to console for debugging purposes
        console.log(`[MOCK SMS] To: ${member.phone} | Body: "${messageText}"`);
      }

      report.push({
        memberId: member.id,
        name: `${member.firstName} ${member.lastName}`,
        phone: member.phone,
        status,
        dueDate: member.nextPaymentDueDate,
        type: isDueToday ? 'DUE_TODAY' : 'DUE_IN_3_DAYS',
        message: messageText,
        messageId,
        error: twilioError
      });
    }

    return NextResponse.json({
      processedCount: members.length,
      twilioLive: isTwilioConfigured,
      timestamp: new Date().toISOString(),
      dispatchedReminders: report
    });
  } catch (error: any) {
    console.error('Cron Reminder Error:', error);
    return NextResponse.json(
      { message: 'Internal server error occurred.', error: error.message },
      { status: 500 }
    );
  }
}
