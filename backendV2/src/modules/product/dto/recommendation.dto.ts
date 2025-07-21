import { IsOptional, IsUUID, IsNumber, Min, Max } from 'class-validator';

export interface UserProductScore {
  userId: string;
  productId: string;
  score: number; // Combination of rating and purchase frequency
}

export interface SimilarUser {
  userId: string;
  similarity: number;
}

export interface PredictionScore {
  productId: string;
  predictedScore: number;
  confidence: number;
  voters: number;
}

export interface RecommendationResult {
  productId: string;
  product: any;
  predictedScore: number;
  confidence: number;
  recommendationReason: string;
}

export interface UserProductMatrix {
  [userId: string]: {
    [productId: string]: number;
  };
}
