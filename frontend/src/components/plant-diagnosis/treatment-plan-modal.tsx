"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CheckCircle,
  Clock,
  Droplets,
  Pill,
  ShoppingCart,
} from "lucide-react";

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

interface TreatmentPlanModalProps {
  consultation: AiConsultation;
  isOpen: boolean;
  onClose: () => void;
}

export function TreatmentPlanModal({
  consultation,
  isOpen,
  onClose,
}: TreatmentPlanModalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const totalCost = consultation.treatment_plans.reduce(
    (sum, plan) => sum + plan.product.price,
    0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Kế hoạch điều trị: {consultation.disease.disease_name}
          </DialogTitle>
          <DialogDescription>
            Kế hoạch điều trị chi tiết cho {consultation.crop_type} -{" "}
            {consultation.growth_stage}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Treatment Overview */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              Tổng quan điều trị
            </h3>
            <p className="text-green-700 text-sm leading-relaxed">
              {consultation.recommended_treatment}
            </p>
          </div>

          {/* Treatment Timeline */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lịch trình điều trị ({consultation.treatment_plans.length} bước)
            </h3>

            <div className="space-y-4">
              {consultation.treatment_plans
                .sort((a, b) => a.day_number - b.day_number)
                .map((plan, index) => (
                  <div key={plan.treatment_plan_id} className="relative">
                    {/* Timeline connector */}
                    {index < consultation.treatment_plans.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                    )}

                    <div className="flex gap-4">
                      {/* Day indicator */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-700 font-semibold text-sm">
                            Ngày {plan.day_number}
                          </span>
                        </div>
                      </div>

                      {/* Treatment details */}
                      <div className="flex-1 bg-white border rounded-lg p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Instructions */}
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-gray-800 mb-1">
                                Hướng dẫn thực hiện:
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {plan.treatment_instruction}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-blue-500" />
                                <div>
                                  <span className="text-gray-500">
                                    Liều lượng:
                                  </span>
                                  <p className="font-medium">
                                    {plan.dosage_instruction}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <div>
                                  <span className="text-gray-500">
                                    Tần suất:
                                  </span>
                                  <p className="font-medium">
                                    {plan.frequency}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Product */}
                          <div className="border-l lg:border-l pl-4 lg:pl-4 border-l-0 border-t pt-4 lg:border-t-0 lg:pt-0">
                            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                              <Pill className="h-4 w-4" />
                              Sản phẩm sử dụng:
                            </h4>

                            <div className="flex gap-3">
                              <img
                                src={
                                  plan.product.image_url || "/placeholder.svg"
                                }
                                alt={plan.product.name}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800 text-sm mb-1">
                                  {plan.product.name}
                                </h5>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                  {plan.product.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-green-600 text-sm">
                                    {formatPrice(plan.product.price)}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs bg-transparent"
                                  >
                                    <ShoppingCart className="w-3 h-3 mr-1" />
                                    Thêm vào giỏ
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <Separator />

          {/* Cost Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">
                Tổng chi phí điều trị
              </h3>
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(totalCost)}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              {consultation.treatment_plans.map((plan) => (
                <div
                  key={plan.treatment_plan_id}
                  className="flex justify-between"
                >
                  <span className="text-gray-600">{plan.product.name}</span>
                  <span className="font-medium">
                    {formatPrice(plan.product.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => {
                // Add all products to cart logic here
                console.log("Adding all products to cart");
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Mua tất cả sản phẩm ({formatPrice(totalCost)})
            </Button>
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
