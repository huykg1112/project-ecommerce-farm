import {
  AIConsultationInfo,
  ImplementationPlanRequest,
  ImplementationPlanResponse,
  PestAnalysisRequest,
} from "@/lib_dashboard/types/pest-analysis";
import { post } from "@/lib_dashboard/utils/api";

export async function getPestAnalysis(
  request: PestAnalysisRequest
): Promise<AIConsultationInfo> {
  if (request.analysisType === "text") {
    return await getPestAnalysisByText(request);
  }
  return await getPestAnalysisByImage(request);
}

export const getPestAnalysisByText = async (
  request: PestAnalysisRequest
): Promise<AIConsultationInfo> => {
  return await post<AIConsultationInfo>("/api/pest/analyze/text", request);
};

export const getPestAnalysisByImage = async (
  request: PestAnalysisRequest
): Promise<AIConsultationInfo> => {
  return await post<AIConsultationInfo>("/api/pest/analyze/image", request);
};

export const getImplementationPlan = async (
  request: ImplementationPlanRequest
): Promise<ImplementationPlanResponse> => {
  return await post<ImplementationPlanResponse>("/api/pest/plan", request);
};
