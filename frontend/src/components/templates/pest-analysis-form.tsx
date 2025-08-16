"use client";

import { getPestAnalysis } from "@/adapter/pest-analysis";
import { predictPlantDisease } from "@/adapter/plant-disease-ai";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCookie } from "@/lib/utils";
import { ai_ConsultationServiceManagement } from "@/lib_dashboard/services/ai-consultation-service";
import {
  AIConsultationCreateRequest,
  AiConsultation,
} from "@/lib_dashboard/types/ai-consultation";
import {
  AIConsultationInfo,
  PestAnalysisRequest,
} from "@/lib_dashboard/types/pest-analysis";
import { saveConsultationToHistory } from "@/lib_dashboard/utils/consultation-history";
import { fileToBase64 } from "@/lib_dashboard/utils/image";
import {
  PestAnalysisFormData,
  pestAnalysisSchema,
} from "@/schemas/pest-analysis-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Bug,
  Camera,
  Droplets,
  FileText,
  Leaf,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CropTypeController } from "../organisms/crop-type-controller";
import { GrowthStageController } from "../organisms/growth-stage-controller";
import { SymptomsController } from "../organisms/symptoms-controller";
import { ConsultationHistoryModal } from "./consultation-history-modal";

export function PestAnalysisForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIConsultationInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lowConfidenceWarning, setLowConfidenceWarning] = useState(false);

  const userId = getCookie("user_id");

  const loadingWords = [
    "🤖 Đang gọi AI model cục bộ...",
    "🔍 Đang phân tích triệu chứng...",
    "🎯 Đang dự đoán bệnh cây...",
    "📋 Đang tìm kiếm tư vấn có sẵn...",
    "🧠 AI đang xử lý dữ liệu...",
    "💊 Chuẩn bị phác đồ điều trị...",
    "💾 Đang lưu kết quả...",
    "✅ Hoàn thành phân tích!",
  ];

  const defaultValues: PestAnalysisFormData = {
    cropType: "",
    analysisType: "text",
    symptoms: "",
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<PestAnalysisFormData>({
    resolver: zodResolver(pestAnalysisSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const analysisType = watch("analysisType");

  // Helper function to convert AIConsultationInfo to AIConsultationCreateRequest
  const convertToCreateRequest = useCallback(
    (consultationInfo: AIConsultationInfo): AIConsultationCreateRequest => {
      // Convert recommended products array to comma-separated string
      const recommendedProductsString =
        consultationInfo.recommended_products
          ?.map((product) => product.name)
          .join(", ") || "";

      // Convert prevention tips array to comma-separated string
      const preventionTipsString =
        consultationInfo.prevention_tips?.join(", ") || "";

      // Convert monitoring signs array to comma-separated string
      const monitoringSignsString =
        consultationInfo.monitoring_signs?.join(", ") || "";

      // Convert treatment plans to the required format
      const treatmentPlans =
        consultationInfo.treatment_plans?.map((plan) => ({
          day_number: plan.day_number,
          treatment_instruction: plan.treatment_instruction,
          dosage_instruction: plan.dosage_instruction,
          frequency: plan.frequency,
        })) || [];

      return {
        crop_type: consultationInfo.crop_type,
        symptom_description: consultationInfo.symptom_description,
        growth_stage: consultationInfo.growth_stage,
        disease_name: consultationInfo.disease_name,
        recommended_treatment: consultationInfo.recommended_treatment,
        treatment_duration: consultationInfo.treatment_duration,
        severity_level: consultationInfo.severity_level,
        recommended_name_products: recommendedProductsString,
        prevention_tips: preventionTipsString,
        monitoring_signs: monitoringSignsString,
        treatment_plans: treatmentPlans,
      };
    },
    []
  );

  // Helper function to convert AiConsultation to AIConsultationInfo
  const convertFromAiConsultation = useCallback(
    (consultation: AiConsultation): AIConsultationInfo => {
      return {
        crop_type: consultation.crop_type,
        symptom_description: consultation.symptom_description,
        growth_stage: consultation.growth_stage,
        disease_name: consultation.disease.disease_name,
        disease_cause:
          consultation.disease.description || "Chưa xác định nguyên nhân", // Add missing disease_cause
        recommended_treatment: consultation.recommended_treatment,
        treatment_duration: consultation.treatment_duration,
        severity_level: consultation.severity_level,
        confidence_score: 100, // Set high confidence for existing consultations
        diagnosis_confidence: "Cao", // Add missing diagnosis_confidence
        recommended_products: consultation.recommended_name_products.map(
          (name) => ({ name })
        ),
        prevention_tips: consultation.prevention_tips,
        monitoring_signs: consultation.monitoring_signs,
        treatment_plans: consultation.treatment_plans.map((plan) => ({
          day_number: plan.day_number,
          step_title: `Ngày ${plan.day_number}`, // Add missing step_title
          treatment_instruction: plan.treatment_instruction,
          dosage_instruction: plan.dosage_instruction,
          frequency: plan.frequency,
        })),
        self_assessment: {
          // Add missing self_assessment
          accuracy_check: "Chẩn đoán dựa trên dữ liệu có sẵn trong hệ thống",
          recommendation_reliability: "Cao - Dựa trên tư vấn đã được lưu trữ",
          need_expert_consultation: false,
        },
      };
    },
    []
  );

  const onSubmit = useCallback(
    async (data: PestAnalysisFormData) => {
      setLoading(true);
      setError(null);
      setResult(null);
      setSaveSuccess(false);
      setLowConfidenceWarning(false);

      try {
        // Only process text analysis type for the new integration
        if (data.analysisType === "text") {
          // Step 1: Call local AI model first
          const plantDiseaseRequest = {
            name: data.cropType,
            description: data.symptoms || "",
          };

          console.log("🤖 Calling local AI model with:", plantDiseaseRequest);
          const aiPredictions = await predictPlantDisease(plantDiseaseRequest);
          console.log("🎯 AI model predictions:", aiPredictions);

          if (aiPredictions && aiPredictions.length > 0) {
            const topPrediction = aiPredictions[0];
            const confidencePercentage = parseFloat(
              topPrediction.probability.replace("%", "")
            );

            console.log(
              `📊 Top prediction: ${topPrediction.disease} with ${confidencePercentage}% confidence`
            );

            if (confidencePercentage >= 60) {
              console.log(
                "✅ High confidence - searching existing consultations"
              );

              // Step 2: High confidence - search for existing consultations
              try {
                const existingConsultations =
                  await ai_ConsultationServiceManagement.getByDiseaseName(
                    topPrediction.disease
                  );

                if (existingConsultations && existingConsultations.length > 0) {
                  // Step 3: Found existing consultation - use it
                  console.log(
                    "🎉 Found existing consultation for disease:",
                    topPrediction.disease
                  );
                  const consultation = existingConsultations[0];
                  const consultationInfo =
                    convertFromAiConsultation(consultation);
                  setResult(consultationInfo);

                  // Save to localStorage
                  if (userId) {
                    saveConsultationToHistory(userId, consultationInfo);
                  }

                  setSaveSuccess(true);
                  return;
                } else {
                  // Step 4: No existing consultation found - call Gemini with disease name
                  console.log(
                    "⚠️ No existing consultation found - calling Gemini with disease name"
                  );
                  const requestData: PestAnalysisRequest = {
                    cropType: data.cropType,
                    symptoms: topPrediction.disease, // Use disease name instead of user symptoms
                    analysisType: data.analysisType,
                    growthStage: data.growthStage || undefined,
                  };

                  const response = await getPestAnalysis(requestData);
                  setResult(response);

                  // Save to localStorage
                  if (userId) {
                    saveConsultationToHistory(userId, response);
                  }

                  // Auto-save if confidence is high
                  if (
                    response.confidence_score &&
                    response.confidence_score >= 60
                  ) {
                    try {
                      const createRequest = convertToCreateRequest(response);
                      await ai_ConsultationServiceManagement.createAIConsultation(
                        createRequest
                      );
                      setSaveSuccess(true);
                      console.log(
                        "✅ Đã lưu kết quả tư vấn vào cơ sở dữ liệu thành công!"
                      );
                    } catch (saveError) {
                      console.error(
                        "❌ Lỗi khi lưu kết quả tư vấn:",
                        saveError
                      );
                    }
                  }
                }
              } catch (searchError) {
                console.error(
                  "❌ Error searching existing consultations:",
                  searchError
                );
                // Fallback to Gemini with disease name
                console.log("🔄 Fallback - calling Gemini with disease name");
                const requestData: PestAnalysisRequest = {
                  cropType: data.cropType,
                  symptoms: topPrediction.disease,
                  analysisType: data.analysisType,
                  growthStage: data.growthStage || undefined,
                };

                const response = await getPestAnalysis(requestData);
                setResult(response);

                if (userId) {
                  saveConsultationToHistory(userId, response);
                }
              }
            } else {
              // Step 1 alternative: Low confidence - call Gemini with original user input
              console.log(
                "⚠️ Low confidence - calling Gemini with original user symptoms"
              );
              setLowConfidenceWarning(true);

              const requestData: PestAnalysisRequest = {
                cropType: data.cropType,
                symptoms: data.symptoms || "",
                analysisType: data.analysisType,
                growthStage: data.growthStage || undefined,
              };

              const response = await getPestAnalysis(requestData);
              setResult(response);

              // Save to localStorage
              if (userId) {
                saveConsultationToHistory(userId, response);
              }

              // Auto-save if Gemini confidence is high
              if (
                response.confidence_score &&
                response.confidence_score >= 60
              ) {
                try {
                  const createRequest = convertToCreateRequest(response);
                  await ai_ConsultationServiceManagement.createAIConsultation(
                    createRequest
                  );
                  setSaveSuccess(true);
                  console.log(
                    "✅ Đã lưu kết quả tư vấn vào cơ sở dữ liệu thành công!"
                  );
                } catch (saveError) {
                  console.error("❌ Lỗi khi lưu kết quả tư vấn:", saveError);
                }
              }
            }
          } else {
            // No predictions from AI model - fallback to Gemini
            console.log("⚠️ No predictions from AI model - fallback to Gemini");
            throw new Error("AI model không trả về kết quả");
          }
        } else {
          // For image analysis, use the original flow
          console.log("📸 Processing image analysis with original flow");
          const requestData: PestAnalysisRequest = {
            cropType: data.cropType,
            symptoms: data.symptoms || "",
            analysisType: data.analysisType,
            growthStage: data.growthStage || undefined,
            imageBase64: data.imageBase64 || undefined,
            imageMimeType: data.imageMimeType || undefined,
          };

          const response = await getPestAnalysis(requestData);
          setResult(response);

          // Save to localStorage
          if (userId) {
            saveConsultationToHistory(userId, response);
          }

          // Auto-save if confidence is high
          if (response.confidence_score && response.confidence_score >= 60) {
            try {
              const createRequest = convertToCreateRequest(response);
              await ai_ConsultationServiceManagement.createAIConsultation(
                createRequest
              );
              setSaveSuccess(true);
              console.log(
                "✅ Đã lưu kết quả tư vấn vào cơ sở dữ liệu thành công!"
              );
            } catch (saveError) {
              console.error("❌ Lỗi khi lưu kết quả tư vấn:", saveError);
            }
          } else {
            setLowConfidenceWarning(true);
            console.log(
              `⚠️ Kết quả không được lưu tự động vì độ tin cậy (${response.confidence_score}%) thấp hơn 60%`
            );
          }
        }
      } catch (error) {
        console.error("❌ Error in analysis:", error);

        // Fallback to original Gemini flow if AI model fails
        try {
          console.log("🔄 Fallback to original Gemini flow");
          const requestData: PestAnalysisRequest = {
            cropType: data.cropType,
            symptoms: data.symptoms || "",
            analysisType: data.analysisType,
            growthStage: data.growthStage || undefined,
            imageBase64:
              data.analysisType === "image"
                ? data.imageBase64 || undefined
                : undefined,
            imageMimeType:
              data.analysisType === "image"
                ? data.imageMimeType || undefined
                : undefined,
          };

          const response = await getPestAnalysis(requestData);
          setResult(response);

          if (userId) {
            saveConsultationToHistory(userId, response);
          }

          if (response.confidence_score && response.confidence_score >= 60) {
            try {
              const createRequest = convertToCreateRequest(response);
              await ai_ConsultationServiceManagement.createAIConsultation(
                createRequest
              );
              setSaveSuccess(true);
            } catch (saveError) {
              console.error("❌ Lỗi khi lưu kết quả tư vấn:", saveError);
            }
          }
        } catch (fallbackError) {
          setError(
            error instanceof Error
              ? error.message
              : "Có lỗi xảy ra khi phân tích. Vui lòng thử lại."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [
      setLoading,
      setError,
      setResult,
      setSaveSuccess,
      setLowConfidenceWarning,
      convertToCreateRequest,
      convertFromAiConsultation,
      userId,
    ]
  );

  const handleTabChange = useCallback(
    (value: string) => {
      const tabValue = value as "text" | "image";
      setValue("analysisType", tabValue);
      setValue("symptoms", "");
      setValue("growthStage", "");
      setValue("imageBase64", "");
      setValue("imageMimeType", "");
      setError(null);
      setResult(null);
      setSaveSuccess(false);
      setLowConfidenceWarning(false);
    },
    [setValue, setError, setResult, setSaveSuccess, setLowConfidenceWarning]
  );

  const handleImageSelect = useCallback(
    async (file: File | null, base64: string | null, mimeType?: string) => {
      if (file && !base64) {
        const convertedBase64 = await fileToBase64(file);
        setValue("imageBase64", convertedBase64);
        setValue("imageMimeType", file.type);
        setValue("symptoms", `Hình ảnh: ${file.name}`);
      } else {
        setValue("imageBase64", base64 || "");
        setValue("imageMimeType", mimeType || "");
        setValue("symptoms", `Hình ảnh`);
      }
      setError(null);
    },
    [setValue, setError]
  );

  useEffect(() => {
    if (!loading) {
      setLoadingTextIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingTextIndex((prevIndex) => (prevIndex + 1) % loadingWords.length);
    }, 1500); // Slower transition for better readability
    return () => clearInterval(interval);
  }, [loading, loadingWords.length]);

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-full shadow-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Phân tích sâu bệnh cây trồng
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Sử dụng công nghệ AI tiên tiến để chẩn đoán bệnh cây trồng và đưa ra
          phác đồ điều trị chi tiết, giúp bảo vệ và phục hồi sức khỏe cây trồng
        </p>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Chẩn đoán chính xác</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Phác đồ điều trị</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Hỗ trợ AI</span>
          </div>
        </div>

        {/* History Button */}
        {userId && (
          <div className="mt-6 flex justify-center">
            <ConsultationHistoryModal />
          </div>
        )}
      </div>

      <Card className="mb-6 shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bug className="w-5 h-5 text-blue-600" />
            </div>
            Thông tin cây trồng & triệu chứng
          </CardTitle>
          <CardDescription className="text-base">
            Vui lòng cung cấp thông tin chi tiết để AI có thể đưa ra chẩn đoán
            chính xác nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={analysisType}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="text"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                <FileText className="w-4 h-4" />
                Mô tả bằng văn bản
              </TabsTrigger>
              <TabsTrigger
                value="image"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                <Camera className="w-4 h-4" />
                Tải lên hình ảnh
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
              <div className="space-y-2">
                <label htmlFor="cropType" className="text-sm font-medium">
                  Tên cây trồng *
                </label>
                <CropTypeController
                  control={control}
                  error={errors.cropType}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="growthStage" className="text-sm font-medium">
                  Giai đoạn sinh trưởng
                </label>
                <GrowthStageController
                  control={control}
                  error={errors.growthStage}
                  disabled={loading}
                />
              </div>

              <TabsContent value="text" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <label htmlFor="symptoms" className="text-sm font-medium">
                    Mô tả triệu chứng *
                  </label>
                  <SymptomsController
                    control={control}
                    error={errors.symptoms}
                    disabled={loading}
                  />
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Hình ảnh cây trồng *
                  </label>
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    error={
                      errors.imageBase64?.message ||
                      errors.imageMimeType?.message
                    }
                    disabled={loading}
                  />
                  {(errors.imageBase64 || errors.imageMimeType) && (
                    <p className="text-sm text-red-600">
                      {errors.imageBase64?.message ||
                        errors.imageMimeType?.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Tải lên hình ảnh rõ nét của cây trồng bị bệnh để AI có thể
                    phân tích chính xác
                  </p>
                </div>
              </TabsContent>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !isValid}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 text-base"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <LoadingSpinner size="sm" />
                    <span className="animate-pulse">
                      {loadingWords[loadingTextIndex]}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Bug className="w-5 h-5" />
                    Phân tích sâu bệnh với AI
                  </div>
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Success notification for saved data */}
          {saveSuccess && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-300">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 text-green-700">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">
                      Đã lưu kết quả tư vấn thành công!
                    </p>
                    <p className="text-sm text-green-600">
                      Kết quả phân tích đã được lưu vào hệ thống để bạn có thể
                      xem lại sau.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Low confidence warning */}
          {lowConfidenceWarning &&
            result &&
            result.confidence_score &&
            result.confidence_score < 60 && (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 text-yellow-700">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        Độ tin cậy thấp - Chưa lưu tự động
                      </p>
                      <p className="text-sm text-yellow-600">
                        Kết quả có độ tin cậy {result.confidence_score}% (dưới
                        60%), không được lưu tự động. Vui lòng xem xét kỹ kết
                        quả và có thể thử lại với thông tin chi tiết hơn.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Header Card - Thông tin tổng quan */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 text-xl">
                <Leaf className="w-6 h-6" />
                Kết quả phân tích cho cây {result.crop_type}
              </CardTitle>
              <CardDescription className="text-base">
                <span className="font-medium">Triệu chứng quan sát:</span>{" "}
                {result.symptom_description}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Diagnosis Card - Chẩn đoán */}
          <Card className="border-l-4 border-l-red-500 shadow-md">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Bug className="w-5 h-5" />
                Chẩn đoán bệnh
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-white rounded-lg p-4 border border-red-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-red-800">
                    {result.disease_name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.severity_level === "Nặng"
                          ? "bg-red-100 text-red-800"
                          : result.severity_level === "Trung bình"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {result.severity_level}
                    </span>
                    {result.confidence_score && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.confidence_score >= 80
                            ? "bg-green-100 text-green-800"
                            : result.confidence_score >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {result.confidence_score}% chính xác
                      </span>
                    )}
                    {result.diagnosis_confidence && (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          result.diagnosis_confidence === "cao"
                            ? "bg-blue-100 text-blue-800"
                            : result.diagnosis_confidence === "trung bình"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        Tin cậy: {result.diagnosis_confidence}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h4 className="font-semibold text-sm text-gray-700">
                        Nguyên nhân
                      </h4>
                    </div>
                    <p className="text-sm pl-4 bg-blue-50 p-2 rounded border-l-2 border-blue-300">
                      {result.disease_cause}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h4 className="font-semibold text-sm text-gray-700">
                        Giai đoạn sinh trưởng
                      </h4>
                    </div>
                    <p className="text-sm pl-4 bg-green-50 p-2 rounded border-l-2 border-green-300">
                      {result.growth_stage}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <h4 className="font-semibold text-sm text-gray-700">
                        Thời gian điều trị
                      </h4>
                    </div>
                    <p className="text-sm pl-4 bg-purple-50 p-2 rounded border-l-2 border-purple-300">
                      {result.treatment_duration} ngày
                    </p>
                  </div>
                </div>

                {/* Thuốc BVTV khuyến nghị */}
                {result.recommended_products &&
                  result.recommended_products.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-600" />
                        Thuốc BVTV & Phân bón khuyến nghị
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.recommended_products.map((product, index) => (
                          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-3 min-w-[200px] hover:shadow-md transition-shadow cursor-pointer">
                            <Link
                              key={index}
                              href={`/products?search=${encodeURIComponent(
                                product.name.trim()
                              )}`}
                            >
                              <div className="font-medium text-blue-800 text-sm hover:text-green-900">
                                {product.name}
                              </div>
                            </Link>
                            {product.active_ingredient && (
                              <Link
                                key={index}
                                href={`/products?search=${encodeURIComponent(
                                  product.active_ingredient.trim()
                                )}`}
                              >
                                <div className="text-xs text-gray-600 mt-1 hover:text-green-700">
                                  Hoạt chất: {product.active_ingredient}
                                </div>
                              </Link>
                            )}
                            {product.concentration && (
                              <div className="text-xs text-green-700 font-medium">
                                {product.concentration}
                              </div>
                            )}
                            {product.usage_note && (
                              <div className="text-xs text-gray-500 mt-1 italic">
                                {product.usage_note}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <h4 className="font-semibold text-sm text-gray-700">
                      Khuyến nghị điều trị tổng quan
                    </h4>
                  </div>
                  <p className="text-sm pl-4 bg-orange-50 p-3 rounded border-l-2 border-orange-300">
                    {result.recommended_treatment}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Plans Card - Kế hoạch điều trị */}
          {result.treatment_plans && result.treatment_plans.length > 0 && (
            <Card className="border-l-4 border-l-blue-500 shadow-md">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Shield className="w-5 h-5" />
                  Phác đồ điều trị chi tiết ({result.treatment_duration} ngày)
                </CardTitle>
                <CardDescription>
                  Thực hiện theo từng bước để đạt hiệu quả tối ưu
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {result.treatment_plans
                    .sort((a, b) => a.day_number - b.day_number)
                    .map((plan, index) => (
                      <div
                        key={index}
                        className="relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Timeline indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-green-400 rounded-l-lg"></div>

                        {/* Day header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                              📅 Ngày {plan.day_number}
                            </span>
                            <h4 className="text-lg font-semibold text-gray-800">
                              {plan.step_title}
                            </h4>
                          </div>
                          {plan.frequency && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                              {plan.frequency}
                            </span>
                          )}
                        </div>

                        {/* Treatment instruction */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <h5 className="font-semibold text-gray-800">
                              Hướng dẫn thực hiện
                            </h5>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-400">
                            <p className="text-sm leading-relaxed">
                              {plan.treatment_instruction}
                            </p>
                          </div>
                        </div>

                        {/* Products used */}
                        {plan.products_used &&
                          plan.products_used.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Droplets className="w-4 h-4 text-green-600" />
                                <h5 className="font-semibold text-gray-800">
                                  Thuốc sử dụng
                                </h5>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {plan.products_used.map(
                                  (product, productIndex) => (
                                    <Link
                                      key={productIndex}
                                      href={`/products?search=${encodeURIComponent(
                                        product.trim()
                                      )}`}
                                    >
                                      <span
                                        key={productIndex}
                                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                                      >
                                        💊 {product}
                                      </span>
                                    </Link>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Dosage instruction */}
                        {plan.dosage_instruction && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Droplets className="w-4 h-4 text-green-600" />
                              <h5 className="font-semibold text-gray-800">
                                Liều lượng & Pha chế
                              </h5>
                            </div>
                            <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-400">
                              <p className="text-sm leading-relaxed font-medium text-green-800">
                                {plan.dosage_instruction}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Expected result */}
                        {plan.expected_result && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-4 h-4 text-purple-600">
                                🎯
                              </span>
                              <h5 className="font-semibold text-gray-800">
                                Kết quả mong đợi
                              </h5>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-md border-l-4 border-purple-400">
                              <p className="text-sm leading-relaxed text-purple-800">
                                {plan.expected_result}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Safety notes */}
                        {plan.safety_notes && (
                          <div className="mb-2">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              <h5 className="font-semibold text-gray-800">
                                Lưu ý an toàn
                              </h5>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                              <p className="text-sm leading-relaxed text-yellow-800">
                                {plan.safety_notes}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Prevention tips */}
                {result.prevention_tips &&
                  result.prevention_tips.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2 mb-3">
                        <span className="w-5 h-5 text-green-600 mt-0.5">
                          🛡️
                        </span>
                        <h6 className="font-semibold text-green-800">
                          Biện pháp phòng ngừa
                        </h6>
                      </div>
                      <ul className="text-sm text-green-700 space-y-1">
                        {result.prevention_tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Monitoring signs */}
                {result.monitoring_signs &&
                  result.monitoring_signs.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2 mb-3">
                        <span className="w-5 h-5 text-blue-600 mt-0.5">👀</span>
                        <h6 className="font-semibold text-blue-800">
                          Dấu hiệu cần theo dõi
                        </h6>
                      </div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {result.monitoring_signs.map((sign, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            {sign}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Tự thẩm định AI */}
                {result.self_assessment && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="w-5 h-5 text-purple-600 mt-0.5">🤖</span>
                      <h6 className="font-semibold text-purple-800">
                        Tự thẩm định kết quả
                      </h6>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-purple-700">
                          Kiểm tra độ chính xác:
                        </span>
                        <p className="text-purple-600 mt-1">
                          {result.self_assessment.accuracy_check}
                        </p>
                      </div>

                      <div>
                        <span className="font-medium text-purple-700">
                          Độ tin cậy khuyến nghị:
                        </span>
                        <p className="text-purple-600 mt-1">
                          {result.self_assessment.recommendation_reliability}
                        </p>
                      </div>

                      {result.self_assessment.alternative_diagnosis &&
                        result.self_assessment.alternative_diagnosis.length >
                          0 && (
                          <div>
                            <span className="font-medium text-purple-700">
                              Chẩn đoán khác có thể:
                            </span>
                            <ul className="mt-1 text-purple-600 space-y-1">
                              {result.self_assessment.alternative_diagnosis.map(
                                (alt, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                                    {alt}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {result.self_assessment.uncertainty_factors &&
                        result.self_assessment.uncertainty_factors.length >
                          0 && (
                          <div>
                            <span className="font-medium text-purple-700">
                              Yếu tố không chắc chắn:
                            </span>
                            <ul className="mt-1 text-purple-600 space-y-1">
                              {result.self_assessment.uncertainty_factors.map(
                                (factor, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                    {factor}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {result.self_assessment.need_expert_consultation && (
                        <div className="p-3 bg-orange-100 border border-orange-300 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-orange-800">
                              Khuyến nghị tham khảo chuyên gia
                            </span>
                          </div>
                        </div>
                      )}

                      {result.self_assessment.additional_tests_needed &&
                        result.self_assessment.additional_tests_needed.length >
                          0 && (
                          <div>
                            <span className="font-medium text-purple-700">
                              Kiểm tra bổ sung cần thiết:
                            </span>
                            <ul className="mt-1 text-purple-600 space-y-1">
                              {result.self_assessment.additional_tests_needed.map(
                                (test, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                    {test}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Summary note */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h6 className="font-semibold text-yellow-800 mb-1">
                        Lưu ý quan trọng
                      </h6>
                      <p className="text-sm text-yellow-700">
                        Thực hiện đúng thứ tự các ngày và liều lượng để đảm bảo
                        hiệu quả điều trị. Theo dõi sát tình trạng cây trong quá
                        trình điều trị và liên hệ chuyên gia nếu có biến chứng
                        hoặc không cải thiện sau 3-5 ngày điều trị.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
