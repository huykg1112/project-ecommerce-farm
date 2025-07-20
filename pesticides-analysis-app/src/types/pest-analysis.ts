export interface PestAnalysisRequest {
  cropType: string;
  symptoms: string;
  analysisType?: 'text' | 'image';
  imageFile?: File;
  imageBase64?: string;
  imageMimeType?: string;
}

export interface Treatment {
  method: string;
  recommendedProducts: string[];
  applicationTiming: string;
  dosage: string;
  safetyNotes: string;
}

export interface PestOrDisease {
  name: string;
  cause: string;
  impact: string;
  treatment: Treatment;
}

export interface PestAnalysisResponse {
  cropType: string;
  cropSymptom: string;
  possiblePestsOrDiseases: PestOrDisease[];
  additionalInfo: string;
}
