import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString({ message: 'Tên phương thức phải là chuỗi' })
  @IsIn(['COD', 'VNPAY'], { message: 'Phương thức chỉ được là COD hoặc VNPAY' })
  method_name: string;

  @IsString({ message: 'Mô tả phải là chuỗi' })
  @IsOptional()
  description?: string;

  @IsBoolean({ message: 'Trạng thái phải là boolean' })
  @IsOptional()
  is_active?: boolean;
}
