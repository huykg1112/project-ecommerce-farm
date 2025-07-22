import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VNPay } from 'vnpay';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'VNPAY_SERVICE',
      useFactory: (configService: ConfigService) => {
        return new VNPay({
          tmnCode: configService.get<string>('VNPAY_TMN_CODE') || '',
          secureSecret: configService.get<string>('VNPAY_HASH_SECRET') || '',
          vnpayHost:
            configService.get<string>('VNPAY_URL') ||
            'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
          testMode: true, // Set to false in production
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
