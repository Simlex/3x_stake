import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { accountCreationTemplate } from "./templates/accountCreation";
import { verifyEmailTemplate } from "./templates/verifyAccount";
import { resetPasswordTemplate } from "./templates/resetPassword";

type Mail = {
  to: string;
  name: string;
  subject: string;
  body: string;
  bcc?: string;
  attachments?: { filename: string; content: Buffer | string }[];
};

export async function sendMail({
  to,
  name,
  subject,
  body,
  bcc,
  attachments,
}: Mail) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    // Verify connection configuration
    const testResult = await transport.verify();
    // Log test result
    console.log("Transporter test result: ", testResult);
  } catch (error) {
    console.error(error);
  }

  try {
    if (attachments) {
      const sendMail = await transport.sendMail({
        from: SMTP_EMAIL,
        to,
        bcc,
        subject,
        html: body,
        attachments: [
          {
            filename: attachments[0].filename,
            content: attachments[0].content,
          },
        ],
      });

      return sendMail;
    }

    const sendMail = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      bcc,
      subject,
      html: body,
    });
    return sendMail;
  } catch (error) {
    console.error(error);
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?vrtkn=${token}`;

  // Send email to the new customer
  await sendMail({
    to: email,
    name: "Verify Email",
    subject: "Verify your email address",
    body: compileVerifyEmailTemplate({ verificationUrl, userEmail: email }),
  });
}

export function compileAccountCreationTemplate(name: string) {
  const template = handlebars.compile(accountCreationTemplate);
  const htmlBody = template({ name });

  return htmlBody;
}

export function compileVerifyEmailTemplate({
  verificationUrl,
  userEmail,
}: {
  verificationUrl: string;
  userEmail: string;
}) {
  const template = handlebars.compile(verifyEmailTemplate);
  const htmlBody = template({ verificationUrl, userEmail });

  return htmlBody;
}

export function compileResetEmailTemplate({
  username,
  resetLink,
}: {
  username: string;
  resetLink: string;
}) {
  const template = handlebars.compile(resetPasswordTemplate);
  const htmlBody = template({ username, resetLink });

  return htmlBody;
}
