import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateProductTypeDto {
  @IsString({ message: 'Tên loại sản phẩm phải là chuỗi' })
  type_name: string;

  @IsString({ message: 'Mô tả phải là chuỗi' })
  @IsOptional()
  description?: string;

  @IsBoolean({ message: 'Trạng thái phải là boolean' })
  @IsOptional()
  is_active?: boolean;
}
