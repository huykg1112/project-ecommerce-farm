export interface TreatmentPlanCreateRequest {
  day_number?: number; // Số ngày trong phác đồ
  treatment_instruction: string; // Hướng dẫn điều trị (có thể là phun thuốc, bón phân, cách thức thực hiện, v.v.)
  dosage_instruction?: string; // Hướng dẫn liều lượng thuốc điều trị hoặc hoạc chất (nếu có)
  frequency?: string; // Tần suất thực hiện (ví dụ: mỗi ngày, mỗi tuần, v.v.)
}

export interface AIConsultationCreateRequest {
  crop_type: string; //Tên cây
  symptom_description: string; //Mô tả triệu chứng
  growth_stage: string; //Giai đoạn sinh trưởng
  recommended_treatment: string; //Phác đồ điều trị
  treatment_duration?: number; //Thời gian điều trị (số ngày)
  severity_level?: string; //Mức độ nghiêm trọng (nhẹ/trung bình/nặng)
  recommended_name_products?: string; // đoạn văn sản phẩm đề xuất, mỗi sản phẩm cách nhau bởi dấu phẩy
  prevention_tips?: string; //đoạn văn mẹo phòng ngừa, mỗi mẹo cách nhau bởi dấu phẩy
  monitoring_signs?: string; //đoan văn dấu hiệu cần theo dõi, mỗi dấu hiệu cách nhau bởi dấu phẩy
  disease_name: string; //Tên bệnh
  treatment_plans?: TreatmentPlanCreateRequest[]; //Danh sách phác đồ điều trị
}

export interface TreatmentPlan {
  treatment_plan_id: string;
  day_number: number;
  treatment_instruction: string;
  dosage_instruction: string;
  frequency: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface User {
  user_id: string;
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  avatar: string | null;
  avatarPublicId: string | null;
  cccd: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface Disease {
  disease_id: string;
  disease_name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface AiConsultation {
  consultation_id: string;
  crop_type: string;
  symptom_description: string;
  growth_stage: string;
  recommended_treatment: string;
  created_at: string;
  updated_at: string;
  severity_level: string;
  recommended_name_products: string[];
  treatment_duration: number;
  prevention_tips: string[];
  monitoring_signs: string[];
  is_deleted: boolean;
  user: User;
  disease: Disease;
  treatment_plans: TreatmentPlan[];
}

export interface AIConsultationResponse {
  AiConsultation: AiConsultation;
  existing: boolean;
}
