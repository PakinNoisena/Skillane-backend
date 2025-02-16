import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailBodyPayload } from './interface/mail.interface';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('EMAIL'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendEmail(mailPayload: MailBodyPayload) {
    await this.transporter.sendMail({
      from: 'Skillane assessment service',
      to: mailPayload.to,
      subject: mailPayload.subject,
      html: mailPayload.html,
    });
  }
}
