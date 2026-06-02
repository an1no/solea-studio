/**
 * Premium Email service using Resend.
 * Supports elegant HTML templates and a local console fallback for seamless development.
 */

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, text, from }: SendEmailOptions): Promise<void> {
  const useRealEmail = process.env.USE_REAL_EMAIL === 'true';
  const apiKey = process.env.RESEND_API_KEY || '';
  // Default to Resend onboarding email if custom sender is not configured
  const sender = from || process.env.EMAIL_FROM || 'Solea Studio <onboarding@resend.dev>';

  if (!useRealEmail) {
    // Elegant local development console logging
    console.log('✉️ ─────────────────────────────────────────');
    console.log('[EMAIL NOTIFICATION (DEVELOPMENT FALLBACK)]');
    console.log(`  From:    ${sender}`);
    console.log(`  To:      ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log('  Content:');
    console.log(text);
    console.log('───────────────────────────────────────── ✉️');
    return;
  }

  if (!apiKey) {
    throw new Error('ResendEmailService: RESEND_API_KEY must be set when USE_REAL_EMAIL is true.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: sender,
      to: [to],
      subject: subject,
      html: html,
      text: text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend API returned ${response.status}: ${errorBody}`);
  }
}

/**
 * Returns a premium, responsive HTML email template for billing reminders.
 */
export function getBillingReminderTemplate({
  firstName,
  dueDate,
  isDueToday,
  branchName,
  lang,
}: {
  firstName: string;
  dueDate: string;
  isDueToday: boolean;
  branchName: string;
  lang: 'en' | 'ka';
}): { html: string; text: string; subject: string } {
  const formattedDate = new Date(dueDate).toLocaleDateString(lang === 'ka' ? 'ka-GE' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Multilingual dynamic titles and content
  const subject = isDueToday
    ? lang === 'ka'
      ? `🔔 შეხსენება: წევრობის გადასახადის ვადა დღეს არის — Solea Studio`
      : `🔔 Reminder: Membership Due Today — Solea Studio`
    : lang === 'ka'
      ? `📅 შეხსენება: წევრობის გადასახადის ვადა 3 დღეშია — Solea Studio`
      : `📅 Reminder: Membership Due in 3 Days — Solea Studio`;

  const heading = isDueToday
    ? lang === 'ka'
      ? 'წევრობის გადასახადის ვადა დღეს არის'
      : 'Membership Payment Due Today'
    : lang === 'ka'
      ? 'წევრობის გადასახადის ვადა 3 დღეშია'
      : 'Membership Payment Due in 3 Days';

  const bodyText = isDueToday
    ? lang === 'ka'
      ? `გამარჯობა ${firstName}, შეგახსენებთ, რომ დღეს არის თქვენი ყოველთვიური წევრობის გადასახადის ვადა Solea Studio-ს ${branchName} ფილიალში.`
      : `Hello ${firstName}, this is a gentle reminder that your monthly membership payment is due today for the Solea Studio ${branchName} branch.`
    : lang === 'ka'
      ? `გამარჯობა ${firstName}, შეგახსენებთ, რომ თქვენი ყოველთვიური წევრობის გადასახადის ვადა Solea Studio-ს ${branchName} ფილიალში არის 3 დღეში — ${formattedDate}.`
      : `Hello ${firstName}, this is a friendly reminder that your monthly membership payment for the Solea Studio ${branchName} branch is due in 3 days on ${formattedDate}.`;

  const thankYou = lang === 'ka'
    ? 'გმადლობთ, რომ პრაქტიკობთ ჩვენთან ერთად!'
    : 'Thank you for practicing with us!';

  const buttonText = lang === 'ka' ? 'პორტალზე გადასვლა' : 'Go to Admin Portal';

  // Beautiful premium responsive HTML email template using inline Tailwind-like aesthetics
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #fafaf7;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper {
            width: 100%;
            background-color: #fafaf7;
            padding: 40px 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e5e5e0;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          }
          .header {
            background-color: #4a5c53;
            padding: 40px;
            text-align: center;
          }
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #f7f7f2;
            letter-spacing: 0.1em;
            margin: 0;
            font-family: Georgia, serif;
          }
          .logo-accent {
            color: #d1b48c;
          }
          .content {
            padding: 40px;
            color: #2d312e;
          }
          .badge {
            display: inline-block;
            background-color: #f3eae1;
            color: #8c6d48;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 6px 16px;
            border-radius: 100px;
            margin-bottom: 20px;
          }
          .title {
            font-family: Georgia, serif;
            font-size: 24px;
            font-weight: 700;
            color: #2d312e;
            margin-top: 0;
            margin-bottom: 20px;
            line-height: 1.3;
          }
          .body-text {
            font-size: 15px;
            line-height: 1.6;
            color: #555c56;
            margin-bottom: 30px;
          }
          .details-card {
            background-color: #fafaf7;
            border: 1px solid #e5e5e0;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 30px;
          }
          .details-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e5e0;
          }
          .details-row:last-child {
            border-bottom: none;
          }
          .details-label {
            font-size: 13px;
            color: #7c857e;
          }
          .details-value {
            font-size: 13px;
            font-weight: 600;
            color: #2d312e;
          }
          .footer {
            background-color: #fafaf7;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e5e5e0;
            font-size: 12px;
            color: #7c857e;
          }
          .footer-links {
            margin-top: 10px;
          }
          .footer-link {
            color: #4a5c53;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1 class="logo">SOLEA <span class="logo-accent">STUDIO</span></h1>
            </div>
            <div class="content">
              <div class="badge">${isDueToday ? 'Urgent / სასწრაფო' : 'Reminder / შეხსენება'}</div>
              <h2 class="title">${heading}</h2>
              <p class="body-text">${bodyText}</p>
              
              <div class="details-card">
                <div class="details-row">
                  <span class="details-label">${lang === 'ka' ? 'ფილიალი' : 'Branch'}</span>
                  <span class="details-value">${branchName}</span>
                </div>
                <div class="details-row">
                  <span class="details-label">${lang === 'ka' ? 'ვადა' : 'Due Date'}</span>
                  <span class="details-value">${formattedDate}</span>
                </div>
              </div>
              
              <p class="body-text" style="font-style: italic; margin-bottom: 0;">${thankYou}</p>
            </div>
            <div class="footer">
              <p>© 2026 Solea Studio. All rights reserved.</p>
              <div class="footer-links">
                <a href="https://solea-studio-ten.vercel.app" class="footer-link">${buttonText}</a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `${heading}\n\n${bodyText}\n\n${thankYou}\n\nBranch: ${branchName}\nDue Date: ${formattedDate}`;

  return { html, text, subject };
}
