import {
  getImageAiPrompt,
  getImplementationPlanPrompt,
  getInValidResponse,
  getTextAiPrompt,
} from "@/constants/prompts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AIConsultationInfo,
  ImplementationPlanRequest,
  ImplementationPlanResponse,
  PestAnalysisRequest,
} from "../types/pest-analysis";
import { post } from "../utils/api";
import { detectMimeTypeFromBase64 } from "../utils/image";

export async function analyzeTextService(
  body: PestAnalysisRequest
): Promise<AIConsultationInfo> {
  const aiPrompt = getTextAiPrompt(
    body.symptoms,
    body.cropType,
    body.growthStage
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aiResponse: any = await post(
    `${process.env.GEMINI_API_URL}`,
    aiPrompt,
    {
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": `${process.env.GEMINI_API_KEY}`,
      },
    }
  );

  return JSON.parse(aiResponse.candidates[0].content.parts[0].text);
}

export async function analyzeImageService(
  body: PestAnalysisRequest
): Promise<AIConsultationInfo> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = getImageAiPrompt(body.cropType);
  const mimeType =
    body.imageMimeType || detectMimeTypeFromBase64(body.imageBase64 as string);
  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: body.imageBase64 as string,
    },
  };
  try {
    const result = await model.generateContent([prompt, imagePart]);
    const content = result.response.text();
    if (!content.includes("không hợp lệ")) {
      return await analyzeTextService({
        cropType: body.cropType,
        symptoms: content,
      });
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return getInValidResponse(body.cropType, `Không thể phân tích hình ảnh`);
  }
  return getInValidResponse(body.cropType, `Không thể phân tích hình ảnh`);
}

export async function generateImplementationPlan(
  body: ImplementationPlanRequest
): Promise<ImplementationPlanResponse> {
  const aiPrompt = getImplementationPlanPrompt(
    body.pestOrDisease.name,
    body.cropType,
    body.pestOrDisease.treatment,
    body.currentDate
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aiResponse: any = await post(
    `${process.env.GEMINI_API_URL}`,
    aiPrompt,
    {
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": `${process.env.GEMINI_API_KEY}`,
      },
    }
  );

  return JSON.parse(aiResponse.candidates[0].content.parts[0].text);
}
