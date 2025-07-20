import { PestAnalysisRequest, PestAnalysisResponse } from "@/types/pest-analysis";
import { post } from "@/utils/api";

export async function getPestAnalysis(request: PestAnalysisRequest): Promise<PestAnalysisResponse> {
  if (request.analysisType === 'text') {
    return await getPestAnalysisByText(request);
  }
  return await getPestAnalysisByImage(request);
}

export const getPestAnalysisByText = async (request: PestAnalysisRequest): Promise<PestAnalysisResponse> => {
  return await post<PestAnalysisResponse>('/api/pest/analyze/text', request);
}

export const getPestAnalysisByImage = async (request: PestAnalysisRequest): Promise<PestAnalysisResponse> => {
  return await post<PestAnalysisResponse>('/api/pest/analyze/image', request);
}