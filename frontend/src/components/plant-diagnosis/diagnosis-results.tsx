"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  Pill,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { TreatmentPlanModal } from "./treatment-plan-modal";

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

interface DiagnosisResultsProps {
  consultations: AiConsultation[];
}

export function DiagnosisResults({ consultations }: DiagnosisResultsProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [selectedConsultation, setSelectedConsultation] =
    useState<AiConsultation | null>(null);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);

  const toggleCard = (consultationId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(consultationId)) {
      newExpanded.delete(consultationId);
    } else {
      newExpanded.add(consultationId);
    }
    setExpandedCards(newExpanded);
  };

  const handleViewTreatmentPlan = (consultation: AiConsultation) => {
    setSelectedConsultation(consultation);
    setShowTreatmentModal(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <>
      <div className="space-y-6">
        {consultations.map((consultation, index) => {
          const isExpanded = expandedCards.has(consultation.consultation_id);

          return (
            <Card
              key={consultation.consultation_id}
              className="overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Phương án {index + 1}
                      </Badge>
                      {consultation.disease.disease_name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {consultation.disease.description}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCard(consultation.consultation_id)}
                  >
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Khuyến nghị điều trị:
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {consultation.recommended_treatment}
                    </p>
                  </div>

                  {isExpanded && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Loại cây:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {consultation.crop_type}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Giai đoạn sinh trưởng:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {consultation.growth_stage}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">
                          Triệu chứng:
                        </span>
                        <p className="mt-1 text-gray-600 text-sm">
                          {consultation.symptom_description}
                        </p>
                      </div>

                      {consultation.treatment_plans.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-3">
                            Sản phẩm đề xuất:
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {consultation.treatment_plans.map((plan) => (
                              <div
                                key={plan.treatment_plan_id}
                                className="border rounded-lg p-4 bg-gray-50"
                              >
                                <div className="flex items-start gap-3">
                                  <img
                                    src={
                                      plan.product.image_url ||
                                      "/placeholder.svg"
                                    }
                                    alt={plan.product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h6 className="font-medium text-gray-800 text-sm truncate">
                                      {plan.product.name}
                                    </h6>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                      {plan.product.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="font-semibold text-green-600 text-sm">
                                        {formatPrice(plan.product.price)}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs bg-transparent"
                                      >
                                        <ShoppingCart className="w-3 h-3 mr-1" />
                                        Mua
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {consultation.treatment_plans.length} bước điều trị
                      </span>
                      <span className="flex items-center gap-1">
                        <Pill className="w-4 h-4" />
                        {consultation.treatment_plans.length} sản phẩm
                      </span>
                    </div>

                    <Button
                      onClick={() => handleViewTreatmentPlan(consultation)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem kế hoạch điều trị
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedConsultation && (
        <TreatmentPlanModal
          consultation={selectedConsultation}
          isOpen={showTreatmentModal}
          onClose={() => {
            setShowTreatmentModal(false);
            setSelectedConsultation(null);
          }}
        />
      )}
    </>
  );
}
