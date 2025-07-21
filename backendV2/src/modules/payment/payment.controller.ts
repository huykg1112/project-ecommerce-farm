import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment/vnpay')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-url')
  createPaymentUrl(@Body() body: any, @Req() req: Request) {
    const { amount, orderId, orderInfo, orderType, bankCode } = body;
    const ipAddr =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const paymentUrl = this.paymentService.createPaymentUrl({
      amount,
      orderId,
      orderInfo,
      orderType,
      ipAddr,
      bankCode,
    });
    return { paymentUrl };
  }

  @Get('return')
  async vnpReturn(@Query() query: any, @Res() res: Response) {
    // Có thể kiểm tra checksum, redirect về FE với query string
    return res.redirect(
      `/checkout/success?${new URLSearchParams(query).toString()}`,
    );
  }

  @Get('ipn')
  async vnpIpn(@Query() query: any, @Res() res: Response) {
    // TODO: Kiểm tra checksum, cập nhật trạng thái đơn hàng, trả về JSON cho VNPay
    return res.json({ RspCode: '00', Message: 'Confirm Success' });
  }
}
