import { MailAdapter, SendMailData } from "../mail-adapter";
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "792774ec9f92ed",
    pass: "df0a1b5b94a737"
  }
});

export class NodemailerMailAdapter implements MailAdapter {
  async sendMail({subject, body}: SendMailData) {
    await transport.sendMail({
    from: 'Equipe Feedget <oi@feedget.com>',
    to: '<Wallysson Lima <wlc.couto@gmail.com>',
    subject,
    html: body
  })
  };
}

// [
//   `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
//     `<p>Tipo do feedback: ${type}</p>`,
//     `<p>Comentário: ${comment}`,
//   `</div>`
// ].join('\n')