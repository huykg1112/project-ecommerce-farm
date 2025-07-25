import { IsUUID } from 'class-validator';

export class DeleteReviewDto {
  @IsUUID()
  review_id: string;
}
