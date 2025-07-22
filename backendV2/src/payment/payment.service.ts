import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductCode, VNPay, VnpLocale } from 'vnpay';

export interface CreatePaymentDto {
  amount: number;
  orderId: string;
  orderInfo: string;
  orderType?: ProductCode;
  ipAddr: string;
  bankCode?: string;
}

export interface PaymentResult {
  paymentUrl: string;
  vnpayParams: any;
}

export interface VerifyPaymentDto {
  vnp_TxnRef: string;
  vnp_OrderInfo: string;
  vnp_ResponseCode: string;
  vnp_Amount: string;
  vnp_BankCode?: string;
  vnp_BankTranNo?: string;
  vnp_CardType?: string;
  vnp_PayDate?: string;
  vnp_SecureHash: string;
  vnp_TransactionNo?: string;
  vnp_TransactionStatus?: string;
  [key: string]: string | undefined;
}

@Injectable()
export class PaymentService {
  constructor(
    @Inject('VNPAY_SERVICE') private readonly vnpay: VNPay,
    private readonly configService: ConfigService,
  ) {}

  async createPaymentUrl(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResult> {
    const { amount, orderId, orderInfo, orderType, ipAddr, bankCode } =
      createPaymentDto;

    const returnUrl =
      this.configService.get<string>('VNPAY_RETURN_URL') ||
      'http://localhost:3000/checkout/success';

    console.log('VNPay Config Check:', {
      tmnCode: this.configService.get<string>('VNPAY_TMN_CODE'),
      hasSecret: !!this.configService.get<string>('VNPAY_HASH_SECRET'),
      vnpayUrl: this.configService.get<string>('VNPAY_URL'),
      returnUrl,
    });

    console.log('Payment Data:', {
      amount,
      orderId,
      orderInfo,
      orderType,
      ipAddr,
      bankCode,
    });

    try {
      const paymentUrl = this.vnpay.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: orderType || ProductCode.Other,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_BankCode: bankCode,
        vnp_Locale: VnpLocale.VN,
      });

      return {
        paymentUrl,
        vnpayParams: {
          amount,
          orderId,
          orderInfo,
          returnUrl,
        },
      };
    } catch (error) {
      console.error('VNPay buildPaymentUrl error:', error);
      throw new Error(`Failed to create payment URL: ${error.message}`);
    }
  }

  async verifyPayment(params: VerifyPaymentDto): Promise<boolean> {
    try {
      const verify = this.vnpay.verifyReturnUrl(params);
      return verify.isVerified && verify.isSuccess;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  async verifyIPN(
    params: VerifyPaymentDto,
  ): Promise<{ RspCode: string; Message: string }> {
    try {
      const verify = this.vnpay.verifyIpnCall(params);

      if (!verify.isVerified) {
        return {
          RspCode: '97',
          Message: 'Invalid signature',
        };
      }

      if (!verify.isSuccess) {
        return {
          RspCode: '00',
          Message: 'Transaction failed',
        };
      }

      // Here you should update your order status in database
      // Example: await this.orderService.updateOrderStatus(params.vnp_TxnRef, 'PAID');

      return {
        RspCode: '00',
        Message: 'Confirm success',
      };
    } catch (error) {
      console.error('IPN verification error:', error);
      return {
        RspCode: '99',
        Message: 'System error',
      };
    }
  }

  getPaymentStatus(responseCode: string): string {
    const statusMap = {
      '00': 'SUCCESS',
      '07': 'SUSPICIOUS',
      '09': 'CARD_NOT_REGISTERED',
      '10': 'INCORRECT_OTP',
      '11': 'EXPIRED_OTP',
      '12': 'CARD_LOCKED',
      '13': 'INCORRECT_PASSWORD',
      '24': 'CANCELLED',
      '51': 'INSUFFICIENT_BALANCE',
      '65': 'TRANSACTION_LIMIT_EXCEEDED',
      '75': 'BANK_MAINTENANCE',
      '79': 'EXCEEDED_PASSWORD_ATTEMPTS',
      '99': 'UNKNOWN_ERROR',
    };

    return statusMap[responseCode] || 'UNKNOWN_ERROR';
  }
}
