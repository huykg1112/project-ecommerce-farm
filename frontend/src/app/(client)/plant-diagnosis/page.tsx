"use client";

import { DiagnosisResults } from "@/components/plant-diagnosis/diagnosis-results";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, FileText, Leaf, Loader2, Stethoscope } from "lucide-react";
import { useState } from "react";

interface DiagnosisForm {
  cropType: string;
  symptomDescription: string;
  plantAge: number;
}

interface AiConsultation {
  consultation_id: string;
  crop_type: string;
  symptom_description: string;
  growth_stage: string;
  recommended_treatment: string;
  disease: {
    disease_id: string;
    disease_name: string;
    description: string;
  };
  treatment_plans: TreatmentPlan[];
}

interface TreatmentPlan {
  treatment_plan_id: string;
  day_number: number;
  treatment_instruction: string;
  dosage_instruction: string;
  frequency: string;
  product: {
    product_id: string;
    name: string;
    price: number;
    image_url: string;
    description: string;
  };
}

export default function PlantDiagnosisPage() {
  const [form, setForm] = useState<DiagnosisForm>({
    cropType: "",
    symptomDescription: "",
    plantAge: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [consultations, setConsultations] = useState<AiConsultation[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (
    field: keyof DiagnosisForm,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDiagnosis = async () => {
    if (
      !form.cropType.trim() ||
      !form.symptomDescription.trim() ||
      form.plantAge <= 0
    ) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call for diagnosis
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock data for demonstration
      const mockConsultations: AiConsultation[] = [
        {
          consultation_id: "1",
          crop_type: form.cropType,
          symptom_description: form.symptomDescription,
          growth_stage: `${form.plantAge} ngày tuổi`,
          recommended_treatment:
            "Sử dụng thuốc trừ sâu sinh học kết hợp với phân bón hữu cơ. Tăng cường tưới nước và đảm bảo thoát nước tốt.",
          disease: {
            disease_id: "1",
            disease_name: "Bệnh đốm lá",
            description:
              "Bệnh do nấm gây ra, thường xuất hiện khi độ ẩm cao và nhiệt độ thích hợp",
          },
          treatment_plans: [
            {
              treatment_plan_id: "1",
              day_number: 1,
              treatment_instruction: "Phun thuốc trừ sâu sinh học lên lá",
              dosage_instruction: "10ml/1 lít nước",
              frequency: "1 lần/ngày",
              product: {
                product_id: "1",
                name: "Thuốc trừ sâu sinh học BioKill",
                price: 150000,
                image_url: "/placeholder.svg?height=200&width=200",
                description: "Thuốc trừ sâu sinh học an toàn, không độc hại",
              },
            },
            {
              treatment_plan_id: "2",
              day_number: 3,
              treatment_instruction: "Bón phân hữu cơ quanh gốc cây",
              dosage_instruction: "50g/cây",
              frequency: "1 lần/3 ngày",
              product: {
                product_id: "2",
                name: "Phân hữu cơ vi sinh Organic Plus",
                price: 80000,
                image_url: "/placeholder.svg?height=200&width=200",
                description: "Phân hữu cơ giàu vi sinh vật có ích",
              },
            },
          ],
        },
        {
          consultation_id: "2",
          crop_type: form.cropType,
          symptom_description: form.symptomDescription,
          growth_stage: `${form.plantAge} ngày tuổi`,
          recommended_treatment:
            "Điều chỉnh độ pH đất và bổ sung kali. Cắt bỏ các lá bị bệnh và tăng cường thông gió.",
          disease: {
            disease_id: "2",
            disease_name: "Thiếu dinh dưỡng",
            description:
              "Cây thiếu các chất dinh dưỡng cần thiết, đặc biệt là kali và photpho",
          },
          treatment_plans: [
            {
              treatment_plan_id: "3",
              day_number: 1,
              treatment_instruction: "Bón phân NPK cân bằng",
              dosage_instruction: "30g/m²",
              frequency: "1 lần/tuần",
              product: {
                product_id: "3",
                name: "Phân NPK 16-16-8 Đầu Trâu",
                price: 45000,
                image_url: "/placeholder.svg?height=200&width=200",
                description: "Phân NPK cân bằng dinh dưỡng cho cây trồng",
              },
            },
          ],
        },
        {
          consultation_id: "3",
          crop_type: form.cropType,
          symptom_description: form.symptomDescription,
          growth_stage: `${form.plantAge} ngày tuổi`,
          recommended_treatment:
            "Sử dụng thuốc kháng nấm và cải thiện hệ thống tưới tiêu. Tăng cường ánh sáng cho cây.",
          disease: {
            disease_id: "3",
            disease_name: "Bệnh thối rễ",
            description:
              "Bệnh do nấm gây ra ở hệ thống rễ, thường do tưới nước quá nhiều",
          },
          treatment_plans: [
            {
              treatment_plan_id: "4",
              day_number: 1,
              treatment_instruction: "Tưới thuốc kháng nấm vào gốc",
              dosage_instruction: "5ml/1 lít nước",
              frequency: "2 lần/tuần",
              product: {
                product_id: "4",
                name: "Thuốc kháng nấm Fungicure",
                price: 120000,
                image_url: "/placeholder.svg?height=200&width=200",
                description: "Thuốc kháng nấm chuyên dụng cho rễ cây",
              },
            },
            {
              treatment_plan_id: "5",
              day_number: 5,
              treatment_instruction: "Bổ sung chế phẩm vi sinh",
              dosage_instruction: "20ml/1 lít nước",
              frequency: "1 lần/tuần",
              product: {
                product_id: "5",
                name: "Chế phẩm vi sinh EM1",
                price: 95000,
                image_url: "/placeholder.svg?height=200&width=200",
                description:
                  "Chế phẩm vi sinh cải thiện đất và tăng sức đề kháng",
              },
            },
          ],
        },
      ];

      setConsultations(mockConsultations);
      setShowResults(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      cropType: "",
      symptomDescription: "",
      plantAge: 0,
    });
    setConsultations([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-green-800 mb-2">
                Kết quả chẩn đoán
              </h1>
              <p className="text-gray-600">
                Dựa trên thông tin bạn cung cấp, chúng tôi đề xuất 3 phương án
                điều trị
              </p>
            </div>
            <Button onClick={resetForm} variant="outline">
              Chẩn đoán mới
            </Button>
          </div>

          <DiagnosisResults consultations={consultations} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Chẩn đoán bệnh cây trồng
          </h1>
          <p className="text-gray-600">
            Nhập thông tin về cây trồng và triệu chứng để nhận được phương án
            điều trị phù hợp
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Thông tin cây trồng
            </CardTitle>
            <CardDescription>
              Vui lòng cung cấp thông tin chi tiết để có kết quả chẩn đoán chính
              xác nhất
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cropType" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Tên cây trồng
              </Label>
              <Input
                id="cropType"
                placeholder="Ví dụ: Cà chua, Dưa chuột, Rau muống..."
                value={form.cropType}
                onChange={(e) => handleInputChange("cropType", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plantAge" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Tuổi cây (ngày)
              </Label>
              <Input
                id="plantAge"
                type="number"
                placeholder="Nhập số ngày tuổi của cây"
                min="1"
                value={form.plantAge || ""}
                onChange={(e) =>
                  handleInputChange(
                    "plantAge",
                    Number.parseInt(e.target.value) || 0
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Mô tả triệu chứng hoặc tên bệnh
              </Label>
              <Textarea
                id="symptoms"
                placeholder="Mô tả chi tiết các triệu chứng bạn quan sát được trên cây (lá vàng, héo, có đốm, sâu bệnh...) hoặc tên bệnh nếu bạn biết"
                rows={4}
                value={form.symptomDescription}
                onChange={(e) =>
                  handleInputChange("symptomDescription", e.target.value)
                }
              />
            </div>

            <Button
              onClick={handleDiagnosis}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang chẩn đoán...
                </>
              ) : (
                <>
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Chẩn đoán ngay
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            💡 Mẹo để có kết quả chẩn đoán tốt nhất:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Mô tả triệu chứng càng chi tiết càng tốt</li>
            <li>• Ghi rõ vị trí xuất hiện triệu chứng (lá, thân, rễ...)</li>
            <li>• Nêu thời gian xuất hiện và diễn biến của bệnh</li>
            <li>
              • Cung cấp thông tin về điều kiện môi trường (độ ẩm, nhiệt độ...)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
