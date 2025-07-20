import { Category } from "@/lib_dashboard/types/category";

export interface User {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  avatar?: string;
  cccd?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  role: Role;
  invenstory?: Invenstory;
}

export interface StoreOwnerRequest {
  store_owner_request_id: string;
  user: User;
  request_date: string; // ISO format date string
  request_status: boolean;
  approved_date?: string; // ISO format date string | undefined
  name: string; // Tên kho đăng ký
  business_license: string; // Mã số giấy phép kinh doanh
  invenstory_address: string; // Địa chỉ kho
  invenstory_lat?: number;
  invenstory_lng?: number;
  invenstory_img?: string; // URL ảnh kho
}

export interface Role {
  role_id: string;
  role_name: "Admin" | "Distributor" | "Client";
  description: string;
  is_active: boolean;
}

export interface Product {
  product_id: string;
  distributor: User;
  categories: Category[];
  product_name: string;
  description: string;
  usage_instructions: string;
  unit_product_price: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  product_images?: ProductImage[];
  product_ingredients?: ProductIngredient[];
  product_diseases?: ProductDisease[];
}

export interface ProductImage {
  image_id: string;
  product: Product;
  image_url: string;
  is_primary: boolean;
  alt_text?: string;
  created_at: Date;
}

export interface ProductIngredient {
  product_ingredient_id: string;
  product: Product;
  active_ingredient: ActiveIngredient;
  concentration: number; // Nồng độ (%)
  is_primary: boolean; // Thành phần chính hay phụ
  created_at: Date;
}

export interface ProductDisease {
  product_disease_id: string;
  product: Product;
  disease: Disease;
  is_primary: boolean; // Điều trị chính hay hỗ trợ
  created_at: Date;
}

export interface BatchProduct {
  batch_id: string;
  product: Product;
  batch_number: string;
  quantity: number;
  manufactured_date: Date;
  expiry_date: Date;
  low_stock_threshold: number;
  is_active: boolean;
}

export interface Order {
  order_id: string;
  user: User;
  distributor: User;
  status: OrderStatus;
  total_amount: number;
  created_at: Date;
  order_details: OrderDetail[];
}

export interface OrderDetail {
  order_detail_id: string;
  batch_product: BatchProduct;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OrderStatus {
  status_id: string;
  status_name: "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  description: string;
}

export interface ActiveIngredient {
  ingredient_id: string;
  ingredient_name: string;
  description: string;
  hazard_level: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  chemical_formula?: string;
  cas_number?: string; // cas_number là số CAS của hoạt chất
  is_active: boolean;
  is_deleted?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Disease {
  disease_id: string;
  disease_name: string;
  description: string;
  scientific_name?: string;
  affected_crops: string[]; // Cây trồng bị ảnh hưởng
  symptoms: string; // Triệu chứng
  prevention_tips?: string; // Lời khuyên phòng ngừa
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Invenstory {
  invenstory_id: string;
  distributor: User; // The distributor (user) who owns the invenstory
  name: string; // Store name
  business_license: string; // Business license number
  invenstory_address: string; // Full address
  invenstory_lat?: number; // Latitude
  invenstory_lng?: number; // Longitude
  invenstory_img?: string; // Store image (URL)
  is_locked?: boolean; // Warehouse lock status
  created_at: Date;
  updated_at: Date;
  batch_products?: BatchProduct[]; // Optional list of batch products in the inventory
}

export interface Voucher {
  voucher_id: string;
  voucher_code: string;
  distributor_id: string;
  min_order_value?: number;
  max_discount_value?: number;
  usage_limit?: number;
  used_count: number;
  start_date?: Date;
  end_date?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  distributor: User; // The user who created the voucher
  users?: User[]; // Optional list of user vouchers
  is_deleted: boolean;
}

export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}
