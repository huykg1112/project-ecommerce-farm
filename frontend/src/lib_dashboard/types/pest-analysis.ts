export interface PestAnalysisRequest {
  cropType: string;
  symptoms: string;
  analysisType?: "text" | "image";
  imageFile?: File;
  imageBase64?: string;
  imageMimeType?: string;
  growthStage?: string; // Thêm giai đoạn sinh trưởng
}

export interface RecommendedProduct {
  name: string; // Tên thuốc BVTV hoặc phân bón
  active_ingredient?: string; // Hoạt chất chính
  concentration?: string; // Nồng độ (ví dụ: 25% EC, 10% WP)
  usage_note?: string; // Ghi chú sử dụng
}

export interface TreatmentPlanInfo {
  day_number: number; // Số ngày trong phác đồ (bắt buộc)
  step_title: string; // Tiêu đề bước điều trị
  treatment_instruction: string; // Hướng dẫn điều trị chi tiết
  dosage_instruction?: string; // Hướng dẫn liều lượng thuốc điều trị
  frequency?: string; // Tần suất thực hiện
  products_used?: string[]; // Danh sách tên thuốc sử dụng trong ngày này
  safety_notes?: string; // Lưu ý an toàn cho bước này
  expected_result?: string; // Kết quả mong đợi sau bước này
}

export interface SelfAssessment {
  accuracy_check: string; // Kiểm tra độ chính xác của chẩn đoán
  alternative_diagnosis?: string[]; // Các chẩn đoán khác có thể
  uncertainty_factors?: string[]; // Các yếu tố gây không chắc chắn
  recommendation_reliability: string; // Độ tin cậy của khuyến nghị
  need_expert_consultation: boolean; // Có cần tham khảo chuyên gia không
  additional_tests_needed?: string[]; // Các kiểm tra bổ sung cần thiết
}

export interface AIConsultationInfo {
  crop_type: string; // Tên cây
  symptom_description: string; // Mô tả triệu chứng
  growth_stage: string; // Giai đoạn sinh trưởng
  disease_name: string; // Tên bệnh chính xác
  disease_cause: string; // Nguyên nhân gây bệnh
  severity_level: string; // Mức độ nghiêm trọng (nhẹ/trung bình/nặng)
  confidence_score: number; // Tỷ lệ chính xác (0-100%)
  diagnosis_confidence: string; // Mức độ tin cậy chẩn đoán (cao/trung bình/thấp)
  recommended_products: RecommendedProduct[]; // Danh sách thuốc BVTV đề xuất
  recommended_treatment: string; // Phác đồ điều trị tổng quan
  treatment_duration: number; // Thời gian điều trị (số ngày)
  treatment_plans: TreatmentPlanInfo[]; // Danh sách phác đồ điều trị theo ngày
  prevention_tips?: string[]; // Mẹo phòng ngừa
  monitoring_signs?: string[]; // Dấu hiệu cần theo dõi
  self_assessment: SelfAssessment; // Tự đánh giá kết quả
}

// Keep old interfaces for backward compatibility if needed
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
  probability: number;
}

export interface PestAnalysisResponse {
  cropType: string;
  cropSymptom: string;
  possiblePestsOrDiseases: PestOrDisease[];
  additionalInfo: string;
}

export interface ImplementationPlanRequest {
  pestOrDisease: PestOrDisease;
  cropType: string;
  currentDate: string;
}

export interface ImplementationStep {
  day: number;
  date: string;
  title: string;
  description: string;
  tasks: string[];
  materials: string[];
  notes?: string;
  isUrgent?: boolean;
}

export interface ImplementationPlanResponse {
  cropType: string;
  pestName: string;
  planStartDate: string;
  planEndDate: string;
  totalDuration: number;
  steps: ImplementationStep[];
  generalNotes: string;
  successIndicators: string[];
}
