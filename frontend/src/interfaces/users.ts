import { CartItem } from "./cart_items";
import { FavoriteProduct } from "./favorite_products";
import { Inventory } from "./inventorys";
import { Product } from "./products";
import { Role } from "./roles";
import { Token } from "./tokens";

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: Role;
  Orders?: any[];
  CartItems?: CartItem[];
  favorites?: FavoriteProduct[];
  token?: Token;
  products?: Product[];
  inventory?: Inventory;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone?: string;
  fullName?: string;
  lat?: number;
  lng?: number;
  address?: string;
  cccd?: string;
  license?: string;
  avatar?: string;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  phone?: string;
  address?: string;
  email?: string;
  lat?: number;
  lng?: number;
  cccd?: string;
  license?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateStoreDto {
  fullName?: string;
  phone?: string;
  email?: string;
  cccd?: string;
  license?: string;
  nameStore?: string;
  addressStore?: string;
  lat?: number;
  lng?: number;
  imageStore?: string;
  imageStorePublicId?: string;
}

export interface RegisterRequest {
  username?: string;
  email: string;
  password?: string;
  phone?: string;
  fullName?: string;
  address?: string;
  cccd?: string;
  license?: string;
  lat?: number;
  lng?: number;
  nameStore?: string;
  addressStore?: string;
  imageStore?: string;
  imageStorePublicId?: string;
}
