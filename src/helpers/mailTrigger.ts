import { createTransport } from 'nodemailer';
import { env } from '@config';

/**
 * Creates a nodemailer transport using the configured SMTP server and credentials.
 *
 * @returns {import("nodemailer").Transport} - The created nodemailer transport.
 */
const transporter = createTransport({
  host: env.BREVO_SMTP_SERVER,
  port: env.BREVO_PORT,
  secure: false, // TLS
  auth: {
    user: env.BREVO_LOGIN,
    pass: env.BREVO_PASSWORD,
  },
});

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Sends an email using the configured transport.
 *
 * @param {MailOptions} options - The mail options.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.subject - The email subject.
 * @param {string} options.html - The email body in HTML format.
 * @param {string} [options.from=`"operations" <${env.BREVO_USER}>`] - The sender's email address.
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>} - A promise that resolves to an object with a success flag, an optional messageId, and an optional error message.
 */
export async function sendMail({
  to,
  subject,
  html,
  from = `"operations" <${env.BREVO_USER}>`,
}: MailOptions): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
