import { createTransport } from "nodemailer";
import { env } from "@config";

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
