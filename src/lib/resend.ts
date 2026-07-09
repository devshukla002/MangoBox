import { Resend } from 'resend';

let resendClient: Resend | null = null;

export function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY environment variable is missing. Resend is disabled or running in mock mode.');
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export async function sendInquiryEmail(to: string, name: string, type: string, message: string) {
  const client = getResend();
  if (!client) {
    console.log(`[Mock Resend Email] to: ${to}, name: ${name}, type: ${type}, message: ${message}`);
    return { success: true, mock: true };
  }

  try {
    const data = await client.emails.send({
      from: 'MangoBox Curation <onboarding@resend.dev>', // Resend default sandbox sender
      to: [to],
      subject: `New MangoBox Inquiry: ${type} - From ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #2F3B3B; background-color: #FFEDB7; border-radius: 10px;">
          <h2 style="color: #4ABA94; border-bottom: 2px solid #4ABA94; padding-bottom: 10px;">New Inquiry Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Inquiry Type:</strong> ${type}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background-color: rgba(47, 59, 59, 0.05); padding: 15px; border-left: 4px solid #4ABA94; margin: 10px 0;">
            ${message}
          </blockquote>
          <p style="font-size: 12px; color: #685B53; margin-top: 20px; border-top: 1px solid rgba(47, 59, 59, 0.1); padding-top: 10px;">
            This email was sent via MangoBox Curation and Resend.
          </p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email via Resend:', error);
    return { success: false, error };
  }
}
