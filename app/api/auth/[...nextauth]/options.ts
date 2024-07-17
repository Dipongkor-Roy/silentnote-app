// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { render } from '@react-email/render';
import RaycastMagicLinkEmail from "../../../../Emails/email"; // Adjust the import path if necessary
import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_SERVER_PASSWORD);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT as string, 10),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const emailHtml = render(
          RaycastMagicLinkEmail({magicLink:url})  
        );

        const { data, error } = await resend.emails.send({
          from: 'SilentNote <onboarding@resend.dev>',
          to: [email],
          subject: 'Welcome to Our Service',
          html: emailHtml,
        });

        if (error) {
          console.error('Error sending email:', error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
