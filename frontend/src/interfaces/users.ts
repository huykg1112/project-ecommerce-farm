import { Invenstory } from "@/types/entities";
import { CartItem } from "./cart_items";
import { FavoriteProduct } from "./favorite_products";
import { Product } from "./products";
import { Role } from "./roles";
import { Token } from "./tokens";

export interface User {
  user_id: string;
  email: string;
  password?: string;
  username?: string;
  full_name?: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  is_verified?: boolean;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  roles?: Role;
  orders?: any[];
  cart_items?: CartItem[];
  favorites?: FavoriteProduct[];
  token?: Token;
  products?: Product[];
  inventory?: Invenstory;
}

export interface UserAddress {
  address_id: string;
  address_detail: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  user_id: string;
  username: string;
  email: string;
  phone_number?: string;
  full_name?: string;
  lat?: number;
  lng?: number;
  is_active?: boolean;
  is_verified?: boolean;
  address?: string;
  cccd?: string;
  license_number?: string;
  avatar?: string;
  role_name: string;
  role_id?: string;
  created_at: string;
  updated_at: string;
  addresses: UserAddress[];
}

export interface UpdateProfileDto {
  full_name?: string;
  phone_number?: string;
  address?: string;
  email?: string;
  lat?: number;
  lng?: number;
  cccd?: string;
  license_number?: string;
}

export interface ChangePasswordDto {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface UpdateStoreDto {
  full_name?: string;
  phone_number?: string;
  email?: string;
  cccd?: string;
  license_number?: string;
  name_store?: string;
  address_store?: string;
  lat?: number;
  lng?: number;
  image_store?: string;
  image_store_public_id?: string;
}

export interface RegisterRequest {
  username?: string;
  email: string;
  password?: string;
  phone_number?: string;
  full_name?: string;
  address?: string;
  cccd?: string;
  license?: string;
  lat?: number;
  lng?: number;
  name_store?: string;
  address_store?: string;
  image_store?: string;
  image_store_public_id?: string;
}

//admin
export interface UserRole {
  role_id: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface UserStatistics {
  pieChart: {
    label: string;
    value: number;
  }[];
  barChart: {
    label: string;
    value: number;
  }[];
  totalStats: {
    totalUsers: number;
    activeUsers: number;
    verifiedUsers: number;
  };
}
