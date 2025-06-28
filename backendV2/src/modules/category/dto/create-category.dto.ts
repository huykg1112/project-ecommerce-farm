import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Tên danh mục phải là chuỗi' })
  category_name: string;

  @IsString({ message: 'Mô tả phải là chuỗi' })
  @IsOptional()
  description?: string;

  @IsBoolean({ message: 'Trạng thái phải là boolean' })
  @IsOptional()
  is_active?: boolean;
}
