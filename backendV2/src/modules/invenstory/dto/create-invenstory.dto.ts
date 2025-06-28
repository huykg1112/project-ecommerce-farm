import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvenstoryDto {
  @IsString()
  name: string;

  @IsString()
  business_license: string;

  @IsString()
  invenstory_address: string;

  @IsNumber()
  invenstory_lat: number;

  @IsNumber()
  invenstory_lng: number;

  @IsOptional()
  @IsString()
  invenstory_img?: string;

  @IsOptional()
  @IsString()
  distributor_id?: string; // dùng khi tạo thủ công, còn khi duyệt request sẽ tự động gán
}
