import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePromotionDto {
  @IsString({ message: 'Tên chương trình phải là chuỗi' })
  promotion_name: string;

  @IsString({ message: 'Mô tả phải là chuỗi' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Giá trị giảm giá phải là số' })
  discount_value: number;

  @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
  start_date: string;

  @IsDateString({}, { message: 'Ngày kết thúc không hợp lệ' })
  end_date: string;

  @IsBoolean({ message: 'Trạng thái phải là boolean' })
  @IsOptional()
  is_active?: boolean;

  @IsArray({ message: 'Danh sách batch_product_ids phải là mảng' })
  @ArrayNotEmpty({ message: 'Phải chọn ít nhất 1 sản phẩm áp dụng' })
  batch_product_ids: string[];
}

/*
{
  "promotion_name": "Chương trình giảm giá 10%",
  "description": "Giảm giá 10% cho tất cả sản phẩm",
  "discount_value": 10,
  "start_date": "2025-01-01",
  "end_date": "2025-01-31",
  "is_active": true,
  "batch_product_ids": ["1", "2", "3"]
}
*/
