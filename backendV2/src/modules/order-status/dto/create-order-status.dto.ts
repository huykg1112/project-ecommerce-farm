import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateOrderStatusDto {
  @IsString({ message: 'Tên trạng thái phải là chuỗi' })
  status_name: string;

  @IsString({ message: 'Mô tả phải là chuỗi' })
  @IsOptional()
  description?: string;

  @IsBoolean({ message: 'Trạng thái phải là boolean' })
  @IsOptional()
  is_active?: boolean;
}
