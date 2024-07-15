import { Resend } from 'resend';
import { RaycastMagicLinkEmail} from '../email/email';

const resend = new Resend(process.env.EMAIL_SERVER_PASSWORD);

await resend.emails.send({
  from: process.env.EMAIL_FROM as string,
  to: '',
  subject: 'hello world',
  react: <RaycastMagicLinkEmail />,
});
