export interface TreatmentPlanInfo {
  day_number?: number; // Số ngày trong phác đồ
  treatment_instruction: string; // Hướng dẫn điều trị (có thể là phun thuốc, bón phân, cách thức thực hiện, v.v.)
  dosage_instruction?: string; // Hướng dẫn liều lượng thuốc điều trị hoặc hoạc chất (nếu có)
  frequency?: string; // Tần suất thực hiện (ví dụ: mỗi ngày, mỗi tuần, v.v.)
}

export interface AIConsultationInfo {
  crop_type: string; //Tên cây
  symptom_description: string; //Mô tả triệu chứng
  growth_stage: string; //Giai đoạn sinh trưởng
  recommended_treatment: string; //Phác đồ điều trị
  disease_name: string; //Tên bệnh
  treatment_plans?: TreatmentPlanInfo[]; //Danh sách phác đồ điều trị
}
