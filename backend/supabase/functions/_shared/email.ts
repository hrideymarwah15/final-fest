const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') || 'noreply@sportsfest.com';
const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'http://localhost:3000';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

// Send email via Resend
export async function sendEmail(options: EmailOptions): Promise<boolean> {
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: EMAIL_FROM,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
}

// Email templates
export const emailTemplates = {
    welcome: (name: string) => ({
        subject: 'Welcome to Sports Fest 2024!',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏆 Welcome to Sports Fest 2024!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for registering! We're excited to have you participate in Sports Fest 2024.</p>
            <p>You can now browse available sports and register for events.</p>
            <a href="${FRONTEND_URL}/sports" class="button">Browse Sports</a>
            <p style="margin-top: 30px;">If you have any questions, feel free to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>© 2024 Sports Fest. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),

    registrationConfirmation: (name: string, sportName: string, registrationNumber: string) => ({
        subject: `Registration Confirmed: ${sportName}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .registration-box { background: white; border: 2px solid #48bb78; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
          .reg-number { font-size: 24px; font-weight: bold; color: #48bb78; }
          .button { display: inline-block; background: #48bb78; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Registration Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Congratulations, ${name}!</h2>
            <p>Your registration for <strong>${sportName}</strong> has been confirmed.</p>
            <div class="registration-box">
              <p>Your Registration Number</p>
              <p class="reg-number">${registrationNumber}</p>
            </div>
            <p>Please keep this number safe. You'll need it during the event check-in.</p>
            <a href="${FRONTEND_URL}/dashboard" class="button">View My Registrations</a>
          </div>
          <div class="footer">
            <p>© 2024 Sports Fest. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),

    paymentConfirmation: (name: string, sportName: string, amount: number, receiptNumber: string) => ({
        subject: `Payment Received: ${sportName}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .receipt-box { background: white; border: 1px solid #ddd; border-radius: 10px; padding: 20px; margin: 20px 0; }
          .amount { font-size: 28px; font-weight: bold; color: #48bb78; text-align: center; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 Payment Successful!</h1>
          </div>
          <div class="content">
            <h2>Thank you, ${name}!</h2>
            <p>We've received your payment for <strong>${sportName}</strong>.</p>
            <div class="receipt-box">
              <p class="amount">₹${amount.toFixed(2)}</p>
              <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
              <p><strong>Receipt Number:</strong> ${receiptNumber}</p>
              <p><strong>Event:</strong> ${sportName}</p>
              <p><strong>Status:</strong> <span style="color: #48bb78;">Paid</span></p>
            </div>
            <a href="${FRONTEND_URL}/payments" class="button">View Receipt</a>
          </div>
          <div class="footer">
            <p>© 2024 Sports Fest. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),

    reminder: (name: string, sportName: string, eventDate: string, venue: string) => ({
        subject: `Reminder: ${sportName} starts tomorrow!`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .event-box { background: white; border-left: 4px solid #ed8936; padding: 20px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Event Reminder</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>This is a friendly reminder that your event is coming up soon!</p>
            <div class="event-box">
              <h3 style="margin-top: 0;">${sportName}</h3>
              <p>📅 <strong>Date:</strong> ${eventDate}</p>
              <p>📍 <strong>Venue:</strong> ${venue}</p>
            </div>
            <p>Please arrive at least 30 minutes before the scheduled time for check-in.</p>
            <p>Good luck! 🏆</p>
          </div>
          <div class="footer">
            <p>© 2024 Sports Fest. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),

    waitlistPromotion: (name: string, sportName: string) => ({
        subject: `Spot Available: ${sportName}!`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert-box { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 10px; padding: 15px; margin: 20px 0; }
          .button { display: inline-block; background: #805ad5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 A Spot Has Opened Up!</h1>
          </div>
          <div class="content">
            <h2>Great news, ${name}!</h2>
            <p>A spot has opened up for <strong>${sportName}</strong> and you're next in line!</p>
            <div class="alert-box">
              <p>⚠️ <strong>Important:</strong> Please complete your payment within 24 hours to confirm your registration, or you may lose your spot.</p>
            </div>
            <a href="${FRONTEND_URL}/dashboard" class="button">Complete Payment</a>
          </div>
          <div class="footer">
            <p>© 2024 Sports Fest. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),

    cancellation: (name: string, sportName: string, reason?: string) => ({
        subject: `Registration Cancelled: ${sportName}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #fc8181 0%, #f56565 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Registration Cancelled</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Your registration for <strong>${sportName}</strong> has been cancelled.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>If you'd like to register again, you can browse available sports.</p>
            <a href="${FRONTEND_URL}/sports" class="button">Browse Sports</a>
            <p style="margin-top: 30px;">If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2024 Sports Fest. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),
};

// Send templated email
export async function sendTemplatedEmail(
    to: string,
    template: keyof typeof emailTemplates,
    // deno-lint-ignore no-explicit-any
    ...args: any[]
): Promise<boolean> {
    // @ts-ignore - dynamic template args
    const { subject, html } = emailTemplates[template](...args);
    return sendEmail({ to, subject, html });
}
