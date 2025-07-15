import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvenstoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  business_license?: string;

  @IsString()
  @IsOptional()
  invenstory_address?: string;

  @IsNumber()
  @IsOptional()
  invenstory_lat?: number;

  @IsNumber()
  @IsOptional()
  invenstory_lng?: number;

  @IsOptional()
  @IsString()
  invenstory_img?: string;

  @IsOptional()
  @IsString()
  distributor_id?: string; // dùng khi tạo thủ công, còn khi duyệt request sẽ tự động gán
}
