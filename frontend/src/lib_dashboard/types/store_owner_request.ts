import { User } from "@/types/entities";

export interface StoreOwnerRequest {
  store_owner_request_id?: string;
  user: User;
  request_date?: Date | null;
  request_status?: string;
  approved_date?: Date | null;
  name?: string;
  business_license?: string;
  invenstory_address?: string;
  invenstory_lat?: number | null;
  invenstory_lng?: number | null;
  invenstory_img?: string | null;
  is_deleted?: boolean;
  created_at?: Date | null;
}
export interface CreateStoreOwnerRequestDto {
  note?: string;
  name: string;
  business_license: string;
  invenstory_address: string;
  invenstory_lat?: number;
  invenstory_lng?: number;
  invenstory_img?: string;
}
