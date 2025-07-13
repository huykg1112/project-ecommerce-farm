export interface DiseaseFormData {
  disease_name: string;
  description: string;
  is_active: boolean;
}
export interface DiseaseTableData {
  disease_id: string;
  disease_name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface DiseaseCreateData {
  disease_name: string;
  description: string;
  is_active: boolean;
}
export interface DiseaseUpdateData {
  disease_id: string;
  disease_name: string;
  description: string;
  is_active: boolean;
}
export interface DiseaseFilters {
  search?: string;
  status?: string;
}
