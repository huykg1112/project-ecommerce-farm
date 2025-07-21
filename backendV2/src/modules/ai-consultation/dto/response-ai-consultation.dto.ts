export class AiConsultationResponseDto {
  consultation_id: string;
  crop_type?: string;
  symptom_description?: string;
  growth_stage?: string;
  recommended_treatment?: string;
  created_at: Date;
  updated_at: Date;
  user?: {
    user_id: string;
    full_name?: string;
    email?: string;
  };
  disease?: {
    disease_id: string;
    disease_name: string;
    description?: string;
  };
  treatment_plans?: Array<{
    plan_id: string;
    plan_name?: string;
    description?: string;
  }>;
}

export class AiConsultationStatisticsDto {
  total: number;
  todayCount: number;
  cropTypeStats: Array<{
    crop_type: string;
    count: number;
  }>;
  diseaseStats: Array<{
    disease_name: string;
    disease_id: string;
    count: number;
  }>;
  growthStageStats: Array<{
    growth_stage: string;
    count: number;
  }>;
  monthlyStats: Array<{
    month: string;
    count: number;
  }>;
}
