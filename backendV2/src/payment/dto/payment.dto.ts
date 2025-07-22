import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProductCode } from 'vnpay';

export class CreatePaymentUrlDto {
  @IsNumber()
  @Min(1000, { message: 'Amount must be at least 1000 VND' })
  amount: number;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  orderInfo: string;

  @IsOptional()
  @IsString()
  orderType?: ProductCode;

  @IsOptional()
  @IsString()
  bankCode?: string;
}

export class PaymentReturnDto {
  @IsString()
  vnp_Amount: string;

  @IsString()
  vnp_BankCode: string;

  @IsString()
  vnp_BankTranNo: string;

  @IsString()
  vnp_CardType: string;

  @IsString()
  vnp_OrderInfo: string;

  @IsString()
  vnp_PayDate: string;

  @IsString()
  vnp_ResponseCode: string;

  @IsString()
  vnp_TmnCode: string;

  @IsString()
  vnp_TransactionNo: string;

  @IsString()
  vnp_TransactionStatus: string;

  @IsString()
  vnp_TxnRef: string;

  @IsString()
  vnp_SecureHash: string;
}
