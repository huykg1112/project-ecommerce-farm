import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStoreOwnerRequestDto {
  // user_id will be injected from context, not from client
  @IsOptional()
  @IsString()
  note?: string;

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
}
