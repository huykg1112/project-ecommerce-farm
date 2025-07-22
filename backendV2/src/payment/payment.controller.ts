import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreatePaymentUrlDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment/vnpay')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-url')
  async createPaymentUrl(
    @Body() createPaymentDto: CreatePaymentUrlDto,
    @Req() req: Request,
  ) {
    const { amount, orderId, orderInfo, orderType, bankCode } =
      createPaymentDto;

    // Fix IP address handling
    let ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      (req.connection.remoteAddress as string) ||
      (req.socket.remoteAddress as string) ||
      '127.0.0.1';

    // console.log('IP Address:', ipAddr);

    // Clean up IP address - remove IPv6 prefix if present
    if (ipAddr.includes(',')) {
      ipAddr = ipAddr.split(',')[0].trim();
    }
    if (ipAddr === '::1' || ipAddr === '::ffff:127.0.0.1') {
      ipAddr = '127.0.0.1';
    }

    // console.log('Payment request:', { amount, orderId, orderInfo, ipAddr });

    try {
      const result = await this.paymentService.createPaymentUrl({
        amount,
        orderId,
        orderInfo,
        orderType,
        ipAddr,
        bankCode,
      });

      // console.log('Payment URL created:', result.paymentUrl);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      // console.error('Payment creation error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('return')
  async vnpReturn(@Query() query: any, @Res() res: Response) {
    try {
      const isValid = await this.paymentService.verifyPayment(query);
      const status = this.paymentService.getPaymentStatus(
        query.vnp_ResponseCode,
      );

      if (isValid && status === 'SUCCESS') {
        // Payment successful - redirect to success page
        const successParams = new URLSearchParams({
          status: 'success',
          orderId: query.vnp_TxnRef,
          amount: query.vnp_Amount,
          transactionNo: query.vnp_TransactionNo || '',
        });

        return res.redirect(`/checkout/success?${successParams.toString()}`);
      } else {
        // Payment failed - redirect to failure page
        const failureParams = new URLSearchParams({
          status: 'failed',
          orderId: query.vnp_TxnRef,
          message: status,
        });

        return res.redirect(`/checkout/failure?${failureParams.toString()}`);
      }
    } catch (error) {
      // console.error('VNPay return error:', error);
      return res.redirect(
        '/checkout/failure?status=error&message=System error',
      );
    }
  }

  @Get('ipn')
  async vnpIpn(@Query() query: any, @Res() res: Response) {
    try {
      const result = await this.paymentService.verifyIPN(query);
      return res.json(result);
    } catch (error) {
      // console.error('VNPay IPN error:', error);
      return res.json({
        RspCode: '99',
        Message: 'System error',
      });
    }
  }

  @Get('status/:orderId')
  async getPaymentStatus(@Param('orderId') orderId: string) {
    // This endpoint can be used to check payment status
    // You would typically query your database here
    return {
      orderId,
      status: 'pending', // This should come from your database
    };
  }
}
