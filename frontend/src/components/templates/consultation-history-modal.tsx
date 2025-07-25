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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCookie } from "@/lib/utils";
import { AIConsultationInfo } from "@/lib_dashboard/types/pest-analysis";
import {
  clearUserConsultationHistory,
  ConsultationHistory,
  deleteConsultationFromHistory,
  formatConsultationDate,
  getConsultationStats,
  getUserConsultationHistory,
} from "@/lib_dashboard/utils/consultation-history";
import {
  BarChart3,
  Bug,
  Calendar,
  Clock,
  Eye,
  Leaf,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ConsultationHistoryModalProps {
  trigger?: React.ReactNode;
}

export function ConsultationHistoryModal({
  trigger,
}: ConsultationHistoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ConsultationHistory[]>([]);
  const [selectedConsultation, setSelectedConsultation] =
    useState<AIConsultationInfo | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    diseaseTypes: 0,
    cropTypes: 0,
  });

  const userId = getCookie("user_id");

  const loadHistory = () => {
    if (!userId) return;

    const userHistory = getUserConsultationHistory(userId);
    setHistory(userHistory.consultations);
    setStats(getConsultationStats(userId));
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, userId]);

  const handleDeleteConsultation = (consultationId: string) => {
    if (!userId) return;

    const success = deleteConsultationFromHistory(userId, consultationId);
    if (success) {
      loadHistory(); // Reload after delete
    }
  };

  const handleClearAllHistory = () => {
    if (!userId) return;

    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử tư vấn?")) {
      const success = clearUserConsultationHistory(userId);
      if (success) {
        loadHistory(); // Reload after clear
      }
    }
  };

  const handleViewDetail = (consultation: AIConsultationInfo) => {
    setSelectedConsultation(consultation);
    setShowDetail(true);
  };

  if (!userId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Lịch sử tư vấn
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Lịch sử tư vấn AI của bạn
          </DialogTitle>
        </DialogHeader>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng tư vấn</p>
                <p className="text-lg font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Tháng này</p>
                <p className="text-lg font-bold text-green-600">
                  {stats.thisMonth}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Loại bệnh</p>
                <p className="text-lg font-bold text-red-600">
                  {stats.diseaseTypes}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-700" />
              <div>
                <p className="text-sm text-gray-600">Loại cây</p>
                <p className="text-lg font-bold text-green-700">
                  {stats.cropTypes}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">
            Danh sách lịch sử ({history.length} tư vấn)
          </h3>
          {history.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAllHistory}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả
            </Button>
          )}
        </div>

        {/* History List */}
        <ScrollArea className="h-[500px]">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Chưa có lịch sử tư vấn</p>
              <p className="text-sm">
                Hãy thực hiện tư vấn AI để xem lịch sử tại đây
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Leaf className="w-5 h-5 text-green-600" />
                          {item.consultation.crop_type}
                          <span className="text-sm text-gray-500">→</span>
                          <Bug className="w-4 h-4 text-red-600" />
                          {item.consultation.disease_name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {formatConsultationDate(item.timestamp)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.consultation.confidence_score && (
                          <Badge
                            variant={
                              item.consultation.confidence_score >= 80
                                ? "default"
                                : item.consultation.confidence_score >= 60
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {item.consultation.confidence_score}% tin cậy
                          </Badge>
                        )}
                        <Badge
                          variant={
                            item.consultation.severity_level === "Nặng"
                              ? "destructive"
                              : item.consultation.severity_level ===
                                "Trung bình"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {item.consultation.severity_level}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          <span className="font-medium">Triệu chứng:</span>{" "}
                          {item.consultation.symptom_description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>🌱 {item.consultation.growth_stage}</span>
                          <span>
                            ⏱️ {item.consultation.treatment_duration} ngày điều
                            trị
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(item.consultation)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteConsultation(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Detail Modal */}
        {showDetail && selectedConsultation && (
          <ConsultationDetailModal
            consultation={selectedConsultation}
            isOpen={showDetail}
            onClose={() => setShowDetail(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// Component để hiển thị chi tiết tư vấn
interface ConsultationDetailModalProps {
  consultation: AIConsultationInfo;
  isOpen: boolean;
  onClose: () => void;
}

function ConsultationDetailModal({
  consultation,
  isOpen,
  onClose,
}: ConsultationDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Chi tiết tư vấn: {consultation.crop_type}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[600px]">
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Bug className="w-5 h-5" />
                  {consultation.disease_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Triệu chứng:
                    </p>
                    <p className="text-sm text-gray-600">
                      {consultation.symptom_description}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Nguyên nhân:
                    </p>
                    <p className="text-sm text-gray-600">
                      {consultation.disease_cause}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Giai đoạn sinh trưởng:
                    </p>
                    <p className="text-sm text-gray-600">
                      {consultation.growth_stage}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Thời gian điều trị:
                    </p>
                    <p className="text-sm text-gray-600">
                      {consultation.treatment_duration} ngày
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Treatment Plans */}
            {consultation.treatment_plans &&
              consultation.treatment_plans.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">
                      Phác đồ điều trị
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {consultation.treatment_plans
                        .sort((a, b) => a.day_number - b.day_number)
                        .map((plan, index) => (
                          <div
                            key={index}
                            className="border-l-4 border-blue-400 pl-4 py-2"
                          >
                            <h4 className="font-semibold text-sm">
                              Ngày {plan.day_number}: {plan.step_title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {plan.treatment_instruction}
                            </p>
                            {plan.dosage_instruction && (
                              <p className="text-sm text-green-700 mt-1">
                                <span className="font-medium">Liều lượng:</span>{" "}
                                {plan.dosage_instruction}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Recommended Products */}
            {consultation.recommended_products &&
              consultation.recommended_products.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700">
                      Thuốc khuyến nghị
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {consultation.recommended_products.map(
                        (product, index) => (
                          <div
                            key={index}
                            className="bg-green-50 p-3 rounded-lg border border-green-200"
                          >
                            <h5 className="font-medium text-green-800">
                              {product.name}
                            </h5>
                            {product.active_ingredient && (
                              <p className="text-sm text-gray-600">
                                Hoạt chất: {product.active_ingredient}
                              </p>
                            )}
                            {product.concentration && (
                              <p className="text-sm text-green-700">
                                {product.concentration}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
