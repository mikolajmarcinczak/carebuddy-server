import nodemailer from 'nodemailer';

class MailService {
  async sendMail (from: string, to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_PROVIDER,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWWORD
      }
    });

    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}

export default new MailService();