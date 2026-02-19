import nodemailer from 'nodemailer';
import type Subscriber from '../types/interfaces/subsciber.interface.js';
import type Newsletter from '../types/interfaces/newsletter.interface.js';
import newsletterModel from '../models/newsletter.model.js';
import cron from 'node-cron';
import subscriberModel from '../models/subscriber.model.js';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

let transporter: nodemailer.Transporter<
  SMTPTransport.SentMessageInfo,
  SMTPTransport.Options
>;
if (process.env.NODE_ENV === 'development') {
  const testAccount = await nodemailer.createTestAccount();
  console.info(testAccount);
  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.MAILER_EMAIL,
      clientId: process.env.MAILER_CLIENT_ID,
      clientSecret: process.env.MAILER_CLIENT_SECRET,
      accessToken: process.env.MAILER_ACCESS_TOKEN,
      refreshToken: process.env.MAILER_REFRESH_TOKEN,
    },
  });

  await transporter.verify();
}

const sendMail = async (
  newsletter: Newsletter,
  subscribers: Subscriber[],
): Promise<void> => {
  const sendPromises = subscribers.map((subs) => {
    return transporter.sendMail({
      from: `MarsAi <${process.env.MAILER_EMAIL}>`,
      to: subs.email,
      subject: newsletter.object,
      html: `
        <h1>miaou miaou<h1/>
        <p>${newsletter.content}<p/>
        <img src="https://imgs.search.brave.com/6HTmkrs86xIbHszERypQBVSqhAIY9u7Z4AQSoL1C1I0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTg3/MTMyOTczNS9waG90/by9jYXRzLW5vc2Uu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PVVHWGgtS21yTm9Z/Tl9va05zM2tlWmFm/M1VHMUZ1akRmMVFN/djlvNDRmbTQ9" alt="Mars Logo" />
    `,
    });
  });

  const result = await Promise.allSettled(sendPromises);
  console.info('Email sent: ' + result.length);

  await newsletterModel.setIsSent(newsletter.id);
};

const mailerJob = (): void => {
  cron.schedule('*/10 * * * *', async () => {
    console.info('Running mailer job on ' + new Date().toUTCString());
    const newsletters = await newsletterModel.findAllToSend();
    if (newsletters.length > 0) {
      const subscribers = await subscriberModel.findAll();
      if (subscribers.length > 0) {
        for (const newsletter of newsletters) {
          await sendMail(newsletter, subscribers);
        }
      }
    }
  });
};

const sendMailSubscribeEvent = async (
  participantEmail: string,
  eventTitle: string,
  eventDescription: string,
  token: string,
): Promise<void> => {
  await transporter.sendMail({
    from: `MarsAi <${process.env.MAILER_EMAIL}>`,
    to: participantEmail,
    subject: `Subscription Confirmation for Event: ${eventTitle}`,
    html: `
      <h1>Event Subscription Confirmation</h1>
      <p>Dear participant,</p>
      <p>Thank you for subscribing to our event: <strong>${eventTitle}</strong>.</p>
      <p>Here are the details of the event:</p>
      <p>${eventDescription}</p>
      <p>We look forward to seeing you there!</p>
      <p>If you want to unsubscribe, please <a href="${process.env.FRONT_IP}/bookings/unsubscribe/${token}">click here</a>.</p>
      <img src="https://imgs.search.brave.com/6HTmkrs86xIbHszERypQBVSqhAIY9u7Z4AQSoL1C1I0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTg3/MTMyOTczNS9waG90/by9jYXRzLW5vc2Uu/anBnP3M9NjExNjEy/Jnc9maz0yMCZjPVVHWGgtS21yTm9Z/Tl9va05zM2tlWmFm/M1VHMUZ1akRmMVFN/djlvNDRmbTQ9" alt="Mars Logo" />
    `,
  });
  console.info(
    `Subscription confirmation email sent to ${participantEmail} for event ${eventTitle}`,
  );
};

const emailService = { sendMail, mailerJob, sendMailSubscribeEvent };

export default emailService;
