"use client";

import { getPestAnalysis } from "@/adapter/pest-analysis";
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
import {
  PestAnalysisFormData,
  pestAnalysisSchema,
} from "@/schemas/pest-analysis-schema";
import {
  PestAnalysisRequest,
  PestAnalysisResponse,
} from "@/types/pest-analysis";
import { fileToBase64 } from "@/utils/image";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Bug,
  Camera,
  Clock,
  Droplets,
  FileText,
  Info,
  Leaf,
  Shield,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { CropTypeController } from "../organisms/crop-type-controller";
import { SymptomsController } from "../organisms/symptoms-controller";

export function PestAnalysisForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PestAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const onSubmit = useCallback(
    async (data: PestAnalysisFormData) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const requestData: PestAnalysisRequest = {
          cropType: data.cropType,
          symptoms: data.symptoms || "",
          analysisType: data.analysisType,
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
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi phân tích. Vui lòng thử lại."
        );
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setResult]
  );

  const handleTabChange = useCallback(
    (value: string) => {
      const tabValue = value as "text" | "image";
      setValue("analysisType", tabValue);
      setValue("symptoms", "");
      setValue("imageBase64", "");
      setValue("imageMimeType", "");
      setError(null);
      setResult(null);
    },
    [setValue, setError, setResult]
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
          <Leaf className="w-8 h-8 text-green-600" />
          Phân tích sâu bệnh cây trồng
        </h1>
        <p className="text-gray-600">
          Nhập thông tin về cây trồng và triệu chứng để nhận được phân tích chi
          tiết về sâu bệnh
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Thông tin cây trồng
          </CardTitle>
          <CardDescription>
            Vui lòng cung cấp thông tin chi tiết để có kết quả phân tích chính
            xác nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={analysisType}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Mô tả bằng văn bản
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
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
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Đang phân tích...
                  </div>
                ) : (
                  "Phân tích sâu bệnh"
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Leaf className="w-5 h-5" />
                Kết quả phân tích: {result.cropType}
              </CardTitle>
              <CardDescription>
                Triệu chứng: {result.cropSymptom}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6">
            {result.possiblePestsOrDiseases.map((pest, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Bug className="w-5 h-5" />
                    {pest.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">
                        Nguyên nhân:
                      </h4>
                      <p className="text-sm">{pest.cause}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">
                        Tác hại:
                      </h4>
                      <p className="text-sm">{pest.impact}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      Biện pháp xử lý
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-1">
                          Phương pháp:
                        </h5>
                        <p className="text-sm">{pest.treatment.method}</p>
                      </div>

                      {pest.treatment.recommendedProducts.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-1">
                            Sản phẩm khuyến nghị:
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {pest.treatment.recommendedProducts.map(
                              (product, idx) => (
                                <span
                                  key={idx}
                                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs"
                                >
                                  {product}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Thời điểm áp dụng:
                          </h5>
                          <p className="text-sm">
                            {pest.treatment.applicationTiming}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
                            <Droplets className="w-3 h-3" />
                            Liều lượng:
                          </h5>
                          <p className="text-sm">{pest.treatment.dosage}</p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                        <h5 className="font-medium text-sm text-yellow-800 mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Lưu ý an toàn:
                        </h5>
                        <p className="text-sm text-yellow-700">
                          {pest.treatment.safetyNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {result.additionalInfo && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Info className="w-5 h-5" />
                  Thông tin bổ sung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800">{result.additionalInfo}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
