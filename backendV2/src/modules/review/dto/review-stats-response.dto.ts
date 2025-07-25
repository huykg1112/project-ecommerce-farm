export class ReviewStatsResponseDto {
  total_reviews: number;
  average_rating: number;
  rating_distribution: { rating: number; count: number }[];
  total_responses: number;
}
