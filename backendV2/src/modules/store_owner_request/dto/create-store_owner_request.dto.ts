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

/*
body API:
{
  "name": "Đại lý vặt tư nông nghiệp Hoàng Huy",
  "business_license": "1234567890",
  "invenstory_address": "Đại lý vặt tư nông nghiệp Hoàng Huy, đường Lê Quý Đôn, phường 1, quận 1, thành phố Hồ Chí Minh",
  "invenstory_lat": 10.7769,
  "invenstory_lng": 106.7099,
  "invenstory_img": "https://tse2.mm.bing.net/th/id/OIP.wxLz1ZS2yH7jtRT5-4JMCQHaE9?pid=Api&P=0&h=220"
}
*/
