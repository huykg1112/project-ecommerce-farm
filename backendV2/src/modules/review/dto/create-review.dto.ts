import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  product_id: string;

  @IsOptional()
  @IsUUID()
  user_id?: string; // Optional để admin có thể tạo review

  @IsOptional()
  @IsUUID()
  distributor_id?: string; // Cho distributor phản hồi

  @IsOptional()
  @IsUUID()
  parent_review_id?: string; // Khi distributor phản hồi review

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating?: number; // Chỉ có khi user đánh giá, không có khi distributor phản hồi

  @IsString()
  comment: string; // Bắt buộc có comment
}
