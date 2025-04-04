import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác thực email của bạn',
      html: `
        <p>Xin chào,</p>
        <p>Vui lòng click vào link dưới đây để xác thực email của bạn:</p>
        <a href="${url}">Xác thực email</a>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const url = `http://localhost:3000/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Đặt lại mật khẩu',
      html: `
        <p>Xin chào,</p>
        <p>Vui lòng click vào link dưới đây để đặt lại mật khẩu:</p>
        <a href="${url}">Đặt lại mật khẩu</a>
      `,
    });
  }
}
