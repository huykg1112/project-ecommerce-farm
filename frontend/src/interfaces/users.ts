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
  address?: string;
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
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
