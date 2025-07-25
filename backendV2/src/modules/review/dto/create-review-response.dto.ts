import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateReviewResponseDto {
  @IsUUID()
  parent_review_id: string;

  @IsOptional()
  @IsUUID()
  distributor_id?: string; // If not provided, use current user

  @IsString()
  @IsOptional()
  comment: string;
}
