import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductImageDto {
  @IsUUID('4', { message: 'product_id phải là UUID' })
  product_id: string;

  @IsString({ message: 'image_url phải là chuỗi' })
  image_url: string;

  @IsString({ message: 'description phải là chuỗi' })
  @IsOptional()
  description?: string;
}
