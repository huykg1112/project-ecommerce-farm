import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class QueryReviewDto {
  @IsOptional()
  @IsUUID()
  product_id?: string;

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsUUID()
  distributor_id?: string;

  @IsOptional()
  @IsUUID()
  parent_review_id?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string; // Tìm kiếm trong comment

  @IsOptional()
  @IsString()
  sort_by?: string = 'created_at'; // rating, created_at, updated_at

  @IsOptional()
  @IsString()
  sort_order?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  include_deleted?: boolean = false; // Chỉ admin mới xem được deleted reviews

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  only_parent_reviews?: boolean = false; // Chỉ lấy review gốc (không phải phản hồi)

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  only_responses?: boolean = false; // Chỉ lấy phản hồi từ distributor
}
